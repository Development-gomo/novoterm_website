"use client";

import { useEffect, useState } from "react";
import ServiceCaseStudySlider from "../../Sliders/Servicepage_sliders/ServiceCaseStudySlider";
import DotIndicator from "../../ui/DotIndicator";

export default function ServiceCaseStudySection({
  section_title,
  heading,
  paragraph,
}) {
  const [slides, setSlides] = useState([]);

  useEffect(() => {
    async function getData() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_WP_URL}/wp-json/wp/v2/case_study?acf_format=standard`
        );

        const data = await res.json();

        const formatted = data.map((post) => ({
          slug: post.slug,
          review_heading: post.acf.review_heading,
          button_text: post.acf.button_text,
          button_link: post.acf.button_link,
          time_text: post.acf.time_text,
          subtext: post.acf.subtext,
          service_used: post.acf.service_used,
          cs_image: post.acf.cs_image,
        }));

        setSlides(formatted);
      } catch (error) {
        console.error("CASE STUDY FETCH ERROR:", error);
      }
    }

    getData();
  }, []);

  return (
    <section className="relative w-full py-6 sm:py-12 md:py-16 lg:p-[80px] px-4 sm:px-6 md:px-10 bg-[#E9F0FF]">
      <div className="mx-auto">

        {/* LABEL */}
        <div className="flex items-center gap-2 mb-6">
          <DotIndicator />
          <span className="uppercase font-montserrat font-medium text-[10px] sm:text-[10px] md:text-[12px] tracking-wider text-black">
            {section_title}
          </span>
        </div>

        {/* HEADING */}
        <h2
          className="text-[24px] sm:text-[28px] md:text-[40px] font-semibold leading-tight md:leading-[1.15] max-w-[561px] mb-4"
          dangerouslySetInnerHTML={{ __html: heading }}
        />

        {/* PARAGRAPH */}
        <div
          className="text-[14px] sm:text-[15px] md:text-[16px] text-[#000] leading-[1.7] max-w-[533px]"
          dangerouslySetInnerHTML={{ __html: paragraph }}
        />

        {/* SLIDER */}
        {slides.length > 0 && (
          <ServiceCaseStudySlider slides={slides} />
        )}

      </div>
    </section>
  );
}
