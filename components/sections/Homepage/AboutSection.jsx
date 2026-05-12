import Link from "next/link";
import Image from "next/image";
import DotIndicator from "../../ui/DotIndicator";
import { wpToPath } from "../../../lib/api";

/** Convert any YouTube URL to an embed URL, return null for non-YouTube */
function toYouTubeEmbed(url) {
  if (!url) return null;
  // youtu.be/ID  or  youtube.com/watch?v=ID  or  youtube.com/embed/ID
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([A-Za-z0-9_-]{11})/
  );
  if (!match) return null;
  return `https://www.youtube.com/embed/${match[1]}?rel=0&modestbranding=1`;
}

/** Detect if a URL is a local/direct video file */
function isVideoFile(url) {
  if (!url) return false;
  return /\.(mp4|webm|ogg|mov|avi|mkv)(\?.*)?$/i.test(url);
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
  page_type = "homepage",
}) {
  const imgUrl =
    typeof image === "string"
      ? image
      : image?.url ||
        image?.sizes?.large ||
        image?.sizes?.medium_large ||
        "";

  // Determine what media to show: video takes priority over image
  const youtubeEmbed = toYouTubeEmbed(video_url);
  const isLocalVideo  = !youtubeEmbed && isVideoFile(video_url);
  const showVideo     = !!(youtubeEmbed || isLocalVideo);

  const MediaBlock = ({ className = "", sizes = "80vw" }) => {
    if (showVideo) {
      if (youtubeEmbed) {
        return (
          <div className={`relative w-full rounded-[3px] overflow-hidden ${className}`} style={{ aspectRatio: "16 / 9" }}>
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
        <div className={`w-full rounded-[3px] overflow-hidden ${className}`}>
          <video
            src={video_url}
            controls
            playsInline
            className="w-full h-auto block"
            style={{ aspectRatio: "16 / 9", objectFit: "cover" }}
          >
            <source src={video_url} />
            Your browser does not support the video tag.
          </video>
        </div>
      );
    }
    if (imgUrl) {
      return (
        <div className={`relative w-full rounded-[3px] overflow-hidden ${className}`} style={{ aspectRatio: "3 / 2" }}>
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

      {/* LOCAL STYLE */}
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
