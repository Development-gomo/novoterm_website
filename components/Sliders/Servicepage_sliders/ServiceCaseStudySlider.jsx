
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import Link from "next/link";
import Image from "next/image";
import { useRef } from "react";
import { useRouter } from "next/router";
import { DEFAULT_LANG, localePath } from "../../../lib/api";

export default function ServiceCaseStudySlider({ slides }) {
  const router = useRouter();
  const lang = router.locale || DEFAULT_LANG;
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  return (
    <div className="relative w-full mt-10 sm:mt-0">

      {/* Custom Navigation Buttons */}
      <div className="flex gap-3 absolute right-0 top-[-24] lg:top-[-54px] z-10 pointer-events-auto">
        <button ref={prevRef} className="w-[48px] h-[48px] rounded-full bg-[#BBC8E1] flex items-center justify-center text-[#1B3A6F] hover:bg-[#2655c4] cursor-pointer hover:text-white transition">
         <svg xmlns="http://www.w3.org/2000/svg" width="23" height="15" viewBox="0 0 23 15" fill="none">
  <path d="M8.14526 14.1729C7.98211 14.3215 7.7207 14.3399 7.53296 14.2285L7.45679 14.1729L7.45679 14.1719L0.246826 7.5293L0.184326 7.45899C0.129799 7.38393 0.100073 7.29453 0.100341 7.2002L0.110107 7.1084C0.129634 7.01842 0.177351 6.93598 0.247802 6.8711L7.45679 0.228517C7.64346 0.0570564 7.96037 0.0578416 8.14526 0.228517C8.34077 0.409054 8.34036 0.705293 8.14526 0.885743L8.14429 0.885743L1.79272 6.73926L21.8093 6.73926C22.0724 6.73932 22.2995 6.93869 22.2996 7.2002C22.2996 7.46174 22.0725 7.66107 21.8093 7.66113L1.79175 7.66113L8.14624 13.5146C8.34135 13.6951 8.34121 13.9913 8.14624 14.1719L8.14526 14.1729Z" fill="#E3EDFF" stroke="#E3EDFF" strokeWidth="0.2"/>
</svg>
        </button>

        <button ref={nextRef} className="w-[48px] h-[48px] rounded-full cursor-pointer bg-[#2655c4] flex items-center justify-center text-white hover:bg-[#1B3A6F] transition">
          <svg xmlns="http://www.w3.org/2000/svg" width="23" height="15" viewBox="0 0 23 15" fill="none">
  <path d="M14.2546 0.227539C14.4178 0.0788897 14.6792 0.060445 14.8669 0.171875L14.9431 0.227539V0.228516L22.1531 6.87109L22.2156 6.94141C22.2701 7.01646 22.2998 7.10586 22.2996 7.2002L22.2898 7.29199C22.2703 7.38197 22.2226 7.46442 22.1521 7.5293L14.9431 14.1719C14.7564 14.3433 14.4395 14.3426 14.2546 14.1719C14.0591 13.9913 14.0595 13.6951 14.2546 13.5146H14.2556L20.6072 7.66113H0.590576C0.327467 7.66107 0.100389 7.4617 0.100342 7.2002C0.100342 6.93865 0.327439 6.73932 0.590576 6.73926H20.6082L14.2537 0.885742C14.0586 0.705249 14.0587 0.409081 14.2537 0.228516L14.2546 0.227539Z" fill="white" stroke="white" strokeWidth="0.2"/>
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
            <div className="w-full mt-12 bg-[#071937] text-white rounded-[3px] overflow-hidden grid grid-cols-1 md:grid-cols-[60%_40%] max-w-full sm:max-w-full">

              {/* LEFT SIDE — TEXT */}
              <div className="p-10 md:p-12 flex flex-col justify-between">
                <div>
                  <h3 className="text-[24px] font-semibold leading-8 mb-8 max-w-[550px] line-clamp-2" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {slide.review_heading}
                  </h3>

                  {slide.button_text && (
                   <Link
  href={localePath("caseStudy", slide.slug, lang)}
  className="btn-primary mb-8">
  {slide.button_text}
</Link>

                  )}
                </div>

                <div className="flex flex-col md:flex-row items-start gap-6 md:gap-10">
                  {/* TIME */}
                  <div className="w-full md:w-[220px]">
                    <h4 className="text-[32px] font-semibold text-[#5c83dd] mb-2">
                      {slide.time_text}
                    </h4>
                    <p className="text-[16px] font-normal">{slide.subtext}</p>
                  </div>

                  {/* Separator Line (hidden on mobile) */}
                  <div className="hidden md:block w-[1px] h-[90px] bg-white opacity-25 self-start"></div>

                  {/* SERVICE USED */}
                  <div className="w-full md:w-auto">
                    <h5 className="text-[14px] text-[#5C83DD] font-normal tracking-wider mb-2">
                      {lang === 'sv' ? 'Tjänst' : 'Service used'}
                    </h5>
                    <p className="text-[16px] font-normal">{slide.service_used}</p>
                  </div>

                </div>
              </div>

            {/* RIGHT SIDE — IMAGE */}
            <div className="flex items-center justify-end p-4">
              <div className="relative w-[370px] h-[370px] overflow-hidden rounded-[3px] bg-white">
                <Image
                  src={slide.cs_image}
                  alt={slide.review_heading || ""}
                  fill
                  sizes="370px"
                  className="object-cover"
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
