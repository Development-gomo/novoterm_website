import DotIndicator from "../../ui/DotIndicator";

export default function CaseStudyResultsSection({ section }) {
  if (!section) return null;

  const { section_label, heading, description, results_points = [], highlight } = section;

  return (
    <section className="w-full bg-[#061837] py-[100px] px-[80px]">
      <div className="mx-auto">
        <div className="flex gap-0">

          {/* LEFT – 15% */}
          <div className="w-[15%]">
            {section_label && (
              <div className="flex items-center gap-2 mt-2">
                <DotIndicator />
                <span className="uppercase font-montserrat font-medium text-[12px] tracking-widest text-white">{section_label}</span>
              </div>
            )}
          </div>

          {/* RIGHT – 85% */}
          <div className="w-[85%] grid grid-cols-[1fr_360px] gap-[153px] items-start">

            {/* LEFT CONTENT */}
            <div>
              {heading && (
                <h2 className="  font-heading font-semibold text-white text-[44px] leading-[1.25] mb-[24px]">
                  {heading}
                </h2>
              )}

              {description && (
                <div className="max-w-[533px] text-[16px] font-normal leading-[1.7] text-white mb-[40px]" dangerouslySetInnerHTML={{ __html: description }} />
              )}

              <div className="grid grid-cols-2 gap-[48px] w-[560px]">
                {results_points.map((item, index) => (
                  <div key={index}>
                    <h4 className="text-[24px] leading-[32px] font-semibold text-[#5C83DD] mb-2">{item.title}</h4>
                    <p className="text-[16px] leading-[24px] text-white">{item.content}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT CARD */}
            {highlight && (
              <div className="bg-[#2655C4] rounded-[8px] p-[32px] text-white">

                {highlight.icon && (
                  <div className="w-[48px] h-[48px] flex items-center justify-center rounded-full border border-white mb-[32px]">
                    <img src={highlight.icon?.url || highlight.icon} alt="" className="w-[24px] h-[24px]" />
                  </div>
                )}

                {highlight.metric && (
                  <div className="text-[40px] font-semibold mb-1">{highlight.metric}</div>
                )}

                {highlight.metric_label && (
                  <div className="uppercase text-[14px] tracking-widest mb-[24px]">{highlight.metric_label}</div>
                )}

                {/* DIVIDER */}
                <div className="w-full h-px bg-[#FFFFFF4D] my-[24px]" />

                {highlight.title && (
                  <h4 className="text-[24px] leading-[32px] font-semibold mb-2">{highlight.title}</h4>
                )}

                {highlight.content && (
                  <p className="text-[16px] leading-[24px] leading-[1.6]">{highlight.content}</p>
                )}

              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
