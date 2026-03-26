import DotIndicator from "../../ui/DotIndicator";

const formatLabel = (layout) => {
  if (!layout) return null;
  return layout
    .replace(/_section$/, '')
    .replace(/^(services?_|casestudy_|blog_|industry_)/, '')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
};

export default function CaseStudyTestimonialSection({ section, sectionId }) {
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
      id={sectionId}
      className="relative w-full flex bg-cover bg-center h-auto lg:h-[660px] py-6 md:py-8 lg:pt-[100px] lg:pb-[80px]"
      style={{ backgroundImage: `url(${bgUrl})` }}
    >
      {/* OVERLAY: linear gradient from 10% transparent black to solid black */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(180deg, rgba(0,0,0,0.1) 0%, #000000 100%)",
        }}
      />

      {/* CONTENT */}
      <div className="relative z-10 web-width mx-auto px-6 md:px-0">

        {/* LABEL */}
        {(section_label || section?.acf_fc_layout) && (
          <div className="flex items-center gap-2 mb-[64px] sm:mb-[120px] lg:mb-[197px]">
            <span className="w-2 h-2 rounded-full bg-[#2655C4] lg:hidden" />
            <span className="uppercase font-montserrat font-medium text-[10px] sm:text-[12px] tracking-widest text-white lg:hidden">
              {section_label || formatLabel(section?.acf_fc_layout)}
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
        <div className="text-white text-[12px] sm:text-[14px] uppercase font-heading font-medium tracking-widest">
          {author_name}
          {author_title && `  ${author_title}`} |
          {author_company && ` ${author_company}`}
        </div>

      </div>
    </section>
  );
}
