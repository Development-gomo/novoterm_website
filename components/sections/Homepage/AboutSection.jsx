import Link from "next/link";
import DotIndicator from "../../ui/DotIndicator";

export default function AboutSection({
  section_label,
  heading,
  description,
  button_text,
  button_link,
  image,
}) {
  const imgUrl =
    typeof image === "string"
      ? image
      : image?.url ||
        image?.sizes?.large ||
        image?.sizes?.medium_large ||
        "";


  return (
    <section className="relative w-full bg-[#E3EDFF] py-[40px] px-4 sm:px-6 md:py-10 lg:py-[100px] lg:px-[80px]">
      
      {/* LOCAL STYLE */}
      <style>{`
        .about-section-content em {
          color: #2655C4 !important;
          font-family: var(--font-merriweather), serif !important;
          font-style: italic;
          font-weight: 600;
        }
      `}</style>

      <div className=" mx-auto flex flex-col md:flex-row gap-6 md:gap-8">

        {/* LEFT COLUMN */}
        <div className="md:w-[15%]">
          <div className="flex items-center gap-2 mb-4 md:mb-6">
            <DotIndicator />
            <span className="uppercase font-montserrat font-medium text-[10px] sm:text-[10px] md:text-[12px] tracking-wider text-black">
              {section_label}
            </span>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="md:w-[85%] about-section-content">

          {/* FIXED HEADING */}
          <div
            className="
              font-heading 
              font-semibold
              text-[28px]
              sm:text-[34px]
              md:text-[40px]
              lg:text-[48px]
              leading-[36px]
              sm:leading-[44px]
              md:leading-[52px]
              lg:leading-[58px]
              text-[#000]
              mb-8
              md:mb-10
              max-w-[1050px]
            "
            suppressHydrationWarning={true}
            dangerouslySetInnerHTML={{ __html: heading || "" }}
          />

          {/* ROW */}
          <div className="flex flex-col md:flex-row gap-8 md:gap-10">

            {/* LEFT SIDE */}
            <div className="md:w-[23%]">

              {/* FIXED DESCRIPTION */}
              <div
                suppressHydrationWarning={true}
                className="
                  font-body
                  text-[14px]   sm:text-[15px]   md:text-[16px] 
                  leading-[1.4]
                  md:leading-[1.5]
                  text-[#1A1A1A]
                  mb-6
                "
                dangerouslySetInnerHTML={{ __html: description || "" }}
              />

              {button_text && (
                <Link
                  href={button_link}
                  className="btn-primary inline-block text-sm sm:text-base"
                >
                  {button_text}
                </Link>
              )}
            </div>

            {/* RIGHT SIDE IMAGE */}
            <div className="md:w-[80%]">
              {imgUrl && (
                <img
                  src={imgUrl}
                  alt={image?.alt || "About image"}
                  className="
                    rounded-[3px] w-full h-auto object-cover lg:h-[424px]"
                  style={{ aspectRatio: "3 / 2" }}
                />
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
