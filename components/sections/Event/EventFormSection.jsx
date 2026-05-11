import CF7ContactForm from "../../ui/CF7ContactForm";

export default function EventFormSection({ section, sectionId, index = 0 }) {
  if (!section) return null;

  const {
    heading,
    subheading,
    form_id,
    section_theme = "light",
    section_label,
    acf_fc_layout,
  } = section;

  const isDark = section_theme === "dark";
  const sectionBg = isDark ? "bg-[#061837]" : "bg-[#E3EDFF]";
  const labelColor = isDark ? "text-white/70" : "text-[#061837]";

  const formatLabel = (layout) => {
    if (!layout) return null;
    return layout
      .replace(/_section$/, "")
      .replace(/^(services?_|casestudy_|blog_)/, "")
      .replace(/_/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
  };

  const mobileLabel = section_label || formatLabel(acf_fc_layout);

  return (
    <section
      id={sectionId}
      className={`w-full ${sectionBg} py-[60px] sm:py-[80px] lg:py-[100px] ${isDark ? "text-white" : "text-[#061837]"}`}
      data-section-index={index}
    >
      <div className="web-width mx-auto px-6 md:px-0">
        <div className="flex flex-col md:flex-row">
          <div className="w-full lg:w-[15%] relative mb-6 lg:mb-0">
            {mobileLabel && (
              <div className="flex items-center gap-2 mb-4 lg:hidden">
                <span className="w-2 h-2 rounded-full bg-[#2655C4]" />
                <span
                  className={`uppercase font-montserrat font-medium text-[10px] tracking-wider ${labelColor}`}
                >
                  {mobileLabel}
                </span>
              </div>
            )}
          </div>

          <div className="md:w-[85%]">
            {heading && (
              <h2 className="text-[24px] sm:text-[28px] md:text-[40px] font-semibold leading-tight md:leading-[1.15] max-w-[577px] mb-4">
                {heading}
              </h2>
            )}

            {subheading && (
              <p
                className={`text-[14px] sm:text-[16px] leading-[24px] max-w-[520px] mb-8 md:mb-10 ${
                  isDark ? "text-white/85" : "text-[#061837]/85"
                }`}
              >
                {subheading}
              </p>
            )}

            <CF7ContactForm
              sectionTheme={section_theme}
              formId={form_id}
              mode="event"
            />
          </div>
        </div>
      </div>
      
    </section>
  );
}

