import { DEFAULT_LANG, resolveLang, withLocalePrefix } from "./api";
import {
  getYouTubeNoCookieEmbedUrl,
  getYouTubeThumbnailCandidates,
  getYouTubeThumbnailUrl,
  getYouTubeVideoId,
} from "./videoEmbed";

const WP_API = process.env.NEXT_PUBLIC_WP_URL?.replace(/\/$/, "");
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY || process.env.YOUTUBE_DATA_API_KEY || "";
const youtubeMetadataCache = new Map();
const youtubeThumbnailCache = new Map();
const youtubeStatisticsCache = new Map();

const VIDEO_ROUTE_PREFIXES = {
  sv: "/videor",
  en: "/videos",
};

function parsePositiveInteger(value) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric) || numeric < 0) return null;
  return Math.trunc(numeric);
}

function buildYouTubeInteractionStatistic(count) {
  if (!(Number(count) > 0)) return null;

  return {
    "@type": "InteractionCounter",
    interactionType: {
      "@type": "WatchAction",
    },
    userInteractionCount: Number(count),
  };
}

function parseIsoDurationToSeconds(value = "") {
  const match = String(value).match(/^P(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?)?$/i);
  if (!match) return 0;

  const days = Number(match[1] || 0);
  const hours = Number(match[2] || 0);
  const minutes = Number(match[3] || 0);
  const seconds = Number(match[4] || 0);

  return (((days * 24) + hours) * 60 + minutes) * 60 + seconds;
}

function parseDurationTextToSeconds(value = "") {
  const clean = String(value).replace(/<[^>]*>/g, "").trim();
  if (!clean) return 0;

  const isoSeconds = parseIsoDurationToSeconds(clean);
  if (isoSeconds > 0) return isoSeconds;

  const parts = clean.split(":").map((part) => Number(part));
  if (parts.length >= 2 && parts.length <= 3 && parts.every(Number.isFinite)) {
    if (parts.length === 2) {
      const [minutes, seconds] = parts;
      return (minutes * 60) + seconds;
    }

    const [hours, minutes, seconds] = parts;
    return ((hours * 60) + minutes) * 60 + seconds;
  }

  return 0;
}

function isKnownPlaceholderUploadDate(value) {
  const timestamp = new Date(value).getTime();
  if (!Number.isFinite(timestamp)) return false;

  const placeholderStart = Date.parse("2026-07-14T07:44:00Z");
  const placeholderEnd = Date.parse("2026-07-14T07:46:00Z");
  return timestamp >= placeholderStart && timestamp <= placeholderEnd;
}

function hasCustomUploadDate(video) {
  const value = String(video?.upload_date || "").trim();
  return Boolean(value) && !isKnownPlaceholderUploadDate(value);
}

function hasCustomDuration(video) {
  return Number(video?.duration_seconds) > 0 || parseDurationTextToSeconds(video?.duration) > 0;
}

function hasCustomInteractionCount(video) {
  return Number(video?.interaction_count) > 0;
}

function extractVideoSlugFromUrl(url = "") {
  if (!url) return "";

  try {
    const parsed = new URL(url, "https://www.novoterm.se");
    const parts = parsed.pathname.split("/").filter(Boolean);
    const pathParts = ["en", "sv"].includes(parts[0]) ? parts.slice(1) : parts;

    if (["watch", "videos", "videor"].includes(pathParts[0])) {
      return pathParts[1] || "";
    }
  } catch {
    const match = String(url).match(/(?:^|\/)(?:watch|videos|videor)\/([^/?#]+)/i);
    return match?.[1] || "";
  }

  return "";
}

function inferVideoLangFromUrl(url = "", fallbackLang = DEFAULT_LANG) {
  const resolvedFallback = resolveLang(fallbackLang);

  try {
    const parsed = new URL(url, "https://www.novoterm.se");
    const firstPart = parsed.pathname.split("/").filter(Boolean)[0];
    if (firstPart === "en") return "en";
    if (firstPart === "sv") return "sv";
  } catch {
    if (String(url).startsWith("/en/")) return "en";
    if (String(url).startsWith("/sv/")) return "sv";
  }

  return resolvedFallback;
}

function normalizeVideoRouteUrl(url = "", fallbackLang = DEFAULT_LANG) {
  if (!url) return "";

  const slug = extractVideoSlugFromUrl(url);
  if (!slug) return url;

  const lang = inferVideoLangFromUrl(url, fallbackLang);
  const path = getWatchPath(slug, lang);

  try {
    const parsed = new URL(url);
    return `${parsed.origin}${path}`;
  } catch {
    return path;
  }
}

function normalizeVideoTranslations(translations) {
  if (!translations || typeof translations !== "object") return translations;

  return Object.fromEntries(
    Object.entries(translations).map(([lang, url]) => [
      lang,
      normalizeVideoRouteUrl(url, lang),
    ])
  );
}

function getVideoYouTubeId(video) {
  return getYouTubeVideoId(video?.embed_url || video?.content_url || video?.watch_url || "");
}

function chunkItems(items = [], size = 50) {
  const chunks = [];

  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }

  return chunks;
}

function getBestYouTubeApiThumbnail(thumbnails = {}) {
  const preferred = ["maxres", "standard", "high", "medium", "default"];

  for (const quality of preferred) {
    const url = thumbnails?.[quality]?.url;
    if (url) return url;
  }

  return "";
}

async function getBestReachableYouTubeApiThumbnail(thumbnails = {}) {
  const preferred = ["maxres", "standard", "high", "medium", "default"];

  for (const quality of preferred) {
    const url = thumbnails?.[quality]?.url;
    if (url && await isReachableImage(url)) return url;
  }

  return getBestYouTubeApiThumbnail(thumbnails);
}

async function fetchYouTubeStatisticsByIds(videoIds = []) {
  const uniqueIds = [...new Set(videoIds.filter(Boolean))];
  if (!YOUTUBE_API_KEY || !uniqueIds.length) return new Map();

  const uncachedIds = uniqueIds.filter((videoId) => !youtubeStatisticsCache.has(videoId));

  await Promise.all(
    chunkItems(uncachedIds).map(async (chunk) => {
      try {
        const params = new URLSearchParams({
          part: "snippet,statistics,contentDetails",
          id: chunk.join(","),
          key: YOUTUBE_API_KEY,
        });
        const response = await fetch(`https://www.googleapis.com/youtube/v3/videos?${params}`, {
          cache: "no-store",
        });

        if (!response.ok) return;

        const data = await response.json();
        const returnedIds = new Set();

        await Promise.all((data.items || []).map(async (item) => {
          const viewCount = parsePositiveInteger(item?.statistics?.viewCount);
          const duration = item?.contentDetails?.duration || "";
          const durationSeconds = parseIsoDurationToSeconds(duration);
          const thumbnailUrl = await getBestReachableYouTubeApiThumbnail(item?.snippet?.thumbnails);
          returnedIds.add(item.id);
          youtubeStatisticsCache.set(item.id, {
            interaction_count: viewCount ?? 0,
            interaction_count_source: "youtube",
            upload_date: item?.snippet?.publishedAt || "",
            duration,
            duration_seconds: durationSeconds > 0 ? durationSeconds : 0,
            thumbnail_url: thumbnailUrl,
          });
        }));

        chunk
          .filter((videoId) => !returnedIds.has(videoId))
          .forEach((videoId) => {
            youtubeStatisticsCache.set(videoId, null);
          });
      } catch {
        // Keep views hidden if the live YouTube statistics request fails.
      }
    })
  );

  return new Map(
    uniqueIds
      .map((videoId) => [videoId, youtubeStatisticsCache.get(videoId)])
      .filter(([, stats]) => stats)
  );
}

function applyYouTubeStatistics(video, stats) {
  if (!video || !stats) return video;

  const customInteractionCount = parsePositiveInteger(video.interaction_count) ?? 0;
  const youtubeInteractionCount = parsePositiveInteger(stats.interaction_count) ?? 0;
  const youtubeDurationSeconds = parsePositiveInteger(stats.duration_seconds);
  const useYouTubeDate = !hasCustomUploadDate(video) && Boolean(stats.upload_date);
  const useYouTubeDuration = !hasCustomDuration(video) && youtubeDurationSeconds > 0;
  const useYouTubeViews = !hasCustomInteractionCount(video) && youtubeInteractionCount > 0;
  const useYouTubeThumbnail =
    Boolean(stats.thumbnail_url) &&
    (!video.thumbnail_url || isYouTubeThumbnailUrl(video.thumbnail_url));
  const interactionCount = useYouTubeViews ? youtubeInteractionCount : customInteractionCount;
  const interactionCountSource = useYouTubeViews
    ? "youtube"
    : interactionCount > 0
      ? video.interaction_count_source || "custom"
      : "";
  const interactionStatistic = buildYouTubeInteractionStatistic(interactionCount);
  const schema = video.schema
    ? {
        ...video.schema,
        ...(useYouTubeDate ? { uploadDate: stats.upload_date } : {}),
        ...(useYouTubeDuration && stats.duration ? { duration: stats.duration } : {}),
        ...(useYouTubeThumbnail ? { thumbnailUrl: [stats.thumbnail_url] } : {}),
        ...(interactionStatistic ? { interactionStatistic } : {}),
      }
    : video.schema;

  if (schema && !interactionStatistic) {
    delete schema.interactionStatistic;
  }

  return {
    ...video,
    thumbnail_url: useYouTubeThumbnail ? stats.thumbnail_url : video.thumbnail_url,
    duration: useYouTubeDuration ? stats.duration || video.duration : video.duration,
    duration_seconds: useYouTubeDuration ? youtubeDurationSeconds : video.duration_seconds,
    interaction_count: interactionCount,
    interaction_count_source: interactionCountSource,
    upload_date: useYouTubeDate ? stats.upload_date : video.upload_date,
    schema,
  };
}

async function enrichVideoWithYouTubeStatistics(video) {
  if (typeof window !== "undefined") return video;

  const videoId = getVideoYouTubeId(video);
  if (!videoId) return video;

  const statsById = await fetchYouTubeStatisticsByIds([videoId]);
  return applyYouTubeStatistics(video, statsById.get(videoId));
}

async function enrichVideosWithYouTubeStatistics(videos = []) {
  if (typeof window !== "undefined" || !videos.length) return videos;

  const videoIds = videos.map(getVideoYouTubeId).filter(Boolean);
  const statsById = await fetchYouTubeStatisticsByIds(videoIds);

  if (!statsById.size) return videos;

  return videos.map((video) => applyYouTubeStatistics(video, statsById.get(getVideoYouTubeId(video))));
}

function extractYouTubeFallbackMetadata(html = "") {
  if (!html) return {};

  const watchActionMatch = html.match(/itemprop="interactionType"\s+content="https:\/\/schema\.org\/WatchAction"[\s\S]*?itemprop="userInteractionCount"\s+content="(\d+)"/i);
  const durationMatch = html.match(/itemprop="duration"\s+content="([^"]+)"/i);
  const lengthSecondsMatch = html.match(/"lengthSeconds":"(\d+)"/);
  const viewCountMatch = html.match(/"viewCount":"(\d+)"/);

  const interactionCount = parsePositiveInteger(watchActionMatch?.[1] || viewCountMatch?.[1]);
  const durationSeconds =
    parsePositiveInteger(lengthSecondsMatch?.[1]) ??
    (() => {
      const isoSeconds = parseIsoDurationToSeconds(durationMatch?.[1]);
      return isoSeconds > 0 ? isoSeconds : null;
    })();

  return {
    ...(interactionCount !== null ? { interaction_count: interactionCount } : {}),
    ...(durationSeconds !== null ? { duration_seconds: durationSeconds } : {}),
  };
}

async function fetchYouTubeFallbackMetadata(videoId) {
  if (!videoId) return {};

  let pending = youtubeMetadataCache.get(videoId);
  if (!pending) {
    pending = (async () => {
      try {
        const response = await fetch(`https://www.youtube.com/watch?v=${encodeURIComponent(videoId)}`, {
          cache: "no-store",
          headers: {
            "accept-language": "en-US,en;q=0.9",
          },
        });

        if (!response.ok) return {};
        return extractYouTubeFallbackMetadata(await response.text());
      } catch {
        return {};
      }
    })();

    youtubeMetadataCache.set(videoId, pending);
  }

  return pending;
}

function isYouTubeThumbnailUrl(url = "") {
  try {
    const parsed = new URL(url);
    const hostname = parsed.hostname.replace(/^www\./, "");
    return ["i.ytimg.com", "img.youtube.com", "i3.ytimg.com"].includes(hostname);
  } catch {
    return false;
  }
}

async function isReachableImage(url) {
  try {
    const response = await fetch(url, {
      method: "HEAD",
      cache: "no-store",
    });

    if (response.ok) return true;
  } catch {
    // Some image CDNs do not answer HEAD reliably; try a tiny GET below.
  }

  try {
    const response = await fetch(url, {
      cache: "no-store",
      headers: {
        Range: "bytes=0-0",
      },
    });

    return response.ok;
  } catch {
    return false;
  }
}

async function resolveBestYouTubeThumbnailUrl(url) {
  const videoId = getYouTubeVideoId(url);
  if (!videoId) return "";

  let pending = youtubeThumbnailCache.get(videoId);
  if (!pending) {
    pending = (async () => {
      const candidates = getYouTubeThumbnailCandidates(url);

      for (const candidate of candidates) {
        if (await isReachableImage(candidate)) {
          return candidate;
        }
      }

      return getYouTubeThumbnailUrl(url);
    })();

    youtubeThumbnailCache.set(videoId, pending);
  }

  return pending;
}

async function fetchVideoYoastBySlug(slug, lang = DEFAULT_LANG) {
  if (!WP_API || !slug) return {};

  try {
    const resolvedLang = resolveLang(lang);
    const res = await fetch(
      `${WP_API}/wp-json/wp/v2/headless-videos?slug=${encodeURIComponent(slug)}&lang=${encodeURIComponent(resolvedLang)}&_fields=yoast_head,yoast_head_json`,
      { cache: "no-store" }
    );

    if (!res.ok) return {};

    const data = await res.json();
    const post = Array.isArray(data) ? data[0] : null;

    return {
      ...(post?.yoast_head ? { yoast_head: post.yoast_head } : {}),
      ...(post?.yoast_head_json ? { yoast_head_json: post.yoast_head_json } : {}),
    };
  } catch {
    return {};
  }
}

export function normalizeVideoEmbedUrl(url) {
  if (!url) return "";

  try {
    const parsed = new URL(url);
    const hostname = parsed.hostname.replace(/^www\./, "");

    if (hostname === "youtube.com" || hostname === "youtube-nocookie.com") {
      if (parsed.pathname.startsWith("/embed/")) {
        return getYouTubeNoCookieEmbedUrl(url);
      }

      if (parsed.pathname === "/watch") {
        return getYouTubeNoCookieEmbedUrl(url);
      }

      if (parsed.pathname.startsWith("/shorts/")) {
        return getYouTubeNoCookieEmbedUrl(url);
      }

      if (parsed.pathname.startsWith("/live/")) {
        return getYouTubeNoCookieEmbedUrl(url);
      }
    }

    if (hostname === "youtu.be") {
      return getYouTubeNoCookieEmbedUrl(url);
    }

    if (hostname === "vimeo.com") {
      const videoId = parsed.pathname.split("/").filter(Boolean)[0];
      if (videoId) {
        return `https://player.vimeo.com/video/${videoId}`;
      }
    }

    return url;
  } catch {
    return url;
  }
}

function normalizeHeadlessVideo(video) {
  if (!video) return video;

  const embedUrl = normalizeVideoEmbedUrl(video.embed_url);
  const youtubeThumbnailUrl = getYouTubeThumbnailUrl(
    embedUrl || video.embed_url || video.watch_url || video.content_url
  );
  const thumbnailUrl =
    video.thumbnail_url ||
    youtubeThumbnailUrl ||
    "";
  const durationSeconds =
    parsePositiveInteger(video.duration_seconds) ??
    parseDurationTextToSeconds(video.duration);
  const interactionCount = parsePositiveInteger(video.interaction_count) ?? 0;
  const hasYouTubeInteractionCount = video.interaction_count_source === "youtube";
  const interactionStatistic = hasYouTubeInteractionCount
    ? buildYouTubeInteractionStatistic(interactionCount)
    : null;
  const interactionCountSource = hasYouTubeInteractionCount
    ? "youtube"
    : interactionCount > 0
      ? video.interaction_count_source || "custom"
      : "";
  const inferredLang = inferVideoLangFromUrl(video.watch_url || video.schema?.url);
  const watchUrl = normalizeVideoRouteUrl(
    video.watch_url || (video.slug ? getWatchPath(video.slug, inferredLang) : ""),
    inferredLang
  );
  const translations = normalizeVideoTranslations(video.translations);

  const schema = video.schema
    ? {
        ...video.schema,
        ...(watchUrl && {
          url: watchUrl,
        }),
        ...(thumbnailUrl && {
          thumbnailUrl: [thumbnailUrl],
        }),
        ...(video.schema.embedUrl && {
          embedUrl: normalizeVideoEmbedUrl(video.schema.embedUrl),
        }),
        ...(interactionStatistic ? { interactionStatistic } : {}),
      }
    : video.schema;

  if (schema && !interactionStatistic) {
    delete schema.interactionStatistic;
  }

  return {
    ...video,
    embed_url: embedUrl,
    thumbnail_url: thumbnailUrl,
    duration_seconds: durationSeconds,
    interaction_count: interactionCount,
    interaction_count_source: interactionCountSource,
    watch_url: watchUrl,
    translations,
    schema,
  };
}

function getTranslatedVideoSlug(video, lang) {
  const translation = video?.translations?.[lang];
  return extractVideoSlugFromUrl(translation) || "";
}

function getVideoTranslationKey(video) {
  return getTranslatedVideoSlug(video, "sv") || getTranslatedVideoSlug(video, "en") || video?.slug || "";
}

function withUploadDate(video, uploadDate) {
  if (!uploadDate) return video;

  return {
    ...video,
    upload_date: uploadDate,
    schema: video.schema
      ? {
          ...video.schema,
          uploadDate: uploadDate,
        }
      : video.schema,
  };
}

async function fetchEnglishVideoDateMap() {
  if (!WP_API) return new Map();

  try {
    const res = await fetch(
      `${WP_API}/wp-json/headless-video/v1/videos?per_page=100&lang=en`,
      { cache: "no-store" }
    );

    if (!res.ok) return new Map();

    const data = await res.json();
    if (!Array.isArray(data)) return new Map();

    const dates = new Map();

    const videosWithYouTubeDates = await enrichVideosWithYouTubeStatistics(
      data.map(normalizeHeadlessVideo)
    );

    videosWithYouTubeDates.forEach((video) => {
      if (!video?.upload_date) return;
      const keys = [
        getVideoTranslationKey(video),
        video.slug,
        getTranslatedVideoSlug(video, "sv"),
        getTranslatedVideoSlug(video, "en"),
      ].filter(Boolean);

      keys.forEach((key) => dates.set(key, video.upload_date));
    });

    return dates;
  } catch {
    return new Map();
  }
}

async function syncTranslatedUploadDates(videos = [], lang = DEFAULT_LANG) {
  if (resolveLang(lang) === "en" || !videos.length) return videos;

  const englishDates = await fetchEnglishVideoDateMap();
  if (!englishDates.size) return videos;

  return videos.map((video) => {
    if (hasCustomUploadDate(video)) return video;

    const uploadDate =
      englishDates.get(getVideoTranslationKey(video)) ||
      englishDates.get(video.slug) ||
      englishDates.get(getTranslatedVideoSlug(video, "en")) ||
      englishDates.get(getTranslatedVideoSlug(video, "sv"));

    return uploadDate ? withUploadDate(video, uploadDate) : video;
  });
}

async function syncTranslatedUploadDate(video, lang = DEFAULT_LANG) {
  if (resolveLang(lang) === "en" || !video) return video;
  if (hasCustomUploadDate(video)) return video;

  const englishDates = await fetchEnglishVideoDateMap();
  if (!englishDates.size) return video;

  const uploadDate =
    englishDates.get(getVideoTranslationKey(video)) ||
    englishDates.get(video.slug) ||
    englishDates.get(getTranslatedVideoSlug(video, "en")) ||
    englishDates.get(getTranslatedVideoSlug(video, "sv"));

  return uploadDate ? withUploadDate(video, uploadDate) : video;
}

function sortVideosByUploadDateDesc(videos = []) {
  return [...videos].sort((a, b) => {
    const dateA = new Date(a?.upload_date || 0).getTime() || 0;
    const dateB = new Date(b?.upload_date || 0).getTime() || 0;
    return dateB - dateA;
  });
}

async function enrichHeadlessVideo(video) {
  const normalized = normalizeHeadlessVideo(video);
  if (!normalized) return normalized;

  if (typeof window !== "undefined") {
    return normalized;
  }

  const youtubeSource = normalized.embed_url || normalized.content_url || normalized.watch_url || "";
  if (normalized.thumbnail_url && !isYouTubeThumbnailUrl(normalized.thumbnail_url)) {
    return normalized;
  }

  const resolvedThumbnailUrl = await resolveBestYouTubeThumbnailUrl(youtubeSource);
  const enriched =
    resolvedThumbnailUrl && resolvedThumbnailUrl !== normalized.thumbnail_url
      ? normalizeHeadlessVideo({
          ...normalized,
          thumbnail_url: resolvedThumbnailUrl,
        })
      : normalized;

  const needsDurationFallback = !(enriched.duration_seconds > 0);

  if (!needsDurationFallback) {
    return enriched;
  }

  const youtubeId = getYouTubeVideoId(enriched.embed_url || enriched.content_url || enriched.watch_url || "");
  if (!youtubeId) {
    return enriched;
  }

  const fallback = await fetchYouTubeFallbackMetadata(youtubeId);

  return normalizeHeadlessVideo({
    ...enriched,
    duration_seconds:
      needsDurationFallback && Number(fallback.duration_seconds) > 0
        ? fallback.duration_seconds
        : enriched.duration_seconds,
  });
}

export function secondsToReadableDuration(seconds, lang = DEFAULT_LANG) {
  const total = Number(seconds) || 0;
  if (total <= 0) return "";

  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const secs = total % 60;
  const isEnglish = resolveLang(lang) === "en";
  const parts = [];

  if (hours > 0) {
    parts.push(`${hours} ${isEnglish ? "hr" : "tim"}`);
  }

  if (minutes > 0) {
    parts.push(`${minutes} min`);
  }

  if (secs > 0 || parts.length === 0) {
    parts.push(`${secs} ${isEnglish ? "sec" : "sek"}`);
  }

  return parts.join(" ");
}

export function durationToReadableDuration(value, lang = DEFAULT_LANG) {
  const clean = String(value || "").replace(/<[^>]*>/g, "").trim();
  if (!clean) return "";

  const seconds = parseDurationTextToSeconds(clean);
  if (seconds > 0) return secondsToReadableDuration(seconds, lang);

  return clean;
}

export function getWatchPath(slug, lang = DEFAULT_LANG) {
  const resolvedLang = resolveLang(lang);
  const prefix = VIDEO_ROUTE_PREFIXES[resolvedLang] || VIDEO_ROUTE_PREFIXES.en;
  return withLocalePrefix(`${prefix}/${slug}`, resolvedLang);
}

export async function fetchHeadlessVideoBySlug(slug, lang = DEFAULT_LANG) {
  if (!WP_API || !slug) return null;

  try {
    const resolvedLang = resolveLang(lang);
    const res = await fetch(
      `${WP_API}/wp-json/headless-video/v1/videos/${encodeURIComponent(slug)}?lang=${encodeURIComponent(resolvedLang)}`,
      { cache: "no-store" }
    );

    if (!res.ok) return null;
    const video = await res.json();
    const yoast = await fetchVideoYoastBySlug(video?.slug || slug, resolvedLang);

    const enriched = await enrichHeadlessVideo({
      ...video,
      ...yoast,
    });
    const withYouTubeStats = await enrichVideoWithYouTubeStatistics(enriched);

    return syncTranslatedUploadDate(withYouTubeStats, resolvedLang);
  } catch {
    return null;
  }
}

export async function fetchHeadlessVideos({ perPage = 100, lang = DEFAULT_LANG } = {}) {
  if (!WP_API) return [];

  try {
    const resolvedLang = resolveLang(lang);
    const res = await fetch(
      `${WP_API}/wp-json/headless-video/v1/videos?per_page=${perPage}&lang=${encodeURIComponent(resolvedLang)}`,
      { cache: "no-store" }
    );

    if (!res.ok) return [];
    const data = await res.json();
    if (!Array.isArray(data)) return [];
    const videos = await Promise.all(data.map(enrichHeadlessVideo));
    const withYouTubeStats = await enrichVideosWithYouTubeStatistics(videos);
    const withSyncedDates = await syncTranslatedUploadDates(withYouTubeStats, resolvedLang);
    return sortVideosByUploadDateDesc(withSyncedDates);
  } catch {
    return [];
  }
}

async function fetchVideoPostById(id, lang = DEFAULT_LANG) {
  if (!WP_API || !id) return null;

  try {
    const resolvedLang = resolveLang(lang);
    const res = await fetch(
      `${WP_API}/wp-json/wp/v2/headless-videos/${encodeURIComponent(id)}?lang=${encodeURIComponent(resolvedLang)}&_fields=id,slug`,
      { cache: "no-store" }
    );

    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function fetchHeadlessVideoTranslationsBySlug(slug, lang = DEFAULT_LANG) {
  if (!WP_API || !slug) return null;

  try {
    const resolvedLang = resolveLang(lang);
    const res = await fetch(
      `${WP_API}/wp-json/wp/v2/headless-videos?slug=${encodeURIComponent(slug)}&lang=${encodeURIComponent(resolvedLang)}&_fields=id,slug,translations`,
      { cache: "no-store" }
    );

    if (!res.ok) return null;

    const data = await res.json();
    const current = Array.isArray(data) ? data[0] : null;
    if (!current?.translations || typeof current.translations !== "object") {
      return null;
    }

    const entries = await Promise.all(
      Object.entries(current.translations).map(async ([localeCode, postId]) => {
        const translated = await fetchVideoPostById(postId, localeCode);
        if (!translated?.slug) return null;
        return [localeCode, getWatchPath(translated.slug, localeCode)];
      })
    );

    const translations = Object.fromEntries(entries.filter(Boolean));
    return Object.keys(translations).length ? translations : null;
  } catch {
    return null;
  }
}
