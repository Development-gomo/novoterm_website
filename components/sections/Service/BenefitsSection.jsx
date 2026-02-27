"use client";
import Link from "next/link";

const getImageUrl = (img) => {
  if (!img) return null;
  if (typeof img === "string") return img;
  return img.url || null;
};

export default function BenefitsSection({ section, sectionId, index = 0 }) {
  if (!section) return null;

  const { heading, section_description, cta_text, cta_link, benefits = [] } = section;

  return (
    <section id={sectionId} className="w-full bg-[#EAF1FF] py-6 md:py-10 lg:py-[100px]">
      <div className="web-width mx-auto px-6 md:px-0">
        <div className="flex flex-col lg:flex-row">

          {/* LEFT – 15% */}
          <div className="w-full lg:w-[15%] mb-6 lg:mb-0 relative">
          </div>

          {/* RIGHT – 85% */}
          <div className="w-full lg:w-[85%]">

            {/* HEADER */}
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-[40px] lg:mb-[64px] gap-6">
              <div className="max-w-[550px]">
                {heading && (
                  <h2 className="font-heading text-[24px] sm:text-[28px] md:text-[40px] font-semibold text-[#061837] leading-tight md:leading-[1.15] mb-4">
                    {heading}
                  </h2>
                )}
                 {section_description && (
  <div 
    className="text-[14px] sm:text-[15px] md:text-[16px] lg:text-[18px]
               leading-[24px] text-[#061837]"
    dangerouslySetInnerHTML={{ __html: section_description }}
  />
)}

              </div>

              {cta_text && cta_link && (
                <Link href={cta_link} className="btn-primary lg:mt-[6px] w-fit">
                  {cta_text}
                </Link>
              )}
            </div>

            {/* BENEFITS GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">

              {benefits.map((item, i) => {
                const iconUrl = getImageUrl(item.icon);
                const bgUrl = getImageUrl(item.background_image);
                const isImageCard = !!bgUrl;

                return (
                  <div key={`benefit-${i}`} className="relative justify-end h-[320px] overflow-hidden bg-[#CCD8EE]">

                    {/* IMAGE BACKGROUND */}
                    {isImageCard && (
                    <div
  className="absolute inset-0"
  style={{
    background: `linear-gradient(180deg, rgba(0, 0, 0, 0.00) -14.94%, #000 100%), url(${bgUrl}) lightgray -20.739px 0px / 126.954% 100% no-repeat`,
  }}
/>

                    )}

                    {/* CONTENT */}
                    <div className={`relative z-10 h-full flex flex-col ${isImageCard ? "justify-end p-[24px] pb-[26px] text-white" : "p-[24px] pb-[32px] text-[#061837]"}`}>

                      {iconUrl && (
                        <div className="w-[48px] h-[48px] mb-[102px]">
                          <img src={iconUrl} alt={item.title || "Benefit icon"} className="w-full h-full object-contain" />
                        </div>
                      )}

                      {item.title && (
                        <h3 className="text-[16px] sm:text-[17px] md:text-[18px] leading-[48px] font-semibold">
                          {item.title}
                        </h3>
                      )}

                      {item.benefit_description && (
                        <p className={`text-[14px] sm:text-[15px] md:text-[16px] leading-[24px] ${isImageCard ? 'text-white' : 'text-black'}`}>
                          {item.benefit_description}
                        </p>
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
