import Link from "next/link";
import DotIndicator from "../../ui/DotIndicator";

export default function CaseStudyChallengeSection({
  section,
  sectionId,
  index = 0,
}) {
  if (!section) return null;

  const {
    section_label,
    heading,
    description,
    image,
    challenges = [],
    cta_text,
    cta_url,
  } = section;

  const imageUrl =
    typeof image === "string"
      ? image
      : image?.url ||
        image?.sizes?.large ||
        image?.sizes?.medium_large ||
        "";

  const STICKY_START = 120;
  const LABEL_HEIGHT = 32;
  const stickyTop = STICKY_START + index * LABEL_HEIGHT;

  return (
    <section
      id={sectionId}
      className="w-full bg-[#061837] px-4 py-6 sm:px-6 md:py-8 lg:py-[100px] lg:px-[80px]"
    >
      <div className="mx-auto max-w-[1440px]">

        <div className="flex flex-col md:flex-row gap-6 md:gap-0">

          {/* LEFT – 15% (STICKY LABEL) */}
          <div className="md:w-[15%] relative">
            {section_label && (
              <div
                className="flex items-center gap-2 mt-2 mb-4 md:mb-0"
                style={{
                  position: "sticky",
                  top: `${stickyTop}px`,
                  zIndex: 10 + index,
                }}
              >
                <DotIndicator />
                <span className="uppercase font-montserrat font-medium text-[10px] sm:text-[10px] md:text-[12px] tracking-wider text-white">
                  {section_label}
                </span>
              </div>
            )}
          </div>

          {/* RIGHT – 85% */}
          <div className="md:w-[85%]">

            {/* HEADING */}
            {heading && (
              <h2 className="max-w-[577px] font-heading text-[24px] sm:text-[28px] md:text-[40px] font-semibold leading-tight md:leading-[1.15] font-semibold text-white mb-[16px] sm:mb-[24px]"
              >
                {heading}
              </h2>
            )}

            {/* DESCRIPTION */}
            {description && (
              <div
                className="max-w-[533px] text-[14px] sm:text-[15px] md:text-[16px] leading-[24px] text-white mb-[40px] sm:mb-[56px]"
                dangerouslySetInnerHTML={{ __html: description }}
              />
            )}

            {/* IMAGE + CHALLENGES */}
            <div className="flex flex-col lg:flex-row gap-10 lg:gap-[80px] items-start">

              {/* IMAGE */}
              {imageUrl && (
                <div
                  className="w-full max-w-[466px]
                    h-[460px] sm:h-[460px] md:h-[460px] lg:h-[553px]
                    rounded-[3px] bg-cover bg-center"
                  style={{ backgroundImage: `url(${imageUrl})` }}
                />
              )}

              {/* CHALLENGES */}
              <div className="flex-1 space-y-[32px]">

                {challenges.map((item, i) => (
                  <div key={i}>

                    <div className="flex gap-4 items-start">
                      <div className="!font-merriweather flex-shrink-0 w-6 h-6 rounded-full bg-[#2655C4] text-white text-[14px] flex items-center justify-center font-medium mt-[4px]">
                        {i + 1}
                      </div>

                      <div>
                        <h4 className="text-[15px] sm:text-[24px] leading-[32px] font-normal text-white mb-2">
                          {item.title}
                        </h4>
                        <p className="text-[14px] sm:text-[16px] leading-[24px] text-white">
                          {item.content}
                        </p>
                      </div>
                    </div>

                    {/* DIVIDER */}
                    <div className="w-full h-px bg-white/15 mt-[24px]" />
                  </div>
                ))}

                {cta_text && cta_url && (
                  <Link href={cta_url} className="btn-primary inline-flex w-fit">
                    {cta_text}
                  </Link>
                )}

              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
