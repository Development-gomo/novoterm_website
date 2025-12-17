"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import DotIndicator from "../ui/DotIndicator";

export default function ServicesSection({
  section_label,
  heading,
  description,
}) {
  const [services, setServices] = useState([]);

  // 🔵 Fetch Services CPT (same pattern as CaseStudySection)
  useEffect(() => {
    async function loadServices() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_WP_URL}/wp-json/wp/v2/service?_embed&acf_format=standard`
        );

        if (!res.ok) {
          throw new Error("Failed to fetch services");
        }

        const data = await res.json();

        const formatted = Array.isArray(data)
          ? data.map((post) => ({
              id: post.id,
              slug: post.slug, // ✅ REQUIRED for CTA

                    // ACF fields
      heading: post.acf?.heading || "",
      description_text: post.acf?.description_text || "",
      cta_text: post.acf?.cta_text || "",



      highlights: post.acf?.service_highlights || [],

      // Featured image

      bg:
  post._embedded?.["wp:featuredmedia"]?.[0]?.source_url ||
  post._embedded?.["wp:featuredmedia"]?.[0]?.media_details?.sizes?.full?.source_url ||
  post._embedded?.["wp:featuredmedia"]?.[0]?.media_details?.sizes?.large?.source_url ||
  "",
            }))
          : [];

        setServices(formatted);
      } catch (e) {
        console.error("SERVICES FETCH ERROR:", e);
      }
    }

    loadServices();
  }, []);

  return (
    <section className="relative w-full bg-[#E9F0FF]">

      {/* ============================= */}
      {/* SECTION HEADER (TOP) */}
      {/* ============================= */}
      <div className="px-[80px] pt-[80px] pb-[40px]">
        <div className="max-w-[561px]">

          {section_label && (
          <div className="flex items-center gap-2 mb-6">
            <DotIndicator />
            
            <span className="uppercase text-[14px] tracking-wider text-black">
                {section_label}
            </span>
            </div>
          )}

          <h2
            className="text-[35px] md:text-[40px] font-heading font-semibold text-[#000] leading-[1.15] mb-4"
            dangerouslySetInnerHTML={{ __html: heading }}
          />

          <div
            className="text-[16px] text-[#000] leading-[1.7]"
            dangerouslySetInnerHTML={{ __html: description }}
          />
        </div>
      </div>

      {/* ===== SERVICES STACK ===== */}
      {services.map((service) => (
        <section key={service.id} className="relative min-h-screen">

          {/* STICKY HEADER BAR */}
          <div
            className="
              sticky
              top-[88px]
              z-30
              bg-[#DDE6F6]
              px-8 md:px-14
              h-[88px]
              flex items-center
              border-b border-black/10
            "
          >
            <div className="flex justify-between items-center w-full">
              <h3 className="text-[28px] font-semibold">
                {service.heading}
              </h3>

              {service.cta_text && (
                <Link
                  href={`/services/${service.slug}`}
                  className="btn-primary"
                >
                  {service.cta_text}
                </Link>
              )}
            </div>
          </div>

          {/* BACKGROUND IMAGE */}
          <div
            className="absolute inset-0 -z-0 bg-cover bg-center"
            style={{
              backgroundImage: `
                linear-gradient(
                  90deg,
                  rgba(6,24,55,0.75) 0%,
                  rgba(6,24,55,0.45) 55%,
                  rgba(6,24,55,0.15) 100%
                ),
                url(${service.bg})
              `,
            }}
          />

          {/* CONTENT */}
          <div className="relative z-20 h-full flex items-center px-8 md:px-14">
            <div className="max-w-[560px] text-white">

              <div
                className="text-[16px] leading-[1.7] mb-6"
                dangerouslySetInnerHTML={{ __html: service.description_text }}
              />

              <div className="w-[180px] h-[1px] bg-white/40 mb-6"></div>

              {service.highlights.length > 0 && (
                <ul className="space-y-3">
                  {service.highlights.map((item, i) => (
                    <li key={i} className="flex gap-3">
                      <span className="mt-[7px] w-[6px] h-[6px] rounded-full bg-[#4A7BFF]" />
                      <span>{item.highlight_text}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </section>
      ))}

    </section>
  );
}
