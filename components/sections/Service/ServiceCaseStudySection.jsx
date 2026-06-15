
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import CaseStudySlider from "../../Sliders/Homepage_sliders/CaseStudySlider";
import { DEFAULT_LANG, wpRestUrl } from "../../../lib/api";

export default function ServiceCaseStudySection({
  heading,
  paragraph,
  sectionLabel,
  sectionId,
  index = 0,
  add_padding_top = 'no',
}) {
  const formatLabel = (layout) => {
    if (!layout) return null;
    return layout
      .replace(/_section$/, '')
      .replace(/^(services?_|casestudy_|blog_)/, '')
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase());
  };
  const router = useRouter();
  const lang = router.locale || DEFAULT_LANG;
  const [slides, setSlides] = useState([]);

  useEffect(() => {
    async function getData() {
      try {
        const res = await fetch(
          wpRestUrl(`wp/v2/case_study?acf_format=standard&per_page=10&lang=${lang}`)
        );
        const data = await res.json();

        const formatted = data.map((post) => ({
          slug: post.slug,
          review_heading: post.acf?.review_heading,
          button_text: post.acf?.button_text,
          button_link: post.acf?.button_link,
          time_text: post.acf?.time_text,
          subtext: post.acf?.subtext,
          service_title: post.acf?.service_title,
          service_used: post.acf?.service_used,
          cs_image: post.acf?.cs_image,
        }));

        setSlides(formatted);
      } catch (error) {
        console.error("SERVICE CASE STUDY FETCH ERROR:", error);
        setSlides([]);
      }
    }

    getData();
  }, [lang]);

  // Determine top padding class
  const topPaddingClass = add_padding_top === 'yes'
    ? 'pt-[100px] md:pt-[100px] sm:pt-[60px] xs:pt-[40px]'
    : 'lg:pt-[0px]';

  return (
    <section id={sectionId} className={`w-full bg-[#EAF1FF] py-6 md:py-10 lg:pb-[100px] ${topPaddingClass}`}>
      <div className="web-width mx-auto px-6 md:px-0">
        <div className="flex flex-col lg:flex-row">

          {/* LEFT – 15% */}
          <div className="w-full lg:w-[15%] mb-6 lg:mb-0 relative">
            {sectionLabel && (
              <div className="flex items-center gap-2 mb-4 lg:hidden">
                <span className="w-2 h-2 rounded-full bg-[#2655C4]" />
                <span className="uppercase font-montserrat font-medium text-[10px] tracking-wider text-[#061837]">
                  {sectionLabel}
                </span>
              </div>
            )}
          </div>

          {/* RIGHT – 85% */}
          <div className="w-full lg:w-[85%]">

            {/* HEADER */}
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-[40px] lg:mb-0 gap-6">
              <div className="max-w-[550px]">
                {heading && (
                  <h2 className="font-heading text-[24px] sm:text-[28px] md:text-[40px] font-semibold text-[#061837] leading-tight md:leading-[1.15] mb-4">
                    <div dangerouslySetInnerHTML={{ __html: heading }} />
                  </h2>
                )}
                {paragraph && (
                  <div 
                    className="text-[14px] sm:text-[14px] md:text-[14px] lg:text-[16px]
                               leading-[24px] text-[#000]"
                    dangerouslySetInnerHTML={{ __html: paragraph }}
                  />
                )}
              </div>
            </div>

            {/* SLIDER */}
            {slides.length > 0 && <CaseStudySlider slides={slides} />}

          </div>
        </div>
      </div>
    </section>
  );
}
