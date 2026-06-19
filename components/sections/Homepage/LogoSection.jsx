import Image from "next/image";
import Link from "next/link";
import DotIndicator from "../../ui/DotIndicator";
import { pickWpImageUrl } from "../../../lib/wpImage";
import { getSectionBackground, isDarkSectionColor } from "../../../lib/sectionTheme";

export default function LogoSection({ section, sectionId, optionsLogos = [] }) {
  const {
    section_theme = "#E3EDFF",
    section_label,
    heading,
    description,
    cta_text,
    cta_url,
    logos = [],
    select_layout = "grid",
    page_type = "inner",
  } = section || {};

  const sectionBackground = getSectionBackground(section_theme);
  const isDark = isDarkSectionColor(section_theme);
  const isHomeLayout = page_type === "home";
  const contentWidthClass = isHomeLayout ? "w-full" : "md:w-[85%]";

  const sorted = [...logos].sort(
    (a, b) => (Number(a.logo_sequence) || 0) - (Number(b.logo_sequence) || 0)
  );

  const ctaHref =
    typeof cta_url === "object" ? cta_url?.url || "#" : cta_url || "#";
  const ctaTarget =
    typeof cta_url === "object" && cta_url?.target ? cta_url.target : "_self";

  /* ── CAROUSEL LAYOUT ───────────────────────────────────────── */
  if (select_layout === "carousel") {
    // Logos load exclusively from options page (upload_logos repeater, field: logo)
    const track = [...optionsLogos, ...optionsLogos];

    const getLogoUrl = (item) => {
      const field = item?.logo;
      if (!field) return "";
      if (typeof field === "string") return field;
      return (
        pickWpImageUrl(field, "card") ||
        field?.url ||
        field?.source_url ||
        ""
      );
    };
    const getLogoAlt = (item) => {
      const field = item?.logo;
      return typeof field === "object" ? field?.alt || "" : "";
    };

    return (
      <section
        id={sectionId}
        className="w-full py-[60px] sm:py-[80px] lg:py-[100px] overflow-hidden"
        style={{ backgroundColor: sectionBackground }}
      >
        <div className="web-width mx-auto px-6 md:px-0">
          <div className="flex flex-col md:flex-row">

            {/* LEFT – 15% */}
            {!isHomeLayout && <div className="md:w-[15%] relative">
              {section_label && (
                <div className="flex items-center gap-2 mb-6 md:mb-0 lg:hidden">
                  <DotIndicator />
                  <span className={`uppercase font-montserrat font-medium text-[12px] tracking-wider ${isDark ? "text-white" : "text-black"}`}>
                    {section_label}
                  </span>
                </div>
              )}
            </div>}

            {/* RIGHT – 85% */}
            <div className={contentWidthClass}>
              {isHomeLayout && section_label && (
                <div className="flex items-center gap-2 mb-6">
                  <DotIndicator />
                  <span className={`uppercase font-montserrat font-medium text-[12px] tracking-wider ${isDark ? "text-white" : "text-black"}`}>
                    {section_label}
                  </span>
                </div>
              )}

              {heading && (
                <h2
                  className={`text-[32px] md:text-[40px] font-heading font-semibold leading-[1.15] max-w-[600px] mb-10 ${
                    isDark ? "text-white" : "text-[#061837]"
                  }`}
                  dangerouslySetInnerHTML={{ __html: heading }}
                />
              )}

              {description && (
                <div
                  suppressHydrationWarning
                  className={`text-[16px] leading-[1.7] max-w-[560px] mb-10 [&_p]:mb-0 ${
                    isDark ? "text-[#cdd8e8]" : "text-[#3A3A3A]"
                  }`}
                  dangerouslySetInnerHTML={{ __html: description }}
                />
              )}

              {/* Infinite scroll track scoped to 85% column */}
              <div className="relative overflow-hidden">
                <div
                  className="pointer-events-none absolute left-0 top-0 h-full w-16 z-10"
                  style={{ background: `linear-gradient(to right, ${sectionBackground}, transparent)` }}
                />
                <div
                  className="pointer-events-none absolute right-0 top-0 h-full w-16 z-10"
                  style={{ background: `linear-gradient(to left, ${sectionBackground}, transparent)` }}
                />

                <div className="flex logo-carousel-track">
                  {track.map((item, i) => {
                    const imgUrl = getLogoUrl(item);
                    const imgAlt = getLogoAlt(item);

                    return (
                      <div
                        key={i}
                        className={`flex-shrink-0 flex items-center justify-center mx-1 px-6 py-4 rounded-[3px] border ${
                          isDark ? "bg-[#d7e5f5] border-[]" : "bg-[#CCD8EE] border-[#CCD8EE]"
                        }`}
                        style={{ minWidth: "180px", height: "90px" }}
                      >
                        {imgUrl ? (
                          <div className="relative w-[120px] h-[70px]">
                            <Image src={imgUrl} alt={imgAlt} fill unoptimized className="object-contain" sizes="120px" loading="lazy" />
                          </div>
                        ) : (
                          <span className={`text-[14px] font-semibold font-heading ${isDark ? "text-white" : "text-[#061837]"}`}>
                            {imgAlt || `Logo ${i + 1}`}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {cta_text && ctaHref !== "#" && (
                <div className="mt-10">
                  <Link href={ctaHref} target={ctaTarget} className="btn-primary inline-block">{cta_text}</Link>
                </div>
              )}

            </div>
          </div>
        </div>

        <style jsx>{`
          @keyframes logo-scroll {
            0%   { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .logo-carousel-track {
            animation: logo-scroll 30s linear infinite;
            width: max-content;
          }
          .logo-carousel-track:hover {
            animation-play-state: paused;
          }
        `}</style>
      </section>
    );
  }

  /* ── GRID LAYOUT (default) ─────────────────────────────────── */
  return (
    <section
      id={sectionId}
      className="w-full py-[60px] sm:py-[80px] lg:py-[100px]"
      style={{ backgroundColor: sectionBackground }}
    >
      <div className="web-width mx-auto px-6 md:px-0">
        <div className="flex flex-col md:flex-row">

          {/* LEFT – 15% */}
          {!isHomeLayout && <div className="md:w-[15%] relative">
            {section_label && (
              <div className="flex items-center gap-2 mb-6 md:mb-0 lg:hidden">
                <DotIndicator />
                <span
                  className={`uppercase font-montserrat font-medium text-[12px] tracking-wider ${
                    isDark ? "text-white" : "text-black"
                  }`}
                >
                  {section_label}
                </span>
              </div>
            )}
          </div>}

          {/* RIGHT – 85% */}
          <div className={contentWidthClass}>
            {isHomeLayout && section_label && (
              <div className="flex items-center gap-2 mb-6">
                <DotIndicator />
                <span
                  className={`uppercase font-montserrat font-medium text-[12px] tracking-wider ${
                    isDark ? "text-white" : "text-black"
                  }`}
                >
                  {section_label}
                </span>
              </div>
            )}

            {heading && (
              <h2
                className={`text-[32px] md:text-[40px] font-heading font-semibold leading-[1.15] max-w-[600px] mb-10 ${
                  isDark ? "text-white" : "text-[#061837]"
                }`}
                dangerouslySetInnerHTML={{ __html: heading }}
              />
            )}

            {description && (
              <div
                suppressHydrationWarning
                className={`text-[16px] leading-[1.7] max-w-[560px] mb-10 [&_p]:mb-0 ${
                  isDark ? "text-[#cdd8e8]" : "text-[#3A3A3A]"
                }`}
                dangerouslySetInnerHTML={{ __html: description }}
              />
            )}

            {optionsLogos.length > 0 && (
              <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-0 border-l rounded-[3px] border-t ${isDark ? "border-[#06183717]" : "border-[#06183717]"}`}>
                {optionsLogos.map((item, i) => {
                  const field = item?.logo;
                  const imgUrl = !field ? "" :
                    typeof field === "string" ? field :
                    pickWpImageUrl(field, "card") || field?.url || field?.source_url || "";
                  const imgAlt = typeof field === "object" ? field?.alt || "" : "";

                  return (
                    <div
                      key={i}
                      className={`flex items-center justify-center p-8 min-h-[160px] border-r border-b ${
                        isDark
                          ? "bg-[#d7e5f5] border-[#06183717]"
                          : "bg-[#CCD8EE] border-[#06183717]"
                      }`}
                    >
                      {imgUrl ? (
                        <div className="relative w-full max-w-[140px] h-[80px]">
                          <Image
                            src={imgUrl}
                            alt={imgAlt}
                            fill
                            className="object-contain"
                            sizes="(max-width:640px) 40vw, (max-width:1024px) 25vw, 180px"
                            loading="lazy"
                          />
                        </div>
                      ) : (
                        <span
                          className={`text-[16px] font-semibold font-heading ${
                            isDark ? "text-white" : "text-[#061837]"
                          }`}
                        >
                          {imgAlt || `Logo ${i + 1}`}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {cta_text && ctaHref !== "#" && (
              <div className="mt-10">
                <Link href={ctaHref} target={ctaTarget} className="btn-primary inline-block">
                  {cta_text}
                </Link>
              </div>
            )}

          </div>
        </div>
      </div>
    </section>
  );
}
