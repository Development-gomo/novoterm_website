import { useState } from "react";
import Head from "next/head";
import DotIndicator from "../../ui/DotIndicator";
import { wpToPath } from "../../../lib/api";

const stripHtml = (html) =>
  html ? html.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim() : "";

export default function FaqSection({ section, sectionId, index = 0 }) {
  const [openIndex, setOpenIndex] = useState(null);

  const {
    section_label,
    section_title,
    section_description,
    cta_text,
    cta_link,
    faqs: faqList = [],
  } = section || {};

  const faqs = Array.isArray(faqList) ? faqList : [];

  if (!faqs.length) return null;

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs
      .filter((faq) => faq?.faq_title && faq?.faq_answer)
      .map((faq) => ({
        "@type": "Question",
        name: stripHtml(faq.faq_title),
        acceptedAnswer: {
          "@type": "Answer",
          text: stripHtml(faq.faq_answer),
        },
      })),
  };

  return (
    <>
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      </Head>

      <section
        id={sectionId}
        className="w-full bg-[#EEF3FF] py-[60px] md:py-[80px] lg:py-[100px]"
      >
        <div className="web-width mx-auto px-6 md:px-0">
          {/* HEADER */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-8 md:mb-14">
            <div>
              {section_label && (
                <div className="flex items-center gap-2 mb-4 md:mb-6">
                  <DotIndicator />
                  <span className="uppercase font-montserrat font-medium text-[10px] sm:text-[10px] md:text-[12px] tracking-wider">
                    {section_label}
                  </span>
                </div>
              )}

              {section_title && (
                <h2 className="text-[24px] sm:text-[28px] md:text-[36px] lg:text-[40px] font-semibold leading-tight md:leading-[1.15] max-w-[561px] mb-4 text-[#061837]">
                  {section_title}
                </h2>
              )}

              {section_description && (
                <p className="text-[14px] sm:text-[15px] md:text-[16px] leading-[1.6] text-[#000] max-w-[640px]">
                  {section_description}
                </p>
              )}
            </div>

            {cta_text && cta_link && (
              <a
                href={
                  wpToPath(
                    typeof cta_link === "object" ? cta_link?.url : cta_link
                  ) || "#"
                }
                target={
                  typeof cta_link === "object" && cta_link?.target
                    ? cta_link.target
                    : undefined
                }
                className="btn-primary self-start sm:self-auto"
              >
                {cta_text}
              </a>
            )}
          </div>

          {/* FAQ ACCORDION */}
          <div className="space-y-4">
            {faqs.map((faq, i) => {
              const title = faq?.faq_title;
              const answer = faq?.faq_answer;
              if (!title || !answer) return null;

              const isOpen = openIndex === i;

              return (
                <div key={i} className="rounded-[3px] overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                    className="w-full flex items-start justify-between text-left bg-[#C4D0E6] px-4 sm:px-6 py-3"
                  >
                    <span className="text-[15px] sm:text-[16px] md:text-[18px] font-semibold text-[#061837] leading-snug pr-4 font-montserrat">
                      {title}
                    </span>

                    <span className="flex-shrink-0 w-[32px] h-[32px] rounded-full bg-[#2655C4] text-white flex items-center justify-center text-[18px]">
                      {isOpen ? (
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path fillRule="evenodd" clipRule="evenodd" d="M0.532143 7C-0.177381 7 -0.177381 8.07798 0.532143 8.07798H13.4679C14.1774 8.07798 14.1774 7 13.4679 7H0.532143Z" fill="white"/>
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path fillRule="evenodd" clipRule="evenodd" d="M6.46101 13.4679C6.46101 14.1774 7.53899 14.1774 7.53899 13.4679V7.53899H13.4679C14.1774 7.53899 14.1774 6.46101 13.4679 6.46101H7.53899V0.532143C7.53899 -0.177382 6.46101 -0.177382 6.46101 0.532143V6.46101H0.532143C-0.177381 6.46101 -0.177381 7.53899 0.532143 7.53899H6.46101V13.4679Z" fill="white"/>
                          </svg>
                        )}
                    </span>
                  </button>

                  {isOpen && (
                    <div
                      className="px-4 sm:px-6 py-6 text-[14px] sm:text-[15px] md:text-[16px] text-[#061837] leading-relaxed [&_a]:text-[#2655c4] [&_a]:underline [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:my-2 [&_ul]:marker:text-[#2655c4] [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:my-2 [&_ol]:marker:text-[#2655c4] [&_li]:mb-1 [&_p]:mb-2 [&_br]:block [&_br]:content-[''] [&_br]:mb-2 [&_strong]:font-semibold [&_em]:italic"
                      style={{ backgroundColor: "rgba(196, 208, 230, 0.50)" }}
                      dangerouslySetInnerHTML={{ __html: answer }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
