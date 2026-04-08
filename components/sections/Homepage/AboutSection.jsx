import Link from "next/link";
import Image from "next/image";
import DotIndicator from "../../ui/DotIndicator";
import { wpToPath } from "../../../lib/api";

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
    <section className="relative bg-[#E3EDFF] py-15 md:py-[100px]">
      
      {/* LOCAL STYLE */}
      <style>{`
        .about-section-content em {
          color: #2655C4 !important;
          font-family: var(--font-merriweather), serif !important;
          font-style: italic;
          font-weight: 600;
        }
      `}</style>

      <div className="web-width mx-auto px-6 md:px-0 flex flex-col md:flex-row">

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
                  href={wpToPath(button_link) || "#"}
                  className="btn-primary inline-block text-sm sm:text-base"
                >
                  {button_text}
                </Link>
              )}
            </div>

            {/* RIGHT SIDE IMAGE */}
            <div className="md:w-[80%]">
              {imgUrl && (
                <div className="relative w-full rounded-[3px] overflow-hidden" style={{ aspectRatio: "3 / 2" }}>
                  <Image
                    src={imgUrl}
                    alt={image?.alt || "About image"}
                    fill
                    sizes="(max-width: 768px) 100vw, 80vw"
                    className="object-cover"
                  />
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
