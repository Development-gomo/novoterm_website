// components/FeatureRows.jsx
export default function FeatureRows({ acfLayout }) {
  if (!acfLayout?.rows?.length) return null;

  const toUrl = (img) =>
    (img && (img.url || img.sizes?.large || img.sizes?.medium_large)) || "";

  return (
    <section className="w-full bg-[#fff] py-16 md:py-24">
      <div className="mx-auto max-w-[1200px] space-y-24">
        {acfLayout.rows.map((item, i) => {
          const imgUrl = toUrl(item.image);
          const imageFirst = item.layout_type !== "image_right";

          return (
            <div
              key={i}
              className="grid items-center gap-10 md:grid-cols-2"
            >
              {/* IMAGE */}
              <div className={imageFirst ? "" : "md:order-2"}>
                {imgUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={imgUrl}
                    alt={item.image?.alt || ""}
                    className="w-full max-w-[560px] h-auto rounded-[18px] object-cover mx-auto"
                  />
                )}
              </div>

              {/* COPY */}
              <div className={imageFirst ? "" : "md:order-1"}>
                {item.label_pill && (
                  <span className="inline-block rounded-md bg-[#E6E8E1] px-2.5 py-1 text-[12px] font-semibold tracking-wide text-[#1b1b1b] uppercase mb-4">
                    {item.label_pill}
                  </span>
                )}

                {item.heading && (
                  <h3 className="text-[40px] leading-tight md:text-[44px] font-extrabold text-[#0E0E0E]">
                    {item.heading}
                  </h3>
                )}

                {item.description && (
                  <div
                    className="mt-4 max-w-[560px] text-[18px] md:text-[20px] leading-[1.7] text-[#2A2A2A] opacity-90"
                    dangerouslySetInnerHTML={{ __html: item.description }}
                  />
                )}

                {item.cta_text && item.cta_link && (
                  <a
                    href={item.cta_link}
                    className="mt-6 inline-flex items-center justify-center rounded-[10px] bg-[#6C8E5E] px-[22px] py-[10px] text-[16px] font-semibold text-white transition hover:bg-[#5b7b50]"
                  >
                    {item.cta_text}
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
