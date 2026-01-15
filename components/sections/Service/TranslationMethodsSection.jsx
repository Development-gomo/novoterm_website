import Link from "next/link";

export default function TranslationMethodsSection({ section }) {
  if (!section) return null;

  const {
    section_label,
    heading,
    translation_methods = [],
  } = section;

  return (
    <section className="w-full bg-[#061837] p-[80px]">
      <div className="mx-auto">

        <div className="flex gap-0">

          {/* LEFT – 15% */}
          <div className="w-[15%]">
            <div className="flex items-center gap-3 mt-2">
              <span className="w-2 h-2 rounded-full bg-white/80" />
              {section_label && (
                <span className="uppercase text-[12px] tracking-widest text-white/70">
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
                  font-heading font-semibold text-white
                  text-[36px] leading-[1.3]
                  mb-[48px] max-w-[720px]
                "
              >
                {heading}
              </h2>
            )}

            {/* CARDS */}
            <div className="flex gap-[32px] flex-wrap">

              {translation_methods.map((item, index) => {
                const imageUrl =
                  typeof item.image === "string"
                    ? item.image
                    : item.image?.url ||
                      item.image?.sizes?.large ||
                      "";

                return (
                  <div
                    key={index}
                    className="
                      group
                      w-[353px] h-[420px]
                      rounded-[4px]
                      overflow-hidden
                      bg-black
                    "
                  >
                    {/* IMAGE */}
                    <div
                      className="
                        w-full
                        h-full
                        group-hover:h-[239px]
                        transition-all duration-500 ease-out
                        relative
                        overflow-hidden
                      "
                    >
                      {/* IMAGE BG */}
                      <div
                        className="absolute inset-0"
                        style={{
                          backgroundImage: `url("${imageUrl}")`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                        }}
                      />

                      {/* OVERLAY + TEXT (DEFAULT ONLY) */}
                      <div
                        className="
                          absolute inset-0
                          bg-gradient-to-t from-black/70 to-transparent
                          p-[24px]
                          flex flex-col justify-end
                          transition-opacity duration-300
                          group-hover:opacity-0
                        "
                      >
                        {item.card_tag && (
                          <span className="text-[11px] uppercase tracking-widest text-white/80 mb-1">
                            {item.card_tag}
                          </span>
                        )}

                        {item.card_title && (
                          <h3 className="text-white text-[20px] font-semibold">
                            {item.card_title}
                          </h3>
                        )}
                      </div>
                    </div>

                    {/* HOVER CONTENT */}
                    <div
                      className="
                        w-full
                        h-0
                        group-hover:h-[181px]
                        transition-all duration-500 ease-out
                        bg-[#FEE4CA]
                        px-[24px] py-[20px]
                        flex flex-col
                      "
                    >
                      {item.card_tag && (
                        <span className="text-[11px] uppercase tracking-widest text-[#1A1A1A] mb-1">
                          {item.card_tag}
                        </span>
                      )}

                      {item.card_title && (
                        <h3 className="text-[20px] font-semibold text-[#1A1A1A] mb-4">
                          {item.card_title}
                        </h3>
                      )}

                      {item.cta_text && item.cta_link && (
                        <Link
                          href={item.cta_link}
                          className="
                            btn-primary
                            inline-block
                            text-sm sm:text-base
                            w-full
                            text-center
                            mt-auto
                          "
                        >
                          {item.cta_text}
                        </Link>
                      )}
                    </div>

                  </div>
                );
              })}

            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
