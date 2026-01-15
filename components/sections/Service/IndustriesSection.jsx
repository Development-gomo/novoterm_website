"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";

export default function IndustriesSection({ data }) {
  /* ================= ACF DATA ================= */
  const {
    section_label,
    section_title,
    section_description,
  } = data || {};

  /* ================= CPT DATA ================= */
  const [industries, setIndustries] = useState([]);

  useEffect(() => {
    async function fetchIndustries() {
      try {
        const res = await fetch(
          "https://gomostaging.com/novoterm-headless/wp-json/wp/v2/industry?_embed&per_page=20"
        );
        const json = await res.json();

        const formatted = Array.isArray(json)
          ? json.map((item) => ({
              id: item.id,
              title: item.title?.rendered,
              slug: item.slug,
              image:
                item._embedded?.["wp:featuredmedia"]?.[0]?.source_url || "",
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
    <section className="w-full bg-[#EAF1FF] py-[80px]">
      <div className="max-w-[1320px] mx-auto px-6">

        {/* ================= 15 / 85 GRID ================= */}
        <div className="grid grid-cols-[15%_85%] gap-10 items-start">

          {/* ================= LEFT – 15% ================= */}
          <div>
            {section_label && (
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#2E6CF6]" />
                <span className="uppercase text-[12px] tracking-widest text-[#2E6CF6]">
                  {section_label}
                </span>
              </div>
            )}
          </div>

          {/* ================= RIGHT – 85% ================= */}
          <div>

            {/* HEADER */}
            <div className="flex items-start justify-between mb-10">
              <div>
                {section_title && (
                  <h2 className="text-[36px] leading-[1.2] font-semibold text-[#061837] mb-4">
                    {section_title}
                  </h2>
                )}

                {section_description && (
                  <p className="text-[15px] text-[#4B5563] max-w-[720px]">
                    {section_description}
                  </p>
                )}
              </div>

              {/* NAVIGATION ARROWS */}
              <div className="flex gap-3">
                <button className="industry-prev w-[44px] h-[44px] rounded-full bg-[#D5DEEF] flex items-center justify-center hover:bg-[#2E6CF6] hover:text-white transition">
                  ←
                </button>
                <button className="industry-next w-[44px] h-[44px] rounded-full bg-[#2E6CF6] text-white flex items-center justify-center hover:bg-[#1E4FD6] transition">
                  →
                </button>
              </div>
            </div>

            {/* ================= SLIDER ================= */}
            <Swiper
              modules={[Navigation]}
              navigation={{
                prevEl: ".industry-prev",
                nextEl: ".industry-next",
              }}
              slidesPerView={1}
              spaceBetween={10}
              breakpoints={{
                768: { slidesPerView: 2 },
                1024: { slidesPerView: 3.5 },
              }}
            >
              {industries.map((item) => (
                <SwiperSlide key={item.id}>
                  <Link
                    href={`/industries/${item.slug}`}
                    className="
                      relative
                      h-[420px]
                      rounded-[3px]
                      overflow-hidden
                      group
                      block
                    "
                  >
                    {/* BACKGROUND IMAGE */}
                    <div
                      className="absolute inset-0"
                      style={{
                        backgroundImage: `
                          linear-gradient(
                            180deg,
                            rgba(0,0,0,0.25) 0%,
                            rgba(0,0,0,0.75) 100%
                          ),
                          url(${item.image})
                        `,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    />

                    {/* TITLE */}
                    <div className="absolute top-6 left-6 right-6 z-10">
                      <h3 className="text-white text-[20px] font-semibold">
                        {item.title}
                      </h3>
                    </div>

                    {/* ARROW */}
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
    </section>
  );
}
