import DotIndicator from "../../ui/DotIndicator";

function html(value = "") {
  return { __html: value || "" };
}

export default function ResultsSection({ section, sectionId }) {
  if (!section) return null;

  const {
    section_label,
    heading,
    section_description,
    results_points,
    highlight,
  } = section;

  const points = Array.isArray(results_points) ? results_points : [];

  return (
    <section id={sectionId} className="w-full bg-[#E3EDFF] py-[56px] md:py-[72px] lg:py-[84px]">
      <div className="web-width mx-auto px-6 md:px-0">
        <div className="grid grid-cols-1 gap-7 lg:grid-cols-[15%_1fr] lg:gap-0">
          <div>
            {section_label && (
              <div className="flex items-center gap-2 lg:hidden">
                <DotIndicator />
                <span className="uppercase font-montserrat font-medium text-[10px] tracking-wider text-[#061837]">
                  {section_label}
                </span>
              </div>
            )}
          </div>

          <div>
            <div>
              {heading && (
                <div
                  className="font-heading text-[28px] sm:text-[32px] md:text-[34px] lg:text-[38px] xl:text-[40px] font-semibold leading-[1.1] text-[#061837] mb-10 max-w-[700px] [&_p]:m-0 [&_h1]:m-0 [&_h2]:m-0 [&_h3]:m-0 [&_p]:text-[inherit] [&_h1]:text-[inherit] [&_h2]:text-[inherit] [&_h3]:text-[inherit] [&_p]:leading-[inherit] [&_h1]:leading-[inherit] [&_h2]:leading-[inherit] [&_h3]:leading-[inherit] [&_p]:font-[inherit] [&_h1]:font-[inherit] [&_h2]:font-[inherit] [&_h3]:font-[inherit]"
                  dangerouslySetInnerHTML={html(heading)}
                />
              )}

              {section_description && (
                <div
                  className="font-cabin text-[14px] md:text-[16px] leading-[24px] text-[#061837] mb-7 max-w-[600px] [&_p]:mb-3 last:[&_p]:mb-0"
                  dangerouslySetInnerHTML={html(section_description)}
                />
              )}
            </div>

            <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
              <div className="space-y-5 md:space-y-6">
                {points.map((point, index) => (
                  <div key={`${point?.title || "result"}-${index}`}>
                    {point?.title && (
                      <h3 className="font-heading text-[20px] md:text-[24px] font-semibold leading-[40px] text-[#061837]">
                        {point.title}
                      </h3>
                    )}
                    {point?.content && (
                      <div
                        className="font-cabin text-[14px] md:text-[16px] leading-[24px] text-[#061837] [&_p]:mb-3 last:[&_p]:mb-0"
                        dangerouslySetInnerHTML={html(point.content)}
                      />
                    )}
                  </div>
                ))}
              </div>

              {(highlight?.label || highlight?.title || highlight?.content) && (
                <div className="w-full lg:w-[360px] bg-[#061837] text-white p-10 rounded-[3px] self-start">
                  {highlight?.label && (
                    <div
                      className="font-merriweather text-[38px] italic font-semibold leading-[48px] text-white [&_p]:m-0 [&_h1]:m-0 [&_h2]:m-0 [&_h3]:m-0 [&_p]:text-[inherit] [&_h1]:text-[inherit] [&_h2]:text-[inherit] [&_h3]:text-[inherit] [&_p]:leading-[inherit] [&_h1]:leading-[inherit] [&_h2]:leading-[inherit] [&_h3]:leading-[inherit] [&_p]:font-[inherit] [&_h1]:font-[inherit] [&_h2]:font-[inherit] [&_h3]:font-[inherit] [&_p]:italic [&_h1]:italic [&_h2]:italic [&_h3]:italic"
                      dangerouslySetInnerHTML={html(highlight.label)}
                    />
                  )}

                  {highlight?.label && (highlight?.title || highlight?.content) && (
                    <hr className="my-4 border-0 border-t border-[#FFFFFF4D]" />
                  )}

                  {highlight?.title && (
                    <h3 className="font-heading text-[24px] font-semibold leading-[32px] text-white mb-3">
                      {highlight.title}
                    </h3>
                  )}

                  {highlight?.content && (
                    <div
                      className="font-cabin text-[16px] leading-[24px] text-white [&_p]:mb-3 last:[&_p]:mb-0"
                      dangerouslySetInnerHTML={html(highlight.content)}
                    />
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
