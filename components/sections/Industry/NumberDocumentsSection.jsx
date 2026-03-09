"use client";

export default function NumberDocumentsSection({ section, sectionId }) {
  if (!section) return null;

  const {
    section_label,
    heading,
    select_theme = "light",
    document_lists = [],
  } = section;

  // Theme-based classes
  const isDark = select_theme === "dark";
  const sectionBg    = isDark ? "bg-[#061837]"  : "bg-[#E3EDFF]";
  const headingColor = isDark ? "text-white"     : "text-[#061837]";
  const labelColor   = isDark ? "text-white/70"  : "text-[#061837]";
  const dividerColor = isDark ? "border-white/20" : "border-[#061837]/20";
  const numberBg     = isDark ? "bg-[#2655C4]"   : "bg-[#2655C4]";
  const itemText     = isDark ? "text-white"      : "text-[#061837]";

  // Split into 3 columns
  // If total > 10 → 4 items per column (up to 12), else → 3 items per column
  const total = document_lists.length;
  const perCol = total > 9 ? 4 : 3;

  const col1 = document_lists.slice(0, perCol);
  const col2 = document_lists.slice(perCol, perCol * 2);
  const col3 = document_lists.slice(perCol * 2, perCol * 3);
  const columns = [col1, col2, col3].filter((c) => c.length > 0);

  // Global running index so numbers are continuous across columns
  let counter = 0;

  return (
    <section id={sectionId} className={`w-full ${sectionBg} pb-[40px] md:pb-10 lg:pb-[100px]`}>
      <div className="web-width mx-auto px-6 md:px-0">
        <div className="flex flex-col md:flex-row">

          {/* LEFT 15% spacer */}
          <div className="md:w-[15%] relative mb-6 md:mb-0" />

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

            {/* 3-COLUMN LIST */}
            {document_lists.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 lg:gap-x-16">
                {columns.map((col, colIdx) => (
                  <div key={colIdx} className="flex flex-col">
                    <hr className={`border-t ${dividerColor}`} />
                    {col.map((item) => {
                      counter += 1;
                      const num = counter;
                      return (
                        <div key={num} className="flex flex-col">
                          <div className="flex items-center gap-4 py-[14px] md:py-[18px]">
                            <div className={`w-[24px] h-[24px] shrink-0 rounded-full ${numberBg} flex items-center justify-center text-white text-[11px] font-semibold`}>
                              {num}
                            </div>
                            <span className={`text-[14px] sm:text-[15px] md:text-[16px] font-medium leading-snug ${itemText}`}>
                              {item.document_name}
                            </span>
                          </div>
                          <hr className={`border-t ${dividerColor}`} />
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            )}

          </div>
        </div>
      </div>
    </section>
  );
}