import DotIndicator from "../../ui/DotIndicator";

export default function CaseStudyIntroductionSection({
  section,
  sectionId,
  index = 0,
}) {
  if (!section) return null;

  const {
    section_label,
    heading,
    left_title,
    left_content,
    client,
    industry,
    services,
  } = section;

  const STICKY_START = 120;
  const LABEL_HEIGHT = 32;
  const stickyTop = STICKY_START + index * LABEL_HEIGHT;

  return (
    <section
      id="next-section"
      className="w-full bg-[#EAF1FF] py-6 md:py-8 lg:py-[100px]"
    >
      <div className="web-width mx-auto px-6 md:px-0">

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-0">

          {/* LEFT LABEL */}
          <div className="lg:w-[15%] relative">
            {section_label && (
              <div
                className="flex items-center gap-2 text-[#0A1A3A]"
                style={{
                  position: "sticky",
                  top: `${stickyTop}px`,
                  zIndex: 10 + index,
                }}
              >
                <DotIndicator />
                <span className="uppercase font-montserrat text-[#061837] font-medium text-[12px] tracking-wider">
                  {section_label}
                </span>
              </div>
            )}
          </div>

          {/* MAIN CONTENT */}
          <div className="lg:w-[85%]">

            {/* HEADING */}
            {heading && (
              <h2
                className="
                  font-heading font-semibold text-[#061837]
                  text-[28px]
                  sm:text-[34px]
                  md:text-[40px]
                  lg:text-[48px]
                  leading-[36px]
                  sm:leading-[44px]
                  md:leading-[52px]
                  lg:leading-[58px]
                  max-w-[1090px]
                  mb-8 lg:mb-10
                  [&_em]:text-[#2655C4]
                  [&_em]:italic
                  [&_em]:font-semibold
                "
                dangerouslySetInnerHTML={{ __html: heading }}
              />
            )}

            {/* CONTENT + INFO CARD */}
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-[48px] items-start">

              {/* LEFT TEXT */}
              <div className="w-full lg:flex-[682px] max-w-full">

                {left_title && (
                  <h3 className="text-[24px] leading-[48px] font-semibold text-[#061837]">
                    {left_title}
                  </h3>
                )}

                {left_content && (
                  <div
                    className="text-[15px] md:text-[16px] leading-[1.5] text-[#000000] space-y-4"
                    dangerouslySetInnerHTML={{ __html: left_content }}
                  />
                )}
              </div>

              {/* RIGHT INFO CARD */}
              <div className="w-full lg:flex-[360px] bg-[#061837] text-white rounded-[3px] p-[24px] lg:p-[48px]
">

                {client && (
                  <div className="mb-8">
                    <p className="text-[14px] uppercase !font-montserrat font-medium tracking-[0.84px] text-[#5C83DD] mb-[8px]">
                      Client
                    </p>
                    <p className="text-[16px] leading-[24px] !font-normal ">{client}</p>
                  </div>
                )}

                {industry && (
                 <div className="mb-8">
                    <p className="text-[14px] uppercase font-normal tracking-[0.84px] text-[#5C83DD] mb-[8px]">
                      Industry
                    </p>
                    <p className="text-[16px] leading-[24px] font-medium">{industry}</p>
                  </div>
                )}

                {services && (
                  <div>
                    <p className="text-[14px] uppercase font-normal tracking-[0.84px] text-[#5C83DD] mb-[8px]">
                      Services
                    </p>
                    <p className="text-[16px] leading-[24px] font-medium">{services}</p>
                  </div>
                )}

              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
