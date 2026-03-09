"use client";

import { useEffect, useState } from "react";
import ServiceSlider from "../../Sliders/Industrypage_sliders/ServiceSlider";

export default function ServiceSliderSection({ section, sectionId }) {
  if (!section) return null;

  const {
    select_theme = "light",
    section_label,
    section_title,
    section_description,
  } = section;

  const isDark = select_theme === "dark";
  const sectionBg    = isDark ? "bg-[#061837]"  : "bg-[#E3EDFF]";
  const headingColor = isDark ? "text-white"     : "text-[#061837]";
  const textColor    = isDark ? "text-white/80"  : "text-[#061837]/80";
  const labelColor   = isDark ? "text-white/70"  : "text-[#061837]";

  const [services, setServices] = useState([]);

  useEffect(() => {
    async function fetchServices() {
      try {
        const res = await fetch(
          `/wp-api/wp/v2/service?_embed&acf_format=standard`,
          { cache: "no-store" }
        );
        const data = await res.json();
        if (!Array.isArray(data)) return;

        setServices(
          data.map((post) => ({
            slug: post.slug || "",
            heading: post.acf?.heading || post.title?.rendered || "",
            description_text: post.acf?.description_text || "",
            bg: post._embedded?.["wp:featuredmedia"]?.[0]?.source_url || "",
          }))
        );
      } catch (e) {
        console.error("SERVICE SLIDER FETCH ERROR:", e);
      }
    }

    fetchServices();
  }, []);

  return (
    <section id={sectionId} className={`w-full ${sectionBg} py-[40px] md:py-[60px] lg:py-[100px]`}>
      <div className="web-width mx-auto px-6 md:px-0">
        <div className="flex flex-col md:flex-row">

          {/* LEFT 15% spacer */}
          <div className="md:w-[15%] mb-6 md:mb-0" />

          {/* RIGHT 85% */}
          <div className="md:w-[85%]">

       

            {/* TITLE (WYSIWYG) */}
            {section_title && (
              <h2
                className={`
                  font-heading font-semibold
                  text-[28px]
                  sm:text-[34px]
                  md:text-[40px]
                  lg:text-[48px]
                  leading-[36px]
                  sm:leading-[44px]
                  md:leading-[52px]
                  lg:leading-[58px]
                  [&_em]:text-[#2655C4]
                  [&_em]:font-bold
                  mb-4 max-w-[900px]
                  ${headingColor}
                `}
                dangerouslySetInnerHTML={{ __html: section_title }}
              />
            )}

            {/* DESCRIPTION */}
            {section_description && (
              <p className={`text-[14px] sm:text-[15px] md:text-[16px] leading-[1.7] max-w-[620px] ${textColor}`}>
                {section_description}
              </p>
            )}

            {/* SLIDER */}
            <ServiceSlider slides={services} isDark={isDark} />

          </div>
        </div>
      </div>
    </section>
  );
}