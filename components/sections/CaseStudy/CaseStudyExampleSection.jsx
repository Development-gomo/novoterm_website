const formatLabel = (layout) => {
  if (!layout) return null;
  return layout
    .replace(/_section$/, "")
    .replace(/^(services?_|casestudy_|blog_|industry_)/, "")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
};

export default function CaseStudyExampleSection({ section, sectionId, index = 0 }) {
  if (!section) return null;

  const { section_label, heading, description, solution_cards = [] } = section;

  return (
    <section
      id={sectionId}
      className="w-full bg-white py-6 md:py-8 lg:py-[100px]"
    >
      <div className="web-width mx-auto px-6 md:px-0">
        <div className="flex flex-col md:flex-row gap-6 md:gap-0">

          {/* LEFT – 15% (STICKY LABEL) */}
          <div className="md:w-[15%] relative">
            {(section_label || section?.acf_fc_layout) && (
              <div className="flex items-center gap-2 mt-2 mb-4 lg:hidden">
                <span className="w-2 h-2 rounded-full bg-[#2655C4]" />
                <span className="uppercase font-montserrat font-medium text-[10px] tracking-widest text-[#0A1A3A]">
                  {section_label || formatLabel(section?.acf_fc_layout)}
                </span>
              </div>
            )}
          </div>

          {/* RIGHT – 85% */}
          <div className="md:w-[85%]">

            {/* HEADING */}
            {heading && (
              <h2 className="max-w-[760px] font-heading text-[#061837] text-[24px] sm:text-[28px] md:text-[40px] font-semibold leading-tight md:leading-[1.15] mb-[16px]">
                {heading}
              </h2>
            )}

            {/* DESCRIPTION */}
            {description && (
              <div
                className="max-w-[520px] text-[14px] sm:text-[16px] leading-[1.5] text-black space-y-4 mb-[40px]"
                dangerouslySetInnerHTML={{ __html: description }}
              />
            )}

            {/* EXAMPLE CARDS */}
            <div className="flex flex-col gap-[24px]">
              {solution_cards.map((example, i) => (
                <div
                  key={i}
                  className="border border-[#D3DEF3] rounded-[3px] overflow-hidden"
                >
                  {/* Example title row */}
                  {example.example_title && (
                    <div className="px-[20px] sm:px-[24px] py-[14px] sm:py-[16px] border-b border-[#D3DEF3] bg-white">
                      <h3 className="text-[15px] sm:text-[17px] font-semibold text-[#061837]">
                        {example.example_title}
                      </h3>
                    </div>
                  )}

                  {/* Column cards */}
                  <div className="flex flex-col sm:flex-row">
                    {(example.example_card || []).map((card, j) => {
                      const isLast = j === (example.example_card.length - 1);
                      return (
                        <div
                          key={j}
                          className={[
                            "flex-1 p-[20px] sm:p-[24px]",
                            isLast
                              ? "bg-[#061837] text-white"
                              : "bg-white text-[#061837] border-b sm:border-b-0 sm:border-r border-[#D3DEF3]",
                          ].join(" ")}
                        >
                          {card.card_heading && (
                            <h4
                              className={`text-[13px] sm:text-[14px] font-semibold mb-[10px] sm:mb-[12px] ${
                                isLast ? "text-white" : "text-[#061837]"
                              }`}
                            >
                              {card.card_heading}
                            </h4>
                          )}
                          {card.card_description && (
                            <div
                              className={`text-[13px] sm:text-[14px] leading-[1.7] ${
                                isLast ? "text-white/90" : "text-[#333]"
                              }`}
                              dangerouslySetInnerHTML={{ __html: card.card_description }}
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
