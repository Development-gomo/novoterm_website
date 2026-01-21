import Link from "next/link";

export default function ServicesHeroSection({
  heading,
  sub_heading,
  background_image,
  cta_text,
  cta_url,
}) {
  const bgUrl =
    typeof background_image === "string"
      ? background_image
      : background_image?.url ||
        background_image?.sizes?.large ||
        background_image?.sizes?.medium_large ||
        "";

  // 🔥 Make only the word "Services" italic
  const formattedHeading = heading
    ? heading.replace(
        /\bServices\b/g,
        '<span class="font-serif italic normal-case">Services</span>'
      )
    : "";

  return (
    <section
      className="relative w-full min-h-screen flex items-center justify-center overflow-hidden
                 px-4 sm:px-0"
      style={{
        backgroundImage: bgUrl
          ? `linear-gradient(180deg, rgba(6,24,55,0.50) 0%, #061837 100%), url(${bgUrl})`
          : `linear-gradient(180deg, rgba(6,24,55,0.50) 0%, #061837 100%)`,
        backgroundColor: "lightgray",
        backgroundPosition: "top center",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* CONTENT WRAPPER */}
      <div className="w-full max-w-[900px] flex flex-col sm:block">

        {/* HEADING */}
        {formattedHeading && (
          <h1
            className="font-heading uppercase font-semibold text-white
              text-[32px] sm:text-[48px] md:text-[60px] lg:text-[80px]
              leading-tight md:leading-[90px] tracking-[1px]
              w-full sm:w-[600px] mx-auto sm:mx-0"
            dangerouslySetInnerHTML={{ __html: formattedHeading }}
          />
        )}

        {/* DESCRIPTION + CTA */}
        <div
          className="max-w-full sm:max-w-[411px]
                     mt-6 sm:mt-8 lg:mt-0
                     mx-auto sm:mx-0
                      sm:text-left
                     sm:!justify-self-end"
        >
          {sub_heading && (
            <div
              className="font-body text-white/90
                text-[14px] sm:text-[15px] md:text-[16px] lg:text-[18px]
                leading-[1.6] mb-[20px] sm:mb-[24px]"
              dangerouslySetInnerHTML={{ __html: sub_heading }}
            />
          )}

          {cta_text && cta_url && (
            <Link
              href={cta_url}
              className="btn-primary !inline-flex !w-auto px-6 sm:px-8
                         text-sm sm:text-base mx-auto sm:mx-0"
            >
              {cta_text}
            </Link>
          )}
        </div>
      </div>

      {/* DOWN ARROW */}
      <div className="absolute bottom-6 sm:bottom-15 left-1/2 -translate-x-1/2 z-20">
        <svg
          width="64"
          height="64"
          viewBox="0 0 83 83"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="cursor-pointer sm:w-[80px] sm:h-[80px]"
        >
          <rect
            x="0.75"
            y="0.75"
            width="81.5"
            height="81.5"
            rx="40.75"
            stroke="white"
            strokeOpacity="0.9"
            strokeWidth="1.5"
          />
          <line
            x1="41.5228"
            y1="27.7045"
            x2="41.5228"
            y2="53.8409"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M48.7727 48.0454L41.5 55.3181L34.2273 48.0454"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* BOTTOM FADE */}
      <div className="absolute bottom-0 left-0 w-full h-28 sm:h-40 lg:h-48 bg-gradient-to-t from-[#061837] to-transparent" />
    </section>
  );
}
