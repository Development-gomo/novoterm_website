import DotIndicator from "../../ui/DotIndicator";

import Link from "next/link";

export default function TranslationMethodsSection({ section, index = 0 }) {
  if (!section) return null;

  const { section_label, heading, translation_methods = [] } = section;

  const STICKY_START = 120;
  const LABEL_HEIGHT = 32;
  const stickyTop = STICKY_START + index * LABEL_HEIGHT;

  return (
    <section className="w-full bg-[#061837] px-4 py-6 sm:px-6 md:py-10 lg:py-[100px] lg:px-[80px]">
      <div className="mx-auto">
        <div className="flex flex-col lg:flex-row gap-0">

          {/* LEFT – 15% */}
          <div className="w-full lg:w-[15%] relative mb-6 lg:mb-0">
            <div className="flex items-center gap-3 mt-2" style={{ position: "sticky", top: `${stickyTop}px`, zIndex: 10 + index }}>
              <DotIndicator variant="white" />
              {section_label && (
                <span className="uppercase font-montserrat font-medium text-white text-[10px] sm:text-[10px] md:text-[12px] tracking-wider">
                  {section_label}
                </span>
              )}
            </div>
          </div>

          {/* RIGHT – 85% */}
          <div className="w-full lg:w-[85%]">
            {heading && (
              <h2 className="font-heading text-[24px] sm:text-[28px] md:text-[40px] font-semibold leading-tight md:leading-[1.15] text-white mb-[32px] lg:mb-[48px] max-w-[720px]">
                {heading}
              </h2>
            )}

            <div className="flex flex-wrap gap-[24px] lg:gap-[32px]">
              {translation_methods.map((item, i) => {
                const imageUrl =
                  typeof item.image === "string"
                    ? item.image
                    : item.image?.url || item.image?.sizes?.large || "";

                return (
                  <div key={i} className="group w-full sm:w-[48%] lg:w-[353px] h-[420px] rounded-[4px] overflow-hidden bg-black">

                    {/* IMAGE */}
                    <div className="w-full h-full group-hover:h-[239px] transition-all duration-500 ease-out relative overflow-hidden">
                      <div className="absolute inset-0" style={{ backgroundImage: `url("${imageUrl}")`, backgroundSize: "cover", backgroundPosition: "center" }} />

                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent p-[24px] flex flex-col justify-end transition-opacity duration-300 group-hover:opacity-0">
                        {item.card_tag && (
                          <span className="text-[11px] uppercase tracking-widest text-white/80 mb-1">
                            {item.card_tag}
                          </span>
                        )}
                        {item.card_title && (
                          <h3 className="text-white text-[20px] font-semibold">
                            {item.card_title}
                          </h3>
                        )}
                      </div>
                    </div>

                    {/* HOVER CONTENT */}
                    <div className="w-full h-0 group-hover:h-[181px] transition-all duration-500 ease-out bg-[#FEE4CA] px-[24px] py-[20px] flex flex-col">
                      {item.card_tag && (
                        <span className="text-[11px] uppercase tracking-widest text-[#1A1A1A] mb-1">
                          {item.card_tag}
                        </span>
                      )}
                      {item.card_title && (
                        <h3 className="text-[20px] font-semibold text-[#1A1A1A] mb-4">
                          {item.card_title}
                        </h3>
                      )}
                      {item.cta_text && item.cta_link && (
                        <Link href={item.cta_link} className="btn-primary inline-block text-sm sm:text-base w-full text-center mt-auto">
                          {item.cta_text}
                        </Link>
                      )}
                    </div>

                  </div>
                );
              })}
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
