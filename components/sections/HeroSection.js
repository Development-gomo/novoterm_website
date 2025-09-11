// components/HeroSection.jsx
import { Archivo } from "next/font/google";
const archivo = Archivo({ subsets: ["latin"], weight: ["400"] });

export default function HeroSection({
  headline,
  subheadline,
  cta_text,
  cta_link,
  main_mockup,
  stats_image,
  testimonial_image,
  bg_shape_left,
  bg_shape_right,
  bg_shape_extra,
}) {
  const url = (img) =>
    (img && (img.url || img.sizes?.large || img.sizes?.medium_large)) || "";
  const alt = (img, fallback = "") => (img && img.alt) || fallback;

  return (
    <section
      className={`${archivo.className} relative isolate overflow-hidden bg-[#F3F2ED] text-center pt-[70px] md:pt-[70px]`}
    >
      {/* SECTION A — Left/Right background shapes (decorative only) */}
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
        {url(bg_shape_left) && (
          <img
            src={url(bg_shape_left)}
            alt=""
            className="absolute left-0 top-[306px] w-[405px] object-contain"
            loading="lazy"
          />
        )}
        {url(bg_shape_right) && (
          <img
            src={url(bg_shape_right)}
            alt=""
            className="absolute right-[-80px] top-[306px] w-[405px] object-contain"
            loading="lazy"
          />
        )}
        {url(bg_shape_extra) && (
          <img
            src={url(bg_shape_extra)}
            alt=""
            className="absolute right-6 bottom-6 w-16 md:w-20 object-contain"
            loading="lazy"
          />
        )}
      </div>

      {/* SECTION B — Heading + Subheading + CTA */}
      <div className="mx-auto max-w-[1200px] relative z-10">
        <h1 className="font-extrabold text-[#0E0E0E] text-[68px] leading-[1.05] tracking-[-0.01em]">
          {headline}
        </h1>

        {subheadline && (
          <div
            className="mx-auto mt-5 max-w-[900px] text-[#1F1F1F] text-[24px] leading-[1.6] opacity-90"
            dangerouslySetInnerHTML={{ __html: subheadline }}
          />
        )}

        {cta_text && cta_link && (
          <a
            href={cta_link}
            className="mt-7 inline-flex items-center justify-center rounded-[10px] bg-[#6C8E5E] px-[26px] py-[12px] text-[16px] font-semibold text-white transition hover:bg-[#5b7b50]"
          >
            {cta_text}
          </a>
        )}
      </div>

      {/* SECTION C — Bottom three images (stage) */}
      <div className="relative mt-[190px] w-full">
        {/* Left stats card (260x290) */}
        {url(stats_image) && (
          <img
            src={url(stats_image)}
            alt={alt(stats_image, "Overall stats")}
            className="hidden md:block absolute left-[100px] top-[135px] w-[260px] h-[290px] object-contain"
            loading="lazy"
          />
        )}

        {/* Right testimonial card (192x108) */}
        {url(testimonial_image) && (
          <img
            src={url(testimonial_image)}
            alt={alt(testimonial_image, "Activity")}
            className="hidden md:block absolute right-[134px] top-[35px] w-[192px] h-[108px] object-contain"
            loading="lazy"
          />
        )}

        {/* Center mockup (593x464) */}
        {url(main_mockup) && (
          <div className="relative mx-auto w-[593px] h-[464px]">
            <img
              src={url(main_mockup)}
              alt={alt(main_mockup, "Product mockup")}
              className="absolute inset-0 w-[593px] h-[464px] object-contain"
              loading="eager"
            />
          </div>
        )}
      </div>
    </section>
  );
}
