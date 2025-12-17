import Link from "next/link";

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
    <section className="relative w-full bg-[#E7ECF5] py-20">
      
      {/* LOCAL STYLE */}
      <style>{`
        .about-section-content em {
          color: #2655C4 !important;
          font-family: var(--font-merriweather), serif !important;
          font-style: italic;
          font-weight: 600;
        }
      `}</style>

      <div className="max-w-[1400px] mx-auto px-6 flex flex-col md:flex-row gap-10">

        {/* LEFT COLUMN */}
        <div className="md:w-[20%]">
          <div className="flex items-center gap-3 mb-6">
            <div className="relative w-[25px] h-[25px]">
              <div className="absolute inset-0 rounded-full border-[3px] border-[#BFC5D1]" />
              <div className="absolute inset-1 rounded-full bg-transparent" />
              <div className="absolute inset-2 rounded-full bg-[#2555C4]" />
            </div>

            <span className="uppercase text-[18px] tracking-wide font-semibold text-[#0A1A33]">
              {section_label}
            </span>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="md:w-[80%] about-section-content">

          {/* FIXED HEADING */}
          <div
            className="font-heading text-[32px] md:text-[42px] leading-[1.3] text-[#000] mb-10 max-w-[1000px]"
            suppressHydrationWarning={true}
            dangerouslySetInnerHTML={{ __html: heading || "" }}
          />

          {/* ROW */}
          <div className="flex flex-col md:flex-row gap-10">

            {/* LEFT SIDE */}
            <div className="md:w-[25%]">

              {/* FIXED DESCRIPTION */}
              <div
                suppressHydrationWarning={true}
                className="font-body text-[16px] md:text-[17px] leading-[1.7] text-[#1A1A1A] mb-6"
                
                dangerouslySetInnerHTML={{ __html: description || "" }}
                
              />

              {button_text && (
                <Link href={button_link} className="btn-primary inline-block">
                  {button_text}
                </Link>
              )}
            </div>

            {/* RIGHT SIDE IMAGE */}
            <div className="md:w-[75%]">
              {imgUrl && (
                <img
                  src={imgUrl}
                  alt={image?.alt || "About image"}
                  className="rounded-lg w-full h-auto object-cover shadow-md"
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
