"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import Link from "next/link";

export default function DocumentTypeSlider({ slides }) {
  return (
    <div className="relative w-full">

      {/* ---------------- NAVIGATION BUTTONS ---------------- */}
      <div className="absolute -top-26 right-0 flex gap-3 z-[50] pointer-events-auto">
        <button className="
          swiper-prev-doc 
          w-[40px] h-[40px] 
          bg-[#D8E0FA] 
          text-[#1B3A6F] 
          rounded-full 
          flex items-center justify-center 
          hover:bg-[#2555C4] hover:text-white
          transition cursor-pointer
        ">
          ←
        </button>

        <button className="
          swiper-next-doc 
          w-[40px] h-[40px] 
          bg-[#2555C4] 
          text-white 
          rounded-full 
          flex items-center justify-center 
          hover:bg-[#1C3C90]
          transition cursor-pointer
        ">
          →
        </button>
      </div>

      {/* ---------------- SWIPER SLIDER ---------------- */}
      <Swiper
        modules={[Navigation]}
        navigation={{
          nextEl: ".swiper-next-doc",
          prevEl: ".swiper-prev-doc",
        }}
        slidesPerView={4}
        spaceBetween={0}
        className="relative z-10"
      >
        {slides.map((slide, index) => {
          const isLast = index === slides.length - 1;

          return (
            <SwiperSlide key={index} className="pointer-events-none">
              <Link
                href={`/document-type/${slide.slug}`}
                className="block h-full pointer-events-auto"
              >
                <div className="relative group h-[420px] overflow-hidden">

                  {/* ================= ACTIVE LAST SLIDE ================= */}
                  {isLast ? (
                    <div className="absolute inset-0 bg-[#FEE4CA] p-8 pr-[74px] flex flex-col">

                      <h3 className="text-[22px] font-semibold text-black mb-4">
                        {slide.heading}
                      </h3>

                      <div
                        className="text-[14px] text-black leading-[1.5] max-w-[260px]"
                        dangerouslySetInnerHTML={{ __html: slide.subtext }}
                      />

                    </div>
                  ) : (
                    <>
                      {/* ---------------- Background Image + Gradients ---------------- */}
                      <div
                        className="absolute inset-0"
                        style={{
                          backgroundImage: `
                            linear-gradient(180deg, rgba(0,0,0,0.00) 66.63%, rgba(0,0,0,0.80) 100%),
                            linear-gradient(180deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.00) 100%),
                            url(${slide.cs_image})
                          `,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                        }}
                      />

                      {/* Title before hover */}
                      <h3 className="absolute top-8 left-8 text-[22px] font-semibold text-white z-20 group-hover:opacity-0 transition">
                        {slide.heading}
                      </h3>

                      {/* Hide arrow on hover */}
                      <div className="absolute bottom-8 left-8 z-20 group-hover:opacity-0 transition">
                        <div className="w-[40px] h-[40px] rounded-full border border-white flex items-center justify-center text-white">
                          →
                        </div>
                      </div>

                      {/* Hover Panel */}
                      <div
                        className="
                          absolute inset-0 opacity-0 group-hover:opacity-100 
                          bg-[#FEE4CA] 
                          transition-all z-30 flex flex-col
                          p-8 pr-[74px]
                        "
                      >
                        <h3 className="text-[22px] font-semibold text-black mb-4">
                          {slide.heading}
                        </h3>

                        <div
                          className="text-[14px] text-black leading-[1.5] max-w-[260px]"
                          dangerouslySetInnerHTML={{ __html: slide.subtext }}
                        />
                      </div>
                    </>
                  )}

                </div>
              </Link>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
}
