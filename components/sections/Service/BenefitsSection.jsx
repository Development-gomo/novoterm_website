"use client";
import DotIndicator from "../../ui/DotIndicator";

import Link from "next/link";

const getImageUrl = (img) => {
  if (!img) return null;
  if (typeof img === "string") return img;
  return img.url || null;
};

export default function BenefitsSection({ section, index = 0 }) {
  if (!section) return null;

  const { section_label, heading, description, cta_text, cta_link, benefits = [] } = section;

  const STICKY_START = 120;
  const LABEL_HEIGHT = 32;
  const stickyTop = STICKY_START + index * LABEL_HEIGHT;

  return (
    <section className="w-full bg-[#EAF1FF] px-4 py-6 sm:px-6 md:py-10 lg:py-[96px] lg:px-[80px]">
      <div className="mx-auto">
        <div className="flex flex-col lg:flex-row">

          {/* LEFT – 15% STICKY */}
          <div className="w-full lg:w-[15%] mb-6 lg:mb-0 relative">
            {section_label && (
              <div className="flex items-center gap-3 mt-2" style={{ position: "sticky", top: `${stickyTop}px`, zIndex: 10 + index }}>
                <DotIndicator />
                <span className="uppercase font-montserrat font-medium text-[10px] sm:text-[10px] md:text-[12px] tracking-wider">
                  {section_label}
                </span>
              </div>
            )}
          </div>

          {/* RIGHT – 85% */}
          <div className="w-full lg:w-[85%]">

            {/* HEADER */}
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-[40px] lg:mb-[64px] gap-6">
              <div className="max-w-[720px]">
                {heading && (
                  <h2 className="font-heading text-[24px] sm:text-[28px] md:text-[40px] font-semibold leading-tight md:leading-[1.15] mb-4">
                    {heading}
                  </h2>
                )}
                {description && (
                  <p className="text-[14px] sm:text-[15px] md:text-[16px] leading-[1.6] text-[#000]">
                    {description}
                  </p>
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
                    <div className={`relative z-10 h-full flex flex-col ${isImageCard ? "justify-end p-[24px] pb-[32px] text-white" : "p-[24px] pb-[32px] text-[#061837]"}`}>

                      {iconUrl && (
                        <div className="w-[36px] h-[36px] mb-[102px]">
                          <img src={iconUrl} alt={item.title || "Benefit icon"} className="w-full h-full object-contain" />
                        </div>
                      )}

                      {item.title && (
                        <h3 className="text-[16px] sm:text-[17px] md:text-[18px] leading-[48px] font-semibold mb-2">
                          {item.title}
                        </h3>
                      )}

                      {item.benefit_description && (
                        <p className="text-[14px] sm:text-[15px] md:text-[16px] leading-[24px] ">
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
