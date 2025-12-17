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
        backgroundImage: `linear-gradient(180deg, rgba(6,24,55,0.75) 0%, rgba(6,24,55,0.95) 70%), url(${bgUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* CONTENT WRAPPER */}
      <div className="relative z-10 w-full max-w-[900px] pt-[90px] mx-auto flex flex-col justify-center h-[800px]">

        {/* BLOCK 1 */}
        <div className="text-left max-w-[900px]">
          <span className="block font-serif italic font-normal text-[60px] md:text-[70px] lg:text-[80px] leading-[0.9] text-white">
            {top_word}
          </span>

          <h1 className="font-heading uppercase font-semibold text-white text-[60px] md:text-[70px] lg:text-[80px] leading-[0.9] tracking-[-0.03em] mt-1">
            {line1}
          </h1>

          <h1 className="font-heading uppercase font-semibold text-white text-[60px] md:text-[70px] lg:text-[80px] leading-[0.9] tracking-[-0.03em]">
            {line2}
          </h1>
        </div>

        {/* BLOCK 2 */}
        <div className="text-left max-w-[650px] lg:ml-[285px]">

          {/* BOTTOM HEADLINE */}
          <h1 className="text-[60px] md:text-[70px] lg:text-[80px] leading-[0.9] tracking-[-0.03em]">
            <span className="font-serif italic font-normal text-white">
              {bottom_word}
            </span>{" "}
            <span className="font-heading uppercase text-white">
              {bottom_line}
            </span>
          </h1>

          {/* SAFE WRAPPER — FIXES HYDRATION */}
          <div className="mt-6 space-y-6" suppressHydrationWarning={true}>

            {/* Subheadline */}
            {subheadline && (
              <div
                className="font-body text-white/90 text-[16px] md:text-[18px] leading-[1.6]"
                dangerouslySetInnerHTML={{ __html: subheadline }}
              />
            )}

            {/* CTA BUTTON */}
            {button_text && (
              <Link href={button_link} className="btn-primary inline-block">
                {button_text}
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 w-full h-48 bg-gradient-to-t from-[#061837] to-transparent" />
    </section>
  );
}
