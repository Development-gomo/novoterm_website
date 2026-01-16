import DotIndicator from "../../ui/DotIndicator";


export default function CaseStudyIntroductionSection({ section }) {
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

  return (
    <section className="w-full bg-[#EAF1FF] p-[80px]">
      <div className="mx-auto">

        <div className="flex gap-0">

          {/* LEFT – 15% */}
         <div className="w-[15%]">
                {section_label && (
                    <div className="flex items-center gap-2 mt-2">
                    <DotIndicator/>

                    <span className="uppercase font-montserrat font-medium text-[10px] sm:text-[10px] md:text-[12px] tracking-wider">
                        {section_label}
                    </span>
                    </div>
                )}
                </div>

          {/* RIGHT – 85% */}
          <div className="w-[85%]">

            {/* HEADING – FULL WIDTH */}
            {heading && (
              <h2
                className="case-study-intro-heading 
                  max-w-[1090px]
                  font-heading font-semibold text-[#0A1A3A]
                  text-[48px] leading-[1.25]
                  mb-[64px]  [&_em]:text-[#2655C4] [&_em]:font-bold"
                dangerouslySetInnerHTML={{ __html: heading }}
              />
            )}
 

            {/* INNER GRID – 70% / 30% */}
            <div className="grid grid-cols-[682px_418px] gap-[48px]">

              {/* LEFT CONTENT */}
              <div>
                {left_title && (
                  <h3 className="text-[18px] font-semibold text-[#0A1A3A] mb-[16px]">
                    {left_title}
                  </h3>
                )}

                {left_content && (
                  <div
                    className="text-[16px] leading-[1.7] text-[#1A1A1A]"
                    dangerouslySetInnerHTML={{ __html: left_content }}
                  />
                )}
              </div>

              {/* RIGHT INFO CARD */}
              <div className="bg-[#061837] text-white rounded-[6px] p-[32px] space-y-[24px]">

                {client && (
                  <div>
                    <p className="text-[12px] uppercase tracking-widest text-white/60 mb-1">
                      Client
                    </p>
                    <p className="text-[15px] font-medium">{client}</p>
                  </div>
                )}

                {industry && (
                  <div>
                    <p className="text-[12px] uppercase tracking-widest text-white/60 mb-1">
                      Industry
                    </p>
                    <p className="text-[15px] font-medium">{industry}</p>
                  </div>
                )}

                {services && (
                  <div>
                    <p className="text-[12px] uppercase tracking-widest text-white/60 mb-1">
                      Services
                    </p>
                    <p className="text-[15px] font-medium">{services}</p>
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
