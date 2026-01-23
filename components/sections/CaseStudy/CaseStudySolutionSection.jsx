import DotIndicator from "../../ui/DotIndicator";

export default function CaseStudySolutionSection({
  section,
  sectionId,
  index = 0,
}) {
  if (!section) return null;

  const { section_label, heading, description, solution_cards = [] } = section;

  const STICKY_START = 120;
  const LABEL_HEIGHT = 32;
  const stickyTop = STICKY_START + index * LABEL_HEIGHT;

  return (
    <section
      id={sectionId}
      className="w-full bg-[#E3EDFF] px-4 py-6 sm:px-6 md:py-8 lg:py-[100px] lg:px-[80px]"
    >
      <div className="mx-auto">

        <div className="flex flex-col md:flex-row gap-6 md:gap-0">

          {/* LEFT – 15% (STICKY LABEL) */}
          <div className="md:w-[15%] relative">
            {section_label && (
              <div
                className="flex items-center gap-2 mt-2 mb-4 md:mb-0"
                style={{
                  position: "sticky",
                  top: `${stickyTop}px`,
                  zIndex: 10 + index,
                }}
              >
                <DotIndicator />
                <span className="uppercase font-montserrat font-medium text-[10px] sm:text-[12px] tracking-widest text-[#0A1A3A]">
                  {section_label}
                </span>
              </div>
            )}
          </div>

          {/* RIGHT – 85% */}
          <div className="md:w-[85%]">

            {/* HEADING */}
            {heading && (
              <h2
                className="max-w-[760px] font-heading text-[24px] sm:text-[28px] md:text-[40px] font-semibold leading-tight md:leading-[1.15] font-semibold
                  mb-[16px] sm:mb-[24px]"
              >
                {heading}
              </h2>
            )}

            {/* DESCRIPTION */}
            {description && (
              <div
                className="max-w-[520px]
                  text-[14px] sm:text-[16px]
                  leading-[1.6] sm:leading-[1.7]
                  text-[#1A1A1A]
                  mb-[32px] sm:mb-[48px]"
                dangerouslySetInnerHTML={{ __html: description }}
              />
            )}

            {/* CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[14px] sm:gap-[16px]">

              {solution_cards.map((item, i) => (
                <div
                  key={i}
                  className="bg-[#D3DEF3] rounded-[3px] p-[20px] sm:p-[24px]"
                >
                  <div className="w-[40px] h-[40px] sm:w-[48px] sm:h-[48px]
                    flex items-center justify-center rounded-full border border-[#061837]
                    mb-[40px] sm:mb-[62px]"
                  >
                    <img
                      src={item.icon?.url || item.icon}
                      alt=""
                      className="w-[24px] h-[24px] sm:w-[28px] sm:h-[28px]"
                    />
                  </div>

                  <h4 className="text-[16px] sm:text-[17px] font-semibold leading-[1.3] sm:leading-[48px] text-[#061837] mb-[12px]">
                    {item.title}
                  </h4>

                  <p className="text-[14px] sm:text-[16px] leading-[1.6] sm:leading-[24px] text-[#000]">
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
