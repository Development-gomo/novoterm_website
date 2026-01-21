"use client";

import DotIndicator from "../../ui/DotIndicator";
import { useEffect, useState } from "react";

export default function FaqSection({ index = 0 }) {
  const [faqs, setFaqs] = useState([]);
  const [openIndex, setOpenIndex] = useState(null);
  const [loading, setLoading] = useState(true);

  const STICKY_START = 120;
  const LABEL_HEIGHT = 32;
  const stickyTop = STICKY_START + index * LABEL_HEIGHT;

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const res = await fetch(
          "https://gomostaging.com/novoterm-headless/wp-json/wp/v2/faq?per_page=20",
          { cache: "no-store" }
        );
        const data = await res.json();
        setFaqs(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("FAQ fetch error:", err);
        setFaqs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFaqs();
  }, []);

  if (loading) {
    return <p className="text-[#5C6C8A]">Loading FAQs…</p>;
  }

  if (!faqs.length) {
    return <p className="text-[#5C6C8A]">No FAQs available.</p>;
  }

  return (
    <section
      className="
        w-full bg-[#EEF3FF]
        py-[40px]
        md:py-[60px]
        lg:py-[80px]
      "
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">

        {/* ================= 15 / 85 WRAPPER ================= */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">

          {/* ================= LEFT – 15% ================= */}
          <div className="w-full lg:w-[15%] relative">
            <div
              className="flex items-center gap-2 lg:mt-2"
              style={{
                position: "sticky",
                top: `${stickyTop}px`,
                zIndex: 10 + index,
              }}
            >
              <DotIndicator />
              <span className="uppercase font-montserrat font-medium text-[10px] sm:text-[11px] md:text-[12px] tracking-wider">
                FAQ &amp; Support
              </span>
            </div>
          </div>

          {/* ================= RIGHT – 85% ================= */}
          <div className="w-full lg:w-[85%]">

            {/* HEADER */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6 mb-8 md:mb-10">
              <div>
                <h2
                  className="
                    text-[24px]
                    sm:text-[28px]
                    md:text-[36px]
                    lg:text-[40px]
                    font-semibold
                    leading-tight
                    md:leading-[1.15]
                    max-w-[561px]
                    mb-4
                  "
                >
                  Answers to your queries
                </h2>

                <p className="text-[14px] sm:text-[15px] md:text-[16px] leading-[1.6] text-[#000] max-w-[640px]">
                  Quick answers to help you understand our services with confidence.
                </p>
              </div>

              <a
                href="/faqs"
                className="btn-primary self-start sm:self-auto"
              >
                View all FAQs
              </a>
            </div>

            {/* FAQ LIST */}
            <div className="space-y-4">
              {faqs.map((faq, i) => {
                const title = faq?.acf?.title;
                const description = faq?.acf?.description;
                if (!title || !description) return null;

                const isOpen = openIndex === i;

                return (
                  <div
                    key={faq.id}
                    className="bg-[#C4D0E6] rounded-[3px] px-4 sm:px-6 py-3"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenIndex(isOpen ? null : i)}
                      className="w-full flex items-start justify-between text-left"
                    >
                      <span
                        className="
                          text-[15px]
                          sm:text-[16px]
                          md:text-[18px]
                          font-medium
                          text-[#061837]
                          leading-snug
                          pr-4
                        "
                      >
                        {title}
                      </span>

                      <span
                        className="
                          flex-shrink-0
                          w-[28px] h-[28px]
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
                          mt-4
                          text-[14px]
                          sm:text-[15px]
                          md:text-[16px]
                          text-[#061837]
                          leading-relaxed
                        "
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
  );
}
