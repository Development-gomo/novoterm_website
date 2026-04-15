
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import CaseStudySlider from "../../Sliders/Homepage_sliders/CaseStudySlider";
import CaseStudyCardSlider from "../../Sliders/Casestudy_sliders/CaseStudyCardSlider";
import LazyWhenVisible from "../../ui/LazyWhenVisible";
import DotIndicator from "../../ui/DotIndicator";
import { DEFAULT_LANG, localePath } from "../../../lib/api";


export default function CaseStudySection({
  section_title,
  heading,
  paragraph,
  display_mode = "slider_single",
}) {
  const [slides, setSlides] = useState([]);
  const router = useRouter();
  const lang = router.locale || DEFAULT_LANG;

  useEffect(() => {
    if (!router.isReady) return;

    async function getData() {
      try {
        const res = await fetch(
          `/wp-api/wp/v2/case_study?acf_format=standard&lang=${lang}`
        );

        const data = await res.json();
        if (!Array.isArray(data)) return;

        const formatted = data.map(post => ({
          slug: post.slug,
          title: post.acf.review_heading,
          review_heading: post.acf.review_heading,
          button_text: post.acf.button_text,
          button_link: post.acf.button_link,
          time_text: post.acf.time_text,
          subtext: post.acf.subtext,
          service_title: post.acf.service_title,
          service_used: post.acf.service_used,
          image: post.acf.cs_image,
          cs_image: post.acf.cs_image,
        }));

        setSlides(formatted);

      } catch (error) {
        console.error("CASE STUDY FETCH ERROR:", error);
      }
    }

    getData();
  }, [lang, router.isReady]);

  return (
    <section className="relative w-full py-15 md:py-[100px] bg-[#E9F0FF]">
      <div className="web-width mx-auto px-6 md:px-0">

        {/* DOT LABEL */}
        {section_title && (
          <div className="flex items-center gap-2 mb-6">
            <DotIndicator/>
            <span className="uppercase font-montserrat font-medium text-[10px] sm:text-[10px] md:text-[12px] tracking-wider text-black">
              {section_title}
            </span>
          </div>
        )}

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

        {/* ===== DISPLAY MODES ===== */}

        {/* Single large slider (1 slide at a time — homepage style) */}
        {display_mode === "slider_single" && slides.length > 0 && (
          <LazyWhenVisible minHeight={420}>
            <CaseStudySlider slides={slides} />
          </LazyWhenVisible>
        )}

        {/* Multi-card slider (3 visible — casestudy style) */}
        {display_mode === "slider_multi" && slides.length > 0 && (
          <LazyWhenVisible minHeight={480}>
            <div className="mt-10">
              <CaseStudyCardSlider slides={slides} />
            </div>
          </LazyWhenVisible>
        )}

        {/* Grid — 3 columns using casestudy card design */}
        {display_mode === "grid" && slides.length > 0 && (
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {slides.map((slide, i) => (
              <div key={i} className="rounded-[3px] overflow-hidden bg-[#061837] flex flex-col">
                {/* IMAGE */}
                <div className="relative h-[180px] w-full flex-shrink-0">
                  <Image src={slide.image} alt={slide.title} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
                </div>
                {/* CONTENT */}
                <div className="p-[24px] flex flex-col flex-1">
                  <h3
                    className="text-white text-[24px] leading-[32px] font-semibold mb-6 overflow-hidden"
                    style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
                  >
                    {slide.title}
                  </h3>
                  <p className="text-[12px] font-montserrat uppercase tracking-widest font-medium text-white/50 mb-2">
                    Service provided
                  </p>
                  <div className="text-[16px] text-white/90 mb-6">
                    {slide.service_used}
                  </div>
                  <Link
                    href={localePath("caseStudy", slide.slug, lang)}
                    className="btn-primary text-sm w-fit mt-auto"
                  >
                    {slide.button_text || "Read full case"}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
