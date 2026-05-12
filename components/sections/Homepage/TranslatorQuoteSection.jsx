import Link from "next/link";
import { useRef } from "react";
import DotIndicator from "../../ui/DotIndicator";
import QuoteSlider from "../../Sliders/Homepage_sliders/QuoteSlider";

export default function TranslatorQuoteSection({ section }) {
  const {
    section_theme = "light",
    section_label,
    heading,
    description,
    cta_text,
    cta_url,
    quote_block = [],
  } = section || {};

  const isDark    = section_theme === "dark";
  const ctaHref   = typeof cta_url === "object" ? cta_url?.url || "#" : cta_url || "#";
  const ctaTarget = typeof cta_url === "object" && cta_url?.target ? cta_url.target : "_self";

  const prevRef = useRef(null);
  const nextRef = useRef(null);

  return (
    <section
      className={`w-full py-[60px] sm:py-[80px] lg:py-[100px] ${
        isDark ? "bg-[#061837]" : "bg-[#E3EDFF]"
      }`}
    >
      <div className="web-width mx-auto px-6 md:px-0">
        <div className="flex flex-col md:flex-row">

          {/* LEFT – 15% (dot + label for sticky nav) */}
          <div className="md:w-[15%] relative">
            {section_label && (
              <div className="flex items-center gap-2 mb-6 md:mb-0 lg:hidden">
                <DotIndicator />
                <span
                  className={`uppercase font-montserrat font-medium text-[10px] tracking-wider ${
                    isDark ? "text-white" : "text-black"
                  }`}
                >
                  {section_label}
                </span>
              </div>
            )}
          </div>

          {/* RIGHT – 85% */}
          <div className="md:w-[85%]">

            {heading && (
              <h2
                className={`text-[32px] md:text-[40px] lg:text-[48px] font-heading font-semibold leading-[1.15] max-w-[600px] mb-6 ${
                  isDark ? "text-white" : "text-[#061837]"
                }`}
                dangerouslySetInnerHTML={{ __html: heading }}
              />
            )}

            {description && (
              <div className="flex items-start justify-between gap-6 mb-8">
                <div
                  suppressHydrationWarning
                  className={`text-[16px] leading-[1.7] max-w-[560px] [&_p]:mb-0 ${
                    isDark ? "text-[#cdd8e8]" : "text-[#3A3A3A]"
                  }`}
                  dangerouslySetInnerHTML={{ __html: description }}
                />
                {quote_block.length > 1 && (
                  <div className="flex gap-3 flex-shrink-0 pt-1">
                    <button
                      type="button"
                      ref={prevRef}
                      aria-label="Previous slide"
                      className="w-[48px] h-[48px] rounded-full bg-[#BBC8E1] cursor-pointer flex items-center justify-center hover:bg-[#2655C4] group transition"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="14" viewBox="0 0 16 14" fill="none">
                        <path className="group-hover:fill-white transition" d="M0 6.85713C0 6.69011 0.10663 6.46832 0.214822 6.3607L6.30999 0.225284C6.59457 -0.0534402 7.0556 -0.085742 7.38736 0.197133C7.68397 0.450016 7.69136 0.943219 7.41707 1.21783L2.52429 6.13518H15.2381C15.6589 6.13518 16 6.45833 16 6.85698C16 7.25563 15.6589 7.57883 15.2381 7.57883H2.52429L7.41707 12.4962C7.69132 12.7707 7.67186 13.2518 7.38736 13.5168C7.08699 13.7966 6.59023 13.7717 6.30999 13.4887L0.214822 7.35328C0.0357313 7.18687 0.0030098 7.02661 0 6.85713Z" fill="#E3EDFF"/>
                      </svg>
                    </button>
                    <button
                      type="button"
                      ref={nextRef}
                      aria-label="Next slide"
                      className="w-[48px] h-[48px] rounded-full bg-[#2655C4] cursor-pointer text-white flex items-center justify-center hover:bg-[#1C3C90] transition"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="14" viewBox="0 0 16 14" fill="none">
                        <path d="M14 6.85713C14 6.69011 13.8934 6.46832 13.7852 6.3607L7.69001 0.225284C7.40543 -0.0534402 6.9444 -0.085742 6.61264 0.197133C6.31603 0.450016 6.30864 0.943219 6.58293 1.21783L11.4757 6.13518H0.761905C0.341172 6.13518 0 6.45833 0 6.85698C0 7.25563 0.341172 7.57883 0.761905 7.57883H11.4757L6.58293 12.4962C6.30868 12.7707 6.32814 13.2518 6.61264 13.5168C6.91301 13.7966 7.40977 13.7717 7.69001 13.4887L13.7852 7.35328C13.9643 7.18687 13.997 7.02661 14 6.85713Z" fill="currentColor"/>
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            )}

            {cta_text && ctaHref !== "#" && (
              <div className="mb-8">
                <Link href={ctaHref} target={ctaTarget} className="btn-primary inline-block">
                  {cta_text}
                </Link>
              </div>
            )}

            {/* SLIDER */}
            {quote_block.length > 0 && (
              <div>
                <QuoteSlider slides={quote_block} isDark={isDark} prevRef={prevRef} nextRef={nextRef} />
              </div>
            )}

          </div>
        </div>
      </div>
    </section>
  );
}
