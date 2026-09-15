import Image from "next/image";
import Link from "next/link";
import CF7ContactForm from "../../ui/CF7ContactForm";
import { wpToPath } from "../../../lib/api";
import { HERO_IMAGE_QUALITY } from "../../../lib/imageConstants";
import { pickWpImageUrl } from "../../../lib/wpImage";

export default function ServicesHeroFormSection({
  heading,
  sub_heading,
  cta_text,
  cta_url,
  section_id,
  background_image,
  select_form,
  sectionId,
}) {
  const bgUrl = pickWpImageUrl(background_image, "heroNext");
  const rawSectionId = typeof section_id === "string" ? section_id.trim() : "";
  const anchorId = (rawSectionId.includes("#") ? rawSectionId.split("#").pop() : rawSectionId)
    .replace(/^\/+/, "")
    .replace(/^#/, "")
    .trim();
  const ctaHref = wpToPath(cta_url);

  return (
    <section
      id={sectionId}
      className="relative z-50 w-full min-h-svh flex items-center justify-center overflow-hidden px-4 sm:px-0"
    >
      {anchorId && (
        <span id={anchorId} className="absolute top-0 block scroll-mt-[100px]" aria-hidden="true" />
      )}
      {bgUrl && (
        <Image
          src={bgUrl}
          alt=""
          fill
          priority
          fetchPriority="high"
          quality={HERO_IMAGE_QUALITY}
          sizes="100vw"
          className="object-cover object-top"
        />
      )}

      <div
        className="absolute inset-0 z-[1]"
        style={{
          background: "linear-gradient(180deg, rgba(6,24,55,0.50) 0%, #061837 100%)",
        }}
      />

      <div className="relative z-[2] w-full web-width px-6 pb-20 pt-16 sm:pb-20 sm:pt-18 lg:pb-40 lg:pt-20">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_520px] gap-10 lg:gap-16 items-center">
          <div className="max-w-[760px]">
            {heading && (
              <h1
                className="font-heading font-semibold text-white [&_em]:italic [&_em]:font-merriweather
                  text-[32px] sm:text-[48px] md:text-[60px] lg:text-[80px]
                  leading-tight md:leading-[90px] tracking-[1px]
                  w-full mb-1"
                dangerouslySetInnerHTML={{ __html: heading }}
              />
            )}

            {sub_heading && (
              <div
                className="font-body text-white/90
                  text-[14px] sm:text-[15px] md:text-[16px] lg:text-[18px]
                  leading-[24px] my-[10px] md:my-[24px] max-w-[520px]"
                dangerouslySetInnerHTML={{ __html: sub_heading }}
              />
            )}

            {cta_text && ctaHref && ctaHref !== "#" && (
              <Link
                href={ctaHref}
                className="btn-primary !inline-flex !w-auto px-6 sm:px-8 text-sm sm:text-base"
              >
                {cta_text}
              </Link>
            )}
          </div>

          <div className="hero-form-cf7 w-full rounded-[3px] border border-white/20 bg-[#061837]/20 p-4">
            <CF7ContactForm formId={select_form} sectionTheme="dark" />
            <style jsx global>{`
              .hero-form-cf7 form {
                max-width: none !important;
                padding: 0 !important;
              }

              .hero-form-cf7 form .mb-8 {
                margin-bottom: 14px !important;
              }

              .hero-form-cf7 form .mb-4 {
                margin-bottom: 10px !important;
              }

              .hero-form-cf7 form .mt-4 {
                margin-top: 10px !important;
              }

              .hero-form-cf7 form .gap-4 {
                gap: 10px !important;
              }

              .hero-form-cf7 form .space-y-4 > :not([hidden]) ~ :not([hidden]) {
                margin-top: 10px !important;
              }

              .hero-form-cf7 form p {
                line-height: 1.35 !important;
              }

              .hero-form-cf7 form label {
                padding-top: 10px !important;
                padding-bottom: 10px !important;
              }

              .hero-form-cf7 form input:not([type="radio"]):not([type="checkbox"]):not([type="file"]),
              .hero-form-cf7 form select {
                height: 42px !important;
                min-height: 42px !important;
                padding-top: 0 !important;
                padding-bottom: 0 !important;
                font-size: 13px !important;
              }

              .hero-form-cf7 form textarea {
                min-height: 72px !important;
                padding-top: 10px !important;
                padding-bottom: 10px !important;
                font-size: 13px !important;
              }

              .hero-form-cf7 form button[type="submit"] {
                min-height: 42px !important;
                padding-top: 10px !important;
                padding-bottom: 10px !important;
              }
            `}</style>
          </div>
        </div>
      </div>

      <div
        onClick={(e) => {
          const section = e.currentTarget.closest("section");
          const next = section?.nextElementSibling;
          if (next) next.scrollIntoView({ behavior: "smooth" });
        }}
        className="absolute bottom-6 sm:bottom-12 left-1/2 -translate-x-1/2 z-20 cursor-pointer"
      >
        <svg
          viewBox="0 0 83 83"
          className="w-16 h-16 sm:w-[80px] sm:h-[80px]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect x="0.75" y="0.75" width="81.5" height="81.5" rx="40.75" stroke="white" strokeOpacity="0.9" strokeWidth="1.5" />
          <line x1="41.5228" y1="27.7045" x2="41.5228" y2="53.8409" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M48.7727 48.0454L41.5 55.3181L34.2273 48.0454" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>
    </section>
  );
}
