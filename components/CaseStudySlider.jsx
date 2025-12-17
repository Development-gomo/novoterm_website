"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import Link from "next/link";

export default function CaseStudySlider({ slides }) {
  return (
    <div className="w-full mt-[-50px]">

      {/* Custom Navigation Buttons */}
      <div className="flex justify-end gap-3 mb-12 pr-6">
        <button className="swiper-prev w-[40px] h-[40px] rounded-full bg-[#D8E0FA] flex items-center justify-center text-[#1B3A6F] hover:bg-[#2555C4] hover:text-white transition">
          ←
        </button>

        <button className="swiper-next w-[40px] h-[40px] rounded-full bg-[#2555C4] flex items-center justify-center text-white hover:bg-[#1B3A6F] transition">
          →
        </button>
      </div>

      <Swiper
        modules={[Navigation]}
        navigation={{
          nextEl: ".swiper-next",
          prevEl: ".swiper-prev",
        }}
        loop={true}
        slidesPerView={1}
        spaceBetween={40}
        className="case-study-swiper"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div className="w-full bg-[#071937] text-white rounded-xl overflow-hidden grid grid-cols-1 md:grid-cols-[60%_40%]">

              {/* LEFT SIDE — TEXT */}
              <div className="p-10 md:p-14 flex flex-col justify-between">
                <div>
                  <h3 className="text-[24px] font-semibold leading-8 mb-8 max-w-[550px]">
                    {slide.review_heading}
                  </h3>

                  {slide.button_text && (
                   <Link
  href={`/case-study/${slide.slug}`}
  className="btn-primary mb-8">
  {slide.button_text}
</Link>

                  )}
                </div>

                <div className="flex items-start gap-10">
                  
                  {/* TIME */}
                  <div className="w-[220px]" >
                    <h4 className="text-[32px] font-semibold text-[#6FA8FF] mb-2">
                      {slide.time_text}
                    </h4>
                    <p className="text-[16px] font-normal">{slide.subtext}</p>
                  </div>
                    
                    {/* Separator Line */}
             <div className="w-[1px] h-[90px] bg-white opacity-25 self-start"></div>

                  {/* SERVICE USED */}
                  <div className="">
                    <h5 className="text-[14px] text-[#5C83DD] font-normal tracking-wider mb-2">
                      SERVICE USED
                    </h5>
                    <p className="text-[16px] font-normal">{slide.service_used}</p>
                  </div>

                </div>
              </div>

            {/* RIGHT SIDE — IMAGE (368x368 + 16px padding) */}
{/* RIGHT SIDE — IMAGE (368x368 + 16px padding, aligned right) */}
<div className="flex items-center justify-end p-4">
  <div className="w-[368px] h-[368px] overflow-hidden rounded-lg bg-white">
    <img
      src={slide.cs_image}
      alt={slide.review_heading}
      className="w-full h-full object-cover"
    />
  </div>
</div>

            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
