import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import DotIndicator from "../../ui/DotIndicator";
import Image from "next/image";
import { DEFAULT_LANG } from "../../../lib/api";
import { pickWpImageUrl } from "../../../lib/wpImage";

const SITE_HEADER_DESKTOP = 80;
const SITE_HEADER_MOBILE = 64;

const SERVICE_HEADER_DESKTOP = 100;
const SERVICE_HEADER_MOBILE = 64;

const MAX_VISIBLE_HEADERS = 2;

export default function ServicesSection({ section, sectionId }) {
  const {
    section_label = "",
    heading = "",
    description = "",
    service_slide = [],
  } = section || {};

  const router = useRouter();
  const lang = router.locale || DEFAULT_LANG;

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  if (!section) return null;

  const SITE_HEADER_HEIGHT = isMobile ? SITE_HEADER_MOBILE : SITE_HEADER_DESKTOP;
  const SERVICE_HEADER_HEIGHT = isMobile ? SERVICE_HEADER_MOBILE : SERVICE_HEADER_DESKTOP;

  const getBgUrl = (img) => pickWpImageUrl(img, "heroNext");

  const getCtaUrl = (link) => {
    if (!link) return "#";
    if (typeof link === "string") return link;
    return link.url || "#";
  };

  return (
    <section id={sectionId} className="relative w-full overflow-visible bg-[#E3EDFF]">
      {/* ================= INTRO ================= */}
      <div className="web-width mx-auto px-6 md:px-0 pb-15 md:pb-[80px]">
        <div className="max-w-[560px]">
          {section_label && (
            <div className="flex items-center gap-2 mb-4 md:mb-6">
              <DotIndicator />
              <span className="uppercase font-montserrat font-medium text-[10px] sm:text-[10px] md:text-[12px] tracking-wider">
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
      {service_slide.map((service, index) => {
        const isLast = index === service_slide.length - 1;
        const delayedIndex = Math.max(0, index - 1);
        const slot = delayedIndex % MAX_VISIBLE_HEADERS;
        const headerTop = SITE_HEADER_HEIGHT + slot * SERVICE_HEADER_HEIGHT;
        const stickyEnabled = !isMobile && !isLast;

        const bgUrl = getBgUrl(service.background_image);
        const ctaUrl = getCtaUrl(service.cta_url);
        const highlights = Array.isArray(service.service_highlights)
          ? service.service_highlights
          : [];

        return (
          <section
            key={index}
            className="relative"
            style={{ minHeight: isMobile ? "auto" : "80vh" }}
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
                borderBottom: "1px solid rgba(0,0,0,0.1)",
              }}
            >
              <div className="web-width mx-auto px-6 md:px-0 flex justify-between items-center w-full gap-4">
                <h3 className="text-[16px] sm:text-[18px] md:text-[32px] font-semibold">
                  {service.heading}
                </h3>

                {service.cta_text && (
                  <Link href={ctaUrl} className="btn-primary hidden md:inline-flex text-sm">
                    {service.cta_text}
                  </Link>
                )}
              </div>
            </div>

            {/* ===== BACKGROUND (next/image — avoids multi‑MB raw JPGs) ===== */}
            {bgUrl && (
              <>
                <div className="absolute inset-0 z-[1]">
                  <Image
                    src={bgUrl}
                    alt=""
                    fill
                    sizes="100vw"
                    quality={70}
                    loading="lazy"
                    className="object-cover object-center"
                  />
                </div>
                <div
                  className="absolute inset-0 z-[2] pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(90deg, rgba(6,24,55,0.8) 0%, rgba(6,24,55,0.45) 60%, rgba(6,24,55,0.15) 100%)",
                  }}
                />
              </>
            )}

            {/* ===== CONTENT ===== */}
            <div
              style={{ position: "relative", zIndex: 10, color: "#fff" }}
              className="web-width mx-auto px-6 md:px-0 py-15 md:py-8"
            >
              <div className="w-full md:w-[620px]">
                {service.description_text && (
                  <div
                    className="text-[14px] font-normal sm:text-[16px] md:text-[18px] leading-[1.6] md:leading-[1.7]"
                    dangerouslySetInnerHTML={{ __html: service.description_text }}
                  />
                )}

                {highlights.length > 0 && (
                  <>
                    <div className="w-full h-[1px] bg-white/40 my-5 md:my-6" />
                    <ul className="space-y-2 md:space-y-3">
                      {highlights.map((item, i) => (
                        <li key={i} className="flex gap-3">
                          <span className="mt-[7px] w-[6px] h-[6px] rounded-full bg-[#2655C4]" />
                          <span className="italic text-[14px] md:text-[15px]">
                            {item?.highlight_text}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            </div>
          </section>
        );
      })}
    </section>
  );
}
