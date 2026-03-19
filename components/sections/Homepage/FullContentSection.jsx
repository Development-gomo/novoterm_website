import Link from "next/link";

export default function FullContentSection({ section, sectionId }) {
  if (!section) return null;

  const {
    section_theme = "dark",
    section_label,
    heading,
    full_paragraph,
    full_width_video,
    cta_text,
    cta_url,
    video_height = "400px",
  } = section;

  // Theme-based classes
  const isDark = section_theme === "dark";
  const sectionBg = isDark ? "bg-[#061837]" : "bg-[#E3EDFF]";
  const headingColor = isDark ? "text-white" : "text-[#061837]";
  const labelColor = isDark ? "text-white/70" : "text-[#061837]";
  const paragraphColor = isDark ? "text-white/85" : "text-[#061837]/85";

  return (
    <section id={sectionId} className={`w-full ${sectionBg} py-10 md:py-16 lg:py-24`}>
      <div className="web-width mx-auto px-6 md:px-0">

       <div className="flex flex-col lg:flex-row">

          {/* LEFT – 15% */}
          <div className="w-full lg:w-[15%] mb-6 lg:mb-0 relative">
              {/* Section Label */}
        {section_label && (
          <div className="flex items-center gap-2 mb-4 lg:hidden">
            <span className="w-2 h-2 rounded-full bg-[#2655C4]" />
            <span className={`uppercase font-montserrat font-medium text-[10px] tracking-wider ${labelColor}`}>
              {section_label}
            </span>
          </div>
        )}
        </div>

          {/* RIGHT – 85% */}
          <div className="w-full lg:w-[85%]">
    

        {/* Heading */}
        {heading && (
          <h2 className={`font-heading font-semibold text-[28px] md:text-[34px] lg:text-[40px] leading-tight mb-8 ${headingColor}`}>
            {heading}
          </h2>
        )}

        {/* Full Paragraph */}
        {full_paragraph && (
          <div className={`text-[16px] md:text-[18px] leading-[1.7] mb-8 ${paragraphColor}`} dangerouslySetInnerHTML={{ __html: full_paragraph || "" }} />
        )}

        {/* Full Width Video */}
        {full_width_video && (
          <div className="w-full mb-8">
            {/^https?:\/\/(www\.)?youtube\.com|youtu\.be/.test(full_width_video) ? (
              <iframe
                src={
                  full_width_video.includes("youtube.com")
                    ? full_width_video.replace("watch?v=", "embed/")
                    : full_width_video.replace("youtu.be/", "youtube.com/embed/")
                }
                className="w-full rounded-lg"
                height="600"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                frameBorder="0"
                title="YouTube Video"
              />
            ) : (
              <video src={full_width_video} controls className="w-full rounded-lg" style={{ height: video_height }} />
            )}
          </div>
        )}

        {/* CTA Button */}
        {cta_text && cta_url && (
          <Link href={cta_url} className="btn-primary">
            {cta_text}
          </Link>
        )}
      </div>
       </div>
        </div>
    </section>
  );
}
