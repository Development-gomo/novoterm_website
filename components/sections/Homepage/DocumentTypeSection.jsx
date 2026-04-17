
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import DocumentTypeSlider from "../../Sliders/Homepage_sliders/DocumentTypeSlider";
import LazyWhenVisible from "../../ui/LazyWhenVisible";
import DotIndicator from "../../ui/DotIndicator";
import { wpToPath, DEFAULT_LANG } from "../../../lib/api";

export default function DocumentTypeSection({
  section_title,
  heading,
  paragraph,
  button,
  button_url,
  initialSlides = null,
}) {
  const router = useRouter();
  const lang = router.locale || DEFAULT_LANG;
  const [slides, setSlides] = useState(initialSlides || []);

  useEffect(() => {
    // If initialSlides is provided, use it immediately
    if (initialSlides && initialSlides.length > 0) {
      setSlides(initialSlides);
      return;
    }

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
          button_url: post.acf.button_url || "", // always from ACF
          slider_sequence: parseInt(post.acf.slider_sequence, 10) || 0,
        }));

        formatted = formatted.sort((a, b) => a.slider_sequence - b.slider_sequence);

        // Mark the last item in sequence as the special card
        if (formatted.length > 0) {
          formatted[formatted.length - 1].last_block = true;
        }

        setSlides(formatted);
      } catch (error) {
        console.error("DOCUMENT TYPE FETCH ERROR:", error);
      }
    }

    getData();
  }, [lang, initialSlides]);

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
        {slides.length > 0 && (
          <LazyWhenVisible minHeight={420}>
            <DocumentTypeSlider slides={slides} />
          </LazyWhenVisible>
        )}

        {/* CTA BUTTON BELOW SLIDER */}
        {button && (
          <div className="flex justify-center mt-8 md:mt-10">
            <Link href={wpToPath(button_url) || "#"} className="btn-primary">
              {button}
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
