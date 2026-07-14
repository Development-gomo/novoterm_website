import { DEFAULT_LANG, resolveLang, withLocalePrefix } from "./api";
import { getYouTubeNoCookieEmbedUrl } from "./videoEmbed";

const WP_API = process.env.NEXT_PUBLIC_WP_URL?.replace(/\/$/, "");

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

  return {
    ...video,
    embed_url: embedUrl,
    schema: video.schema
      ? {
          ...video.schema,
          ...(video.schema.embedUrl && {
            embedUrl: normalizeVideoEmbedUrl(video.schema.embedUrl),
          }),
        }
      : video.schema,
  };
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
    return normalizeHeadlessVideo(await res.json());
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
    return Array.isArray(data) ? data.map(normalizeHeadlessVideo) : [];
  } catch {
    return [];
  }
}
