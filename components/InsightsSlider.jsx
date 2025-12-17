"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { useRef } from "react";

export default function InsightsSlider({ slides }) {
  
  if (!slides || !Array.isArray(slides)) return null;

  const nextRef = useRef(null);
  const prevRef = useRef(null);

  return (
    <div className="w-full mt-10">

      {/* NAVIGATION BUTTONS */}
      <div className="flex justify-end gap-3 mb-6 pr-6">
        <button
          ref={prevRef}
          className="w-[40px] h-[40px] rounded-full bg-[#D8E0FA] flex items-center justify-center text-[#1B3A6F] hover:bg-[#2555C4] hover:text-white transition"
        >
          ←
        </button>

        <button
          ref={nextRef}
          className="w-[40px] h-[40px] rounded-full bg-[#2555C4] flex items-center justify-center text-white hover:bg-[#1B3A6F] transition"
        >
          →
        </button>
      </div>

      <Swiper
        modules={[Navigation, Autoplay]}
        spaceBetween={25}
        slidesPerView={3}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        speed={800}
        breakpoints={{
          0: { slidesPerView: 1.2 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
        onBeforeInit={(swiper) => {
          // Attach navigation AFTER refs exist
          swiper.params.navigation.prevEl = prevRef.current;
          swiper.params.navigation.nextEl = nextRef.current;
        }}
        onInit={(swiper) => {
          // Initialize navigation
          swiper.navigation.init();
          swiper.navigation.update();
        }}
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <a
              href={slide.url}
              className="block rounded-[3px] overflow-hidden border border-[#D1D9E6] h-[432px] transition"
            >
              {/* IMAGE */}
              <div
                className="relative h-[240px]"
                style={{
                  backgroundImage: `url(${slide.image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <span className="absolute bottom-4 left-4 bg-[#2555C4] text-white text-xs px-3 py-1 rounded uppercase">
                  {slide.category}
                </span>
              </div>

              {/* CONTENT */}
              <div className="bg-[#081B33] text-white px-6 py-6">
                <h3 className="text-[24px] leading-[32px] font-semibold mb-14">{slide.title}</h3>

                <div className="flex justify-between text-[14px] font-light opacity-70">
                  <span>{slide.date}</span>
                  <span>{slide.readTime}</span>
                </div>
              </div>
            </a>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
