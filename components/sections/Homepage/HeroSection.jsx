import Link from "next/link";
import { wpToPath } from "../../../lib/api";

export default function HeroSection({
  background_image,
  heading = "",
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
      <div className="relative min-h-[100vh] web-width px-6 py-24 lg:py-36 lg:px-48 h-full flex flex-col items-start justify-center lg:justify-start">

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

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 w-full h-32 sm:h-40 lg:h-48 bg-gradient-to-t from-[#061837] to-transparent" />
    </section>
  );
}
