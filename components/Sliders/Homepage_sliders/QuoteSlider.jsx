import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import Image from "next/image";
import { useRef, useState, useEffect } from "react";
import { pickWpImageUrl } from "../../../lib/wpImage";
import { wpRestUrl } from "../../../lib/api";

export default function QuoteSlider({ slides = [], isDark = false, prevRef: extPrevRef, nextRef: extNextRef }) {
  const internalPrevRef = useRef(null);
  const internalNextRef = useRef(null);
  const prevRef = extPrevRef || internalPrevRef;
  const nextRef = extNextRef || internalNextRef;
  const swiperRef = useRef(null);
  const [swiperReady, setSwiperReady] = useState(false);
  const [personImgMap, setPersonImgMap] = useState({});

  // client_image lives inside a group sub-field — ACF REST API returns raw integer IDs
  // for group sub-fields. Fetch the actual URL from the media endpoint.
  useEffect(() => {
    const ids = [...new Set(
      slides
        .map(s => (s.client_section || s.client || s)?.client_image)
        .filter(v => typeof v === "number" && v > 0)
    )];
    if (!ids.length) return;
    Promise.all(
      ids.map(id =>
        fetch(wpRestUrl(`wp/v2/media/${id}`))
          .then(r => {
            if (!r.ok) throw new Error(`media ${id} status ${r.status}`);
            return r.json();
          })
          .then(d => [id, d.source_url || d.url || ""])
          .catch(err => { console.warn("QuoteSlider media fetch failed:", err); return [id, ""]; })
      )
    ).then(pairs => setPersonImgMap(Object.fromEntries(pairs)));
  }, [slides]);

  useEffect(() => {
    if (swiperRef.current && prevRef.current && nextRef.current && !swiperReady) {
      const swiper = swiperRef.current;
      if (swiper.params?.navigation) {
        swiper.params.navigation.prevEl = prevRef.current;
        swiper.params.navigation.nextEl = nextRef.current;
        if (swiper.navigation?.destroy && swiper.navigation?.init) {
          swiper.navigation.destroy();
          swiper.navigation.init();
          swiper.navigation.update?.();
        }
        setSwiperReady(true);
      }
    }
  }, [swiperReady]);

  if (!slides.length) return null;

  const borderColor = isDark ? "border-[#0618374D]" : "border-[#0618374D]";
  const cardBg      = isDark ? "bg-[#efefef]"     : "bg-[#CCD8EE]";
  const leftBg      = isDark ? "bg-[#D7E5F5]"     : "bg-[#061837]";
  const textMain    = isDark ? "text-[#061837]"   : "text-white";
  const textSub     = isDark ? "text-[#9bb3cc]"   : "text-white/50";

  const resolveImg = (field) => {
    if (!field) return "";
    if (typeof field === "string") return field;
    const url = pickWpImageUrl(field, "card");
    if (url) return url;
    if (field?.url) return field.url;
    if (field?.source_url) return field.source_url;
    return "";
  };

  const showInternalNav = !extPrevRef && !extNextRef;

  return (
    <div className="w-full">

      {/* NAVIGATION – only rendered if no external refs are provided */}
      {showInternalNav && (
        <div className="flex gap-3 justify-end mb-6">
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

      <Swiper
        modules={[Navigation]}
        spaceBetween={24}
        slidesPerView={1}
        loop={slides.length > 1}
        speed={600}
        navigation={{
          prevEl: prevRef.current,
          nextEl: nextRef.current,
        }}
        onBeforeInit={(swiper) => {
          swiperRef.current = swiper;
          swiper.params.navigation.prevEl = prevRef.current;
          swiper.params.navigation.nextEl = nextRef.current;
        }}
        onInit={() => setSwiperReady(true)}
        autoHeight={false}
        className="w-full quote-swiper"
      >
        {slides.map((slide, i) => {
          // Support both: group field (any name) and flat repeater
          const client =
            slide.client_section ||
            slide.client ||
            (slide.client_image !== undefined ? slide : {});
          const rawClientImg = client.client_image;
          // Integer ID → use fetched URL from personImgMap
          // Object / string → resolve directly (handles acf_format=standard)
          const personImg = typeof rawClientImg === "number"
            ? (personImgMap[rawClientImg] || "")
            : resolveImg(rawClientImg);
          const companyImg = resolveImg(slide.company_logo ?? slide.company_Logo);
          const personAlt  = typeof rawClientImg === "object" ? rawClientImg?.alt || "" : "";
          const logoAlt    = typeof slide.company_logo === "object" ? slide.company_logo?.alt || "" : "";

          return (
            <SwiperSlide key={i} className="h-auto">
              <div className={`flex flex-col md:flex-row rounded-[3px] overflow-hidden min-h-[350px] ${cardBg}`}>

                {/* ── LEFT PANEL ── */}
                <div className={`md:w-[30%] flex flex-col justify-between p-8 md:p-10 ${leftBg}`}>
                  {/* Quote icon – top */}
                  <img
                    src="/quotes-70x70.svg"
                    alt=""
                    aria-hidden="true"
                    className="w-[130px] h-[130px] opacity-5 pointer-events-none"
                  />

                  {/* Person info */}
                  <div className="flex items-center gap-4">
                    <div className="relative w-[70px] h-[70px] rounded-full overflow-hidden flex-shrink-0 ring-1 ring-white/40">
                      <Image
                        src={personImg || "/userfallback.webp"}
                        alt={personAlt || ""}
                        fill
                        unoptimized
                        className="object-cover"
                        sizes="64px"
                        loading="lazy"
                      />
                    </div>

                    <div>
                      {client.client_name && (
                        <p className={`font-semibold text-[15px] font-montserrat ${textMain}`}>
                          {client.client_name}
                        </p>
                      )}
                      {client.position && (
                        <p className={`text-[13px] ${textSub}`}>{client.position}</p>
                      )}
                      {client.company_name && (
                        <p className="text-[15px] text-[#2555C4] font-medium">
                          {client.company_name}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* ── RIGHT PANEL ── */}
                <div className="md:w-[70%] flex flex-col justify-between gap-6 p-8 md:p-10">
                  {slide.quote && (
                    <div
                      className={`text-[16px] md:text-[18px] font-heading font-semibold leading-[1.5] text-[#061837] [&_p]:mb-0`}
                      dangerouslySetInnerHTML={{ __html: slide.quote }}
                    />
                  )}

                  <div>
                    {/* <hr className={`border-t ${isDark ? "border-[#0618374D]" : "border-[#0618374D]"} mb-6`} /> */}

                    {companyImg ? (
                      <div className="relative h-[70px] w-[120px]">
                        <Image
                          src={companyImg}
                          alt={logoAlt}
                          fill
                          unoptimized
                          className="object-contain object-left"
                          sizes="120px"
                          loading="lazy"
                        />
                      </div>
                    ) : client.company_name ? (
                      <p className={`text-[18px] font-heading font-bold tracking-wide ${textMain}`}>
                        {client.company_name.toUpperCase()}
                      </p>
                    ) : null}
                  </div>
                </div>

              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>

    <style jsx global>{`
      .quote-swiper .swiper-wrapper { align-items: stretch; }
      .quote-swiper .swiper-slide { height: auto !important; }
    `}</style>
    </div>
  );
}
