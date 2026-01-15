"use client";

import Link from "next/link";

const getImageUrl = (img) => {
  if (!img) return null;
  if (typeof img === "string") return img;
  return img.url || null;
};

export default function BenefitsSection({ section }) {
  if (!section) return null;

  const {
    section_label,
    heading,
    description,
    cta_text,
    cta_link,
    benefits = [],
  } = section;

  return (
    <section className="w-full bg-[#EAF1FF] px-[80px] py-[96px]">
      <div className="mx-auto">

        <div className="flex">

          {/* LEFT – 15% */}
          <div className="w-[15%]">
            {section_label && (
              <div className="flex items-center gap-3 mt-2">
                <span className="w-2 h-2 rounded-full bg-[#2655C4]" />
                <span className="uppercase text-[12px] tracking-widest text-[#0A1A3A]">
                  {section_label}
                </span>
              </div>
            )}
          </div>

          {/* RIGHT – 85% */}
          <div className="w-[85%]">

            {/* HEADER */}
            <div className="flex items-start justify-between mb-[64px]">
              <div className="max-w-[720px]">
                {heading && (
                  <h2 className="font-heading font-semibold text-[#0A1A3A] text-[40px] leading-[1.2] mb-4">
                    {heading}
                  </h2>
                )}

                {description && (
                  <p className="text-[15px] leading-[1.6] text-[#1A1A1A]">
                    {description}
                  </p>
                )}
              </div>

              {cta_text && cta_link && (
                <Link href={cta_link} className="btn-primary mt-[6px]">
                  {cta_text}
                </Link>
              )}
            </div>

            {/* BENEFITS GRID */}
            <div className="grid grid-cols-3 ">

              {benefits.map((item, index) => {
                const iconUrl = getImageUrl(item.icon);
                const bgUrl = getImageUrl(item.background_image);
                const isImageCard = !!bgUrl;

                return (
                  <div
                    key={`benefit-${index}`}
                    className="
                      relative
                      h-[260px]
                       
                      overflow-hidden
                      bg-[#D7E1F0]
                    "
                  >
                    {/* IMAGE BACKGROUND */}
                    {isImageCard && (
                      <div
                        className="absolute inset-0"
                        style={{
                          backgroundImage: `
                            linear-gradient(
                              180deg,
                              rgba(0,0,0,0.05) 0%,
                              rgba(0,0,0,0.75) 100%
                            ),
                            url(${bgUrl})
                          `,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                        }}
                      />
                    )}

                    {/* CONTENT */}
                    <div
                      className={`
                        relative z-10 h-full
                        flex flex-col
                        ${isImageCard ? "justify-end p-[28px] text-white" : "p-[28px] text-[#0A1A3A]"}
                      `}
                    >
                      {/* ICON */}
                      {iconUrl && (
                        <div className="w-[36px] h-[36px] mb-[20px]">
                          <img
                            src={iconUrl}
                            alt={item.title || "Benefit icon"}
                            className="w-full h-full object-contain"
                          />
                        </div>
                      )}

                      {/* TITLE */}
                      {item.title && (
                        <h3 className="text-[16px] font-semibold mb-2">
                          {item.title}
                        </h3>
                      )}

                      {/* DESCRIPTION */}
                      {item.benefit_description && (
                        <p className="text-[14px] leading-[1.6] opacity-90">
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
