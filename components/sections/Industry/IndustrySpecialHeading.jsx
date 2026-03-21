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
    section_width = "container",
    section_padding = "default",
  } = section;

  const showButton = !!enable_button && button_text && button_link;

  // Theme-based classes
  const isDark = section_theme === "dark";
  const sectionBg = isDark ? "bg-[#061837]" : "bg-[#E3EDFF]";
  const headingColor = isDark ? "text-white" : "text-[#061837]";
  const textColor = isDark ? "text-white/90" : "text-[#000000]";
  const labelColor = isDark ? "text-white/70" : "text-[#061837]";

  // Section padding
  const paddingClass =
    section_padding === "no-top"    ? "pt-0 pb-[40px] md:pb-10 lg:pb-[100px]" :
    section_padding === "no-bottom" ? "pt-[40px] md:pt-10 lg:pt-[100px] pb-0" :
    section_padding === "no-both"   ? "py-0" :
    section_padding === "Add-bottom" ? "lg:pt-[100px] lg:pb-[100px]" :
    "pt-[60px] md:pt-20 lg:pt-[100px]"; // default — keep original top-only

  // Section width
  const isFullWidth = section_width === "full";

  return (
    <section id={sectionId} className={`w-full ${sectionBg} ${paddingClass}`}>
      <div className="web-width mx-auto px-6 md:px-0">

        <div className="flex flex-col md:flex-row">

          {/* ===== LEFT 15% spacer ===== */}
          <div className="md:w-[15%] relative mb-6 md:mb-0">
            {section_label && (
              <div className="flex items-center gap-2 mb-4 lg:hidden">
                <span className="w-2 h-2 rounded-full bg-[#2655C4]" />
                <span className={`uppercase font-montserrat font-medium text-[10px] tracking-wider ${isDark ? 'text-white' : 'text-[#061837]'}`}>
                  {section_label}
                </span>
              </div>
            )}
          </div>

          {/* ===== RIGHT 85% content ===== */}
          <div className="md:w-[85%]">

          

            {/* Heading */}
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
                  ${isFullWidth ? '' : 'max-w-[780px]'}
                  ${headingColor}
                `}
                dangerouslySetInnerHTML={{ __html: heading }}
              />
            )}

            {/* Main Content */}
            {main_content && (
              <div
                className={`font-body text-[14px] sm:text-[15px] md:text-[16px] leading-[1.6] md:leading-[1.7] mb-8 [&_a]:text-[#2655c4] [&_a]:underline
                          [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:my-2 [&_ul]:marker:text-[#2655c4]
                          [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:my-2 [&_ol]:marker:text-[#2655c4]
                          [&_li]:mb-1 [&_p]:mb-2
                          [&_br]:block [&_br]:content-[''] [&_br]:mb-2
                          [&_strong]:font-semibold [&_em]:italic [&_h3]:text-[22px] [&_h3]:font-semibold  ${isFullWidth ? '' : 'max-w-[780px]'} [&_em]:text-[#2655C4] [&_a]:text-[#2655C4] [&_a]:underline ${textColor}`}
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
