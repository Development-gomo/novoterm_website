export default function BlogHeroSection({ section }) {
  if (!section) return null;

  const {
    featured_image,
  } = section;

  const bgUrl =
    typeof featured_image === "string"
      ? featured_image
      : featured_image?.url ||
        featured_image?.sizes?.large ||
        featured_image?.sizes?.medium_large ||
        "";

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
      <div className="w-full flex flex-col sm:block">
      <div className="web-width mx-auto ">
        {/* HEADING */}
        <h1
          className="font-heading  font-semibold text-white 
              text-[32px] sm:text-[48px] md:text-[60px] lg:text-[80px]
              leading-tight md:leading-[90px] tracking-[1px]
              w-full  mx-auto sm:mx-0 mb-10"
        >
          Varför är tekniska  <i className=" italic  font-merriweather">översättningar viktiga?</i>
        </h1>


        {/* DESCRIPTION */}
        <div className="max-w-full sm:max-w-[611px] mt-6 sm:mt-8 lg:mt-0 mx-auto sm:mx-0 sm:text-left sm:!justify-self-end">
          <p className="font-body text-white/90
            text-[14px] sm:text-[15px] md:text-[16px] lg:text-[18px]
            leading-[24px]">
            Stay updated with the latest insights, trends, and news from the world of translation and localization. Explore expert tips, industry updates, and stories from our team.
          </p>
        </div>
        </div>
      </div>

      {/* DOWN ARROW */}
      <div
        onClick={() =>
          document
            .getElementById("next-section")
            ?.scrollIntoView({ behavior: "smooth" })
        }
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
