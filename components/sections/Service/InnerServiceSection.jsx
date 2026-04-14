import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import DotIndicator from "../../ui/DotIndicator";
import { pickWpImageUrl } from "../../../lib/wpImage";

const SITE_HEADER_DESKTOP = 80;
const SITE_HEADER_MOBILE = 64;

const SERVICE_HEADER_DESKTOP = 100;
const SERVICE_HEADER_MOBILE = 64;

const MAX_VISIBLE_HEADERS = 2;

export default function InnerServiceSection({ section, sectionId, index = 0 }) {
  const {
    section_label = "",
    heading = "",
    description = "",
    service_slide = [],
  } = section || {};

  const [isMobile, setIsMobile] = useState(false);
  const [isLg, setIsLg] = useState(false);

  useEffect(() => {
    const check = () => {
      setIsMobile(window.innerWidth < 768);
      setIsLg(window.innerWidth >= 1024);
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  if (!section) return null;

  const SITE_HEADER_HEIGHT = isMobile ? SITE_HEADER_MOBILE : SITE_HEADER_DESKTOP;
  const SERVICE_HEADER_HEIGHT = isMobile ? SERVICE_HEADER_MOBILE : SERVICE_HEADER_DESKTOP;

  const formatLabel = (layout) => {
    if (!layout) return null;
    return layout
      .replace(/_section$/, "")
      .replace(/^(services?_|inner_)/, "")
      .replace(/_/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
  };
  const mobileLabel = section_label || formatLabel(section?.acf_fc_layout);

  const getBgUrl = (img) => pickWpImageUrl(img, "heroNext");

  const getCtaUrl = (link) => {
    if (!link) return "#";
    if (typeof link === "string") return link;
    return link.url || "#";
  };

  return (
    <section id={sectionId} className="relative w-full overflow-clip bg-[#E3EDFF]">
      <div className="web-width mx-auto py-6 px-6 md:px-0 md:py-0">
        {/* ================= 15 / 85 WRAPPER ================= */}
        <div className="flex flex-col lg:flex-row">

          {/* ================= LEFT – 15% ================= */}
          <div className="w-full lg:w-[15%] relative">
            {mobileLabel && (
              <div className="flex items-center gap-2 mb-4 lg:hidden">
                <span className="w-2 h-2 rounded-full bg-[#2655C4]" />
                <span className="uppercase font-montserrat font-medium text-[10px] tracking-wider text-[#061837]">
                  {mobileLabel}
                </span>
              </div>
            )}
          </div>

          {/* ================= RIGHT – 85% ================= */}
          <div className="w-full lg:w-[85%]">

            {/* ================= INTRO ================= */}
            <div className="pb-15 md:py-[80px]">
              <div className="max-w-[560px]">
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
      {service_slide.map((service, i) => {
        const isLast = i === service_slide.length - 1;
        const delayedIndex = Math.max(0, i - 1);
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
            key={i}
            className="relative"
            style={{
              minHeight: isMobile ? "auto" : "",
              width: isLg ? 'calc(100% + max(0px, (100vw - 1280px) / 2))' : undefined,
            }}
          >
            {/* ===== HEADER ===== */}
            <div className="sticky-box"
              style={{
                position: stickyEnabled ? "sticky" : "relative",
                ...(stickyEnabled ? { top: `${headerTop}px` } : {}),
                height: `${SERVICE_HEADER_HEIGHT}px`,
                background: "#D3DEF3",
                zIndex: stickyEnabled ? 2000 + slot : 10,
                display: "flex",
                alignItems: "center",
                borderBottom: "1px solid rgba(0,0,0,0.1)",
              }}
            >
              <div
                className="px-6 md:px-6 flex justify-between items-center w-full gap-4"
                style={{ paddingRight: isLg ? 'max(24px, (100vw - 1280px) / 2)' : undefined }}
              >
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

            {/* ===== BACKGROUND ===== */}
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
                    className="object-cover object-top"
                  />
                </div>
                <div
                  className="absolute inset-0 z-[2] pointer-events-none"
                  style={{
                    background: isMobile
                      ? "linear-gradient(90deg, rgba(6,24,55,0.8) 0%, rgba(6,24,55,0.59) 60%, rgba(6,24,55,0.57) 100%)"
                      : "linear-gradient(90deg, rgba(6,24,55,0.8) 0%, rgba(6,24,55,0.45) 60%, rgba(6,24,55,0.15) 100%)",
                  }}
                />
              </>
            )}

            {/* ===== CONTENT ===== */}
            <div
              style={{
                position: "relative",
                zIndex: 10,
                color: "#fff",
                paddingRight: isLg ? 'max(24px, (100vw - 1280px) / 2)' : undefined,
              }}
              className="px-6 md:px-6 py-15 md:py-8"
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
                      {highlights.map((item, hi) => (
                        <li key={hi} className="flex gap-3">
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
       
          </div>
        </div>
      </div>

     
    </section>
  );
}
