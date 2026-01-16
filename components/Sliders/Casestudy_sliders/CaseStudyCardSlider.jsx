"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import Link from "next/link";

export default function CaseStudyCardSlider({ slides }) {
  return (
    <div className="relative">

      {/* NAVIGATION */}
      <div className="flex gap-2 absolute right-0 -top-[56px] z-10">
        <button className="cs-prev w-[36px] h-[36px] rounded-full bg-[#D6E2FF] text-[#1B3A6F] flex items-center justify-center hover:bg-[#2555C4] hover:text-white transition">
          ←
        </button>
        <button className="cs-next w-[36px] h-[36px] rounded-full bg-[#2555C4] text-white flex items-center justify-center hover:bg-[#1B3A6F] transition">
          →
        </button>
      </div>

      <Swiper
        modules={[Navigation]}
        navigation={{ prevEl: ".cs-prev", nextEl: ".cs-next" }}
        spaceBetween={24}
        slidesPerView={3}
        className="w-full"
      >
        {slides.map((slide, i) => (
          <SwiperSlide key={i}>
            <div className="h-full rounded-[3px] overflow-hidden bg-[#061837] flex flex-col">

              {/* IMAGE */}
              <div className="h-[180px] w-full">
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* CONTENT */}
              <div className="p-[24px] flex flex-col flex-1">

                {/* TITLE */}
                <h3 className="text-white text-[24px] leading-[32px] font-semibold mb-6">
                  {slide.title}
                </h3>

                {/* SERVICE PROVIDED */}
                <div className="text-[12px] uppercase tracking-widest text-[#6B8FD6] mb-2">
                  Service provided
                </div>

                <div className="text-[16px] text-white/90 mb-6">
                  {slide.service_used}
                </div>

                {/* CTA */}
                <Link
                  href={`/case-study/${slide.slug}`}
                  className="btn-primary text-sm w-fit mt-auto"
                >
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
