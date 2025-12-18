"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import DotIndicator from "../ui/DotIndicator";

const SITE_HEADER_DESKTOP = 80;
const SITE_HEADER_MOBILE = 64;

const SERVICE_HEADER_DESKTOP = 88;
const SERVICE_HEADER_MOBILE = 64;

const MAX_VISIBLE_HEADERS = 2;

export default function ServicesSection({
  section_label = "",
  heading = "",
  description = "",
}) {
  const [services, setServices] = useState([]);
  const [isMobile, setIsMobile] = useState(false);

  /* ---------------- detect screen ---------------- */
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const SITE_HEADER_HEIGHT = isMobile
    ? SITE_HEADER_MOBILE
    : SITE_HEADER_DESKTOP;

  const SERVICE_HEADER_HEIGHT = isMobile
    ? SERVICE_HEADER_MOBILE
    : SERVICE_HEADER_DESKTOP;

  /* ---------------- fetch services ---------------- */
  useEffect(() => {
    async function loadServices() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_WP_URL}/wp-json/wp/v2/service?_embed&acf_format=standard`,
          { cache: "no-store" }
        );

        const data = await res.json();
        if (!Array.isArray(data)) return;

        setServices(
          data.map((post) => ({
            id: post.id,
            slug: post.slug || "",
            heading: post.acf?.heading || "",
            description_text: post.acf?.description_text || "",
            cta_text: post.acf?.cta_text || "",
            highlights: Array.isArray(post.acf?.service_highlights)
              ? post.acf.service_highlights
              : [],
            bg:
              post._embedded?.["wp:featuredmedia"]?.[0]?.source_url ||
              "",
          }))
        );
      } catch (e) {
        console.error("SERVICES FETCH ERROR:", e);
      }
    }

    loadServices();
  }, []);

  return (
    <section className="relative w-full overflow-visible bg-[#E3EDFF]">
      {/* ================= INTRO ================= */}
      <div className="px-4 sm:px-6 md:px-[56px] lg:px-[80px] lg:pt-[20px] sm:pt-[64px] md:pt-[80px] pb-[32px] sm:pb-[48px]">
        <div className="max-w-[560px]">
          {section_label && (
            <div className="flex items-center gap-2 mb-4 md:mb-6">
              <DotIndicator />
              <span className="uppercase text-[12px] sm:text-[13px] md:text-[14px] tracking-wider">
                {section_label}
              </span>
            </div>
          )}

          {heading && (
            <h2
              className="text-[24px] sm:text-[28px] md:text-[40px] font-semibold leading-tight md:leading-[1.15]"
              dangerouslySetInnerHTML={{ __html: heading }}
            />
          )}

          {description && (
            <div
              className="mt-3 sm:mt-4 text-[14px] sm:text-[15px] md:text-[16px]"
              dangerouslySetInnerHTML={{ __html: description }}
            />
          )}
        </div>
      </div>

      {/* ================= SERVICES ================= */}
      {services.map((service, index) => {
        const isLast = index === services.length - 1;

        const delayedIndex = Math.max(0, index - 1);
        const slot = delayedIndex % MAX_VISIBLE_HEADERS;

        const headerTop =
          SITE_HEADER_HEIGHT + slot * SERVICE_HEADER_HEIGHT;

        const stickyEnabled = !isMobile && !isLast;

        return (
          <section
            key={service.id}
            className="relative"
            style={{
              minHeight: isMobile ? "auto" : "100vh",
            }}
          >
            {/* ===== HEADER ===== */}
            <div
              style={{
                position: stickyEnabled ? "sticky" : "relative",
                top: stickyEnabled ? `${headerTop}px` : "auto",
                height: `${SERVICE_HEADER_HEIGHT}px`,
                background: "#D3DEF3",
                zIndex: stickyEnabled ? 2000 + slot : 10,
                display: "flex",
                alignItems: "center",
                padding: isMobile ? "0 17px" : "0 80px",
                borderBottom: "1px solid rgba(0,0,0,0.1)",
              }}
              className="px-4 sm:px-6 md:px-[56px]"
            >
              <div className="flex justify-between items-center w-full gap-4">
                <h3 className="text-[16px] sm:text-[18px] md:text-[32px] font-semibold">
                  {service.heading}
                </h3>

                {service.cta_text && (
                  <Link
                    href={`/services/${service.slug}`}
                    className="btn-primary hidden md:inline-flex text-sm"
                  >
                    {service.cta_text}
                  </Link>
                )}
              </div>
            </div>

            {/* ===== BACKGROUND === */}
            {service.bg && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  backgroundImage: `
                    linear-gradient(
                      90deg,
                      rgba(6,24,55,0.8) 0%,
                      rgba(6,24,55,0.45) 60%,
                      rgba(6,24,55,0.15) 100%
                    ),
                    url(${service.bg})
                  `,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  zIndex: 1,
                }}
              />
            )}

            {/* ===== CONTENT ===== */}
            <div
              style={{
                position: "relative",
                zIndex: 10,
                padding: isMobile ? "80px 17px" : "32px 80px",
                maxWidth: "600px",
                color: "#fff",
              }}
              className="px-4 sm:px-6 md:px-[56px]"
            >
              {service.description_text && (
                <div
                  className="text-[14px] sm:text-[15px] md:text-[16px] leading-[1.6] md:leading-[1.7]"
                  dangerouslySetInnerHTML={{
                    __html: service.description_text,
                  }}
                />
              )}

              {service.highlights.length > 0 && (
                <>
                  <div className="w-full h-[1px] bg-white/40 my-5 md:my-6" />
                  <ul className="space-y-2 md:space-y-3">
                    {service.highlights.map((item, i) => (
                      <li key={i} className="flex gap-3">
                        <span className="mt-[7px] w-[6px] h-[6px] rounded-full bg-[#4A7BFF]" />
                        <span className="italic text-[14px] md:text-[15px]">
                          {item?.highlight_text}
                        </span>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </section>
        );
      })}
    </section>
  );
}
