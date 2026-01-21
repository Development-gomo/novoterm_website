"use client";

import CF7ContactForm from "../../ui/CF7ContactForm";
import DotIndicator from "../../ui/DotIndicator";

/**
 * Normalize ACF image field
 */
const getImageUrl = (img) => {
  if (!img) return null;
  if (typeof img === "string") return img;
  return img.url || null;
};

export default function ContactSection({ section, index = 0 }) {
  if (!section) return null;

  const {
    section_label,
    heading,
    subheading,
    image,
    form_id,
  } = section;
  const STICKY_START = 120;
  const LABEL_HEIGHT = 32;
  const stickyTop = STICKY_START + index * LABEL_HEIGHT;
  const imageUrl = getImageUrl(image);

  return (
    <section
      className="
        w-full bg-[#061837] text-white
       px-4 py-6 sm:px-6 md:py-10 lg:px-[80px] lg:py-[100px]
      "
    >
      <div className="mx-auto">

        {/* ================= 15 / 85 WRAPPER ================= */}
        <div className="flex flex-col md:flex-row ">

          {/* ================= LEFT – 15% ================= */}
          <div className="w-full lg:w-[15%] relative mb-6 lg:mb-0">
                     <div className="flex items-center gap-3 mt-2" style={{ position: "sticky", top: `${stickyTop}px`, zIndex: 10 + index }}>
                       <DotIndicator variant="white" />
                       {section_label && (
                         <span className="uppercase font-montserrat font-medium text-white text-[10px] sm:text-[10px] md:text-[12px] tracking-wider">
                           {section_label}
                         </span>
                       )}
                     </div>
                   </div>

          {/* ================= RIGHT – 85% ================= */}
          <div className="md:w-[85%]">

            {/* HEADING */}
            {heading && (
              <h2
                className="text-[24px] sm:text-[28px] md:text-[40px] font-semibold leading-tight md:leading-[1.15]
                  max-w-[577px]
                  mb-4
                "
              >
                {heading}
              </h2>
            )}

            {/* SUBHEADING */}
            {subheading && (
              <p
                className="
                  text-[14px]
                  sm:text-[15px]
                  text-[#D6E2FF]
                  max-w-[520px]
                  mb-8
                  md:mb-10
                "
              >
                {subheading}
              </p>
            )}

            {/* IMAGE + FORM */}
            <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-start">

              {/* IMAGE */}
              {imageUrl && (
                <div className="w-full lg:w-[40%]">
                  <img
                    src={imageUrl}
                    alt="Contact"
                    className="
                      rounded-[12px]
                      w-full
                      h-auto
                      object-cover
                    "
                  />
                </div>
              )}

              {/* FORM */}
              <div className="w-full lg:flex-1">
                <CF7ContactForm formId={form_id} />
              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
