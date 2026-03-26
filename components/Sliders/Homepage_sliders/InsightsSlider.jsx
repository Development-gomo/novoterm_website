

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { useRef, useEffect, useState } from "react";

export default function InsightsSlider({ slides, lang = "sv" }) {
  if (!slides || !Array.isArray(slides)) return null;

  const nextRef = useRef(null);
  const prevRef = useRef(null);
  const [swiperInstance, setSwiperInstance] = useState(null);

  useEffect(() => {
    if (swiperInstance && nextRef.current && prevRef.current) {
      swiperInstance.params.navigation.prevEl = prevRef.current;
      swiperInstance.params.navigation.nextEl = nextRef.current;
      swiperInstance.navigation.destroy();
      swiperInstance.navigation.init();
      swiperInstance.navigation.update();
    }
  }, [swiperInstance]);

  return (
    <div className="relative w-full mt-25 lg:mt-12 min-h-[420px]">
      <Swiper
        modules={[Navigation, Autoplay]}
        spaceBetween={10}
        slidesPerView={3}
        loop={true}
        loopFillGroupWithBlank={true}
        autoplay={false}
        speed={800}
        breakpoints={{
          0: { slidesPerView: 1.2 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
        navigation={false}
        wrapperProps={{ style: { alignItems: 'stretch' } }}
        style={{ alignItems: 'stretch' }}
        onSwiper={setSwiperInstance}
        className="w-full"
      >
        {slides.map((slide, index) => {
          // Localize date
          let dateLocale = lang === "en" ? "en-US" : "sv-SE";
          let formattedDate = "";
          try {
            formattedDate = new Date(slide.date).toLocaleDateString(dateLocale, {
              month: "long",
              day: "numeric",
              year: "numeric",
            });
          } catch {
            formattedDate = slide.date;
          }
          // Localize read time
          let readTimeLabel = lang === "en" ? "MIN READ" : "MIN LÄSNING";
          let formattedReadTime = slide.readTime;
          if (slide.readTime && /\d+/.test(slide.readTime)) {
            let mins = slide.readTime.match(/\d+/)[0];
            formattedReadTime = `${mins} ${readTimeLabel}`;
          }
          return (
            <SwiperSlide key={index} className="flex h-full min-h-full">
              <a
                href={slide.url}
                className="block rounded-[3px] overflow-hidden border border-[#D1D9E6] flex flex-col h-full min-h-full transition"
                style={{ minHeight: 462, height: '100%' }}
              >
                {/* IMAGE */}
                <div
                  className="relative h-[240px] flex-shrink-0"
                  style={{
                    backgroundImage: `url(${slide.image})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  <span className="absolute bottom-4 left-4 bg-[#2655c4] text-white font-montserrat text-xs px-3 py-1 rounded-[4px] uppercase">
                    {slide.category}
                  </span>
                </div>

                {/* CONTENT */}
                <div className="bg-[#081B33] text-white px-6 py-6 flex flex-col flex-1 justify-between min-h-0">
                  <h3
                    className="text-[24px] leading-[32px] text-[#E3EDFF] font-semibold mb-10 overflow-hidden"
                    style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
                  >
                    {slide.title}
                  </h3>
                  <div className="flex justify-between text-white/50 text-[14px] font-normal mt-auto">
                    <span>{formattedDate}</span>
                    <span>{formattedReadTime}</span>
                  </div>
                </div>
              </a>
            </SwiperSlide>
          );
        })}
      </Swiper>
      {/* NAVIGATION BUTTONS INSIDE CONTAINER */}
      <div className="flex gap-3 absolute right-0 top-[-80px] lg:top-[-102px] z-10 pointer-events-auto">
        <button ref={prevRef} className="swiper-prev w-[48px] h-[48px] rounded-full bg-[#BBC8E1] flex items-center justify-center text-[#1B3A6F] hover:bg-[#2655c4] cursor-pointer hover:text-white transition">
          <svg xmlns="http://www.w3.org/2000/svg" width="23" height="15" viewBox="0 0 23 15" fill="none">
            <path d="M8.14526 14.1729C7.98211 14.3215 7.7207 14.3399 7.53296 14.2285L7.45679 14.1729L7.45679 14.1719L0.246826 7.5293L0.184326 7.45899C0.129799 7.38393 0.100073 7.29453 0.100341 7.2002L0.110107 7.1084C0.129634 7.01842 0.177351 6.93598 0.247802 6.8711L7.45679 0.228517C7.64346 0.0570564 7.96037 0.0578416 8.14526 0.228517C8.34077 0.409054 8.34036 0.705293 8.14526 0.885743L8.14429 0.885743L1.79272 6.73926L21.8093 6.73926C22.0724 6.73932 22.2995 6.93869 22.2996 7.2002C22.2996 7.46174 22.0725 7.66107 21.8093 7.66113L1.79175 7.66113L8.14624 13.5146C8.34135 13.6951 8.34121 13.9913 8.14624 14.1719L8.14526 14.1729Z" fill="#E3EDFF" stroke="#E3EDFF" stroke-width="0.2"/>
          </svg>
        </button>
        <button ref={nextRef} className="swiper-next w-[48px] h-[48px] rounded-full cursor-pointer bg-[#2655c4] flex items-center justify-center text-white hover:bg-[#1B3A6F] transition">
          <svg xmlns="http://www.w3.org/2000/svg" width="23" height="15" viewBox="0 0 23 15" fill="none">
            <path d="M14.2546 0.227539C14.4178 0.0788897 14.6792 0.060445 14.8669 0.171875L14.9431 0.227539V0.228516L22.1531 6.87109L22.2156 6.94141C22.2701 7.01646 22.2998 7.10586 22.2996 7.2002L22.2898 7.29199C22.2703 7.38197 22.2226 7.46442 22.1521 7.5293L14.9431 14.1719C14.7564 14.3433 14.4395 14.3426 14.2546 14.1719C14.0591 13.9913 14.0595 13.6951 14.2546 13.5146H14.2556L20.6072 7.66113H0.590576C0.327467 7.66107 0.100389 7.4617 0.100342 7.2002C0.100342 6.93865 0.327439 6.73932 0.590576 6.73926H20.6082L14.2537 0.885742C14.0586 0.705249 14.0587 0.409081 14.2537 0.228516L14.2546 0.227539Z" fill="white" stroke="white" stroke-width="0.2"/>
          </svg>
        </button>
      </div>
    </div>
  );
}
