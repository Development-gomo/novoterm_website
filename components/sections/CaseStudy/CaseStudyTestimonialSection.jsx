import DotIndicator from "../../ui/DotIndicator";

export default function CaseStudyTestimonialSection({ section }) {
  if (!section) return null;

  const { section_label, quote, author_name, author_title, author_company, background_image } = section;

  const bgUrl = typeof background_image === "string" ? background_image : background_image?.url || background_image?.sizes?.large || "";

  return (
    <section className="relative w-full flex bg-cover bg-center p-[80px] py-[100px]"  style={{ backgroundImage: `url(${bgUrl})` }}>
      
      {/* OVERLAY */}
      

      {/* CONTENT */}
      <div className="relative z-10">

        {/* LABEL */}
        {section_label && (
          <div className="flex items-center gap-2 mb-[197px]">
            <DotIndicator />
            <span className="uppercase font-montserrat font-medium text-[12px] tracking-widest text-white">
              {section_label}
            </span>
          </div>
        )}

        {/* QUOTE */}
        {quote && (
          <div
            className="text-white font-heading w-[1280px] text-[28px] font-medium leading-[38px] mb-[24px] [&_em]:italic [&_em]:font-bold [&_em]:text-[#5C83DD]"
            dangerouslySetInnerHTML={{ __html: quote }}
          />
        )}

        {/* AUTHOR */}
        <div className="text-white/80 text-[14px] uppercase font-heading tracking-widest">
          {author_name}
          {author_title && `  ${author_title}`} |
          {author_company && ` at ${author_company}`}
        </div>

      </div>
    </section>
  );
}
