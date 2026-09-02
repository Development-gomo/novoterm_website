import Link from "next/link";
import Image from "next/image";
import { wpToPath } from "../../../lib/api";
import { pickWpImageUrl } from "../../../lib/wpImage";
import { getSectionBackground, isDarkSectionColor } from "../../../lib/sectionTheme";

const getImageUrl = (img) => {
  if (!img) return null;
  const u = pickWpImageUrl(img, "card");
  return u || null;
};

export default function BenefitsSection({ section, sectionId, index = 0 }) {
  if (!section) return null;

  const {
    section_theme = "#E3EDFF",
    heading,
    section_description,
    cta_text,
    cta_link,
    benefits = [],
  } = section;

  const sectionBackground = getSectionBackground(section_theme);
  const isDark = isDarkSectionColor(section_theme);
  const headingColor = isDark ? "text-white" : "text-[#061837]";
  const textColor = isDark ? "text-white/85" : "text-[#061837]";
  const labelColor = isDark ? "text-white" : "text-[#061837]";
  const emptyCardClass = isDark ? "bg-[#D7E5F5]" : "bg-[#CCD8EE]";

  const formatLabel = (layout) => {
    if (!layout) return null;
    return layout
      .replace(/_section$/, '')
      .replace(/^(services?_|casestudy_|blog_)/, '')
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase());
  };
  const mobileLabel = section.section_label || formatLabel(section.acf_fc_layout);

  return (
    <section
      id={sectionId}
      className="w-full py-[60px] sm:py-[80px] lg:py-[100px]"
      style={{ backgroundColor: sectionBackground }}
    >
      <div className="web-width mx-auto px-6 md:px-0">
        <div className="flex flex-col lg:flex-row">

          {/* LEFT – 15% */}
          <div className="w-full lg:w-[15%] lg:mb-0 relative">
            {mobileLabel && (
              <div className="flex items-center gap-2 mb-4 lg:hidden">
                <span className="w-2 h-2 rounded-full bg-[#2655C4]" />
                <span className={`uppercase font-montserrat font-medium text-[10px] tracking-wider ${labelColor}`}>
                  {mobileLabel}
                </span>
              </div>
            )}
          </div>

          {/* RIGHT – 85% */}
          <div className="w-full lg:w-[85%]">

            {/* HEADER */}
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-[40px] lg:mb-[64px] gap-6">
              <div className="max-w-[550px]">
                {heading && (
                  <h2 className={`font-heading text-[24px] sm:text-[28px] md:text-[40px] font-semibold leading-tight md:leading-[1.15] mb-4 ${headingColor}`}>
                    {heading}
                  </h2>
                )}
                 {section_description && (
  <div 
    className={`text-[14px] sm:text-[15px] md:text-[16px] leading-[24px] ${textColor}`}
    dangerouslySetInnerHTML={{ __html: section_description }}
  />
)}

              </div>

              {cta_text && cta_link && (
                <Link href={wpToPath(cta_link) || "#"} className="btn-primary lg:mt-[6px] w-fit">
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
                  <div key={`benefit-${i}`} className={`relative justify-end min-h-[320px] overflow-hidden ${emptyCardClass}`}>

                    {/* IMAGE BACKGROUND */}
                    {isImageCard && (
                    <div className="absolute inset-0"
  style={{
    background: `linear-gradient(180deg, rgba(0, 0, 0, 0.00) -14.94%, #000 100%), url(${bgUrl})  lightgray -40.739px 0px / 126.954% 100% no-repeat`,
    backgroundSize: 'cover',
    backgroundPosition: 'center center',
  }}

/>

                    )}

                    {/* CONTENT */}
                    <div className={`relative z-10 h-full flex flex-col ${isImageCard ? "p-[24px] pb-[26px] text-white" : "p-[24px] pb-[32px] text-[#061837]"}`}>

                      {iconUrl && (
                        <div className="relative w-[48px] h-[48px] mb-[102px]">
                          <Image
                            src={iconUrl}
                            alt={item.title || "Benefit icon"}
                            fill
                            sizes="48px"
                            className="object-contain"
                          />
                        </div>
                      )}
                      {!iconUrl && isImageCard && (
                        <div className="w-[48px] h-[48px] mb-[102px]" />
                      )}

                      {item.title && (
                        <h3 className="text-[16px] sm:text-[17px] md:text-[18px] leading-[24px] mb-4 font-semibold">
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
