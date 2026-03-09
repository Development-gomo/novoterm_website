"use client";

import { useEffect, useState } from "react";
import DocumentTypeSlider from "../../Sliders/Homepage_sliders/DocumentTypeSlider";
import DotIndicator from "../../ui/DotIndicator";

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
          `/wp-api/wp/v2/document_type?acf_format=standard`
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
    <section className="relative w-full py-15 md:py-[100px] bg-[#061837] text-white">
      <div className="web-width mx-auto px-6 md:px-0">

        {/* TOP LABEL */}
        <div className="flex items-center gap-2 mb-4 md:mb-6">
          <DotIndicator variant="white" />
          <span className="uppercase font-montserrat text-[12px] tracking-wider">
            {section_title}
          </span>
        </div>

        {/* FIXED HEADING (font unchanged) */}
        <div
          className="text-[24px] sm:text-[28px] md:text-[40px] font-semibold leading-tight md:leading-[1.15]
            
            font-heading
           
            mb-4
            md:mb-6
            max-w-[577px]
          "
          suppressHydrationWarning={true}
          dangerouslySetInnerHTML={{ __html: heading || "" }}
        />

        {/* FIXED PARAGRAPH (font unchanged) */}
        <div
          className="text-[14px]   sm:text-[15px]   md:text-[16px] 
            text-[#ffffff]
            max-w-[533px]
            leading-[1.7]
            mb-8
            md:mb-12
          "
          suppressHydrationWarning={true}
          dangerouslySetInnerHTML={{ __html: paragraph || "" }}
        />

        {/* SLIDER */}
        {slides.length > 0 && <DocumentTypeSlider slides={slides} />}

        {/* CTA BUTTON BELOW SLIDER */}
        {button && (
          <div className="flex justify-center mt-8 md:mt-10">
            <a href={button_url} className="btn-primary">
              {button}
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
