import Image from "next/image";
import Link from "next/link";
import { wpToPath } from "../../../lib/api";
import { HERO_IMAGE_QUALITY } from "../../../lib/imageConstants";
import { pickWpImageUrl } from "../../../lib/wpImage";

export default function IndustryHeroSection({
  heading,
  sub_heading,
  background_image,
  cta_text,
  cta_url,
  sectionId,
}) {
  const bgUrl = pickWpImageUrl(background_image, "heroNext");

  return (
    <section
      id={sectionId}
      className="relative z-50 w-full min-h-svh flex items-center justify-center overflow-hidden
                 px-4 sm:px-0"
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
          className="object-cover object-top"
        />
      )}
      {/* Dark gradient overlay */}
      <div
        className="absolute inset-0 z-[1]"
        style={{ background: "linear-gradient(180deg, rgba(6,24,55,0.50) 0%, #061837 100%)" }}
      />
      {/* CONTENT WRAPPER */}
      <div className="relative z-[2] w-full web-width  px-6  pb-28 pt-24 sm:py-24 lg:py-36 lg:px-48 flex flex-col sm:block">

        {/* HEADING */}
        {heading && (
          <h1
            className="font-heading  font-semibold text-white [&_em]:italic [&_em]:font-merriweather
              text-[32px] sm:text-[48px] md:text-[60px] lg:text-[80px]
              leading-tight md:leading-[90px] tracking-[1px]
              w-full  mx-auto sm:mx-0 mb-1"
            dangerouslySetInnerHTML={{ __html: heading }}
          />
        )}

        {/* DESCRIPTION + CTA */}
        <div
          className="max-w-full sm:max-w-[411px] mt-1 sm:mt-8 lg:mt-0 mx-auto sm:mx-0 sm:text-left
                     sm:!justify-self-end"
        >
          {sub_heading && (
            <div
              className="font-body text-white/90
                text-[14px] sm:text-[15px] md:text-[16px] lg:text-[18px]
                leading-[24px] my-[10px] md:my-[24px]"
              dangerouslySetInnerHTML={{ __html: sub_heading }}
            />
          )}

          {cta_text && cta_url && (
                      <Link
                        href={wpToPath(cta_url) || "#"}
                        className="btn-primary !inline-flex !w-auto px-6 sm:px-8
                                   text-sm sm:text-base mx-auto sm:mx-0"
                      >
                        {cta_text}
                      </Link>
                    )}
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
          
          
                {/* BOTTOM FADE */}
               
              </section>
            );
          }
          