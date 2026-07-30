import { DEFAULT_LANG, resolveLang, withLocalePrefix } from "./api";
import {
  getYouTubeNoCookieEmbedUrl,
  getYouTubeThumbnailCandidates,
  getYouTubeThumbnailUrl,
  getYouTubeVideoId,
} from "./videoEmbed";

const WP_API = process.env.NEXT_PUBLIC_WP_URL?.replace(/\/$/, "");
const youtubeMetadataCache = new Map();
const youtubeThumbnailCache = new Map();

function parsePositiveInteger(value) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric) || numeric < 0) return null;
  return Math.trunc(numeric);
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
    (isYouTubeThumbnailUrl(video.thumbnail_url) ? video.thumbnail_url : youtubeThumbnailUrl) ||
    video.thumbnail_url ||
    "";
  const durationSeconds = parsePositiveInteger(video.duration_seconds) ?? 0;
  const interactionCount = parsePositiveInteger(video.interaction_count) ?? 0;

  return {
    ...video,
    embed_url: embedUrl,
    thumbnail_url: thumbnailUrl,
    duration_seconds: durationSeconds,
    interaction_count: interactionCount,
    schema: video.schema
      ? {
          ...video.schema,
          ...(thumbnailUrl && {
            thumbnailUrl: [thumbnailUrl],
          }),
          ...(video.schema.embedUrl && {
            embedUrl: normalizeVideoEmbedUrl(video.schema.embedUrl),
          }),
        }
      : video.schema,
  };
}

async function enrichHeadlessVideo(video) {
  const normalized = normalizeHeadlessVideo(video);
  if (!normalized) return normalized;

  if (typeof window !== "undefined") {
    return normalized;
  }

  const youtubeSource = normalized.embed_url || normalized.content_url || normalized.watch_url || "";
  const resolvedThumbnailUrl = await resolveBestYouTubeThumbnailUrl(youtubeSource);
  const enriched =
    resolvedThumbnailUrl && resolvedThumbnailUrl !== normalized.thumbnail_url
      ? normalizeHeadlessVideo({
          ...normalized,
          thumbnail_url: resolvedThumbnailUrl,
        })
      : normalized;

  const needsDurationFallback = !(enriched.duration_seconds > 0);
  const needsViewsFallback = !(enriched.interaction_count > 0);

  if (!needsDurationFallback && !needsViewsFallback) {
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
    interaction_count:
      needsViewsFallback && Number(fallback.interaction_count) > 0
        ? fallback.interaction_count
        : enriched.interaction_count,
  });
}

export function secondsToReadableDuration(seconds) {
  const total = Number(seconds) || 0;
  if (total <= 0) return "";

  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const secs = total % 60;

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  }

  return `${minutes}:${String(secs).padStart(2, "0")}`;
}

export function getWatchPath(slug, lang = DEFAULT_LANG) {
  return withLocalePrefix(`/watch/${slug}`, resolveLang(lang));
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

    return enrichHeadlessVideo({
      ...video,
      ...yoast,
    });
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
    return Promise.all(data.map(enrichHeadlessVideo));
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
