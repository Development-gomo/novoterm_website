
import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import Image from "next/image";
import "swiper/css";
import "swiper/css/navigation";
import Link from "next/link";
import { useRouter } from "next/router";
import { DEFAULT_LANG, localePath } from "../../../lib/api";

export default function ServiceSlider({ slides = [], isDark = false }) {
  const router = useRouter();
  const lang = router.locale || DEFAULT_LANG;
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  if (!slides.length) return null;

  const cardBg    = isDark ? "bg-[#EAF1FF]"  : "bg-[#061837]";
  const cardTitle = isDark ? "text-[#061837]"   : "text-[#EAF1FF]";
  const cardText  = isDark ? "text-[#000000]": "text-white/50";

  return (
    <div className="relative w-full mt-12">

      {/* NAV BUTTONS */}
      <div className="flex gap-3 justify-end mb-[40px]">
        <button
          ref={prevRef}
          className="w-[48px] h-[48px] rounded-full bg-[#BBC8E1] flex items-center justify-center hover:bg-[#2655C4] group transition"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="23" height="15" viewBox="0 0 23 15" fill="none">
            <path className="group-hover:fill-white transition" d="M8.14526 14.1729C7.98211 14.3215 7.7207 14.3399 7.53296 14.2285L7.45679 14.1729L7.45679 14.1719L0.246826 7.5293L0.184326 7.45899C0.129799 7.38393 0.100073 7.29453 0.100341 7.2002L0.110107 7.1084C0.129634 7.01842 0.177351 6.93598 0.247802 6.8711L7.45679 0.228517C7.64346 0.0570564 7.96037 0.0578416 8.14526 0.228517C8.34077 0.409054 8.34036 0.705293 8.14526 0.885743L8.14429 0.885743L1.79272 6.73926L21.8093 6.73926C22.0724 6.73932 22.2995 6.93869 22.2996 7.2002C22.2996 7.46174 22.0725 7.66107 21.8093 7.66113L1.79175 7.66113L8.14624 13.5146C8.34135 13.6951 8.34121 13.9913 8.14624 14.1719L8.14526 14.1729Z" fill="#061837" stroke="#061837" strokeWidth="0.2"/>
          </svg>
        </button>
        <button
          ref={nextRef}
          className="w-[48px] h-[48px] rounded-full bg-[#2655C4] flex items-center justify-center hover:bg-[#1B3A6F] transition"
        >
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
        speed={600}
        spaceBetween={24}
        breakpoints={{
          0:    { slidesPerView: 1.1 },
          640:  { slidesPerView: 1.5 },
          768:  { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
        className="w-full"
      >
        {slides.map((service, i) => (
          <SwiperSlide key={i} className="h-auto">
            <Link
              href={localePath("service", service.slug, lang)}
              className={`flex flex-col rounded-[3px] overflow-hidden h-full ${cardBg} group`}
            >
              {/* FEATURED IMAGE */}
              {service.bg && (
                <div className="relative w-full h-[200px] overflow-hidden shrink-0">
                  <Image
                    src={service.bg}
                    alt={service.heading}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              )}

              {/* CONTENT */}
              <div className="flex flex-col gap-3 p-6 flex-1">
                {service.heading && (
                  <h3 className={`font-heading text-[24px] leading-[32px] font-semibold mb-1 overflow-hidden ${cardTitle}`}>
                    {service.heading}
                  </h3>
                )}
                {service.description_text && (
                  <p className={`text-[14px] sm:text-[16px] leading-[1.65] line-clamp-3 ${cardText}`} dangerouslySetInnerHTML={{ __html: service.description_text }} />
                )}
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}