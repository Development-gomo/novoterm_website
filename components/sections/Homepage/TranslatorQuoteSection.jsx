import Link from "next/link";
import Image from "next/image";
import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import DotIndicator from "../../ui/DotIndicator";
import QuoteSlider from "../../Sliders/Homepage_sliders/QuoteSlider";
import { wpRestUrl } from "../../../lib/api";
import { pickWpImageUrl } from "../../../lib/wpImage";

export default function TranslatorQuoteSection({ section, lang: langProp, quoteSource: quoteSourceProp, optionsSlides = [] }) {
  const router = useRouter();
  // Prefer the server-side prop (from getStaticProps), fall back to router locale — same pattern as Footer
  const lang = langProp || router?.locale || "sv";

  const {
    section_theme = "light",
    section_label,
    heading,
    description,
    cta_text,
    cta_url,
    page_type = "inner",
  } = section || {};
  const quoteSource = quoteSourceProp || section?.quote_source || "translator";

  // PHP endpoint now returns language-specific slides (novoterm_switch_lang pattern, same as header/footer).
  // Use server-prefetched slides directly; fall back to a client-side fetch with ?lang= for pages
  // that don't run the prefetch (e.g. service/industry pages).
  const [slides, setSlides] = useState(optionsSlides);

  useEffect(() => {
    if (optionsSlides.length > 0) {
      setSlides(optionsSlides);
      return;
    }
    // Client-side fallback — mirrors _app.js re-fetching footer on lang change
    const endpoint = quoteSource === "customer" ? "customer-quote-block" : "translator-quote-block";
    fetch(wpRestUrl(`theme/v1/${endpoint}?lang=${lang}`))
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => setSlides(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, [lang, quoteSource, optionsSlides]); // re-run if locale changes (client-side navigation)

  const isDark    = section_theme === "dark";
  const isCustomerQuote = quoteSource === "customer";
  const isHomeLayout = page_type === "home";
  const contentWidthClass = isHomeLayout ? "w-full" : "md:w-[85%]";
  const ctaHref   = typeof cta_url === "object" ? cta_url?.url || "#" : cta_url || "#";
  const ctaTarget = typeof cta_url === "object" && cta_url?.target ? cta_url.target : "_self";

  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const customerSwiperRef = useRef(null);
  const [customerSwiperReady, setCustomerSwiperReady] = useState(false);

  useEffect(() => {
    if (!isCustomerQuote || slides.length <= 1) return;
    if (customerSwiperRef.current && prevRef.current && nextRef.current && !customerSwiperReady) {
      const swiper = customerSwiperRef.current;
      if (swiper.params?.navigation) {
        swiper.params.navigation.prevEl = prevRef.current;
        swiper.params.navigation.nextEl = nextRef.current;
        if (swiper.navigation?.destroy && swiper.navigation?.init) {
          swiper.navigation.destroy();
          swiper.navigation.init();
          swiper.navigation.update?.();
        }
        setCustomerSwiperReady(true);
      }
    }
  }, [customerSwiperReady, isCustomerQuote, slides.length]);

  const resolveImage = (field, size = "heroNext") => {
    if (!field) return "";
    if (typeof field === "string") return field;
    return pickWpImageUrl(field, size) || field?.url || field?.source_url || "";
  };

  const getClient = (slide) =>
    slide?.client_section ||
    slide?.client ||
    (slide?.client_image !== undefined ? slide : {});

  const getCustomerBackground = (slide) => {
    const client = getClient(slide);
    return (
      resolveImage(slide?.background_image, "heroNext") ||
      resolveImage(slide?.image, "heroNext") ||
      resolveImage(slide?.testimonial_image, "heroNext") ||
      resolveImage(section?.background_image, "heroNext") ||
      resolveImage(client?.client_image, "heroNext")
    );
  };

  if (isCustomerQuote) {
    if (!slides.length) return null;

    const staticBgUrl =
      resolveImage(section?.background_image, "heroNext") ||
      getCustomerBackground(slides[0]);

    return (
      <section className="relative z-[60] w-full flex items-end h-auto min-h-[520px] lg:min-h-[660px] py-6 md:py-8 lg:py-[80px] overflow-hidden bg-[#061837]">
        {staticBgUrl ? (
          <>
            <div className="absolute inset-0 z-0">
              <Image
                src={staticBgUrl}
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
        ) : (
          <div
            className="absolute inset-0 z-0"
            style={{
              background: "linear-gradient(180deg, #17315f 0%, #000000 100%)",
            }}
          />
        )}

        {slides.length > 1 && (
          <div className="absolute inset-x-0 bottom-6 lg:bottom-[80px] z-20 pointer-events-none">
            <div className="web-width mx-auto px-6 md:px-0 flex justify-end gap-3 pointer-events-auto">
              <button
                type="button"
                ref={prevRef}
                aria-label={lang === "en" ? "Previous slide" : "Föregående"}
                className="w-[48px] h-[48px] rounded-full bg-[#BBC8E1] cursor-pointer flex items-center justify-center hover:bg-[#2655C4] group transition"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="14" viewBox="0 0 16 14" fill="none">
                  <path className="group-hover:fill-white transition" d="M0 6.85713C0 6.69011 0.10663 6.46832 0.214822 6.3607L6.30999 0.225284C6.59457 -0.0534402 7.0556 -0.085742 7.38736 0.197133C7.68397 0.450016 7.69136 0.943219 7.41707 1.21783L2.52429 6.13518H15.2381C15.6589 6.13518 16 6.45833 16 6.85698C16 7.25563 15.6589 7.57883 15.2381 7.57883H2.52429L7.41707 12.4962C7.69132 12.7707 7.67186 13.2518 7.38736 13.5168C7.08699 13.7966 6.59023 13.7717 6.30999 13.4887L0.214822 7.35328C0.0357313 7.18687 0.0030098 7.02661 0 6.85713Z" fill="#E3EDFF"/>
                </svg>
              </button>

              <button
                type="button"
                ref={nextRef}
                aria-label={lang === "en" ? "Next slide" : "Nästa"}
                className="w-[48px] h-[48px] rounded-full bg-[#2655C4] cursor-pointer text-white flex items-center justify-center hover:bg-[#1C3C90] transition"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="14" viewBox="0 0 16 14" fill="none">
                  <path d="M14 6.85713C14 6.69011 13.8934 6.46832 13.7852 6.3607L7.69001 0.225284C7.40543 -0.0534402 6.9444 -0.085742 6.61264 0.197133C6.31603 0.450016 6.30864 0.943219 6.58293 1.21783L11.4757 6.13518H0.761905C0.341172 6.13518 0 6.45833 0 6.85698C0 7.25563 0.341172 7.57883 0.761905 7.57883H11.4757L6.58293 12.4962C6.30868 12.7707 6.32814 13.2518 6.61264 13.5168C6.91301 13.7966 7.40977 13.7717 7.69001 13.4887L13.7852 7.35328C13.9643 7.18687 13.997 7.02661 14 6.85713Z" fill="currentColor"/>
                </svg>
              </button>
            </div>
          </div>
        )}

        <div className="relative z-10 web-width mx-auto w-full px-6 md:px-0">
          <Swiper
            modules={[Navigation]}
            slidesPerView={1}
            loop={slides.length > 1}
            speed={600}
            navigation={{
              prevEl: prevRef.current,
              nextEl: nextRef.current,
            }}
            onBeforeInit={(swiper) => {
              customerSwiperRef.current = swiper;
              swiper.params.navigation.prevEl = prevRef.current;
              swiper.params.navigation.nextEl = nextRef.current;
            }}
            onInit={() => setCustomerSwiperReady(true)}
            className="w-full customer-quote-fullwidth-swiper"
          >
            {slides.map((slide, i) => {
              const client = getClient(slide);
              const authorName = client?.client_name || slide?.client_name || "";
              const authorTitle = client?.position || slide?.position || "";
              const authorCompany = client?.company_name || slide?.company_name || "";

              return (
                <SwiperSlide key={i} className="!h-auto">
                  <div>
                    {section_label && (
                      <div className="flex items-center gap-2 mb-[64px] sm:mb-[120px] lg:mb-0">
                        <span className="w-2 h-2 rounded-full bg-[#2655C4] lg:hidden" />
                        <span className="uppercase font-montserrat font-medium text-[10px] sm:text-[12px] tracking-widest text-white lg:hidden">
                          {section_label}
                        </span>
                      </div>
                    )}

                    {slide?.quote && (
                      <div
                        className="text-white font-heading max-w-full lg:max-w-[1280px] text-[20px] sm:text-[24px] md:text-[26px] lg:text-[28px] font-medium leading-[1.5] mb-[20px] sm:mb-[24px] [&_em]:italic [&_em]:font-bold [&_em]:text-[#5C83DD] [&_p]:mb-0"
                        dangerouslySetInnerHTML={{ __html: slide.quote }}
                      />
                    )}

                    {(authorName || authorTitle || authorCompany) && (
                      <div className="text-white text-[12px] sm:text-[14px] uppercase font-heading font-medium tracking-widest pr-[120px]">
                        {authorName}
                        {authorTitle && ` | ${authorTitle}`}
                        {authorCompany && `, ${authorCompany}`}
                      </div>
                    )}
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
          <style jsx global>{`
            .customer-quote-fullwidth-swiper {
              overflow: hidden;
            }
            .customer-quote-fullwidth-swiper .swiper-wrapper {
              align-items: flex-end;
            }
          `}</style>
        </div>
      </section>
    );
  }

  return (
    <section
      className={`w-full py-[60px] sm:py-[80px] lg:py-[100px] ${
        isDark ? "bg-[#061837]" : "bg-[#E3EDFF]"
      }`}
    >
      <div className="web-width mx-auto px-6 md:px-0">
        <div className="flex flex-col md:flex-row">

          {/* LEFT – 15% (dot + label for sticky nav) */}
          {!isHomeLayout && <div className="md:w-[15%] relative">
            {section_label && (
              <div className="flex items-center gap-2 mb-6 md:mb-0 lg:hidden">
                <DotIndicator />
                <span
                  className={`uppercase font-montserrat font-medium text-[12px] tracking-wider ${
                    isDark ? "text-white" : "text-black"
                  }`}
                >
                  {section_label}
                </span>
              </div>
            )}
          </div>}

          {/* RIGHT – 85% */}
          <div className={contentWidthClass}>
            {isHomeLayout && section_label && (
              <div className="flex items-center gap-2 mb-6">
                <DotIndicator />
                <span
                  className={`uppercase font-montserrat font-medium text-[12px] tracking-wider ${
                    isDark ? "text-white" : "text-black"
                  }`}
                >
                  {section_label}
                </span>
              </div>
            )}

            {heading && (
              <h2
                className={`text-[32px] md:text-[40px] font-heading font-semibold leading-[1.15] max-w-[600px] mb-6 ${
                  isDark ? "text-white" : "text-[#061837]"
                }`}
                dangerouslySetInnerHTML={{ __html: heading }}
              />
            )}

            {description && (
              <div
                suppressHydrationWarning
                className={`text-[16px] leading-[1.7] max-w-[560px] mb-8 [&_p]:mb-0 ${
                  isDark ? "text-[#cdd8e8]" : "text-[#3A3A3A]"
                }`}
                dangerouslySetInnerHTML={{ __html: description }}
              />
            )}

            {cta_text && ctaHref !== "#" && (
              <div className="mb-8">
                <Link href={ctaHref} target={ctaTarget} className="btn-primary inline-block">
                  {cta_text}
                </Link>
              </div>
            )}

            {/* SLIDER */}
            {slides.length > 0 && (
              <div className="relative w-full mt-25 md:mt-0 lg:mt-0">
                {slides.length > 1 && (
                  <div
                    className="absolute
                      top-[-80px]
                      right-0
                      sm:top-6
                      sm:right-6
                      md:-top-25
                      md:right-0
                      flex
                      gap-3
                      z-[50]
                      pointer-events-auto"
                  >
                    <button
                      type="button"
                      ref={prevRef}
                      aria-label={lang === "en" ? "Previous slide" : "Föregående"}
                      className="w-[48px] h-[48px] rounded-full bg-[#BBC8E1] cursor-pointer flex items-center justify-center hover:bg-[#2655C4] group transition"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="14" viewBox="0 0 16 14" fill="none">
                        <path className="group-hover:fill-white transition" d="M0 6.85713C0 6.69011 0.10663 6.46832 0.214822 6.3607L6.30999 0.225284C6.59457 -0.0534402 7.0556 -0.085742 7.38736 0.197133C7.68397 0.450016 7.69136 0.943219 7.41707 1.21783L2.52429 6.13518H15.2381C15.6589 6.13518 16 6.45833 16 6.85698C16 7.25563 15.6589 7.57883 15.2381 7.57883H2.52429L7.41707 12.4962C7.69132 12.7707 7.67186 13.2518 7.38736 13.5168C7.08699 13.7966 6.59023 13.7717 6.30999 13.4887L0.214822 7.35328C0.0357313 7.18687 0.0030098 7.02661 0 6.85713Z" fill="#E3EDFF"/>
                      </svg>
                    </button>

                    <button
                      type="button"
                      ref={nextRef}
                      aria-label={lang === "en" ? "Next slide" : "Nästa"}
                      className="w-[48px] h-[48px] rounded-full bg-[#2655C4] cursor-pointer text-white flex items-center justify-center hover:bg-[#1C3C90] transition"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="14" viewBox="0 0 16 14" fill="none">
                        <path d="M14 6.85713C14 6.69011 13.8934 6.46832 13.7852 6.3607L7.69001 0.225284C7.40543 -0.0534402 6.9444 -0.085742 6.61264 0.197133C6.31603 0.450016 6.30864 0.943219 6.58293 1.21783L11.4757 6.13518H0.761905C0.341172 6.13518 0 6.45833 0 6.85698C0 7.25563 0.341172 7.57883 0.761905 7.57883H11.4757L6.58293 12.4962C6.30868 12.7707 6.32814 13.2518 6.61264 13.5168C6.91301 13.7966 7.40977 13.7717 7.69001 13.4887L13.7852 7.35328C13.9643 7.18687 13.997 7.02661 14 6.85713Z" fill="currentColor"/>
                      </svg>
                    </button>
                  </div>
                )}
                <QuoteSlider slides={slides} isDark={isDark} prevRef={prevRef} nextRef={nextRef} />
              </div>
            )}

          </div>
        </div>
      </div>
    </section>
  );
}
