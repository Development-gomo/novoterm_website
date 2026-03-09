"use client";

import { useState } from "react";
import Head from "next/head";

// Strip HTML tags for clean schema text
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

  const faqs = faqList;

  if (!faqs.length) return null;

  // Build FAQ schema
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
      className="
        w-full bg-[#EEF3FF]
        py-[40px]
        md:py-[80px]
        lg:py-[100px]
      "
    >
      <div className="web-width mx-auto px-6 md:px-0">

        {/* ================= 15 / 85 WRAPPER ================= */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">

          {/* ================= LEFT – 15% ================= */}
          <div className="w-full lg:w-[15%] relative">
          </div>

          {/* ================= RIGHT – 85% ================= */}
          <div className="w-full lg:w-[85%]">

            {/* HEADER */}
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-8 md:mb-14">
              <div>
              
              
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
                  href={typeof cta_link === "object" ? cta_link?.url || "#" : cta_link}
                  target={typeof cta_link === "object" && cta_link?.target ? cta_link.target : undefined}
                  className="btn-primary self-start sm:self-auto"
                >
                  {cta_text}
                </a>
              )}
            </div>

            {/* FAQ LIST */}
            <div className="space-y-4">
              {faqs.map((faq, i) => {
                const title = faq?.faq_title;
                const description = faq?.faq_answer;
                if (!title || !description) return null;

                const isOpen = openIndex === i;

                return (
                  <div
                    key={i}
                    className="rounded-[3px] overflow-hidden"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenIndex(isOpen ? null : i)}
                      className="w-full flex items-start justify-between text-left bg-[#C4D0E6] px-4 sm:px-6 py-3"
                    >
                      <span
                        className="
                          text-[15px]
                          sm:text-[16px]
                          md:text-[18px]
                          font-semibold
                          text-[#061837]
                          leading-snug
                          pr-4 font-montserrat
                        "
                      >
                        {title}
                      </span>

                      <span
                        className="
                          flex-shrink-0
                          w-[32px] h-[32px]
                          sm:w-[32px] sm:h-[32px]
                          rounded-full
                          bg-[#2655C4]
                          text-white
                          flex items-center justify-center
                          text-[18px]
                        "
                      >
                        {isOpen ? "−" : "+"}
                      </span>
                    </button>

                    {isOpen && (
                      <div
                        className="
                          px-6 sm:px-6 py-6
                          text-[14px]
                          sm:text-[15px]
                          md:text-[16px]
                          text-[#061837]
                          leading-relaxed [&_a]:text-[#2655c4]  [&_a]:underline
                        "
                        style={{ backgroundColor: 'rgba(196, 208, 230, 0.50)' }}
                        dangerouslySetInnerHTML={{ __html: description }}
                      />
                    )}
                  </div>
                );
              })}
            </div>

          </div>
        </div>

      </div>
    </section>
    </>
  );
}
