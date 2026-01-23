"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import Link from "next/link";

export default function CaseStudyCardSlider({ slides }) {
  return (
    <div className="relative w-full">

      {/* NAVIGATION */}
      <div className="flex gap-3 absolute right-0 -top-[48px] sm:-top-[90px] z-10">
        <button className="cs-prev w-[40px] h-[40px] rounded-full bg-[#D6E2FF] flex items-center justify-center text-[#1B3A6F] hover:bg-[#2555C4] hover:text-white transition">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none">
  <rect width="48" height="48" rx="24" fill="#BBC8E1"/>
  <path d="M16 23.8571C16 23.6901 16.1066 23.4683 16.2148 23.3607L22.31 17.2253C22.5946 16.9466 23.0556 16.9143 23.3874 17.1971C23.684 17.45 23.6914 17.9432 23.4171 18.2178L18.5243 23.1352H31.2381C31.6589 23.1352 32 23.4583 32 23.857C32 24.2556 31.6589 24.5788 31.2381 24.5788H18.5243L23.4171 29.4962C23.6913 29.7707 23.6719 30.2518 23.3874 30.5168C23.087 30.7966 22.5902 30.7717 22.31 30.4887L16.2148 24.3533C16.0357 24.1869 16.003 24.0266 16 23.8571Z" fill="#E3EDFF"/>
</svg>
        </button>

        <button className="cs-next w-[40px] h-[40px] rounded-full bg-[#2555C4] flex items-center justify-center text-white hover:bg-[#1B3A6F] transition">
         <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none">
  <rect width="48" height="48" rx="24" fill="#2655C4"/>
  <path d="M32 24.0002C32 23.8332 31.8934 23.6114 31.7852 23.5038L25.69 17.3684C25.4054 17.0896 24.9444 17.0573 24.6126 17.3402C24.316 17.5931 24.3086 18.0863 24.5829 18.3609L29.4757 23.2782H16.7619C16.3411 23.2782 16 23.6014 16 24C16 24.3987 16.3411 24.7219 16.7619 24.7219H29.4757L24.5829 29.6392C24.3087 29.9138 24.3281 30.3949 24.6126 30.6599C24.913 30.9397 25.4098 30.9148 25.69 30.6318L31.7852 24.4964C31.9643 24.3299 31.997 24.1697 32 24.0002Z" fill="white"/>
</svg>
        </button>
      </div>

      <Swiper
        modules={[Navigation]}
        navigation={{ prevEl: ".cs-prev", nextEl: ".cs-next" }}
        spaceBetween={16}
        slidesPerView={1}                 // ✅ MOBILE DEFAULT
        breakpoints={{
          768: { slidesPerView: 2 },      // Tablet
          1024: { slidesPerView: 3 },     // Desktop
        }}
        className="w-full"
      >
        {slides.map((slide, i) => (
          <SwiperSlide key={i}>
            <div className="h-full gap-4 rounded-[3px] overflow-hidden bg-[#061837] flex flex-col">

              {/* IMAGE */}
              <div className="h-[180px] w-full">
                <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
              </div>

              {/* CONTENT */}
              <div className="p-[24px] flex flex-col flex-1">
                <h3 className="text-white text-[24px] leading-[32px] font-semibold mb-6">
                  {slide.title}
                </h3>

                <div className="text-[12px] uppercase tracking-widest text-[#6B8FD6] mb-2">
                  Service provided
                </div>

                <div className="text-[16px] text-white/90 mb-6">
                  {slide.service_used}
                </div>

                <Link href={`/case-study/${slide.slug}`} className="btn-primary text-sm w-fit mt-auto">
                  {slide.button_text || "Read full case"}
                </Link>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
