
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import DotIndicator from "../../ui/DotIndicator";
import CaseStudyCardSlider from "../../Sliders/Casestudy_sliders/CaseStudyCardSlider";
import { DEFAULT_LANG, wpRestUrl } from "../../../lib/api";

const formatLabel = (layout) => {
  if (!layout) return null;
  return layout
    .replace(/_section$/, '')
    .replace(/^(services?_|casestudy_|blog_|industry_)/, '')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
};

export default function CaseStudyRelatedSection({
  section,
  currentSlug,
  sectionId,
  index = 0,
}) {
  const { section_title, heading, paragraph } = section;
  const router = useRouter();
  const lang = router.locale || DEFAULT_LANG;
  const [slides, setSlides] = useState([]);

  const STICKY_START = 120;
  const LABEL_HEIGHT = 32;
  const stickyTop = STICKY_START + index * LABEL_HEIGHT;

  useEffect(() => {
    async function getData() {
      const res = await fetch(
        wpRestUrl(`wp/v2/case_study?acf_format=standard&lang=${lang}`)
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
  }, [currentSlug, lang]);

  if (!slides.length) return null;

  return (
    <section
      id={sectionId}
      className="w-full bg-[#E3EDFF] py-6 md:py-8 lg:py-[100px]"
    >
      <div className="web-width mx-auto px-6 md:px-0">

        {/* 15 / 85 WRAPPER */}
        <div className="flex flex-col md:flex-row gap-6 md:gap-12">

          {/* LEFT – 15% (STICKY) */}
          <div className="md:w-[15%] relative">
            {(section_title || section?.acf_fc_layout) && (
              <div className="flex items-center gap-2 mt-1 mb-4 lg:hidden">
                <span className="w-2 h-2 rounded-full bg-[#2655C4]" />
                <span className="uppercase font-montserrat font-medium text-[10px] tracking-widest text-[#061837]">
                  {section_title || formatLabel(section?.acf_fc_layout)}
                </span>
              </div>
            )}
          </div>

          {/* RIGHT – 85% */}
          <div className="md:w-[85%]">

            {/* HEADING */}
            <h2 className="font-heading text-[24px] sm:text-[28px] md:text-[40px] text-[#061837] font-semibold leading-tight md:leading-[1.15] max-w-full sm:max-w-[578px] mb-4">
              {heading}
            </h2>

            {/* PARAGRAPH */}
            <div
              className="text-[16px] leading-[1.7] max-w-full sm:max-w-[533px] mb-20 sm:mb-10 "
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
