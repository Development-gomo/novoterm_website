export default function ServiceIntroFrontend({ section }) {
  if (!section) return null;

  const {
    section_label,
    heading,
    image,
    content_blocks = [],
  } = section;

  const imageUrl =
    typeof image === "string"
      ? image
      : image?.url ||
        image?.sizes?.large ||
        image?.sizes?.medium_large ||
        "";

  return (
    <section className="w-full bg-[#EAF1FF] p-[80px]">
      <div className="mx-auto">

        <div className="flex gap-0">

          {/* LEFT – 15% */}
          <div className="w-[15%]">
            <div className="flex items-center gap-3 mt-2">
              <span className="w-2 h-2 rounded-full bg-[#2655C4]" />
              {section_label && (
                <span className="uppercase text-[12px] tracking-widest text-[#0A1A3A]">
                  {section_label}
                </span>
              )}
            </div>
          </div>

          {/* RIGHT – 85% */}
          <div className="w-[85%]">

            {/* HEADING */}
            {heading && (
              <h2
                className="
                  max-w-[960px]
                  font-heading font-semibold text-[#0A1A3A]
                  text-[44px] leading-[1.25]
                  mb-[64px]
                "
                dangerouslySetInnerHTML={{ __html: heading }}
              />
            )}

            {/* CONTENT GRID */}
            <div className="grid grid-cols-[420px_1fr] gap-0 items-start">

              {/* IMAGE */}
              {imageUrl && (
                <div
                  className="
                    w-[360px] h-[450px]
                    rounded-[3px]
                    bg-no-repeat
                    bg-[length:102.765%_123.348%]
                    bg-[position:0px_-60px]
                  "
                  style={{
                    backgroundImage: `url("${imageUrl}")`,
                    backgroundColor: "lightgray",
                  }}
                />
              )}

              {/* TEXT BLOCKS */}
              {content_blocks.length > 0 && (
                <div className="space-y-[32px]">
                  {content_blocks.map((block, index) => (
                    <div key={index}>
                      {block?.title && (
                        <h3 className="text-[18px] font-semibold text-[#0A1A3A] mb-2">
                          {block.title}
                        </h3>
                      )}
                      {block?.content && (
                        <div
                          className="text-[15px] leading-[1.7] text-[#1A1A1A]"
                          dangerouslySetInnerHTML={{ __html: block.content }}
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}

            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
