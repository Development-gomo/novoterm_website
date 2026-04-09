import Link from "next/link";
import DotIndicator from "../../ui/DotIndicator";
import { wpToPath } from "../../../lib/api";
import HeroBackdrop from "../../ui/HeroBackdrop";

const EXPERTS_GRADIENT =
  "linear-gradient(180deg, rgba(6, 24, 55, 0.21) 13.86%, rgba(6, 24, 55, 0.70) 100%)";

export default function FullWidthExpertsSection({
  background_image,
  section_label,
  intro_paragraph,
  heading,
  cta_button_text,
  cta_button_link,
}) {
  return (
    <section className="relative w-full py-15 md:py-[100px] h-auto overflow-hidden">
      <HeroBackdrop
        media={background_image}
        gradient={EXPERTS_GRADIENT}
        priority={false}
      />

      <style>{`
        .experts-content em {
          color: #ffffff !important;
          font-family: var(--font-merriweather), serif !important;
          font-style: italic;
          font-weight: 400 !important;
        }
      `}</style>

      <div
        className="
          relative
          z-10
          web-width
          mx-auto
          px-6
          md:px-0
          grid
          grid-cols-1
          md:grid-cols-2
          gap-8
          md:gap-10
        "
      >

        <div className="experts-content flex flex-col justify-center text-white">

          <div className="flex items-center gap-2 mb-4 md:mb-6">
            <DotIndicator variant="white" />
            <span className="uppercase font-montserrat font-medium text-[10px] sm:text-[10px] md:text-[12px] tracking-wider">
              {section_label}
            </span>
          </div>

          <div
            className="
              max-w-[390px]
              text-[14px]
              sm:text-[15px]
              md:text-[16px]
              leading-[1.6]
              md:leading-[1.7]
              opacity-95
              mb-5
              md:mb-[80px]
            "
            dangerouslySetInnerHTML={{ __html: intro_paragraph || "" }}
            suppressHydrationWarning
          />

          <div
            className="block font-serif font-semibold text-[36px] sm:text-[48px] 
            md:text-[60px] lg:text-[80px] leading-tight md:leading-[90px] text-white lg:w-[900px]"
            dangerouslySetInnerHTML={{ __html: heading || "" }}
            suppressHydrationWarning
          />
        </div>

        <div
          className="
            flex
            items-start
            md:items-end
            justify-start
            md:justify-end
            w-full
          "
        >
          {cta_button_text?.trim() && (
            <Link
              href={wpToPath(cta_button_link) || "#"}
              className="btn-primary text-sm sm:text-base px-5 py-3 sm:px-6 md:px-8 md:py-4"
            >
              {cta_button_text}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
