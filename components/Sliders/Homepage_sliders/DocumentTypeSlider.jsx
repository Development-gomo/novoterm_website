
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import Link from "next/link";
import Image from "next/image";
import { useRef } from "react";
import { useRouter } from "next/router";
import { DEFAULT_LANG, wpToPath } from "../../../lib/api";
import { pickWpImageUrl } from "../../../lib/wpImage";

const CARD_SIZES =
  "(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw";

export default function DocumentTypeSlider({ slides, desktopSlides = 4 }) {
  const router = useRouter();
  const lang = router.locale || DEFAULT_LANG;
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  return (
    <div className="relative w-full mt-25 md:mt-0 lg:mt-0">

      {/* ---------------- NAVIGATION BUTTONS --------------- */}
      <div className="absolute
              top-[-80px]
              right-0
              sm:top-6
              sm:right-6
              md:-top-25
              md:right-0
              flex
              gap-3
              z-[50]
              pointer-events-auto
              ">
        <button
          type="button"
          ref={prevRef}
          aria-label={lang === "en" ? "Previous slides" : "Föregående bilder"}
          className="
          w-[48px] h-[48px] 
          bg-[#BBC8E1] 
          text-[#1B3A6F] 
          rounded-full 
          flex items-center justify-center 
          hover:bg-[#2655c4] hover:text-white
          transition cursor-pointer
        ">
         <svg xmlns="http://www.w3.org/2000/svg" width="23" height="15" viewBox="0 0 23 15" fill="none">
  <path d="M8.14526 14.1726C7.98211 14.3213 7.7207 14.3397 7.53296 14.2283L7.45679 14.1726L7.45679 14.1716L0.246826 7.52905L0.184326 7.45874C0.129799 7.38368 0.100073 7.29429 0.100341 7.19995L0.110107 7.10816C0.129634 7.01818 0.177351 6.93573 0.247802 6.87085L7.45679 0.228273C7.64346 0.0568123 7.96037 0.0575975 8.14526 0.228273C8.34077 0.408809 8.34036 0.705049 8.14526 0.885499L8.14429 0.885499L1.79272 6.73902L21.8093 6.73901C22.0724 6.73908 22.2995 6.93845 22.2996 7.19995C22.2996 7.46149 22.0725 7.66082 21.8093 7.66089L1.79175 7.66089L8.14624 13.5144C8.34135 13.6949 8.34121 13.9911 8.14624 14.1716L8.14526 14.1726Z" fill="#E3EDFF" stroke="#E3EDFF" stroke-width="0.2"/>
</svg>
        </button>

        <button
          type="button"
          ref={nextRef}
          aria-label={lang === "en" ? "Next slides" : "Nästa bilder"}
          className="
          w-[48px] h-[48px] 
          bg-[#2655c4] 
          text-white 
          rounded-full 
          flex items-center justify-center 
          hover:bg-[#1C3C90]
          transition cursor-pointer
        ">
          <svg xmlns="http://www.w3.org/2000/svg" width="23" height="15" viewBox="0 0 23 15" fill="none">
  <path d="M14.2546 0.227295C14.4178 0.0786455 14.6792 0.0602009 14.8669 0.171631L14.9431 0.227295V0.228271L22.1531 6.87085L22.2156 6.94116C22.2701 7.01622 22.2998 7.10562 22.2996 7.19995L22.2898 7.29175C22.2703 7.38172 22.2226 7.46417 22.1521 7.52905L14.9431 14.1716C14.7564 14.3431 14.4395 14.3423 14.2546 14.1716C14.0591 13.9911 14.0595 13.6949 14.2546 13.5144H14.2556L20.6072 7.66089H0.590576C0.327467 7.66082 0.100389 7.46145 0.100342 7.19995C0.100342 6.93841 0.327439 6.73908 0.590576 6.73901H20.6082L14.2537 0.885498C14.0586 0.705005 14.0587 0.408837 14.2537 0.228271L14.2546 0.227295Z" fill="white" stroke="white" stroke-width="0.2"/>
</svg>
        </button>
      </div>

      {/* ---------------- SWIPER SLIDER ---------------- */}
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
          watchOverflow={false}   // ✅ keeps arrows visible
          slidesPerView={1}       // default (mobile)
          spaceBetween={0}
          breakpoints={{
            0: {
              slidesPerView: 1,
            },
            768: {
              slidesPerView: 2,
            },
            1024: {
              slidesPerView: desktopSlides,
            },
          }}
          className="relative z-10"
        > 

        {slides.map((slide, index) => {
          const isLast = slide.last_block === true;
          // Always use button_url from ACF (already mapped in parent sections)
          const acfButtonUrl = typeof slide.button_url === 'object' ? slide.button_url?.url : slide.button_url;
          return (
            <SwiperSlide key={index} className="pointer-events-none">
              <Link
                href={acfButtonUrl ? wpToPath(acfButtonUrl) : "#"}
                className="block h-full pointer-events-auto"
              >
                <div className="relative group h-[400px] overflow-hidden">

                  {/* ================= ACTIVE LAST SLIDE ================= */}
                  {isLast ? (
                    <div className="absolute inset-0 bg-[#FEE4CA] p-[32px] pr-[35px] flex flex-col">
                      <h3 className="text-[24px] font-semibold text-black mb-4">
                        {slide.heading}
                      </h3>
                      <div className="text-[16px] text-black leading-[1.5] max-w-[260px]"
                        dangerouslySetInnerHTML={{ __html: slide.subtext }}
                      />
                      {/* Black arrow for last slide */}
                      <div className="absolute bottom-8 left-8 z-20">
                        <div className="w-[48px] h-[48px] rounded-full border border-black flex items-center justify-center text-black">
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="13" viewBox="0 0 20 13" fill="none">
                            <path d="M12.3289 0.212646C12.495 0.0621656 12.7749 0.0622819 12.9412 0.212646L12.9421 0.213623L19.1687 5.90698C19.2522 5.98312 19.2999 6.08763 19.2996 6.19995L19.2908 6.28198C19.2732 6.36214 19.2306 6.43549 19.1677 6.49292L12.9421 12.1863C12.7758 12.3383 12.4938 12.3374 12.3289 12.1863C12.1539 12.0257 12.1548 11.7616 12.3298 11.6013L17.7878 6.60913H0.537842C0.304801 6.60913 0.100382 6.43374 0.100342 6.19995C0.100342 5.96613 0.304777 5.79077 0.537842 5.79077H17.7878L12.3289 0.797607C12.1541 0.637137 12.1541 0.374072 12.3289 0.213623V0.212646Z" fill="black" stroke="black" stroke-width="0.2"/>
                          </svg>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>
                      {(() => {
                        const imgSrc = pickWpImageUrl(slide.cs_image, "card");
                        return imgSrc ? (
                          <>
                            <div className="absolute inset-0 z-0">
                              <Image
                                src={imgSrc}
                                alt={slide.heading || ""}
                                fill
                                sizes={CARD_SIZES}
                                quality={72}
                                loading={index < 2 ? "eager" : "lazy"}
                                className="object-cover object-center"
                              />
                            </div>
                            <div
                              className="absolute inset-0 z-[1] pointer-events-none"
                              style={{
                                backgroundImage: `
                            linear-gradient(180deg, rgba(0,0,0,0.00) 66.63%, rgba(0,0,0,0.80) 100%),
                            linear-gradient(180deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.00) 100%)`,
                                backgroundSize: "cover",
                              }}
                            />
                          </>
                        ) : null;
                      })()}

                      {/* Title before hover */}
                      <h3 className="absolute top-8 left-8 text-[24px] font-semibold text-white z-20 group-hover:opacity-0 transition">
                        {slide.heading}
                      </h3>

                      {/* Hide arrow on hover */}
                      <div className="absolute bottom-8 left-8 z-20 group-hover:opacity-0 transition">
                        <div className="w-[48px] h-[48px] rounded-full border border-white flex items-center justify-center text-white">
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="13" viewBox="0 0 20 13" fill="none">
  <path d="M12.3289 0.212646C12.495 0.0621656 12.7749 0.0622819 12.9412 0.212646L12.9421 0.213623L19.1687 5.90698C19.2522 5.98312 19.2999 6.08763 19.2996 6.19995L19.2908 6.28198C19.2732 6.36214 19.2306 6.43549 19.1677 6.49292L12.9421 12.1863C12.7758 12.3383 12.4938 12.3374 12.3289 12.1863C12.1539 12.0257 12.1548 11.7616 12.3298 11.6013L17.7878 6.60913H0.537842C0.304801 6.60913 0.100382 6.43374 0.100342 6.19995C0.100342 5.96613 0.304777 5.79077 0.537842 5.79077H17.7878L12.3289 0.797607C12.1541 0.637137 12.1541 0.374072 12.3289 0.213623V0.212646Z" fill="white" stroke="white" stroke-width="0.2"/>
</svg>
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
                        <h3 className="text-[24px] font-semibold text-black mb-4">
                          {slide.heading}
                        </h3>

                        <div className="text-[14px] text-black leading-[1.5] max-w-[260px]" dangerouslySetInnerHTML={{ __html: slide.subtext }}/>
                          <div className="absolute bottom-8 left-8 z-20">
                         <div className="w-[48px] h-[48px] rounded-full border border-black flex items-center justify-center text-black">
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="13" viewBox="0 0 20 13" fill="none">
                            <path d="M12.3289 0.212646C12.495 0.0621656 12.7749 0.0622819 12.9412 0.212646L12.9421 0.213623L19.1687 5.90698C19.2522 5.98312 19.2999 6.08763 19.2996 6.19995L19.2908 6.28198C19.2732 6.36214 19.2306 6.43549 19.1677 6.49292L12.9421 12.1863C12.7758 12.3383 12.4938 12.3374 12.3289 12.1863C12.1539 12.0257 12.1548 11.7616 12.3298 11.6013L17.7878 6.60913H0.537842C0.304801 6.60913 0.100382 6.43374 0.100342 6.19995C0.100342 5.96613 0.304777 5.79077 0.537842 5.79077H17.7878L12.3289 0.797607C12.1541 0.637137 12.1541 0.374072 12.3289 0.213623V0.212646Z" fill="black" stroke="black" stroke-width="0.2"/>
                          </svg>
                        </div>
                        </div>
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
