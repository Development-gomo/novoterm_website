import DotIndicator from "../../ui/DotIndicator";

export default function ServiceIntroFrontend({
  section,
  sectionId,
  index = 0, // 👈 NEW
}) {
  if (!section) return null;

  const {
    section_label,
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

  const STICKY_START = 120; // header height
  const LABEL_HEIGHT = 32;  // approx label height
  const stickyTop = STICKY_START + index * LABEL_HEIGHT;

  return (
    <section id="next-section"
      className="w-full bg-[#EAF1FF] py-[40px] px-4 sm:px-6 md:py-10 lg:py-[100px] lg:px-[80px]"
    >
      <div className="mx-auto">

        <div className="flex flex-col md:flex-row gap-6 md:gap-8">

          {/* LEFT – 15% (STACKED STICKY LABEL) */}
          <div className="md:w-[15%] relative">
            <div
              className="flex items-center gap-2 mb-4 md:mb-6"
              style={{
                position: "sticky",
                top: `${stickyTop}px`,
                zIndex: 10 + index,
              }}
            >
              <DotIndicator />
              {section_label && (
                <span
                  className="uppercase font-montserrat font-medium text-[10px] sm:text-[10px] md:text-[12px] tracking-wider
                  "
                >
                  {section_label}
                </span>
              )}
            </div>
          </div>

          {/* RIGHT – 85% */}
          <div className="md:w-[85%]">

            {heading && (
              <h2
                className="
                  font-heading font-semibold text-[#0A1A3A]
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
                  mb-8 md:mb-[64px]
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
                <div className="space-y-[24px] md:space-y-[32px]">
                  {content_blocks.map((block, i) => (
                    <div key={i}>
                      {block?.title && (
                        <h3 className="text-[20px] sm:text-[22px] md:text-[24px] font-semibold text-[#0A1A3A] mb-2">
                          {block.title}
                        </h3>
                      )}
                      {block?.content && (
                        <div
                          className="
                            font-body
                            text-[14px] sm:text-[15px] md:text-[16px]
                            leading-[1.6] md:leading-[1.7]
                            text-[#1A1A1A]
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
