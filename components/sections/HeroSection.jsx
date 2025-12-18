import Link from "next/link";

export default function HeroSection({
  background_image,
  top_word = "We",
  line1 = "TRANSLATE",
  line2 = "GLOBAL LANGUAGES",
  bottom_word = "With",
  bottom_line = "PRECISION",
  subheadline = "",
  button_text = "",
  button_link = "#",
}) {
  const bgUrl =
    typeof background_image === "string"
      ? background_image
      : background_image?.url ||
        background_image?.sizes?.large ||
        background_image?.sizes?.medium_large ||
        "";

  return (
    <section
      className="relative w-full min-h-screen flex items-center overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(180deg, rgba(6, 24, 55, 0.50) 0%, #061837 100%), url(${bgUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* CONTENT WRAPPER */}
      <div className="relative z-10 w-full max-w-[900px] sm:pt-[80px] md:pt-[90px] mx-auto flex flex-col justify-center h-auto min-h-[700px] lg:h-[800px] px-4 sm:px-6 lg:px-0">

        {/* BLOCK 1 */}
        <div className="text-left max-w-[900px]">
          <span className="block font-serif italic font-normal text-[36px] sm:text-[48px] md:text-[60px] lg:text-[80px] leading-tight md:leading-[90px] text-white">
            {top_word}
          </span>

          <h1 className="font-heading uppercase font-semibold text-white text-[36px] sm:text-[48px] md:text-[60px] lg:text-[80px] leading-tight md:leading-[90px] tracking-[1px] mt-1">
            {line1}
          </h1>

          <h1 className="font-heading uppercase font-semibold text-white text-[36px] sm:text-[48px] md:text-[60px] lg:text-[80px] leading-tight md:leading-[90px]">
            {line2}
          </h1>
        </div>

        {/* BLOCK 2 */}
        <div className="text-left max-w-[800px] mt-6 sm:mt-8 lg:mt-0 lg:ml-[235px]">

          {/* BOTTOM HEADLINE */}
          <h1 className="text-[36px] sm:text-[48px] md:text-[60px] lg:text-[80px] leading-tight md:leading-[90px] mb-[6px]">
            <span className="font-serif italic font-normal text-white">
              {bottom_word}
            </span>{" "}
            <span className="font-heading uppercase !font-semibold text-white">
              {bottom_line}
            </span>
          </h1>

          {/* SAFE WRAPPER — FIXES HYDRATION */}
          <div suppressHydrationWarning={true}>
            {/* Subheadline */}
            {subheadline && (
              <div
                className="font-body text-white/90 text-[14px] sm:text-[15px] md:text-[16px] lg:text-[18px] leading-[1.6] mb-[20px] sm:mb-[24px] font-normal"
                dangerouslySetInnerHTML={{ __html: subheadline }}
              />
            )}

            {/* CTA BUTTON */}
            {button_text && (
              <Link
                href={button_link}
                className="btn-primary inline-block text-sm sm:text-base"
              >
                {button_text}
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 w-full h-32 sm:h-40 lg:h-48 bg-gradient-to-t from-[#061837] to-transparent" />
    </section>
  );
}
