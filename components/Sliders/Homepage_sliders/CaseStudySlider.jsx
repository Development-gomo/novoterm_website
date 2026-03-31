
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import Link from "next/link";
import { useRef } from "react";
import { useRouter } from "next/router";
import { DEFAULT_LANG, localePath } from "../../../lib/api";

export default function CaseStudySlider({ slides }) {
  const router = useRouter();
  const lang = router.locale || DEFAULT_LANG;
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  return (
    <div className="w-full">

      {/* NAVIGATION */}
      <div className="lg:flex gap-6 justify-end mt-[-50px] mb-[40px]">
        <button
          ref={prevRef}
          className="w-[48px] h-[48px] rounded-full bg-[#BBC8E1] flex items-center justify-center hover:bg-[#2655C4] transition"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="14" viewBox="0 0 16 14" fill="none">
            <path d="M0 6.85713C0 6.69011 0.10663 6.46832 0.214822 6.3607L6.30999 0.225284C6.59457 -0.0534402 7.0556 -0.085742 7.38736 0.197133C7.68397 0.450016 7.69136 0.943219 7.41707 1.21783L2.52429 6.13518H15.2381C15.6589 6.13518 16 6.45833 16 6.85698C16 7.25563 15.6589 7.57883 15.2381 7.57883H2.52429L7.41707 12.4962C7.69132 12.7707 7.67186 13.2518 7.38736 13.5168C7.08699 13.7966 6.59023 13.7717 6.30999 13.4887L0.214822 7.35328C0.0357313 7.18687 0.0030098 7.02661 0 6.85713Z" fill="#E3EDFF"/>
          </svg>
        </button>
        <button
          ref={nextRef}
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
        loop
        slidesPerView={1}
        spaceBetween={40}
        className="case-study-swiper"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div className="w-full bg-[#071937] text-white rounded-[3px] overflow-hidden grid grid-cols-1 md:grid-cols-[60%_40%]">

              {/* LEFT */}
              <div className="p-10 md:p-12 flex flex-col justify-between">
                <div>
                  <h3 className="text-[24px] font-semibold leading-8 mb-8 max-w-[550px]">
                    {slide.review_heading}
                  </h3>

                  {slide.button_text && (
                    <Link
                      href={localePath("caseStudy", slide.slug, lang)}
                      className="btn-primary mb-8"
                    >
                      {slide.button_text}
                    </Link>
                  )}
                </div>

                <div className="flex items-start gap-10">
                  <div className="w-[220px]">
                    <h4 className="text-[14px] text-[#5C83DD] font-medium tracking-wider mb-2 uppercase">
                      {slide.time_text}
                    </h4>
                    <p className="text-[16px]">{slide.subtext}</p>
                  </div>

                  <div className="w-[1px] h-[100px] bg-white opacity-25" />

                  <div>
                    <h5 suppressHydrationWarning className="text-[14px] text-[#5C83DD] font-medium tracking-wider mb-2 uppercase">
                     {slide.service_title}
                    </h5>
                    <p className="text-[16px]">{slide.service_used}</p>
                  </div>
                </div>
              </div>

              {/* RIGHT IMAGE */}
              <div className="flex items-center justify-end p-4">
                <div className="w-[370px] h-[370px] overflow-hidden rounded-[3px] bg-white">
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
