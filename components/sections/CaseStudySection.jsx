"use client";

import { useEffect, useState } from "react";
import CaseStudySlider from "../../components/CaseStudySlider";

export default function CaseStudySection({
  section_title,
  heading,
  paragraph,
}) {
  const [slides, setSlides] = useState([]);

  // 🔵 Fetch CPT inside section (Option 1)
  useEffect(() => {
    async function getData() {
      try {
      const res = await fetch(
  `${process.env.NEXT_PUBLIC_WP_URL}/wp-json/wp/v2/case_study?acf_format=standard`
);

        const data = await res.json();

        const formatted = data.map(post => ({
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
    <section className="relative w-full p-[80px] bg-[#E9F0FF]">

      <div className="mx-auto">

        {/* DOT LABEL */}
        <div className="flex items-center gap-3 mb-6">
          <div className="relative w-[22px] h-[22px]">
            <div className="absolute inset-0 rounded-full border-[2px] border-[#BFC5D1]" />
            <div className="absolute inset-1 rounded-full bg-white" />
            <div className="absolute inset-2 rounded-full bg-[#2555C4]" />
          </div>

          <span className="uppercase text-[14px] tracking-wider text-[#000]">
            {section_title}
          </span>
        </div>

        {/* HEADING */}
        <h2
          className="text-[35px] md:text-[40px] font-heading font-semibold text-[#000] leading-[1.15] max-w-[561px] mb-4"
          dangerouslySetInnerHTML={{ __html: heading }}
        />

        {/* PARAGRAPH */}
        <div
          className="text-[16px] text-[#000] leading-[1.7] max-w-[533px]"
          dangerouslySetInnerHTML={{ __html: paragraph }}
        />

        {/* SLIDER */}
        {slides.length > 0 && <CaseStudySlider slides={slides} />}
      </div>
    </section>
  );
}
