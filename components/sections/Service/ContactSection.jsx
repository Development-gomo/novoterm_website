
import CF7ContactForm from "../../ui/CF7ContactForm";

/**
 * Normalize ACF image field
 */
const getImageUrl = (img) => {
  if (!img) return null;
  if (typeof img === "string") return img;
  return img.url || null;
};

export default function ContactSection({ section, sectionId, index = 0 }) {
  if (!section) return null;

  const {
    heading,
    subheading,
    image,
    form_id,
  } = section;
  const imageUrl = getImageUrl(image);

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
      className="
        w-full bg-[#061837] text-white
        py-6 md:py-10 lg:py-[100px]
      "
    >
      <div className="web-width mx-auto px-6 md:px-0">

        {/* ================= 15 / 85 WRAPPER ================= */}
        <div className="flex flex-col md:flex-row ">

          {/* ================= LEFT – 15% ================= */}
          <div className="w-full lg:w-[15%] relative mb-6 lg:mb-0">
            {mobileLabel && (
              <div className="flex items-center gap-2 mb-4 lg:hidden">
                <span className="w-2 h-2 rounded-full bg-[#2655C4]" />
                <span className="uppercase font-montserrat font-medium text-[10px] tracking-wider text-white">
                  {mobileLabel}
                </span>
              </div>
            )}
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
                  sm:text-[16px]
                  text-[#fff]
                  max-w-[520px]
                  mb-8
                  md:mb-10
                "
              >
                {subheading}
              </p>
            )}

            {/* IMAGE + FORM */}
            <div className="flex flex-col lg:flex-row gap-[20px] lg:gap-[50px] items-start">

              {/* IMAGE */}
              {imageUrl && (
                <div className="w-full lg:w-[46%]">
                  <img
                    src={imageUrl}
                    alt="Contact"
                    className="
                      rounded-[3px]
                      w-[520px]
                      h-[610px]
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
