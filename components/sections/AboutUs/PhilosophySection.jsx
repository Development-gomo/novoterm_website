"use client";

export default function PhilosophySection({
  section,
  sectionId,
  index = 0,
}) {
  if (!section) return null;

  const {
    section_label,
    heading,
    left_description,
    right_description,
    values = [],
  } = section;

  const STICKY_START = 120;
  const LABEL_HEIGHT = 32;
  const stickyTop = STICKY_START + index * LABEL_HEIGHT;

  return (
    <section
      id={sectionId}
      className="w-full bg-[#E3EDFF]
        pt-[56px] px-[24px] pb-[64px]
        sm:pt-[72px] sm:px-[40px] sm:pb-[80px]
        lg:pt-[100px] lg:px-[80px] lg:pb-[100px]"
    >
      <div className="mx-auto">

        <div className="flex flex-col md:flex-row gap-8 md:gap-0">

          {/* LEFT – LABEL */}
          <div className="md:w-[15%] relative">
            {section_label && (
              <div
                className="flex items-center gap-2
                  md:sticky"
                style={{
                  top: `${stickyTop}px`,
                  zIndex: 10 + index,
                }}
              >
                <span className="w-2 h-2 rounded-full bg-[#2655C4]" />
                <span className="uppercase font-montserrat font-medium
                  text-[10px] md:text-[12px] tracking-wider">
                  {section_label}
                </span>
              </div>
            )}
          </div>

          {/* RIGHT – CONTENT */}
          <div className="md:w-[85%]">

            {/* HEADING */}
            {heading && (
              <h2
                className="font-heading font-semibold text-[#061837]
                  text-[24px] sm:text-[28px] md:text-[40px]
                  leading-tight md:leading-[48px]
                  mb-4
                  max-w-[582px]"   /* ← was fixed width */
              >
                {heading}
              </h2>
            )}

            {/* DESCRIPTIONS */}
            {(left_description || right_description) && (
              <div
                className="grid grid-cols-1 md:grid-cols-2
                  gap-[32px] md:gap-[40px]
                  text-[16px] leading-[1.7] text-[#000]
                  mb-[48px] md:mb-[64px]
                  max-w-[1150px]" /* ← was fixed width */
              >
                {left_description && (
                  <div
                    dangerouslySetInnerHTML={{ __html: left_description }}
                  />
                )}

                {right_description && (
                  <div
                    dangerouslySetInnerHTML={{ __html: right_description }}
                  />
                )}
              </div>
            )}

            {/* VALUES */}
            {values.length > 0 && (
              <div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4
                  gap-[32px] lg:gap-[40px]"
              >
                {values.map((item, i) => (
                  <div key={i} className="flex flex-col">

                    {item?.icon && (
                      <div className="mb-[16px]">
                        <img
                          src={item.icon?.url || item.icon}
                          alt=""
                          className="w-[48px] h-[48px]"
                        />
                      </div>
                    )}

                    <h4
                      className="text-[18px] leading-[24px]
                        font-semibold text-[#2655C4]
                        mb-[12px]"
                    >
                      {item.title}
                    </h4>

                    <div className="w-full h-px bg-[#0618374D] mb-[16px]" />

                    <p className="text-[16px] leading-[24px] text-[#000]">
                      {item.text}
                    </p>

                  </div>
                ))}
              </div>
            )}

          </div>
        </div>

      </div>
    </section>
  );
}
