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
    <section
      style={{
        background: "#E9F0FF",
        position: "relative",
        overflow: "visible",
      }}
    >
      {/* ================= INTRO ================= */}
      <div className="px-6 md:px-[80px] pt-[80px] pb-[40px]">
        <div className="max-w-[560px]">
          {section_label && (
            <div className="flex items-center gap-2 mb-6">
              <DotIndicator />
              <span className="uppercase text-[14px] tracking-wider">
                {section_label}
              </span>
            </div>
          )}

          {heading && (
            <h2
              className="text-[28px] md:text-[40px] font-semibold leading-[1.15]"
              dangerouslySetInnerHTML={{ __html: heading }}
            />
          )}

          {description && (
            <div
              className="mt-4 text-[15px] md:text-[16px]"
              dangerouslySetInnerHTML={{ __html: description }}
            />
          )}
        </div>
      </div>

      {/* ================= SERVICES ================= */}
      {services.map((service, index) => {
        const isLast = index === services.length - 1;

        // FIFO (desktop / tablet only)
        const delayedIndex = Math.max(0, index - 1);
        const slot = delayedIndex % MAX_VISIBLE_HEADERS;

        const headerTop =
          SITE_HEADER_HEIGHT + slot * SERVICE_HEADER_HEIGHT;

        const stickyEnabled = !isMobile && !isLast;

        return (
          <section
            key={service.id}
            style={{
              position: "relative",
              minHeight: isMobile ? "auto" : "100vh",
            }}
          >
            {/* ===== HEADER ===== */}
            <div
              style={{
                position: stickyEnabled ? "sticky" : "relative",
                top: stickyEnabled ? `${headerTop}px` : "auto",
                height: `${SERVICE_HEADER_HEIGHT}px`,
                background: "#E9F0FF",
                zIndex: stickyEnabled ? 2000 + slot : 10,
                display: "flex",
                alignItems: "center",
                padding: "0 16px 0 16px",
                borderBottom: "1px solid rgba(0,0,0,0.1)",
              }}
              className="md:px-[56px]"
            >
              <div className="flex justify-between items-center w-full">
                <h3 className="text-[18px] md:text-[28px] font-semibold">
                  {service.heading}
                </h3>

                {service.cta_text && (
                  <Link
                    href={`/services/${service.slug}`}
                    className="btn-primary hidden md:inline-flex"
                  >
                    {service.cta_text}
                  </Link>
                )}
              </div>
            </div>

            {/* ===== BACKGROUND ===== */}
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
                paddingTop: SERVICE_HEADER_HEIGHT + 32,
                paddingLeft: "16px",
                paddingRight: "16px",
                paddingBottom: "96px",
                maxWidth: "560px",
                color: "#fff",
              }}
              className="md:px-[56px]"
            >
              {service.description_text && (
                <div
                  className="text-[15px] md:text-[16px] leading-[1.7]"
                  dangerouslySetInnerHTML={{
                    __html: service.description_text,
                  }}
                />
              )}

              {service.highlights.length > 0 && (
                <>
                  <div className="w-[180px] h-[1px] bg-white/40 my-6" />
                  <ul className="space-y-3">
                    {service.highlights.map((item, i) => (
                      <li key={i} className="flex gap-3">
                        <span className="mt-[7px] w-[6px] h-[6px] rounded-full bg-[#4A7BFF]" />
                        <span>{item?.highlight_text}</span>
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
