"use client";

import DotIndicator from "../../ui/DotIndicator";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function IndustriesSection({ data, index = 0 }) {
  const { section_label, section_title, section_description } = data || {};

  const STICKY_START = 120;
  const LABEL_HEIGHT = 32;
  const stickyTop = STICKY_START + index * LABEL_HEIGHT;

  const [industries, setIndustries] = useState([]);

  useEffect(() => {
    async function fetchIndustries() {
      try {
        const res = await fetch("https://gomostaging.com/novoterm-headless/wp-json/wp/v2/industry?_embed&per_page=20");
        const json = await res.json();

        const formatted = Array.isArray(json)
          ? json.map((item) => ({
              id: item.id,
              title: item.title?.rendered,
              slug: item.slug,
              image: item._embedded?.["wp:featuredmedia"]?.[0]?.source_url || "",
            }))
          : [];

        setIndustries(formatted);
      } catch (err) {
        console.error("Industry fetch error:", err);
      }
    }

    fetchIndustries();
  }, []);

  if (!industries.length) return null;

  return (
    <section className="w-full bg-[#EAF1FF] px-4 py-6 sm:px-6 md:py-10 lg:px-[80px] lg:py-[100px]">
      <div className="mx-auto">
        <div className="flex flex-col lg:flex-row gap-0">

          {/* LEFT – 15% (STICKY FIXED) */}
          <div className="w-full lg:w-[15%] relative">
            {section_label && (
              <div className="flex items-center gap-2 mb-4 lg:mb-0" style={{ position: "sticky", top: `${stickyTop}px`, zIndex: 10 + index }}>
                <DotIndicator />
                <span className="uppercase font-montserrat font-medium text-[10px] sm:text-[10px] md:text-[12px] tracking-wider">
                  {section_label}
                </span>
              </div>
            )}
          </div>

          {/* RIGHT – 85% */}
          <div className="w-full lg:w-[85%]">

            {/* HEADER */}
            <div className="flex flex-col lg:flex-row lg:items-start max-w-[578px] lg:justify-between mb-8 lg:mb-10 gap-6">
              <div>
                {section_title && (
                  <h2 className="font-heading text-[24px] sm:text-[28px] md:text-[40px] font-semibold leading-tight md:leading-[1.15] font-semibold text-[#061837] mb-4">
                    {section_title}
                  </h2>
                )}
                {section_description && (
                  <p className="text-[16px] text-[#4B5563] ">
                    {section_description}
                  </p>
                )}
              </div>

            </div>
 <div className="w-full">
              <div className="lg:flex gap-3 justify-end  mt-[-90px] mb-[40px]">
                <button className="industry-prev w-[44px] h-[44px] rounded-full bg-[#BBC8E1] flex items-center justify-center hover:bg-[#2655C4] hover:text-white transition">
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="14" viewBox="0 0 16 14" fill="none">
  <path d="M0 6.85713C0 6.69011 0.10663 6.46832 0.214822 6.3607L6.30999 0.225284C6.59457 -0.0534402 7.0556 -0.085742 7.38736 0.197133C7.68397 0.450016 7.69136 0.943219 7.41707 1.21783L2.52429 6.13518H15.2381C15.6589 6.13518 16 6.45833 16 6.85698C16 7.25563 15.6589 7.57883 15.2381 7.57883H2.52429L7.41707 12.4962C7.69132 12.7707 7.67186 13.2518 7.38736 13.5168C7.08699 13.7966 6.59023 13.7717 6.30999 13.4887L0.214822 7.35328C0.0357313 7.18687 0.0030098 7.02661 0 6.85713Z" fill="#E3EDFF"/>
</svg>
                </button>
                <button className="industry-next w-[44px] h-[44px] rounded-full bg-[#2655C4] text-white flex items-center justify-center hover:bg-[#2655C4] transition">

                 <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none">
  <rect width="48" height="48" rx="24" />
  <path d="M32 24.0002C32 23.8332 31.8934 23.6114 31.7852 23.5038L25.69 17.3684C25.4054 17.0896 24.9444 17.0573 24.6126 17.3402C24.316 17.5931 24.3086 18.0863 24.5829 18.3609L29.4757 23.2782H16.7619C16.3411 23.2782 16 23.6014 16 24C16 24.3987 16.3411 24.7219 16.7619 24.7219H29.4757L24.5829 29.6392C24.3087 29.9138 24.3281 30.3949 24.6126 30.6599C24.913 30.9397 25.4098 30.9148 25.69 30.6318L31.7852 24.4964C31.9643 24.3299 31.997 24.1697 32 24.0002Z" fill="white"/>
</svg>
                </button>
              </div>
            {/* SLIDER */}
            <Swiper
              modules={[Navigation, Pagination]}
              navigation={{ prevEl: ".industry-prev", nextEl: ".industry-next" }}
              pagination={{ el: ".industry-dots", clickable: true }}
              slidesPerView={1}
              spaceBetween={16}
              breakpoints={{ 640: { slidesPerView: 1.2 }, 768: { slidesPerView: 2 }, 1024: { slidesPerView: 3.5 } }}
            >
              {industries.map((item) => (
                <SwiperSlide key={item.id}>
                  <Link href={`/industries/${item.slug}`} className="relative h-[420px] rounded-[3px] overflow-hidden group block">
                    <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.75) 100%), url(${item.image}) center / cover no-repeat` }} />
                    <div className="absolute top-6 left-6 right-6 z-10">
                      <h3 className="text-white text-[20px] font-semibold">
                        {item.title}
                      </h3>
                    </div>
                    <div className="absolute bottom-6 left-6 z-10">
                      <div className="w-[36px] h-[36px] bg-[#2E6CF6] rounded flex items-center justify-center text-white">
                        →
                      </div>
                    </div>
                  </Link>
                </SwiperSlide>
              ))}
            </Swiper>
</div>
           

          </div>
        </div>
      </div>
    </section>
  );
}
