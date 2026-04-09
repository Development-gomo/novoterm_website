import Image from "next/image";
import DotIndicator from "../../ui/DotIndicator";

const formatLabel = (layout) => {
  if (!layout) return null;
  return layout
    .replace(/_section$/, '')
    .replace(/^(services?_|casestudy_|blog_|industry_)/, '')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
};


export default function CaseStudyResultsSection({ section, sectionId, index = 0 }) {
  if (!section) return null;

  const {
    section_label,
    heading,
    description,
    results_points = [],
    highlight,
    result_column = "image",
    result_image
  } = section;

  const STICKY_START = 120;
  const LABEL_HEIGHT = 32;
  const stickyTop = STICKY_START + index * LABEL_HEIGHT;

  return (
    <section
      id={sectionId}
      className="w-full bg-[#061837] py-6 md:py-8 lg:py-[100px]"
    >
      <div className="web-width mx-auto px-6 md:px-0">

        <div className="flex flex-col md:flex-row gap-6 md:gap-0">

          {/* LEFT – 15% (STICKY LABEL) */}
          <div className="md:w-[15%] relative">
            {(section_label || section?.acf_fc_layout) && (
              <div className="flex items-center gap-2 mt-2 mb-4 lg:hidden">
                <span className="w-2 h-2 rounded-full bg-[#2655C4]" />
                <span className="uppercase font-montserrat font-medium text-[10px] tracking-widest text-white">
                  {section_label || formatLabel(section?.acf_fc_layout)}
                </span>
              </div>
            )}
          </div>

          {/* RIGHT – 85% */}
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-[48px] items-start md:w-[85%]">

            {/* LEFT CONTENT */}
            <div className="w-full">

              {heading && (
                <h2 className="font-heading text-[24px] sm:text-[28px] md:text-[40px] font-semibold leading-tight md:leading-[1.15] font-semibold text-white mb-[16px] w-full lg:w-[577px]">
                  {heading}
                </h2>
              )}

              {description && (
                <div
                  className="w-full lg:max-w-[600px] text-[16px] leading-[24px] text-white mb-[40px]"
                  dangerouslySetInnerHTML={{ __html: description }}
                />
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-[32px] sm:gap-[48px] max-w-full sm:max-w-[650px]">
                {results_points.map((item, i) => (
                  <div key={i}>
                    <h4 className="text-[20px] sm:text-[24px] leading-[1.3] sm:leading-[32px] font-semibold text-[#5C83DD] mb-2">
                      {item.title}
                    </h4>
                    <p className="text-[16px] leading-[24px] text-white">
                      {item.content}
                    </p>
                  </div>
                ))}
              </div>
            </div>


            {/* RIGHT COLUMN: IMAGE or CARD */}
            {result_column === "image" && result_image && (
              <div className="w-full max-w-full sm:max-w-[360px] flex items-center justify-center">
                <Image
                  src={result_image?.url || result_image}
                  alt="Result"
                  width={360}
                  height={270}
                  sizes="360px"
                  className="w-full h-auto rounded-[3px] object-contain"
                />
              </div>
            )}

            {result_column === "card" && highlight && (
              <div className="w-full max-w-full sm:max-w-[360px] bg-[#2655C4] rounded-[3px] p-[24px] sm:p-[32px] text-white">
                {highlight.icon && (
                  <div className="w-[40px] h-[40px] flex items-center justify-center rounded-full border border-white mb-[32px]">
                    <Image src={highlight.icon?.url || highlight.icon} alt="" width={24} height={24} />
                  </div>
                )}
                {highlight.metric && (
                  <h2 className="text-[32px] !font-montserrat sm:text-[40px] font-semibold mb-1">
                    {highlight.metric}
                  </h2>
                )}
                {highlight.metric_label && (
                  <div className="uppercase text-[14px] !font-montserrat tracking-[0.84px] mb-[24px]">
                    {highlight.metric_label}
                  </div>
                )}
                <div className="w-full h-px bg-[#FFFFFF4D] my-[24px]" />
                {highlight.title && (
                  <h4 className="text-[20px] sm:text-[24px] leading-[1.3] sm:leading-[32px] font-semibold mb-2">
                    {highlight.title}
                  </h4>
                )}
                {highlight.content && (
                  <p className="text-[16px] leading-[24px]">
                    {highlight.content}
                  </p>
                )}
              </div>
            )}

          </div>
        </div>

      </div>
    </section>
  );
}
