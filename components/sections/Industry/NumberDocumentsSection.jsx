
import { useState } from "react";

export default function NumberDocumentsSection({ section, sectionId }) {
  if (!section) return null;

  const {
    section_label,
    heading,
    select_theme = "light",
    document_lists = [],
    padding_top = "0px",
    display_button = false,
    read_more_button,
    read_less_button,
  } = section;

  const [showAll, setShowAll] = useState(false);

  // Theme-based classes
  const isDark = select_theme === "dark";
  const sectionBg    = isDark ? "bg-[#061837]"  : "bg-[#E3EDFF]";
  const headingColor = isDark ? "text-white"     : "text-[#061837]";
  const labelColor   = isDark ? "text-white/70"  : "text-[#061837]";
  const dividerColor = isDark ? "border-white/20" : "border-[#061837]/20";
  const numberBg     = isDark ? "bg-[#2655C4]"   : "bg-[#2655C4]";
  const itemText     = isDark ? "text-white"      : "text-[#061837]";

  // If display_button is enabled, cap visible items at 9 until expanded
  const hasMore = display_button && document_lists.length > 20;
  const visibleItems = hasMore && !showAll
    ? document_lists.slice(0, 9)
    : document_lists;

  // No column pre-splitting needed — CSS grid handles horizontal flow

  return (
    <section
      id={sectionId}
      className={`w-full ${sectionBg} pb-[60px] md:pb-10 lg:pb-[100px]`}
      style={{ paddingTop: padding_top || "0px" }}
    >
      <div className="web-width mx-auto px-6 md:px-0">
        <div className="flex flex-col md:flex-row">

          {/* LEFT 15% spacer */}
          <div className="md:w-[15%] relative mb-6 md:mb-0">
            {section.section_label && (
              <div className="flex items-center gap-2 mb-4 lg:hidden">
                <span className="w-2 h-2 rounded-full bg-[#2655C4]" />
                <span className={`uppercase font-montserrat font-medium text-[10px] tracking-wider ${isDark ? 'text-white' : 'text-[#061837]'}`}>
                  {section.section_label}
                </span>
              </div>
            )}
          </div>

          {/* RIGHT 85% */}
          <div className="md:w-[85%]">

            
            {/* HEADING */}
            {heading && (
              <h2
                className={`
                  font-heading font-semibold
                  text-[16px]
                  md:text-[17px]
                  lg:text-[18px]
                  leading-[24px]
                  sm:leading-[24px]
                  md:leading-[24px]
                  lg:leading-[24px]
                  [&_em]:text-[#2655C4]
                  [&_em]:font-bold
                  mb-4 md:mb-[32px]
                  max-w-[780px]
                  ${headingColor}
                `}
                dangerouslySetInnerHTML={{ __html: heading }}
              />
            )}

            {/* HORIZONTAL LIST — items flow left-to-right across 3 columns */}
            {visibleItems.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 lg:gap-x-16">
                {visibleItems.map((item, i) => (
                  <div key={i} className={`flex items-center gap-4 py-[14px] md:py-[18px] border-t ${dividerColor}`}>
                    <div className={`w-[28px] h-[28px] shrink-0 rounded-full ${numberBg} flex items-center justify-center text-white text-[11px] font-semibold`}>
                      {i + 1}
                    </div>
                    <span className={`text-[14px] font-cabin  sm:text-[15px] md:text-[16px] font-medium leading-snug ${itemText}`}>
                      {item.document_name}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* VIEW ALL / READ LESS BUTTON */}
            {hasMore && (
              <div className="mt-[40px] flex justify-center">
                <button
                  onClick={() => setShowAll((prev) => !prev)}
                  className="btn-primary inline-flex items-center gap-2"
                >
                  {showAll ? read_less_button : read_more_button}
                </button>
              </div>
            )}

          </div>
        </div>
      </div>
    </section>
  );
}