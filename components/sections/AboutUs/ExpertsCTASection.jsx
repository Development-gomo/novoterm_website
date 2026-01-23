import Link from "next/link";

/* Normalize image safely */
const getImage = (img) => {
  if (!img) return null;
  if (typeof img === "string") return img;
  return img.url || img.sizes?.large || img.sizes?.medium_large || null;
};

export default function ExpertsCTASection({ section }) {
  if (!section) return null;

  const { background_image, heading, cta_text, cta_url } = section;
  const bgUrl = getImage(background_image);

  return (
    <section
      className="relative w-full bg-center bg-cover
                 h-[700px]
                 px-[24px] sm:px-[40px] lg:px-[80px]
                 py-[100px]"
      style={{
        background: bgUrl
          ? `linear-gradient(
              180deg,
              rgba(6, 24, 55, 0.21) 13.86%,
              rgba(6, 24, 55, 0.70) 100%
            ),
            url(${bgUrl}) center / cover no-repeat`
          : undefined,
      }}
    >
      {/* CONTENT */}
      <div className="relative z-10 h-full flex items-end">
        <div
          className="w-full mx-auto
                     flex flex-col lg:flex-row
                     lg:items-end
                     lg:justify-between
                     gap-8"
        >
          {/* HEADING */}
          {heading && (
            <div
              className="text-white font-heading font-semibold
                         text-[28px] sm:text-[40px] md:text-[60px] lg:text-[80px]
                         leading-tight max-w-[760px]
                         [&_em]:italic
                         [&_strong]:font-semibold"
              dangerouslySetInnerHTML={{ __html: heading }}
            />
          )}

          {/* CTA BUTTON */}
          {cta_text && cta_url && (
            <Link
              href={cta_url}
              className="btn-primary inline-flex items-center"
            >
              {cta_text}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
