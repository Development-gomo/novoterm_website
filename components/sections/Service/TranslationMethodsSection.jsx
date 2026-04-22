import Link from "next/link";
import { useRouter } from "next/router";
import { wpToPath } from "../../../lib/api";
import { pickWpImageUrl } from "../../../lib/wpImage";

export default function TranslationMethodsSection({ section, sectionId, index = 0 }) {
  const router = useRouter();
  const lang = router.locale || "sv";
  if (!section) return null;

  const { heading, translation_methods = [] } = section;

  const formatLabel = (layout) => {
    if (!layout) return null;
    return layout
      .replace(/_section$/, '')
      .replace(/^(services?_|casestudy_|blog_)/, '')
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase());
  };
  const mobileLabel = section.section_label || formatLabel(section.acf_fc_layout);

  return (
    <section id={sectionId} className="w-full bg-[#061837] py-6 md:py-10 lg:py-[100px]">
      <div className="web-width mx-auto px-6 md:px-0">
        <div className="flex flex-col lg:flex-row gap-0">

          {/* LEFT – 15% */}
          <div className="w-full lg:w-[15%] relative mb-6 lg:mb-0">
            {mobileLabel && (
              <div className="flex items-center gap-2 mb-4 lg:hidden">
                <span className="w-2 h-2 rounded-full bg-[#2655C4]" />
                <span className="uppercase font-montserrat font-medium text-[10px] tracking-wider text-white">
                  {mobileLabel}
                </span>
              </div>
            )}
          </div>

          {/* RIGHT – 85% */}
          <div className="w-full lg:w-[85%]">
            {heading && (
              <h2 className="font-heading text-[24px] sm:text-[28px] md:text-[40px] font-semibold leading-tight md:leading-[1.15] text-white mb-[32px] lg:mb-[48px] max-w-[580px]">
                {heading}
              </h2>
            )}

            <div className="flex flex-wrap gap-[24px] lg:gap-[32px]">
              {translation_methods.map((item, i) => {
                const imageUrl = pickWpImageUrl(item.image, "card");
                // Mobile: whole card is clickable, no button inside
                if (item.cta_link) {
                  return (
                    <Link
                      key={i}
                      href={wpToPath(item.cta_link, lang) || "#"}
                      className="block lg:hidden group w-full sm:w-[48%] lg:w-[353px] h-[420px] rounded-[4px] overflow-hidden bg-black"
                      tabIndex={0}
                    >
                      {/* IMAGE */}
                      <div className="w-full h-full group-hover:h-[239px] transition-all duration-500 ease-out relative overflow-hidden">
                        <div className="absolute inset-0" style={{ backgroundImage: `url(\"${imageUrl}\")`, backgroundSize: "cover", backgroundPosition: "center" }} />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent p-[24px] flex flex-col justify-end transition-opacity duration-300 group-hover:opacity-0">
                          {item.card_tag && (
                            <span className="text-[11px] uppercase tracking-widest text-[#5c83dd] mb-1">
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
                      <div className="w-full h-0 group-hover:h-[181px] transition-all duration-500 ease-out bg-[#FEE4CA] px-[24px] py-[20px] flex flex-col">
                        {item.card_tag && (
                          <span className="text-[11px] uppercase tracking-widest text-[#5c83dd] mb-1">
                            {item.card_tag}
                          </span>
                        )}
                        {item.card_title && (
                          <h3 className="text-[24px] font-semibold text-[#061837] ">
                            {item.card_title}
                          </h3>
                        )}
                        {/* No button on mobile to avoid nested <a> */}
                      </div>
                    </Link>
                  );
                }
                // If no link, fallback to non-clickable card
                return (
                  <div
                    key={i}
                    className="block lg:hidden group w-full sm:w-[48%] lg:w-[353px] h-[420px] rounded-[4px] overflow-hidden bg-black"
                  >
                    {/* IMAGE */}
                    <div className="w-full h-full group-hover:h-[239px] transition-all duration-500 ease-out relative overflow-hidden">
                      <div className="absolute inset-0" style={{ backgroundImage: `url(\"${imageUrl}\")`, backgroundSize: "cover", backgroundPosition: "center" }} />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent p-[24px] flex flex-col justify-end transition-opacity duration-300 group-hover:opacity-0">
                        {item.card_tag && (
                          <span className="text-[11px] uppercase tracking-widest text-[#5c83dd] mb-1">
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
                    <div className="w-full h-0 group-hover:h-[181px] transition-all duration-500 ease-out bg-[#FEE4CA] px-[24px] py-[20px] flex flex-col">
                      {item.card_tag && (
                        <span className="text-[11px] uppercase tracking-widest text-[#5c83dd] mb-1">
                          {item.card_tag}
                        </span>
                      )}
                      {item.card_title && (
                        <h3 className="text-[24px] font-semibold text-[#061837] ">
                          {item.card_title}
                        </h3>
                      )}
                      {/* No button on mobile to avoid nested <a> */}
                    </div>
                  </div>
                );
              })}
              {/* Desktop: original card, only button clickable */}
              {translation_methods.map((item, i) => {
                const imageUrl = pickWpImageUrl(item.image, "card");
                return (
                  <div key={"desktop-"+i} className="hidden lg:block group w-full sm:w-[48%] lg:w-[353px] h-[420px] rounded-[4px] overflow-hidden bg-black">
                    {/* IMAGE */}
                    <div className="w-full h-full group-hover:h-[239px] transition-all duration-500 ease-out relative overflow-hidden">
                      <div className="absolute inset-0" style={{ backgroundImage: `url(\"${imageUrl}\")`, backgroundSize: "cover", backgroundPosition: "center" }} />

                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent p-[24px] flex flex-col justify-end transition-opacity duration-300 group-hover:opacity-0">
                        {item.card_tag && (
                          <span className="text-[11px] uppercase tracking-widest text-[#5c83dd] mb-1">
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
                    <div className="w-full h-0 group-hover:h-[181px] transition-all duration-500 ease-out bg-[#FEE4CA] px-[24px] py-[20px] flex flex-col">
                      {item.card_tag && (
                        <span className="text-[11px] uppercase tracking-widest text-[#5c83dd] mb-1">
                          {item.card_tag}
                        </span>
                      )}
                      {item.card_title && (
                        <h3 className="text-[24px] font-semibold text-[#061837] ">
                          {item.card_title}
                        </h3>
                      )}
                      {item.cta_text && item.cta_link && (
                        <Link href={wpToPath(item.cta_link, lang) || "#"} className="btn-primary inline-block text-sm sm:text-base w-full text-center mt-[24px]">
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
