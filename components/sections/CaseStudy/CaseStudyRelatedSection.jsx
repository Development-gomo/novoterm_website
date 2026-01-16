"use client";

import { useEffect, useState } from "react";
import DotIndicator from "../../ui/DotIndicator";
import CaseStudyCardSlider from "../../Sliders/Casestudy_sliders/CaseStudyCardSlider";

export default function CaseStudyRelatedSection({ section, currentSlug }) {
  const { section_title, heading, paragraph } = section;
  const [slides, setSlides] = useState([]);

  useEffect(() => {
    async function getData() {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_WP_URL}/wp-json/wp/v2/case_study?acf_format=standard`
      );
      const data = await res.json();

      const formatted = data
        .filter(post => post.slug !== currentSlug)
        .map(post => ({
          slug: post.slug,
          title: post.acf.review_heading,
          service_used: post.acf.service_used,
          image: post.acf.cs_image,
        }));

      setSlides(formatted);
    }

    getData();
  }, [currentSlug]);

  if (!slides.length) return null;

  return (
    <section className="w-full bg-[#E9F0FF] py-[80px]">
      <div className="max-w-[1400px] mx-auto px-6">

        {/* 15 / 85 WRAPPER */}
        <div className="flex gap-12">

          {/* LEFT – 15% */}
          <div className="w-[15%]">
            <div className="flex items-center gap-2 mt-2">
              <DotIndicator />
              <span className="uppercase font-montserrat font-medium text-[12px] tracking-widest text-black">
                {section_title}
              </span>
            </div>
          </div>

          {/* RIGHT – 85% */}
          <div className="w-[85%]">

            {/* HEADING */}
            <h2 className="text-[48px] font-semibold leading-[1.2] max-w-[700px] mb-4">
              {heading}
            </h2>

            {/* PARAGRAPH */}
            <div
              className="text-[16px] leading-[1.7] max-w-[600px] mb-10"
              dangerouslySetInnerHTML={{ __html: paragraph }}
            />

            {/* SLIDER */}
            <CaseStudyCardSlider slides={slides} />

          </div>
        </div>

      </div>
    </section>
  );
}
