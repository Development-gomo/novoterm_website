import Image from "next/image";
import Link from "next/link";
import DotIndicator from "../../ui/DotIndicator";
import { wpToPath } from "../../../lib/api";
import { useRouter } from "next/router";

export default function InnerWhyChooseUsSection({ section, sectionId, index = 0 }) {
  const router = useRouter();
  const lang = router.locale || "en";
  const { left_column, right_column } = section || {};
  const { why_items, left_image } = left_column || {};
  const {
    section_label,
    heading,
    description,
    button_text,
    button_link,
    right_image,
  } = right_column || {};

  const formatLabel = (layout) => {
    if (!layout) return null;
    return layout
      .replace(/_section$/, "")
      .replace(/^(services?_|inner_)/, "")
      .replace(/_/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
  };

  // Fix: Use router.locale for language detection
  const getCustomLabel = () => {
    if (typeof right_column?.section_label === "string" && right_column.section_label.trim()) {
      return right_column.section_label.trim();
    }
    return formatLabel(section?.acf_fc_layout);
  };
  const mobileLabel = getCustomLabel();

  const leftImgUrl =
    typeof left_image === "string" ? left_image : left_image?.url || "";

  const rightImgUrl =
    typeof right_image === "string" ? right_image : right_image?.url || "";

  return (
    <section
      id={sectionId}
      className="w-full bg-[#061837] text-white py-15 md:py-[100px]"
    >
      <div className="web-width mx-auto px-6 md:px-0">
        {/* ================= 15 / 85 WRAPPER ================= */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-0">

          {/* ================= LEFT – 15% ================= */}
          <div className="w-full lg:w-[15%] relative">
            {mobileLabel && (
              <div className="flex items-center gap-2 mb-4 lg:hidden">
                <span className="w-2 h-2 rounded-full bg-[#2655C4]" />
                <span className="uppercase font-montserrat font-medium text-[10px] tracking-wider text-white">
                  {mobileLabel}
                </span>
              </div>
            )}
          </div>

          {/* ================= RIGHT – 85% ================= */}
          <div className="w-full lg:w-[85%]">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-[0px]">

              {/* LEFT COLUMN */}
              <div className="flex flex-col gap-[80px] md:gap-[120px] lg:gap-[172px]">

                {/* WHY ITEMS */}
                <div className="flex flex-col">
                  <hr className="border-white/20 w-full md:w-[400px]" />

                  {why_items?.map((item, i) => (
                    <div key={i} className="flex flex-col">
                      <div className="flex items-center gap-4 py-[16px] md:py-[20px]">
                        <div className="w-[24px] h-[24px] rounded-full bg-[#2655C4] flex items-center justify-center text-white text-sm font-semibold">
                          {i + 1}
                        </div>
                        <span className="text-[15px] md:text-[16px] font-montserrat font-medium">
                          {item.item_label}
                        </span>
                      </div>
                      <hr className="border-white/20 w-full md:w-[400px]" />
                    </div>
                  ))}
                </div>

                {/* LEFT IMAGE */}
                {leftImgUrl && (
                  <div className="w-full max-w-[286px] h-auto md:h-[340px]">
                    <Image
                      src={leftImgUrl}
                      alt="Why choose us left image"
                      width={286}
                      height={340}
                      className="rounded-[3px] object-cover w-full h-full"
                    />
                  </div>
                )}
              </div>

              {/* RIGHT COLUMN */}
              <div className="flex flex-col">

                {/* HEADING */}
                {heading && (
                  <h2 className="text-[26px] md:text-[32px] lg:text-[40px] font-semibold leading-tight mb-6">
                    {heading}
                  </h2>
                )}

                {/* DESCRIPTION */}
                {description && (
                  <div
                    className="text-[15px] md:text-[16px] leading-[24px] font-light mb-8 max-w-[450px]"
                    dangerouslySetInnerHTML={{ __html: description }}
                  />
                )}

                {/* CTA */}
                {button_text && (
                  <Link href={wpToPath(button_link) || "#"} className="btn-primary w-[161px] mb-12">
                    {button_text}
                  </Link>
                )}

                {/* RIGHT IMAGE */}
                {rightImgUrl && (
                  <div className="w-full max-w-[549px] h-auto md:h-[575px]">
                    <Image
                      src={rightImgUrl}
                      alt="Why choose us right image"
                      width={549}
                      height={575}
                      className="rounded-[3px] object-cover w-full h-full"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
