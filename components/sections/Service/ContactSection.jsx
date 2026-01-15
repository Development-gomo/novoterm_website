"use client";

import CF7ContactForm from "../../ui/CF7ContactForm";

/**
 * Normalize ACF image field
 */
const getImageUrl = (img) => {
  if (!img) return null;
  if (typeof img === "string") return img;
  return img.url || null;
};

export default function ContactSection({ section }) {
  if (!section) return null;

  const {
    section_label,
    heading,
    subheading,
    image,
    form_id,
  } = section;

  const imageUrl = getImageUrl(image);

  return (
    <section className="w-full bg-[#061837] text-white py-[80px]">
      <div className="max-w-[1400px] mx-auto px-6">

        {/* ================= 15 / 85 WRAPPER ================= */}
        <div className="flex gap-12">

          {/* ================= LEFT – 15% ================= */}
          <div className="w-[15%]">
            {section_label && (
              <div className="flex items-center gap-2 mt-2">
                <span className="w-2 h-2 rounded-full bg-[#2E6CF6]" />
                <span className="uppercase text-[12px] tracking-widest text-[#B7C6FF]">
                  {section_label}
                </span>
              </div>
            )}
          </div>

          {/* ================= RIGHT – 85% ================= */}
          <div className="w-[85%]">

            {/* HEADING */}
            {heading && (
              <h2 className="text-[40px] font-semibold leading-[1.2] max-w-[520px] mb-4">
                {heading}
              </h2>
            )}

            {/* SUBHEADING */}
            {subheading && (
              <p className="text-[15px] text-[#D6E2FF] max-w-[520px] mb-10">
                {subheading}
              </p>
            )}

            {/* IMAGE + FORM */}
            <div className="flex gap-16 items-start">

              {/* IMAGE */}
              {imageUrl && (
                <div className="w-[40%]">
                  <img
                    src={imageUrl}
                    alt="Contact"
                    className="rounded-[12px] w-full h-auto object-cover"
                  />
                </div>
              )}

              {/* FORM */}
              <div className="flex-1">
                <CF7ContactForm formId={form_id} />
              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
