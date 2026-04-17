import Image from "next/image";
import Link from "next/link";
import { wpToPath } from "../../../lib/api";
import { HERO_IMAGE_QUALITY } from "../../../lib/imageConstants";
import { pickWpImageUrl } from "../../../lib/wpImage";

export default function HeroSection({
  background_image,
  heading = "",
  subheadline = "",
  button_text = "",
  button_link = "#",
}) {
  // Use pickWpImageUrl("heroNext") so the source URL matches LcpHeroPreload exactly —
  // prefers sizes.large (1024px WP thumbnail) over the raw full-resolution URL.
  // Mismatched URLs waste the preload and force the optimizer to process a giant source.
  const bgUrl = pickWpImageUrl(background_image, "heroNext");

  return (
    <section
      id={`section-0`}
      className="relative z-50 w-full min-h-screen flex items-center overflow-hidden"
    >
      {/* Background via next/image — enables AVIF/WebP, srcset, and early preload */}
      {bgUrl && (
        <Image
          src={bgUrl}
          alt=""
          fill
          priority
          fetchPriority="high"
          quality={HERO_IMAGE_QUALITY}
          sizes="100vw"
          className="object-cover object-center"
        />
      )}
      {/* Dark gradient overlay */}
      <div
        className="absolute inset-0 z-[1]"
        style={{ background: "linear-gradient(180deg, rgba(6, 24, 55, 0.50) 0%, #061837 100%)" }}
      />
      {/* CONTENT WRAPPER */}
      <div className="relative z-[2] min-h-[100vh] web-width px-6 py-24 lg:py-36 lg:px-48 h-full flex flex-col items-start justify-center">

        {/* BLOCK 1 – heading from ACF */}
        <div className="text-left">
          <h1 suppressHydrationWarning={true}
            className="font-heading font-semibold text-white text-[36px] sm:text-[48px] md:text-[60px] lg:text-[80px] leading-tight md:leading-[90px] tracking-[1px]  [&_em]:font-serif [&_em]:normal-case [&_em]:italic [&_em]:font-normal"
            dangerouslySetInnerHTML={{ __html: heading }}
          />
        </div>

        {/* BLOCK 2 – subheading + CTA */}
        <div className="text-left mt-6 sm:mt-8 lg:mt-0 lg:ml-[235px]">
          <div suppressHydrationWarning={true}>
            {subheadline && (
              <div
                className="font-body text-white text-[14px] sm:text-[15px] md:text-[16px] lg:text-[18px] leading-[24px] mb-[20px] sm:my-[24px] font-normal"
                dangerouslySetInnerHTML={{ __html: subheadline }}
              />
            )}
            {button_text && (
              <Link
                href={wpToPath(button_link) || "#"}
                className="btn-primary inline-block text-sm sm:text-base"
              >
                {button_text}
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* DOWN ARROW */}
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

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 w-full h-32 sm:h-40 lg:h-48 bg-gradient-to-t from-[#061837] to-transparent" />
    </section>
  );
}
