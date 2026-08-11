import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";
import { DEFAULT_LANG } from "../../../lib/api";
import { formatArticleDate } from "../../../lib/dateFormat";
import { fetchHeadlessVideos, getWatchPath, secondsToReadableDuration } from "../../../lib/headlessVideo";

function stripHtml(value) {
  if (!value) return "";
  return String(value).replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
}

function clampDescription(value = "") {
  const clean = stripHtml(value);
  if (!clean) return "";
  return clean;
}

function formatViews(count, lang = "sv") {
  const value = Number(count);
  if (!Number.isFinite(value) || value < 0) return "";
  return new Intl.NumberFormat(lang === "en" ? "en-GB" : "sv-SE").format(value);
}

function getDurationLabel(video, lang = "sv") {
  const derived = video.durationSeconds
    ? secondsToReadableDuration(video.durationSeconds)
    : "";

  if (derived) return derived;
  if (typeof video.duration === "string" && video.duration.trim()) return video.duration.trim();

  return "";
}

function getViewsLabel(video, lang = "sv") {
  const derived = formatViews(video.views, lang);
  if (derived) return `${derived} ${lang === "en" ? "views" : "visningar"}`;

  const numericViews = Number(video.views);
  if (Number.isFinite(numericViews) && numericViews === 0) {
    return `0 ${lang === "en" ? "views" : "visningar"}`;
  }

  return "";
}

function versionedUrl(url, version) {
  if (!url || !version) return url || "";
  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}v=${encodeURIComponent(version)}`;
}

function getYouTubeVideoId(url) {
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
      /(?:youtu\.be\/(?:[^?&\/]+)|youtube(?:-nocookie)?\.com\/(?:watch\?v=|embed\/|shorts\/|live\/))([A-Za-z0-9_-]{11})/
    );
    return match?.[1] || "";
  }

  return "";
}

function normalizeYouTubeThumbnailUrl(url) {
  if (!url) return "";
  const videoId = getYouTubeVideoId(url);
  if (!videoId) return url;

  try {
    const parsed = new URL(url);
    const pathParts = parsed.pathname.split("/").filter(Boolean);
    if (pathParts[0] === "vi" && pathParts[1] === videoId && pathParts[2]) {
      return `https://i.ytimg.com/vi/${videoId}/${pathParts[2]}`;
    }
  } catch {
    // Ignore invalid URL; fallback to normalized YouTube thumbnail format.
  }

  return `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
}

function mergeVideosWithExisting(existingVideos = [], incomingVideos = []) {
  const existingById = new Map(existingVideos.map((video) => [video.id, video]));

  return incomingVideos.map((video) => {
    const existing = existingById.get(video.id);
    if (!existing) return video;

    return {
      ...video,
      image:
        video.image && video.image !== "/userfallback.webp"
          ? video.image
          : existing.image,
      durationSeconds: video.durationSeconds > 0 ? video.durationSeconds : existing.durationSeconds || 0,
      duration: video.duration || existing.duration || "",
      views:
        video.views > 0
          ? video.views
          : existing.views > 0 || Number(existing.views) === 0
            ? existing.views
            : video.views,
    };
  });
}

function CalendarIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M7 3v3M17 3v3M4.5 9h15M6.5 5h11A2.5 2.5 0 0 1 20 7.5v10A2.5 2.5 0 0 1 17.5 20h-11A2.5 2.5 0 0 1 4 17.5v-10A2.5 2.5 0 0 1 6.5 5Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z" stroke="currentColor" strokeWidth="1.8" />
      <path d="M12 7.5V12l3 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M2.5 12s3.5-6.5 9.5-6.5 9.5 6.5 9.5 6.5-3.5 6.5-9.5 6.5S2.5 12 2.5 12Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 14.8a2.8 2.8 0 1 0 0-5.6 2.8 2.8 0 0 0 0 5.6Z" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function MetaSeparator() {
  return <span className="text-[#B8C0CC]" aria-hidden="true">|</span>;
}

function formatVideos(videos = []) {
  return videos
    .filter((video) => video?.slug && video?.title)
    .map((video) => {
      const thumbnail = versionedUrl(video.thumbnail_url, video.modified) || video.thumbnail_url || "";
      return {
        id: video.id || video.slug,
        slug: video.slug,
        title: stripHtml(video.title),
        description: clampDescription(video.description || video.description_html),
        image: normalizeYouTubeThumbnailUrl(thumbnail) || "/userfallback.webp",
        uploadDate: video.upload_date || "",
        durationSeconds: video.duration_seconds || 0,
        duration: video.duration || "",
        views: video.interaction_count || 0,
      };
    });
}

export default function VideosListingSection({
  section,
  initialVideos = [],
}) {
  const router = useRouter();
  const lang = router.locale || DEFAULT_LANG;
  const formattedInitialVideos = formatVideos(initialVideos);
  const [videos, setVideos] = useState(formattedInitialVideos);

  useEffect(() => {
    setVideos(formattedInitialVideos);
  }, [initialVideos]);

  useEffect(() => {
    let cancelled = false;

    async function loadVideos() {
      const data = await fetchHeadlessVideos({ perPage: 100, lang });
      if (!cancelled) {
        const formatted = formatVideos(data);
        if (formatted.length > 0 || formattedInitialVideos.length === 0) {
          setVideos((currentVideos) => mergeVideosWithExisting(currentVideos, formatted));
        }
      }
    }

    loadVideos();

    return () => {
      cancelled = true;
    };
  }, [lang, formattedInitialVideos.length]);

  if (!videos.length) return null;

  const heading = section?.heading || "";
  const ctaButtonTitle = section?.cta_button_title || (lang === "en" ? "Watch video" : "Titta pa video");

  return (
    <section className="w-full bg-white py-15 md:py-[100px]">
      <div className="web-width mx-auto px-6 md:px-0">
        {heading && (
          <h2
            className="mb-10 max-w-[760px] font-heading text-[28px] sm:text-[34px] md:text-[40px] font-semibold leading-[1.15] text-[#061837]"
            dangerouslySetInnerHTML={{ __html: heading }}
          />
        )}

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {videos.map((video) => (
            <article key={video.id} className="flex h-full flex-col overflow-hidden rounded-[3px] border border-[#D1D9E6] bg-white">
              <Link
                href={getWatchPath(video.slug, lang)}
                className="group relative aspect-video w-full overflow-hidden bg-[#E3EDFF]"
                aria-label={video.title}
              >
                <Image
                  src={video.image}
                  alt={video.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <span className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/5 to-transparent opacity-70 transition-opacity duration-300 group-hover:opacity-90" />
                <span className="absolute bottom-4 left-4 flex h-11 w-11 items-center justify-center rounded-full bg-[#2655C4] text-white shadow-lg transition-transform duration-300 group-hover:scale-105">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    className="h-5 w-5 translate-x-[1px]"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </span>
              </Link>

              <div className="flex flex-1 flex-col px-6 py-6 bg-[#F9FAFB]">
                {(() => {
                  const uploadDate = formatArticleDate(video.uploadDate, lang);
                  const duration = getDurationLabel(video, lang);
                  const views = getViewsLabel(video, lang);

                  if (!uploadDate && !duration && !views) return null;

                  return (
                    <div className="mb-4 border-b border-[#D1D9E6] pb-4">
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-[12px] font-montserrat font-semibold tracking-[0.08em] text-[#606164]">
                        {uploadDate && (
                          <div className="flex items-center gap-2">
                            <CalendarIcon />
                            <time dateTime={video.uploadDate}>{uploadDate}</time>
                          </div>
                        )}
                        {uploadDate && duration && <MetaSeparator />}
                        {duration && (
                          <div className="flex items-center gap-2">
                            <ClockIcon />
                            <span>{duration}</span>
                          </div>
                        )}
                        {(uploadDate || duration) && views && <MetaSeparator />}
                        {views && (
                          <div className="flex items-center gap-2">
                            <EyeIcon />
                            <span>{views}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })()}

                <h3 className="mb-3 font-heading text-[22px] font-semibold leading-[1.3] text-[#061837]">
                  {video.title}
                </h3>

                <p
                  className="mb-6 min-h-[78px] overflow-hidden text-[16px] leading-[1.65] text-[#606164]"
                  style={{
                    display: "-webkit-box",
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: "vertical",
                  }}
                >
                  {video.description}
                </p>

                <div className="mt-auto">
                  <Link href={getWatchPath(video.slug, lang)} className="btn-primary w-fit">
                    {ctaButtonTitle}
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
