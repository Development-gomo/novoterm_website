"use client";

import DotIndicator from "../../ui/DotIndicator";

export default function HistorySection({ section, sectionId, index = 0 }) {
  if (!section) return null;

  const { section_label, heading, description, stats = [] } = section;

  const STICKY_START = 120;
  const LABEL_HEIGHT = 32;
  const stickyTop = STICKY_START + index * LABEL_HEIGHT;

  return (
    <section
      id={sectionId}
      className="bg-[#061837] pt-[56px] pr-[24px] pb-[56px] pl-[24px] sm:pt-[72px] sm:pr-[40px] sm:pb-[72px] sm:pl-[40px] lg:pt-[90px] lg:pr-[80px] lg:pb-[90px] lg:pl-[80px]"
    >
      <div className="mx-auto">

        {/* OUTER GRID → 15% / 85% */}
        <div className="grid grid-cols-1 md:grid-cols-[15%_85%] gap-8 md:gap-0">

          {/* LEFT – STICKY LABEL */}
          <div className="relative">
            {section_label && (
              <div
                className="flex items-center gap-2"
                style={{ position: "sticky", top: `${stickyTop}px`, zIndex: 10 + index }}
              >
                <DotIndicator />
                <span className="uppercase text-[10px] sm:text-[12px] tracking-widest text-white">
                  {section_label}
                </span>
              </div>
            )}
          </div>

          {/* RIGHT – CONTENT */}
          <div className="grid grid-cols-1 gap-[48px]">

            {/* HEADING – FULL WIDTH */}
            {heading && (
              <h2 className="text-white font-heading text-[24px] sm:text-[28px] md:text-[40px] font-semibold leading-tight md:leading-[48px] max-w-[654px]">
                {heading}
              </h2>
            )}

            {/* INNER GRID → DESCRIPTION | STATS */}
            <div className="grid grid-cols-1 lg:grid-cols-[538px_1fr] gap-[80px] items-start">

              {/* DESCRIPTION */}
              {description && (
                <div
                  className="text-white text-[16px] leading-relaxed
                    [&_h3]:text-[24px]
                    [&_h3]:font-semibold
                    [&_h3]:leading-[48px]
                    [&_p]:mb-[24px]"
                  dangerouslySetInnerHTML={{ __html: description }}
                />
              )}

              {/* STATS */}
              <div className="grid grid-cols-1 gap-8">

                {stats.map((item, i) => (
                  <div key={i}>

                    {item.number_title && (
                      <div
                        className="historyem font-heading text-[30px] sm:text-[48px] md:text-[52px] font-normal text-[#5C83DD] [&_em]:italic [&_em]:text-[32px] ![&_em]:font-merriweather"
                        dangerouslySetInnerHTML={{ __html: item.number_title }}
                      />
                    )}

                    {item.description && (
                      <p className="uppercase text-[14px] tracking-[0.84px] font-heading text-white mt-2 max-w-[531px]">
                        {item.description}
                      </p>
                    )}

                  </div>
                ))}

              </div>

            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
