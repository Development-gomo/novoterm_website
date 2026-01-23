import DotIndicator from "../../ui/DotIndicator";

export default function CaseStudyTestimonialSection({ section }) {
  if (!section) return null;

  const { section_label, quote, author_name, author_title, author_company, background_image } = section;

  const bgUrl =
    typeof background_image === "string"
      ? background_image
      : background_image?.url ||
        background_image?.sizes?.large ||
        "";

  return (
    <section
      className="relative w-full flex bg-cover bg-center px-4 py-6 sm:px-6 md:py-8 lg:py-[100px] lg:px-[80px]"
      style={{ backgroundImage: `url(${bgUrl})` }}
    >
      {/* OVERLAY */}
      <div className="absolute inset-0 bg-[#061837]/70" />

      {/* CONTENT */}
      <div className="relative z-10 max-w-[1440px] mx-auto">

        {/* LABEL */}
        {section_label && (
          <div className="flex items-center gap-2 mb-[64px] sm:mb-[120px] lg:mb-[197px]">
            <DotIndicator />
            <span className="uppercase font-montserrat font-medium text-[10px] sm:text-[12px] tracking-widest text-white">
              {section_label}
            </span>
          </div>
        )}

        {/* QUOTE */}
        {quote && (
          <div
            className="text-white font-heading max-w-full lg:max-w-[1280px] text-[20px] sm:text-[24px] md:text-[26px] lg:text-[28px] font-medium leading-[1.5] mb-[20px] sm:mb-[24px] [&_em]:italic [&_em]:font-bold [&_em]:text-[#5C83DD]"
            dangerouslySetInnerHTML={{ __html: quote }}
          />
        )}

        {/* AUTHOR */}
        <div className="text-white/80 text-[12px] sm:text-[14px] uppercase font-heading tracking-widest">
          {author_name}
          {author_title && `  ${author_title}`} |
          {author_company && ` at ${author_company}`}
        </div>

      </div>
    </section>
  );
}
