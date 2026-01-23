"use client";

import { useEffect, useState } from "react";
import DotIndicator from "../../ui/DotIndicator";
import CaseStudyCardSlider from "../../Sliders/Casestudy_sliders/CaseStudyCardSlider";

export default function CaseStudyRelatedSection({
  section,
  currentSlug,
  sectionId,
  index = 0,
}) {
  const { section_title, heading, paragraph } = section;
  const [slides, setSlides] = useState([]);

  const STICKY_START = 120;
  const LABEL_HEIGHT = 32;
  const stickyTop = STICKY_START + index * LABEL_HEIGHT;

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
    <section
      id={sectionId}
      className="w-full bg-[#E3EDFF] px-4 py-6 sm:px-6 md:py-8 lg:py-[100px] lg:px-[80px]"
    >
      <div className="mx-auto">

        {/* 15 / 85 WRAPPER */}
        <div className="flex flex-col md:flex-row gap-6 md:gap-12">

          {/* LEFT – 15% (STICKY) */}
          <div className="md:w-[15%] relative">
            <div
              className="flex items-center gap-2 mt-1 md:mt-2"
              style={{
                position: "sticky",
                top: `${stickyTop}px`,
                zIndex: 10 + index,
              }}
            >
              <DotIndicator />
              <span className="uppercase font-montserrat font-medium text-[10px] sm:text-[12px] tracking-widest text-black">
                {section_title}
              </span>
            </div>
          </div>

          {/* RIGHT – 85% */}
          <div className="md:w-[85%]">

            {/* HEADING */}
            <h2 className="font-heading text-[24px] sm:text-[28px] md:text-[40px] font-semibold leading-tight md:leading-[1.15] max-w-full sm:max-w-[578px] mb-4">
              {heading}
            </h2>

            {/* PARAGRAPH */}
            <div
              className="text-[16px] leading-[1.7] max-w-full sm:max-w-[533px] mb-20 sm:mb-10"
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
