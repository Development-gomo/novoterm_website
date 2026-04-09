
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import Link from "next/link";
import Image from "next/image";
import { useRef } from "react";
import { useRouter } from "next/router";
import { DEFAULT_LANG } from "../../../lib/api";

export default function BlogSlider({ slides }) {
  const router = useRouter();
  const lang = router.locale || DEFAULT_LANG;
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  if (!slides || !Array.isArray(slides) || slides.length === 0) return null;

  return (
    <div className="w-full">
      {/* NAVIGATION BUTTONS */}
      <div className="flex gap-6 justify-end mb-[40px]">
        <button
          type="button"
          ref={prevRef}
          aria-label={lang === "en" ? "Previous slides" : "Föregående bilder"}
          className="w-[48px] h-[48px] rounded-full bg-[#BBC8E1] flex items-center justify-center hover:bg-[#2655C4] transition"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="14" viewBox="0 0 16 14" fill="none">
            <path d="M0 6.85713C0 6.69011 0.10663 6.46832 0.214822 6.3607L6.30999 0.225284C6.59457 -0.0534402 7.0556 -0.085742 7.38736 0.197133C7.68397 0.450016 7.69136 0.943219 7.41707 1.21783L2.52429 6.13518H15.2381C15.6589 6.13518 16 6.45833 16 6.85698C16 7.25563 15.6589 7.57883 15.2381 7.57883H2.52429L7.41707 12.4962C7.69132 12.7707 7.67186 13.2518 7.38736 13.5168C7.08699 13.7966 6.59023 13.7717 6.30999 13.4887L0.214822 7.35328C0.0357313 7.18687 0.0030098 7.02661 0 6.85713Z" fill="currentColor"/>
          </svg>
        </button>
        <button
          type="button"
          ref={nextRef}
          aria-label={lang === "en" ? "Next slides" : "Nästa bilder"}
          className="w-[48px] h-[48px] rounded-full bg-[#2655C4] text-white flex items-center justify-center transition"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="14" viewBox="0 0 16 14" fill="none">
            <path d="M14 6.85713C14 6.69011 13.8934 6.46832 13.7852 6.3607L7.69001 0.225284C7.40543 -0.0534402 6.9444 -0.085742 6.61264 0.197133C6.31603 0.450016 6.30864 0.943219 6.58293 1.21783L11.4757 6.13518H0.761905C0.341172 6.13518 0 6.45833 0 6.85698C0 7.25563 0.341172 7.57883 0.761905 7.57883H11.4757L6.58293 12.4962C6.30868 12.7707 6.32814 13.2518 6.61264 13.5168C6.91301 13.7966 7.40977 13.7717 7.69001 13.4887L13.7852 7.35328C13.9643 7.18687 13.997 7.02661 14 6.85713Z" fill="currentColor"/>
          </svg>
        </button>
      </div>

      <Swiper
        modules={[Navigation]}
        navigation={{
          prevEl: prevRef.current,
          nextEl: nextRef.current,
        }}
        onBeforeInit={(swiper) => {
          swiper.params.navigation.prevEl = prevRef.current;
          swiper.params.navigation.nextEl = nextRef.current;
        }}
        spaceBetween={20}
        slidesPerView={1}
        breakpoints={{
          640: { slidesPerView: 2, spaceBetween: 20 },
          1024: { slidesPerView: 3, spaceBetween: 24 },
        }}
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <Link
              href={slide.url}
              className="block rounded-[3px] overflow-hidden border border-[#D1D9E6] h-full transition hover:shadow-lg"
            >
              {/* IMAGE */}
              <div className="relative h-[240px]">
                <Image
                  src={slide.image}
                  alt=""
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  quality={72}
                  loading="lazy"
                  className="object-cover object-center"
                />
                <span className="absolute bottom-4 left-4 bg-[#2655C4] text-white text-[12px] px-3 py-1 rounded uppercase font-semibold">
                  {slide.category}
                </span>
              </div>

              {/* CONTENT */}
              <div className="bg-[#081B33] text-white px-6 py-6">
                <h3 className="text-[20px] leading-[28px] text-[#E3EDFF] font-semibold mb-4 min-h-[56px]">
                  {slide.title}
                </h3>

                <p className="text-[14px] text-white/70 mb-6 line-clamp-2">
                  {slide.excerpt}
                </p>

                <div className="flex justify-between text-white text-[12px] font-light opacity-50">
                  <span>
                    {lang === "sv" && slide.date_sv ? slide.date_sv : slide.date}
                  </span>
                  <span>
                    {lang === "sv" && slide.readTime_sv ? slide.readTime_sv : slide.readTime}
                  </span>
                </div>
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
