import DotIndicator from "../../ui/DotIndicator";

export default function CaseStudySolutionSection({ section }) {
  if (!section) return null;

  const { section_label, heading, description, solution_cards = [] } = section;

  return (
    <section className="w-full bg-[#E3EDFF] py-[100px] px-[80px]">
      <div className="mx-auto">
        <div className="flex gap-0">

          {/* LEFT – 15% */}
          <div className="w-[15%]">
            {section_label && (
              <div className="flex items-center gap-2 mt-2">
                <DotIndicator />
                <span className="uppercase font-montserrat font-medium text-[12px] tracking-widest text-[#0A1A3A]">
                  {section_label}
                </span>
              </div>
            )}
          </div>

          {/* RIGHT – 85% */}
          <div className="w-[85%]">

            {/* HEADING */}
            {heading && (
              <h2 className="max-w-[760px] font-heading font-semibold text-[#0A1A3A] text-[44px] leading-[1.25] mb-[24px]">
                {heading}
              </h2>
            )}

            {/* DESCRIPTION */}
            {description && (
              <div
                className="max-w-[520px] text-[15px] leading-[1.7] text-[#1A1A1A] mb-[48px]"
                dangerouslySetInnerHTML={{ __html: description }}
              />
            )}

            {/* CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-[24px]">

              {solution_cards.map((item, index) => (
                <div
                  key={index}
                  className="bg-[#D3DEF3] rounded-[3px] p-[24px]"
                >
                  <div className="w-[48px] h-[48px] flex items-center justify-center rounded-full border border-[#061837] mb-[62px]">
                    <img src={item.icon?.url || item.icon} alt="" className="w-[28px] h-[28px]" />
                  </div>
                  <h4 className="text-[18px] font-semibold leading-[48px] text-[#0A1A3A] mb-[12px]">
                    {item.title}
                  </h4>

                  <p className="text-[16px] leading-[24px] text-[#1A1A1A]">
                    {item.content}
                  </p>
                </div>
              ))}

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
