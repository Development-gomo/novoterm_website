export function getYouTubeVideoId(url) {
  if (!url) return "";

  try {
    const parsed = new URL(url);
    const hostname = parsed.hostname.replace(/^www\./, "");
    const pathParts = parsed.pathname.split("/").filter(Boolean);

    if (hostname === "youtu.be") {
      return pathParts[0] || "";
    }

    if (hostname === "youtube.com" || hostname === "youtube-nocookie.com") {
      if (parsed.pathname === "/watch") {
        return parsed.searchParams.get("v") || "";
      }

      if (["embed", "shorts", "live"].includes(pathParts[0])) {
        return pathParts[1] || "";
      }
    }
  } catch {
    const match = String(url).match(
      /(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:watch\?v=|embed\/|shorts\/|live\/))([A-Za-z0-9_-]{11})/
    );
    return match?.[1] || "";
  }

  return "";
}

export function getYouTubeNoCookieEmbedUrl(url, extraParams = {}) {
  const videoId = getYouTubeVideoId(url);
  if (!videoId) return "";

  const params = new URLSearchParams();

  try {
    const parsed = new URL(url);
    parsed.searchParams.forEach((value, key) => {
      if (key !== "v") params.set(key, value);
    });
  } catch {
    // Non-URL strings are handled by getYouTubeVideoId; no query params to copy.
  }

  Object.entries(extraParams).forEach(([key, value]) => {
    if (value === undefined || value === null || value === false) return;
    params.set(key, value === true ? "1" : String(value));
  });

  const query = params.toString();
  return `https://www.youtube-nocookie.com/embed/${videoId}${query ? `?${query}` : ""}`;
}

export function getYouTubeThumbnailUrl(url) {
  const videoId = getYouTubeVideoId(url);
  if (!videoId) return "";

  return `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`;
}

export function getYouTubeThumbnailCandidates(url) {
  const videoId = getYouTubeVideoId(url);
  if (!videoId) return [];

  return ["maxresdefault", "sddefault", "hqdefault"].map(
    (quality) => `https://i.ytimg.com/vi/${videoId}/${quality}.jpg`
  );
}

export function isYouTubeUrl(url) {
  return Boolean(getYouTubeVideoId(url));
}
