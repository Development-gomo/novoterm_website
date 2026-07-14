import Head from "next/head";
import Image from "next/image";
import { useState } from "react";
import MarketingConsentVideoEmbed from "../../../components/ui/MarketingConsentVideoEmbed";
import { buildSiteUrl, resolveLang } from "../../../lib/api";
import {
  fetchHeadlessVideoBySlug,
  getWatchPath,
  secondsToReadableDuration,
} from "../../../lib/headlessVideo";

function safeJsonLd(schema) {
  return JSON.stringify(schema || {}).replace(/</g, "\\u003c");
}

function stripHtml(value = "") {
  return value.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
}

function formatDate(value) {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat("sv-SE", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

function formatTime(value) {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat("sv-SE", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function versionedUrl(url, version) {
  if (!url || !version) return url || "";
  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}v=${encodeURIComponent(version)}`;
}

function highlightItemsHtml(html = "") {
  if (!html || /<li[\s>]/i.test(html)) return html;

  const items = html
    .replace(/<\/p>\s*<p[^>]*>/gi, "\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/?p[^>]*>/gi, "")
    .split("\n")
    .map((item) => item.trim())
    .filter((item) => stripHtml(item));

  if (!items.length) return html;

  return `<ul>${items.map((item) => `<li>${item}</li>`).join("")}</ul>`;
}

function CalendarIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M7 3v3M17 3v3M4.5 9h15M6.5 5h11A2.5 2.5 0 0 1 20 7.5v10A2.5 2.5 0 0 1 17.5 20h-11A2.5 2.5 0 0 1 4 17.5v-10A2.5 2.5 0 0 1 6.5 5Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z" stroke="currentColor" strokeWidth="1.8" />
      <path d="M12 7.5V12l3 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M2.5 12s3.5-6.5 9.5-6.5 9.5 6.5 9.5 6.5-3.5 6.5-9.5 6.5S2.5 12 2.5 12Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 14.8a2.8 2.8 0 1 0 0-5.6 2.8 2.8 0 0 0 0 5.6Z" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function MetaSeparator() {
  return <span className="text-[#B8C0CC]" aria-hidden="true">|</span>;
}

function formatViews(count) {
  const value = Number(count) || 0;
  if (value <= 0) return "";
  return new Intl.NumberFormat("sv-SE").format(value);
}

export async function getServerSideProps({ params, locale }) {
  const lang = resolveLang(locale);
  const video = await fetchHeadlessVideoBySlug(params.slug, lang);

  if (!video) {
    return { notFound: true };
  }

  if (video.indexing_enabled === false) {
    return {
      props: {
        video,
        canonicalUrl: buildSiteUrl(getWatchPath(video.slug, lang)),
        noindex: true,
      },
    };
  }

  return {
    props: {
      video,
      canonicalUrl: buildSiteUrl(getWatchPath(video.slug, lang)),
      noindex: false,
    },
  };
}

export default function WatchPage({ video, canonicalUrl, noindex }) {
  const [embedStarted, setEmbedStarted] = useState(false);
  const title = stripHtml(video.title);
  const description = stripHtml(video.description || video.description_html);
  const duration = secondsToReadableDuration(video.duration_seconds);
  const uploadDate = formatDate(video.upload_date);
  const uploadTime = formatTime(video.upload_date);
  const views = formatViews(video.interaction_count);
  const hasDirectVideo = Boolean(video.content_url);
  const hasEmbed = Boolean(video.embed_url);
  const thumbnailUrl = versionedUrl(video.thumbnail_url, video.modified);
  const highlightsHtml = highlightItemsHtml(video.highlights_html);
  const ctaTitle = stripHtml(video.cta_title || "");
  const ctaDescriptionHtml = video.cta_description_html;
  const ctaButtonText = stripHtml(video.cta_button_text || "");
  const ctaButtonUrl = video.cta_button_url;
  const hasCta = Boolean(ctaTitle || ctaDescriptionHtml || (ctaButtonText && ctaButtonUrl));
  const showEmbedCover = hasEmbed && thumbnailUrl && !embedStarted;
  const embedSrc =
    hasEmbed && embedStarted
      ? `${video.embed_url}${video.embed_url.includes("?") ? "&" : "?"}autoplay=1`
      : video.embed_url;
  const videoSchema = video.schema
    ? {
        ...video.schema,
        url: canonicalUrl,
      }
    : null;

  return (
    <>
      <Head>
        <title>{title}</title>
        {description && <meta name="description" content={description} />}
        {noindex && <meta name="robots" content="noindex, follow" />}
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:type" content="video.other" />
        <meta property="og:title" content={title} />
        {description && <meta property="og:description" content={description} />}
        <meta property="og:url" content={canonicalUrl} />
        {thumbnailUrl && (
          <meta property="og:image" content={thumbnailUrl} />
        )}
        {hasEmbed && <meta property="og:video" content={video.embed_url} />}
        {videoSchema && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: safeJsonLd(videoSchema) }}
          />
        )}
      </Head>

      <main className="bg-white">
        <article className="mx-auto w-full max-w-[980px] px-6 pt-[150px] pb-[90px]">
          <div className="mb-6 flex flex-wrap items-center gap-x-3 gap-y-3 text-[13px] font-montserrat font-semibold uppercase tracking-[0.08em] text-[#606164]">
            {uploadDate && (
              <div className="flex items-center gap-2">
                <CalendarIcon />
                <time dateTime={video.upload_date}>{uploadDate}</time>
              </div>
            )}
            {uploadDate && uploadTime && <MetaSeparator />}
            {uploadTime && (
              <div className="flex items-center gap-2">
                <ClockIcon />
                <time dateTime={video.upload_date}>{uploadTime}</time>
              </div>
            )}
            {(uploadDate || uploadTime) && duration && <MetaSeparator />}
            {duration && (
              <div className="flex items-center gap-2">
                <ClockIcon />
                <span>{duration}</span>
              </div>
            )}
            {(uploadDate || uploadTime || duration) && views && <MetaSeparator />}
            {views && (
              <div className="flex items-center gap-2">
                <EyeIcon />
                <span>{views} views</span>
              </div>
            )}
          </div>

          <h1 className="font-heading text-[#061837] text-[36px] md:text-[56px] leading-[1.1] font-semibold tracking-normal">
            {title}
          </h1>

          <div className="mt-9 aspect-video w-full overflow-hidden rounded-[3px] bg-[#061837]">
            {hasDirectVideo ? (
              <video
                controls
                preload="metadata"
                poster={thumbnailUrl || undefined}
                className="h-full w-full object-cover"
              >
                <source src={video.content_url} />
              </video>
            ) : showEmbedCover ? (
              <button
                type="button"
                onClick={() => setEmbedStarted(true)}
                className="group relative h-full w-full cursor-pointer overflow-hidden"
                aria-label={`Play ${title}`}
              >
                <Image
                  src={thumbnailUrl}
                  alt=""
                  fill
                  sizes="(max-width: 1024px) 100vw, 980px"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  priority
                />
                <span className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent transition-opacity duration-300 group-hover:opacity-80" />
                <span className="absolute inset-0 flex items-center justify-center">
                  <span className="relative flex items-center gap-3 rounded-full border border-[#2655C4] bg-[#2655C4] px-6 py-3 shadow-xl transition-all duration-300 group-hover:border-white/30 group-hover:bg-white/10 group-hover:backdrop-blur-sm">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      className="h-5 w-5 translate-x-[1px] text-white"
                      fill="currentColor"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                    <span className="font-montserrat text-[13px] font-semibold uppercase tracking-wide text-white">
                      Play Video
                    </span>
                  </span>
                </span>
              </button>
            ) : hasEmbed ? (
              <MarketingConsentVideoEmbed
                src={embedSrc}
                title={title}
                className="h-full w-full"
                iframeClassName="h-full w-full"
              />
            ) : (
              <div
                className="h-full w-full bg-cover bg-center"
                style={{
                  backgroundImage: thumbnailUrl
                    ? `url(${thumbnailUrl})`
                    : "none",
                }}
              />
            )}
          </div>

          {video.description_html && (
            <section className="mt-12">
              <div
                className="prose max-w-none [&_p]:text-[18px] [&_p]:leading-[1.8] [&_p]:text-[#061837] [&_a]:text-[#2555C4] [&_a:hover]:underline"
                dangerouslySetInnerHTML={{ __html: video.description_html }}
              />
            </section>
          )}

          {highlightsHtml && (
            <section className="mt-10 border-t border-[#D1D9E6] pt-8">
              <h2 className="text-[#061837] text-[24px] md:text-[30px] font-heading font-semibold mb-5">
                Highlights
              </h2>
              <div
                className="prose max-w-none [&_p]:text-[17px] [&_p]:leading-[1.75] [&_ul]:list-disc [&_ul]:pl-6 [&_li]:mb-2 [&_li]:text-[#061837] [&_li::marker]:text-[#2555C4]"
                dangerouslySetInnerHTML={{ __html: highlightsHtml }}
              />
            </section>
          )}

          {hasCta && (
            <section className="mt-10 border-t border-[#D1D9E6] pt-8">
              {ctaTitle && (
                <h2 className="text-[#061837] text-[24px] md:text-[30px] font-heading font-semibold mb-4">
                  {ctaTitle}
                </h2>
              )}
              {ctaDescriptionHtml && (
                <div
                  className="prose max-w-none [&_p]:text-[17px] [&_p]:leading-[1.75] [&_p]:text-[#061837] [&_a]:text-[#2555C4] [&_a:hover]:underline"
                  dangerouslySetInnerHTML={{ __html: ctaDescriptionHtml }}
                />
              )}
              {ctaButtonText && ctaButtonUrl && (
                <a href={ctaButtonUrl} className="btn-primary mt-6 w-fit">
                  {ctaButtonText}
                </a>
              )}
            </section>
          )}
        </article>
      </main>
    </>
  );
}
