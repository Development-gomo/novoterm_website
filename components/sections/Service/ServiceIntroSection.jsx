import DotIndicator from "../../ui/DotIndicator";

const formatLabel = (layout) => {
  if (!layout) return null;
  return layout
    .replace(/_section$/, '')
    .replace(/^(services?_|casestudy_|blog_)/, '')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
};

export default function ServiceIntroFrontend({
  section,
  sectionId,
  index = 0,
}) {
  if (!section) return null;

  const {
    heading,
    image,
    content_blocks = [],
  } = section;

  const imageUrl =
    typeof image === "string"
      ? image
      : image?.url ||
        image?.sizes?.large ||
        image?.sizes?.medium_large ||
        "";

  return (
    <section id={sectionId}
      className="w-full bg-[#EAF1FF]  py-[60px] sm:py-[80px] lg:py-[100px]"
    >
      <div className="web-width mx-auto px-6 md:px-0">
        <div className="flex flex-col md:flex-row">

          {/* LEFT – 15% */}
          <div className="md:w-[15%] relative">
            {(section?.section_label || section?.acf_fc_layout) && (
              <div className="flex items-center gap-2 mb-4 lg:hidden">
                <span className="w-2 h-2 rounded-full bg-[#2655C4]" />
                <span className="uppercase font-montserrat font-medium text-[10px] tracking-wider text-[#061837]">
                  {section.section_label || formatLabel(section.acf_fc_layout)}
                </span>
              </div>
            )}
          </div>

          {/* RIGHT – 85% */}
          <div className="md:w-[85%]">

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
                  [&_em]:text-[#2655C4]
                  [&_em]:font-bold
                  mb-8 md:mb-[40px]
                  max-w-[1090px]
                "
                dangerouslySetInnerHTML={{ __html: heading }}
              />
            )}

            <div className="grid grid-cols-1 md:grid-cols-[420px_1fr] gap-8 md:gap-0 items-start">

              {imageUrl && (
                <div
                  className="
                    w-full md:w-[360px]
                    h-[280px] sm:h-[360px] md:h-[450px]
                    rounded-[3px]
                    bg-no-repeat
                    bg-cover
                  "
                  style={{
                    backgroundImage: `url("${imageUrl}")`,
                  }}
                />
              )}

              {content_blocks.length > 0 && (
                <div className="space-y-[18px] md:space-y-[24px]">
                  {content_blocks.map((block, i) => (
                    <div key={i}>
                      {block?.title && (
                        <h3 className="text-[20px] sm:text-[22px] md:text-[24px] font-semibold text-[#061837] mb-2">
                          {block.title}
                        </h3>
                      )}
                      {block?.content && (
                        <div
                          className="
                            font-body
                            text-[14px] sm:text-[15px] md:text-[16px]
                            leading-[1.6] md:leading-[1.7]
                            text-[#000000] [&_a]:text-[#2655c4] [&_a]:underline
                            [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:my-2 [&_ul]:marker:text-[#2655c4]
                            [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:my-2 [&_ol]:marker:text-[#00000] space-y-4
                          "
                          dangerouslySetInnerHTML={{ __html: block.content }}
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}

            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
