import Link from "next/link";

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
      className="relative w-full px-6 py-[80px] md:px-[80px] h-[700px]"
      style={{
        backgroundImage: `
          linear-gradient(
            180deg,
            rgba(6, 24, 55, 0.21) 13.86%,
            rgba(6, 24, 55, 0.70) 100%
          ),
          url(${bg})
        `,
        backgroundSize: "123.035% 129.455%",
        backgroundPosition: "-131px -149.444px",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Custom italic styling for <em> */}
      <style>{`
        .experts-content em {
          color: #ffffff !important;
          font-family: var(--font-merriweather), serif !important;
          font-style: italic;
          font-weight: 400;
        }
      `}</style>

      {/* Wrapper */}
      <div className="relative z-10 w-full mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
        
        {/* LEFT CONTENT */}
        <div className="experts-content flex flex-col justify-center text-white">

          {/* Dot + Label */}
          <div className="flex items-center gap-3 mb-6">
            <div className="relative w-[22px] h-[22px] shrink-0">
              <div className="absolute inset-0 rounded-full border-[2px] border-[#BFC5D1]" />
              <div className="absolute inset-1 rounded-full bg-white" />
              <div className="absolute inset-2 rounded-full bg-[#2555C4]" />
            </div>

            <span className="uppercase text-[14px] tracking-wider opacity-90">
              {section_label}
            </span>
          </div>

          {/* Intro Paragraph */}
          <div
            className="max-w-[390px] text-[16px] leading-[1.7] opacity-95 mb-6 md:mb-8"
            dangerouslySetInnerHTML={{ __html: intro_paragraph || "" }}
            suppressHydrationWarning
          />

          {/* Heading */}
          <div
            className="text-[32px] md:text-[45px] lg:text-[70px] font-heading leading-[1.1] max-w-[900px]"
            dangerouslySetInnerHTML={{ __html: heading || "" }}
            suppressHydrationWarning
          />
        </div>

        {/* RIGHT BUTTON */}
        <div className="flex items-end justify-start md:justify-end w-full pr-0 md:pr-10 pb-[10px] md:pb-[20px]">
          {cta_button_text?.trim() && (
            <Link
              href={cta_button_link || "#"}
              className="btn-primary text-sm md:text-base px-6 py-3 md:px-8 md:py-4"
            >
              {cta_button_text}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
