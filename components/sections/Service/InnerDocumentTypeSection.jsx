import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import DocumentTypeSlider from "../../Sliders/Homepage_sliders/DocumentTypeSlider";
import { wpToPath, DEFAULT_LANG } from "../../../lib/api";

const formatLabel = (layout) => {
  if (!layout) return null;
  return layout
    .replace(/_section$/, '')
    .replace(/^(services?_|casestudy_|blog_|industry_)/, '')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
};

export default function InnerDocumentTypeSection({ section, sectionId, index = 0 }) {
  if (!section) return null;

  const { section_label, heading, paragraph, button, button_url } = section;
  const router = useRouter();
  const lang = router.locale || DEFAULT_LANG;
  const [slides, setSlides] = useState([]);

  const mobileLabel = section_label || formatLabel(section.acf_fc_layout);

  useEffect(() => {
    async function getData() {
      try {
        const res = await fetch(
          `/wp-api/wp/v2/document_type?acf_format=standard&lang=${lang}`
        );
        let data = await res.json();

        let formatted = data.map((post) => ({
          slug: post.slug,
          heading: post.acf.heading,
          subtext: post.acf.subtext,
          cs_image: post.acf.cs_image,
          button_url: post.acf.button_url || "",
          slider_sequence: parseInt(post.acf.slider_sequence, 10) || 0,
        }));

        formatted = formatted.sort((a, b) => a.slider_sequence - b.slider_sequence);

        if (formatted.length > 0) {
          formatted[formatted.length - 1].last_block = true;
        }

        setSlides(formatted);
      } catch (error) {
        console.error("INNER DOCUMENT TYPE FETCH ERROR:", error);
      }
    }

    getData();
  }, [lang]);

  return (
    <section
      id={sectionId}
      className="relative w-full py-[40px] md:py-[80px] lg:py-[100px] bg-[#061837] text-white"
    >
      <div className="web-width mx-auto px-6 md:px-0">
        <div className="flex flex-col lg:flex-row">

          {/* LEFT – 15% */}
          <div className="lg:w-[15%] relative">
            {mobileLabel && (
              <div className="flex items-center gap-2 mb-4 lg:hidden">
                <span className="w-2 h-2 rounded-full bg-[#2655C4]" />
                <span className="uppercase font-montserrat font-medium text-[10px] tracking-wider text-white">
                  {mobileLabel}
                </span>
              </div>
            )}
          </div>

          {/* RIGHT – 85% */}
          <div className="lg:w-[85%]">

            {/* HEADING */}
            {heading && (
              <div
                className="text-[24px] sm:text-[28px] md:text-[40px] font-semibold leading-tight md:leading-[1.15] font-heading mb-4 md:mb-6 max-w-[577px]"
                dangerouslySetInnerHTML={{ __html: heading }}
              />
            )}

            {/* PARAGRAPH */}
            {paragraph && (
              <div
                className="text-[14px] sm:text-[15px] md:text-[16px] text-white max-w-[533px] leading-[1.7] mb-8 md:mb-12"
                dangerouslySetInnerHTML={{ __html: paragraph }}
              />
            )}

            {/* SLIDER */}
            {slides.length > 0 && <DocumentTypeSlider slides={slides} desktopSlides={3} />}

            {/* CTA BUTTON */}
            {button && button_url && (
              <div className="flex justify-center mt-8 md:mt-10">
                <Link href={wpToPath(typeof button_url === "object" ? button_url.url : button_url) || "#"} className="btn-primary">
                  {button}
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
