import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import DotIndicator from "../../ui/DotIndicator";
import { wpToPath } from "../../../lib/api";

/** Convert any YouTube URL to an embed URL, return null for non-YouTube */
function toYouTubeEmbed(url) {
  if (!url) return null;
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([A-Za-z0-9_-]{11})/
  );
  if (!match) return null;
  return `https://www.youtube.com/embed/${match[1]}?rel=0&modestbranding=1&autoplay=1`;
}

/** Detect if a URL is a local/direct video file */
function isVideoFile(url) {
  if (!url) return false;
  return /\.(mp4|webm|ogg|mov|avi|mkv)(\?.*)?$/i.test(url);
}

function resolveImageUrl(field) {
  if (!field) return "";
  if (typeof field === "string") return field;
  return field?.sizes?.large || field?.sizes?.medium_large || field?.url || "";
}

export default function AboutSection({
  sectionId,
  section_label,
  heading,
  description,
  button_text,
  button_link,
  image,
  video_url,
  video_thumbnail,
  media_type = "image",
  page_type = "homepage",
}) {
  const [videoPlaying, setVideoPlaying] = useState(false);

  const imgUrl        = resolveImageUrl(image);
  const thumbUrl      = resolveImageUrl(video_thumbnail);
  const youtubeEmbed  = toYouTubeEmbed(video_url);
  const isLocalVideo  = !youtubeEmbed && isVideoFile(video_url);

  const isVideo = media_type === "video" && !!(youtubeEmbed || isLocalVideo);

  const MediaBlock = ({ sizes = "80vw" }) => {
    /* ── VIDEO ── */
    if (isVideo) {
      // If thumbnail exists and user hasn't clicked play yet → show thumbnail + play btn
      if (thumbUrl && !videoPlaying) {
        return (
          <div
            className="relative w-full rounded-[3px] overflow-hidden cursor-pointer group"
            style={{ aspectRatio: "16 / 9" }}
            onClick={() => setVideoPlaying(true)}
            role="button"
            aria-label="Play video"
          >
            <Image
              src={thumbUrl}
              alt={video_thumbnail?.alt || "Video thumbnail"}
              fill
              sizes={sizes}
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            {/* Gradient overlay — stronger at bottom */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent transition-opacity duration-300 group-hover:opacity-80" />

            {/* Play button — centered */}
            <div className="absolute inset-0 flex items-center justify-center">
              {/* Normal: solid blue pill | Hover: frosted glass */}
              <div className="relative flex items-center gap-3 px-6 py-3 rounded-full bg-[#2655C4] border border-[#2655C4] shadow-xl group-hover:bg-white/10 group-hover:backdrop-blur-sm group-hover:border-white/30 transition-all duration-300">
                {/* Play icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className="w-5 h-5 translate-x-[1px] text-white"
                  fill="currentColor"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
                <span className="text-white text-[13px] font-semibold font-montserrat tracking-wide uppercase">
                  Play Video
                </span>
              </div>
            </div>
          </div>
        );
      }

      // No thumbnail, or user clicked play → render actual video
      if (youtubeEmbed) {
        return (
          <div className="relative w-full rounded-[3px] overflow-hidden" style={{ aspectRatio: "16 / 9" }}>
            <iframe
              src={youtubeEmbed}
              title="About video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full border-0"
            />
          </div>
        );
      }

      return (
        <div className="w-full rounded-[3px] overflow-hidden">
          <video
            src={video_url}
            controls
            autoPlay={videoPlaying}
            playsInline
            className="w-full h-auto block"
            style={{ aspectRatio: "16 / 9", objectFit: "cover" }}
          >
            <source src={video_url} />
          </video>
        </div>
      );
    }

    /* ── IMAGE ── */
    if (imgUrl) {
      return (
        <div className="relative w-full rounded-[3px] overflow-hidden" style={{ aspectRatio: "3 / 2" }}>
          <Image
            src={imgUrl}
            alt={image?.alt || "About image"}
            fill
            sizes={sizes}
            className="object-cover"
          />
        </div>
      );
    }

    return null;
  };

  return (
    <section id={sectionId} className="relative bg-[#E3EDFF] py-15 md:py-[100px]">

      <style>{`
        .about-section-content em {
          color: #2655C4 !important;
          font-family: var(--font-merriweather), serif !important;
          font-style: italic;
          font-weight: 600;
        }
      `}</style>

      <div className="web-width mx-auto px-6 md:px-0 flex flex-col md:flex-row">

        {/* LEFT COLUMN – 15% */}
        <div className="md:w-[15%]">
          {page_type !== "innerpage" && (
            <div className="flex items-center gap-2 mb-4 md:mb-6">
              <DotIndicator />
              <span className="uppercase font-montserrat font-medium text-[10px] sm:text-[10px] md:text-[12px] tracking-wider text-black">
                {section_label}
              </span>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN – 85% */}
        <div className="md:w-[85%] about-section-content">

          {heading && (
            <div
              className="font-heading font-semibold text-[28px] sm:text-[34px] md:text-[40px] lg:text-[48px] leading-[36px] sm:leading-[44px] md:leading-[52px] lg:leading-[58px] text-[#000] mb-8 md:mb-10 max-w-[1050px]"
              suppressHydrationWarning
              dangerouslySetInnerHTML={{ __html: heading }}
            />
          )}

          <div className="flex flex-col md:flex-row gap-8 md:gap-10">

            {/* Description + CTA */}
            <div className="md:w-[23%]">
              {description && (
                <div
                  suppressHydrationWarning
                  className="font-body text-[14px] sm:text-[15px] md:text-[16px] leading-[1.4] md:leading-[1.5] text-[#1A1A1A] mb-6"
                  dangerouslySetInnerHTML={{ __html: description }}
                />
              )}
              {button_text && (
                <Link
                  href={wpToPath(button_link) || "#"}
                  className="btn-primary inline-block text-sm sm:text-base"
                >
                  {button_text}
                </Link>
              )}
            </div>

            {/* Media */}
            <div className="md:w-[80%]">
              <MediaBlock sizes="(max-width: 768px) 100vw, 80vw" />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
