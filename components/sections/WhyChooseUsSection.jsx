"use client";

import Image from "next/image";
import Link from "next/link";

export default function WhyChooseUsSection({ left_column, right_column }) {
  const { why_items, left_image } = left_column || {};
  const {
    section_label,
    heading,
    description,
    button_text,
    button_link,
    right_image,
  } = right_column || {};

  // Accept string URL or image object
  const leftImgUrl =
    typeof left_image === "string" ? left_image : left_image?.url || "";

  const rightImgUrl =
    typeof right_image === "string" ? right_image : right_image?.url || "";

  return (
    <section className="w-full bg-[#061837] text-white px-6 py-[60px] md:py-[80px]">
      <div className="max-w-[1350px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-[140px]">

        {/* LEFT COLUMN */}
        <div className="flex flex-col gap-[80px] md:gap-[120px] lg:gap-[172px]">

          {/* WHY ITEMS */}
          <div className="flex flex-col">
            <hr className="border-white/20 w-full md:w-[400px]" />

            {why_items?.map((item, index) => (
              <div key={index} className="flex flex-col">
                <div className="flex items-center gap-4 py-[16px] md:py-[20px]">
                  <div className="w-[24px] h-[24px] rounded-full bg-[#2655C4] flex items-center justify-center text-white text-sm font-semibold">
                    {index + 1}
                  </div>
                  <span className="text-[15px] md:text-[16px] font-light">
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

          {/* SECTION LABEL */}
          <div className="flex items-center gap-3 mb-6">
            <div className="relative w-[18px] h-[18px]">
              <div className="absolute inset-0 rounded-full border border-[#BFC5D1]" />
              <div className="absolute inset-1 rounded-full bg-white" />
              <div className="absolute inset-2 rounded-full bg-[#2555C4]" />
            </div>
            <span className="uppercase text-[12px] md:text-[13px] tracking-wider opacity-80">
              {section_label}
            </span>
          </div>

          {/* HEADING */}
          <h2 className="text-[26px] md:text-[32px] lg:text-[40px] font-semibold leading-tight mb-6">
            {heading}
          </h2>

          {/* DESCRIPTION */}
          <div
            className="text-[15px] md:text-[16px] leading-[1.7] font-light mb-8 max-w-[450px]"
            dangerouslySetInnerHTML={{ __html: description }}
          />

          {/* CTA */}
          {button_text && (
            <Link href={button_link || "#"} className="btn-primary w-[161px] mb-12">
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
    </section>
  );
}
