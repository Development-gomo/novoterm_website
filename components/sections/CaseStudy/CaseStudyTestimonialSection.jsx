import Image from "next/image";
import DotIndicator from "../../ui/DotIndicator";
import { pickWpImageUrl } from "../../../lib/wpImage";

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

  const bgUrl = pickWpImageUrl(background_image, "heroNext");

  return (
    <section
      id={sectionId}
      className="relative z-[60] w-full flex h-auto lg:min-h-[660px] py-6 md:py-8 lg:pt-[100px] lg:pb-[80px] overflow-hidden"
    >
      {bgUrl ? (
        <>
          <div className="absolute inset-0 z-0">
            <Image
              src={bgUrl}
              alt=""
              fill
              sizes="100vw"
              quality={70}
              loading="lazy"
              className="object-cover object-top"
            />
          </div>
          <div
            className="absolute inset-0 z-[1] pointer-events-none"
            style={{
              background: "linear-gradient(180deg, rgba(0,0,0,0.1) 0%, #000000 100%)",
            }}
          />
        </>
      ) : null}

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
