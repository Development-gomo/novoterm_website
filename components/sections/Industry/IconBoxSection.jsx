import Link from "next/link";
import { wpToPath } from "../../../lib/api";

const getImageUrl = (img) => {
  if (!img) return null;
  if (typeof img === "string") return img;
  return img.url || img.sizes?.medium || null;
};

export default function IconBoxSection({ section, sectionId, index = 0 }) {
  if (!section) return null;

  const {
    section_label,
    select_theme = "light",
    heading,
    section_description,
    cta_text,
    cta_link,
    box_details = [],
  } = section;

  // Theme-based classes (mirrors IndustrySpecialHeading)
  const isDark = select_theme === "dark";
  const sectionBg   = isDark ? "bg-[#061837]"   : "bg-white";
  const headingColor = isDark ? "text-white"      : "text-[#061837]";
  const textColor    = isDark ? "text-white/90"   : "text-[#061837]/80";
  const labelColor   = isDark ? "text-white/70"   : "text-[#2655C4]";
  const cardBg       = isDark ? "bg-white/10"     : "bg-[#EAF1FF]";
  const cardTitle    = isDark ? "text-white"      : "text-[#061837]";
  const cardText     = isDark ? "text-white/80"   : "text-[#061837]/75";

  return (
    <section id={sectionId} className={`w-full ${sectionBg} py-[40px] md:py-[60px] lg:py-[100px]`}>
      <div className="web-width mx-auto px-6 md:px-0">
        <div className="flex flex-col lg:flex-row">

          {/* LEFT – 15% spacer */}
          <div className="w-full lg:w-[15%] mb-6 lg:mb-0">
            {(section?.section_label || section?.acf_fc_layout) && (
              <div className="flex items-center gap-2 mb-4 lg:hidden">
                <span className="w-2 h-2 rounded-full bg-[#2655C4]" />
                <span className={`uppercase font-montserrat font-medium text-[10px] tracking-wider ${isDark ? 'text-white' : 'text-[#061837]'}`}>
                  {section.section_label || section.acf_fc_layout?.replace(/_section$/, '').replace(/^industry_/, '').replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                </span>
              </div>
            )}
          </div>

          {/* RIGHT – 85% */}
          <div className="w-full lg:w-[85%]">
 

            {/* HEADER ROW */}
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-[20px] lg:mb-[40px] gap-6">
              <div className="max-w-[780px]">
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

                {section_description && (
                  <div
                    className={`!font-body text-[14px] sm:text-[15px] md:text-[16px] leading-[1.6] md:leading-[1.7] mb-8 max-w-[780px] [&_em]:text-[#2655C4] [&_a]:text-[#2655C4] [&_a]:underline ${textColor}`}
                    dangerouslySetInnerHTML={{ __html: section_description }}
                  />
                )}
              </div>

              {cta_text && cta_link && (
                <Link href={wpToPath(cta_link) || "#"} className="btn-primary w-fit shrink-0">
                  {cta_text}
                </Link>
              )}
            </div>

            {/* ICON BOX GRID */}
            {Array.isArray(box_details) && box_details.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {box_details.map((box, i) => {
                  const iconUrl = getImageUrl(box.icon);

                  return (
                    <div
                      key={`icon-box-${i}`}
                      className={`flex flex-col gap-4 ${cardBg} p-6 lg:p-8 rounded-[3px]`}
                    >
                      {iconUrl && (
                        <div className="w-[48px] h-[48px] shrink-0">
                          <img
                            src={iconUrl}
                            alt={box.title || "icon"}
                            className="w-full h-full object-contain"
                            style={isDark ? { filter: 'brightness(0) saturate(100%) invert(92%) sepia(7%) saturate(388%) hue-rotate(176deg) brightness(104%) contrast(101%)' } : {}}
                          />
                        </div>
                      )}

                      {box.title && (
                        <h3 className={`font-heading font-semibold
                          text-[16px] sm:text-[17px] md:text-[18px] leading-snug ${cardTitle}`}>
                          {box.title}
                        </h3>
                      )}

                      {box.benefit_description && (
                        <div
                          className={`text-[14px] sm:text-[15px] md:text-[16px]
                            leading-[1.65] [&_a]:underline [&_a]:text-[#2655C4] ${cardText}`}
                          dangerouslySetInnerHTML={{ __html: box.benefit_description }}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            )}

          </div>
        </div>
      </div>
    </section>
  );
}