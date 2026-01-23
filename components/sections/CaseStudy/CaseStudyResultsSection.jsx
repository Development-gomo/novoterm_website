import DotIndicator from "../../ui/DotIndicator";

export default function CaseStudyResultsSection({ section, sectionId, index = 0 }) {
  if (!section) return null;

  const { section_label, heading, description, results_points = [], highlight } = section;

  const STICKY_START = 120;
  const LABEL_HEIGHT = 32;
  const stickyTop = STICKY_START + index * LABEL_HEIGHT;

  return (
    <section
      id={sectionId}
      className="w-full bg-[#061837] px-4 py-6 sm:px-6 md:py-8 lg:py-[100px] lg:px-[80px]"
    >
      <div className="mx-auto max-w-[1440px]">

        <div className="flex flex-col md:flex-row gap-6 md:gap-0">

          {/* LEFT – 15% (STICKY LABEL) */}
          <div className="md:w-[15%] relative">
            {section_label && (
              <div
                className="flex items-center gap-2 mt-2 mb-4 md:mb-0"
                style={{ position: "sticky", top: `${stickyTop}px`, zIndex: 10 + index }}
              >
                <DotIndicator />
                <span className="uppercase font-montserrat font-medium text-[10px] sm:text-[12px] tracking-widest text-white">
                  {section_label}
                </span>
              </div>
            )}
          </div>

          {/* RIGHT – 85% */}
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-[48px] items-start md:w-[85%]">

            {/* LEFT CONTENT */}
            <div className="w-full lg:flex-[566px] max-w-full">

              {heading && (
                <h2 className="font-heading text-[24px] sm:text-[28px] md:text-[40px] font-semibold leading-tight md:leading-[1.15] font-semibold text-white mb-[24px]">
                  {heading}
                </h2>
              )}

              {description && (
                <div
                  className="max-w-[533px] text-[16px] leading-[24px] text-white mb-[40px]"
                  dangerouslySetInnerHTML={{ __html: description }}
                />
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-[32px] sm:gap-[48px] max-w-full sm:max-w-[560px]">
                {results_points.map((item, i) => (
                  <div key={i}>
                    <h4 className="text-[20px] sm:text-[24px] leading-[1.3] sm:leading-[32px] font-semibold text-[#5C83DD] mb-2">
                      {item.title}
                    </h4>
                    <p className="text-[16px] leading-[24px] text-white">
                      {item.content}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT CARD */}
            {highlight && (
              <div className="w-full max-w-full sm:max-w-[360px] bg-[#2655C4] rounded-[8px] p-[24px] sm:p-[32px] text-white">

                {highlight.icon && (
                  <div className="w-[48px] h-[48px] flex items-center justify-center rounded-full border border-white mb-[32px]">
                    <img src={highlight.icon?.url || highlight.icon} alt="" className="w-[24px] h-[24px]" />
                  </div>
                )}

                {highlight.metric && (
                  <div className="text-[32px] sm:text-[40px] font-semibold mb-1">
                    {highlight.metric}
                  </div>
                )}

                {highlight.metric_label && (
                  <div className="uppercase text-[14px] tracking-[0.84px] mb-[24px]">
                    {highlight.metric_label}
                  </div>
                )}

                <div className="w-full h-px bg-[#FFFFFF4D] my-[24px]" />

                {highlight.title && (
                  <h4 className="text-[20px] sm:text-[24px] leading-[1.3] sm:leading-[32px] font-semibold mb-2">
                    {highlight.title}
                  </h4>
                )}

                {highlight.content && (
                  <p className="text-[16px] leading-[24px]">
                    {highlight.content}
                  </p>
                )}
              </div>
            )}

          </div>
        </div>

      </div>
    </section>
  );
}
