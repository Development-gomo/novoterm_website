import Link from "next/link";
import { wpToPath } from "../../../lib/api";

export default function IndustrySpecialHeading({ section, sectionId }) {
  if (!section) return null;

  const {
    section_theme = "light",
    section_label,
    heading,
    main_content,
    enable_button,
    button_text,
    button_link,
  } = section;

  const showButton = !!enable_button && button_text && button_link;

  // Theme-based classes
  const isDark = section_theme === "dark";
  const sectionBg = isDark ? "bg-[#061837]" : "bg-[#E3EDFF]";
  const headingColor = isDark ? "text-white" : "text-[#061837]";
  const textColor = isDark ? "text-white/90" : "text-[#000000]";
  const labelColor = isDark ? "text-white/70" : "text-[#061837]";

  return (
    <section id={sectionId} className={`w-full ${sectionBg} pt-[40px] md:pt-10 lg:pt-[100px]`}>
      <div className="web-width mx-auto px-6 md:px-0">

        <div className="flex flex-col md:flex-row">

          {/* ===== LEFT 15% spacer ===== */}
          <div className="md:w-[15%] relative mb-6 md:mb-0" />

          {/* ===== RIGHT 85% content ===== */}
          <div className="md:w-[85%]">

          

            {/* Heading */}
            {heading && (
              <h2
                className={`
                  font-heading font-semibold
                  text-[28px]
                  sm:text-[34px]
                  md:text-[40px]
                  lg:text-[48px]
                  leading-[36px]
                  sm:leading-[44px]
                  md:leading-[52px]
                  lg:leading-[58px]
                  [&_em]:text-[#2655C4]
                  [&_em]:font-bold
                  mb-8 md:mb-[40px]
                  max-w-[780px]
                  ${headingColor}
                `}
                dangerouslySetInnerHTML={{ __html: heading }}
              />
            )}

            {/* Main Content */}
            {main_content && (
              <div
                className={`font-body text-[14px] sm:text-[15px] md:text-[16px] leading-[1.6] md:leading-[1.7] mb-8 max-w-[780px] [&_em]:text-[#2655C4] [&_a]:text-[#2655C4] [&_a]:underline ${textColor}`}
                dangerouslySetInnerHTML={{ __html: main_content }}
              />
            )}

            {/* Button */}
            {showButton && (
              <Link href={wpToPath(button_link) || "#"} className="btn-primary">
                {button_text}
              </Link>
            )}

          </div>
        </div>
      </div>
    </section>
  );
}
