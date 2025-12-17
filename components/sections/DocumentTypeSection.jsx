"use client";

import { useEffect, useState } from "react";
import DocumentTypeSlider from "../../components/DocumentTypeSlider";

export default function DocumentTypeSection({
  section_title,
  heading,
  paragraph,
  button,
  button_url,
}) {
  const [slides, setSlides] = useState([]);

  useEffect(() => {
    async function getData() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_WP_URL}/wp-json/wp/v2/document_type?acf_format=standard`
        );

        let data = await res.json();

        let formatted = data.map((post) => ({
          slug: post.slug,
          heading: post.acf.heading,
          subtext: post.acf.subtext,
          cs_image: post.acf.cs_image,
        }));

        const order = [
          "Web pages",
          "Annual reports",
          "Quarterly reports",
          "Other documents",
        ];

        formatted = formatted.sort(
          (a, b) =>
            order.indexOf(a.heading.trim()) -
            order.indexOf(b.heading.trim())
        );

        setSlides(formatted);
      } catch (error) {
        console.error("DOCUMENT TYPE FETCH ERROR:", error);
      }
    }

    getData();
  }, []);

  return (
    <section className="relative w-full p-[80px] bg-[#061837] text-white">
      <div className="mx-auto">

        {/* TOP LABEL */}
        <div className="flex items-center gap-3 mb-6">
          <div className="relative w-[22px] h-[22px]">
            <div className="absolute inset-0 rounded-full border-[2px] border-[#BFC5D1]" />
            <div className="absolute inset-1 rounded-full bg-white" />
            <div className="absolute inset-2 rounded-full bg-[#2555C4]" />
          </div>

          <span className="uppercase text-[14px] tracking-wider">
            {section_title}
          </span>
        </div>

        {/* FIXED HEADING */}
        <div
          className="text-[35px] md:text-[40px] font-heading font-semibold leading-[1.15] mb-6 max-w-[577px]"
          suppressHydrationWarning={true}
          dangerouslySetInnerHTML={{ __html: heading || "" }}
        />

        {/* FIXED PARAGRAPH */}
        <div
          className="text-[16px] text-[#ffffff] max-w-[533px] leading-[1.7] mb-12"
          suppressHydrationWarning={true}
          dangerouslySetInnerHTML={{ __html: paragraph || "" }}
        />

        {/* SLIDER */}
        {slides.length > 0 && <DocumentTypeSlider slides={slides} />}

        {/* CTA BUTTON BELOW SLIDER */}
        {button && (
          <div className="flex justify-center mt-10">
            <a href={button_url} className="btn-primary">
              {button}
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
