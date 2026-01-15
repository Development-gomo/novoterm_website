import Link from "next/link";
import DotIndicator from "../../ui/DotIndicator";

export default function FullWidthExpertsSection({
  background_image,
  section_label,
  intro_paragraph,
  heading,
  cta_button_text,
  cta_button_link,
}) {
  const bg =
    typeof background_image === "string"
      ? background_image
      : background_image?.url ||
        background_image?.sizes?.large ||
        background_image?.sizes?.medium_large ||
        "";

  return (
    <section
      className="relative w-full px-4 sm:px-6 md:px-10 lg:py-[100px] py-14 sm:py-16 lg:px-[80px] h-auto bg-cover bg-center bg-no-repeat lg:bg-[length:123.035%_129.455%]
        lg:bg-[position:-131px_-149.444px]
      "
      style={{
        backgroundImage: `
          linear-gradient(
            180deg,
            rgba(6, 24, 55, 0.21) 13.86%,
            rgba(6, 24, 55, 0.70) 100%
          ),
          url(${bg})
        `,
      }}
    >
      
      {/* Custom italic styling for <em> */}
      <style>{`
        .experts-content em {
          color: #ffffff !important;
          font-family: var(--font-merriweather), serif !important;
          font-style: italic;
          font-weight: 400 !important;
        }
      `}</style>

      {/* Wrapper */}
      <div
        className="
          relative
          z-10
          w-full
          mx-auto
          grid
          grid-cols-1
          md:grid-cols-2
          gap-8
          md:gap-10
        "
      >
        
        {/* LEFT CONTENT */}
        <div className="experts-content flex flex-col justify-center text-white">

          {/* Dot + Label */}
          <div className="flex items-center gap-2 mb-4 md:mb-6">
            <DotIndicator variant="white" />
            <span className="uppercase font-montserrat font-medium text-[10px] sm:text-[10px] md:text-[12px] tracking-wider">
              {section_label}
            </span>
          </div>

          {/* Intro Paragraph */}
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

          {/* Heading */}
          <div
            className="block font-serif font-semibold text-[36px] sm:text-[48px] 
            md:text-[60px] lg:text-[80px] leading-tight md:leading-[90px] text-white max-w-[900px]"
            dangerouslySetInnerHTML={{ __html: heading || "" }}
            suppressHydrationWarning
          />
        </div>

        {/* RIGHT BUTTON */}
        <div
          className="
            flex
            items-start
            md:items-end
            justify-start
            md:justify-end
            w-full
            pt-0    md:pt-0
            pr-0
            md:pr-10
            pb-0
            md:pb-[20px]
          "
        >
          {cta_button_text?.trim() && (
            <Link
              href={cta_button_link || "#"}
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
