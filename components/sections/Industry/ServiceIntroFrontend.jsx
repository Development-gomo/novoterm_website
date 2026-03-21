
import { useState } from "react";
import ReadMoreContent from "./ReadMoreContent";
import Link from "next/link";
import DotIndicator from "../../ui/DotIndicator";
import { wpToPath } from "../../../lib/api";

export default function IndustryIntro({
  section,
  sectionId,
  index = 0,
  removeBottomPadding = false,
}) {
  if (!section) return null;

  const {
    section_label,
    heading,
    main_content,
    layout_type = "image",
    media_position = "right",
    image,
    video_url,
    content,
    enable_button,
    button_text,
    button_link,
    button_position = "left",
    section_theme = "light",
  } = section;

  // Normalize enable_button — ACF can return true, 1, or "1"
  const showButton = !!enable_button && button_text && button_link;

  // Theme-based classes
  const isDark = section_theme === "dark";
  const sectionBg = isDark ? "bg-[#061837]" : "bg-[#E3EDFF]";
  const headingColor = isDark ? "text-white" : "text-[#061837]";
  const textColor = isDark ? "text-white/90" : "text-[#000000]";
  const labelColor = isDark ? "text-white/70" : "text-[#061837]";

  /* Normalize image */
  const imageUrl =
    typeof image === "string"
      ? image
      : image?.url ||
        image?.sizes?.large ||
        image?.sizes?.medium_large ||
        "";

  const isMediaRight = media_position === "right";
  const [videoAccepted, setVideoAccepted] = useState(false);
const getEmbedUrl = (url) => {
  if (!url) return null;

  try {
    // Normal YouTube URL
    if (url.includes("youtube.com/watch")) {
      const videoId = new URL(url).searchParams.get("v");
      return `https://www.youtube.com/embed/${videoId}`;
    }

    // Short youtu.be URL
    if (url.includes("youtu.be")) {
      const videoId = url.split("youtu.be/")[1];
      return `https://www.youtube.com/embed/${videoId}`;
    }

    // Already embed format
    return url;
  } catch (err) {
    return url;
  }
};

  return (
    <section id={sectionId} className={`w-full ${sectionBg} ${removeBottomPadding ? 'pt-[40px] md:pt-10 lg:pt-[100px] pb-0' : 'py-[40px] md:py-10 lg:py-[100px]'}`}>
      <div className="web-width mx-auto px-6 md:px-0">

        <div className="flex flex-col md:flex-row">

          {/* ================= LEFT 15% ================= */}
          <div className="md:w-[15%] relative mb-6 md:mb-0">
            {(section_label || section?.acf_fc_layout) && (
              <div className="flex items-center gap-2 mb-4 lg:hidden">
                <span className="w-2 h-2 rounded-full bg-[#2655C4]" />
                <span className={`uppercase font-montserrat font-medium text-[10px] tracking-wider ${isDark ? 'text-white' : 'text-[#061837]'}`}>
                  {section_label || section.acf_fc_layout?.replace(/_section$/, '').replace(/^industry_/, '').replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                </span>
              </div>
            )}
          </div>

          {/* ================= RIGHT 85% ================= */}
          <div className="md:w-[85%]">

            {/* HEADING – FULL WIDTH */}
            {heading && (
              <h2
                className={`
                  font-heading font-semibold
                   text-[28px]
                      md:text-[34px]
                      lg:text-[40px]
                  leading-[36px]
                  sm:leading-[40px]
                  md:leading-[44px]
                  lg:leading-[48px]
                  [&_em]:text-[#2655C4]
                  [&_em]:font-bold
                  mb-8 md:mb-[40px]
                  max-w-[780px]
                  ${headingColor}
                `}
                dangerouslySetInnerHTML={{ __html: heading }}
              />
            )}

            {/* MAIN 50 / 50 BLOCK */}
            <div
              className={`flex flex-col md:flex-row gap-8 md:gap-[32px] items-start ${
                isMediaRight ? "md:flex-row-reverse" : ""
              }`}
            >

              {/* STATIC MAIN CONTENT – 50% */}
              <div className="w-full md:w-1/2">


                {/* Read More/Read Less logic for main_content */}
                {main_content && (
                  <ReadMoreContent html={main_content} textColor={textColor} />
                )}

                {/* BUTTON – LEFT / BELOW STATIC */}
                {showButton && button_position !== "right" && (
                  <Link href={wpToPath(button_link) || "#"} className="btn-primary">
                    {button_text}
                  </Link>
                )}
              </div>

              {/* MEDIA / DYNAMIC CONTENT – 50% */}
              <div className="w-full md:w-1/2">

             {/* IMAGE */}
                {layout_type === "image" && imageUrl && (
                  <div
                    className="w-full h-[280px] rounded-[3px] bg-cover bg-center mb-6"
                    style={{ backgroundImage: `url("${imageUrl}")` }}
                  />
                )}

                {/* VIDEO */}
                {layout_type === "video" && video_url && (
                  <div className="aspect-video w-full mb-6 relative rounded-[3px] overflow-hidden">
                    {!videoAccepted ? (
                      /* CONSENT OVERLAY */
                      <div className="absolute inset-0 bg-black flex flex-col items-center justify-center gap-6 z-10">
                        <p className="text-white text-[15px] md:text-[16px] text-center px-4">
                          This video requires marketing consent.
                        </p>
                        <button
                          onClick={() => setVideoAccepted(true)}
                          className="btn-primary cursor-pointer"
                        >
                          Accept &amp; Play
                        </button>
                      </div>
                    ) : (
                      <iframe
                        src={getEmbedUrl(video_url)}
                        title="Video"
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    )}
                  </div>
                )}
                {layout_type !== "image" && content && (
                  <div
                    className={`font-body text-[14px] sm:text-[15px] md:text-[16px] leading-[1.6] md:leading-[1.7] mb-6 [&_em]:text-[#2655C4] [&_a]:text-[#2655C4] [&_a]:underline [&_h2]:font-heading [&_h2]:font-semibold [&_h2]:text-[22px] [&_h2]:md:text-[26px] [&_h2]:leading-snug [&_h2]:mb-3 [&_h3]:font-heading [&_h3]:font-semibold [&_h3]:text-[18px] [&_h3]:md:text-[22px] [&_h3]:leading-snug [&_h3]:mb-3 [&_h4]:font-heading [&_h4]:font-semibold [&_h4]:text-[16px] [&_h4]:md:text-[18px] [&_h4]:mb-2 [&_p]:mb-4 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-4 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-4 [&_li]:mb-1 [&_strong]:font-semibold [&_br]:block ${textColor}`}
                    dangerouslySetInnerHTML={{ __html: content }}
                  />
                )}

                {/* BUTTON – RIGHT / BELOW MEDIA */}
                {showButton && button_position === "right" && (
                  <Link href={wpToPath(button_link) || "#"} className="btn-primary">
                    {button_text}
                  </Link>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
