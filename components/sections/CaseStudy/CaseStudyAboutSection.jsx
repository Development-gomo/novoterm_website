import Image from "next/image";

const formatLabel = (layout) => {
  if (!layout) return null;
  return layout
    .replace(/_section$/, "")
    .replace(/^(services?_|casestudy_|blog_|industry_)/, "")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
};

export default function CaseStudyAboutSection({ section, sectionId, index = 0 }) {
  if (!section) return null;

  const { section_label, heading, subheading, image, text_below_image, description, select_theme = "dark", image_position = "left" } = section;

  const isImageRight = image_position === "right";

  const isDark = select_theme === "dark";
  const sectionBg     = isDark ? "bg-[#061837]"     : "bg-[#E3EDFF]";
  const headingColor  = isDark ? "text-white"        : "text-[#061837]";
  const subColor      = isDark ? "text-white/70"     : "text-[#061837]/70";
  const bodyColor     = isDark ? "text-white"        : "text-[#061837]";
  const labelColor    = isDark ? "text-white"        : "text-[#061837]";
  const dotColor      = "bg-[#2655C4]";

  const imageUrl =
    typeof image === "string"
      ? image
      : image?.url ||
        image?.sizes?.large ||
        image?.sizes?.medium_large ||
        "";

  return (
    <section
      id={sectionId}
      className={`w-full ${sectionBg} py-6 md:py-8 lg:py-[100px]`}
    >
      <div className="web-width mx-auto px-6 md:px-0">
        <div className="flex flex-col md:flex-row gap-6 md:gap-0">

          {/* LEFT – 15% (STICKY LABEL) */}
          <div className="md:w-[15%] relative">
            {(section_label || section?.acf_fc_layout) && (
              <div className="flex items-center gap-2 mt-2 mb-4 lg:hidden">
                <span className="w-2 h-2 rounded-full bg-[#2655C4]" />
                <span className={`uppercase font-montserrat font-medium text-[10px] tracking-wider ${labelColor}`}>
                  {section_label || formatLabel(section?.acf_fc_layout)}
                </span>
              </div>
            )}
          </div>

          {/* RIGHT – 85% */}
          <div className="md:w-[85%] ">
            <div className=" lg:mb-[50px] mb-3 ">
            {/* HEADING */}
            {heading && (
              <h2 className={`w-full font-heading text-[24px] sm:text-[28px] md:text-[40px] font-semibold leading-tight md:leading-[1.15] ${headingColor} mb-[14px]`}>
                {heading}
              </h2>
            )}

            {/* SUBHEADING */}
            {subheading && (
              <p className={`max-w-[760px] text-[15px] sm:text-[17px] leading-[1.5] ${subColor}`}>
                {subheading}
              </p>
            )}
            </div>
            {/* IMAGE + DESCRIPTION */}
            <div className={`flex flex-col ${isImageRight ? "lg:flex-row-reverse" : "lg:flex-row"} gap-10 lg:gap-[48px] items-start`}>

              {/* IMAGE */}
              {imageUrl && (
                <div className="w-full max-w-[380px] lg:max-w-[400px] flex-shrink-0">
                  <Image
                    src={imageUrl}
                    alt={heading || ""}
                    width={400}
                    height={300}
                    sizes="(max-width: 768px) 100vw, 400px"
                    className="w-full h-auto rounded-[3px] block"
                  />

                      {/* Text below image */}
              {text_below_image && (
                <div
                  className={`mt-4 text-center italic font-medium text-[14px] sm:text-[16px] leading-[1.7] ${bodyColor} space-y-4`}
                  dangerouslySetInnerHTML={{ __html: text_below_image }}
                />
              )}
                </div>
              )}

              {/* DESCRIPTION */}
              {description && (
                <div
                  className={`flex-1 text-[14px] sm:text-[16px] leading-[1.7] ${bodyColor} space-y-4`}
                  dangerouslySetInnerHTML={{ __html: description }}
                />
              )}

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
