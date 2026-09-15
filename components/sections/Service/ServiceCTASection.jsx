import Link from "next/link";
import { wpToPath } from "../../../lib/api";
import { getSectionBackground, isDarkSectionColor } from "../../../lib/sectionTheme";

export default function ServiceCTASection({ section, sectionId }) {
  if (!section) return null;

  const {
    section_label,
    heading,
    section_description,
    cta_text,
    cta_link,
    section_theme = "#E3EDFF",
  } = section;

  const sectionBackground = getSectionBackground(section_theme);
  const isDark = isDarkSectionColor(section_theme);
  const headingColor = isDark ? "text-white" : "text-[#061837]";
  const textColor = isDark ? "text-white/85" : "text-[#061837]";
  const labelColor = isDark ? "text-white" : "text-[#061837]";

  const formatLabel = (layout) => {
    if (!layout) return null;
    return layout
      .replace(/_section$/, "")
      .replace(/^(services?_|casestudy_|blog_)/, "")
      .replace(/_/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
  };
  const mobileLabel = section_label || formatLabel(section.acf_fc_layout);
  const ctaHref = typeof cta_link === "object" ? cta_link?.url : cta_link;
  const ctaTarget = typeof cta_link === "object" ? cta_link?.target : undefined;

  return (
    <section
      id={sectionId}
      className="w-full py-[60px] sm:py-[80px] lg:py-[100px]"
      style={{ backgroundColor: sectionBackground }}
    >
      <div className="web-width mx-auto px-6 md:px-0">
        <div className="flex flex-col lg:flex-row">
          <div className="w-full lg:w-[15%] lg:mb-0 relative">
            {mobileLabel && (
              <div className="flex items-center gap-2 mb-4 lg:hidden">
                <span className="w-2 h-2 rounded-full bg-[#2655C4]" />
                <span className={`uppercase font-montserrat font-medium text-[10px] tracking-wider ${labelColor}`}>
                  {mobileLabel}
                </span>
              </div>
            )}
          </div>

          <div className="w-full lg:w-[85%]">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="max-w-[550px]">
                {heading && (
                  <h2 className={`font-heading text-[24px] sm:text-[28px] md:text-[40px] font-semibold leading-tight md:leading-[1.15] mb-4 ${headingColor}`}>
                    {heading}
                  </h2>
                )}

                {section_description && (
                  <div
                    className={`text-[14px] sm:text-[15px] md:text-[16px] leading-[24px] ${textColor}`}
                    dangerouslySetInnerHTML={{ __html: section_description }}
                  />
                )}
              </div>

              {cta_text && ctaHref && (
                <Link href={wpToPath(ctaHref) || "#"} target={ctaTarget} className="btn-primary w-fit lg:mt-0">
                  {cta_text}
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
