"use client";

import { useEffect, useState } from "react";

export default function FaqSection() {
  const [faqs, setFaqs] = useState([]);
  const [openIndex, setOpenIndex] = useState(null);
  const [loading, setLoading] = useState(true);

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
    <section className="w-full bg-[#EEF3FF] py-[80px]">
      <div className="max-w-[1400px] mx-auto px-6">

        {/* ================= 15 / 85 WRAPPER ================= */}
        <div className="flex gap-12">

          {/* ================= LEFT – 15% ================= */}
          <div className="w-[15%]">
            <div className="flex items-center gap-2 mt-2">
              <span className="w-2 h-2 rounded-full bg-[#2E6CF6]" />
              <span className="uppercase text-[12px] tracking-widest text-[#2E6CF6]">
                FAQ & Support
              </span>
            </div>
          </div>

          {/* ================= RIGHT – 85% ================= */}
          <div className="w-[85%]">

            {/* HEADER */}
            <div className="flex items-start justify-between mb-10">
              <div>
                <h2 className="text-[42px] font-semibold text-[#061837] mb-3">
                  Answers to your queries
                </h2>

                <p className="text-[15px] text-[#5C6C8A] max-w-[520px]">
                  Quick answers to help you understand our services with confidence.
                </p>
              </div>

              <a
                href="/faqs"
                className="bg-[#2E6CF6] text-white px-6 py-3 rounded-[6px] text-[14px] font-medium"
              >
                View all FAQs
              </a>
            </div>

            {/* FAQ LIST */}
            <div className="space-y-4">
              {faqs.map((faq, index) => {
                const title = faq?.acf?.title;
                const description = faq?.acf?.description;
                if (!title || !description) return null;

                const isOpen = openIndex === index;

                return (
                  <div
                    key={faq.id}
                    className="bg-[#DDE7F6] rounded-[10px] px-6 py-5"
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setOpenIndex(isOpen ? null : index)
                      }
                      className="w-full flex items-center justify-between text-left cursor-pointer"
                    >
                      <span className="text-[15px] font-medium text-[#061837] pr-6">
                        {title}
                      </span>

                      <span className="flex w-[28px] h-[28px] rounded-full bg-[#2E6CF6] text-white items-center justify-center text-[18px]">
                        {isOpen ? "−" : "+"}
                      </span>
                    </button>

                    {isOpen && (
                      <div
                        className="mt-4 text-[14px] text-[#061837] leading-relaxed"
                        dangerouslySetInnerHTML={{
                          __html: description,
                        }}
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
