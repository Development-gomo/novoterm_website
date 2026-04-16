
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import DocumentTypeSlider from "../../Sliders/Homepage_sliders/DocumentTypeSlider";
import { DEFAULT_LANG } from "../../../lib/api";

// Module-level cache to persist data between renders and page navigations
const dataCache = {};
const fetchPromiseCache = {};

// Fetch function that can be called immediately
async function fetchDocumentTypesData(lang) {
  // Return cached data if available
  if (dataCache[lang]) {
    return dataCache[lang];
  }
  
  // If already fetching, return the existing promise
  if (fetchPromiseCache[lang]) {
    return fetchPromiseCache[lang];
  }
  
  // Start new fetch
  fetchPromiseCache[lang] = (async () => {
    try {
      const res = await fetch(
        `/wp-api/wp/v2/document_type?acf_format=standard&lang=${lang}`
      );
      
      if (!res.ok) {
        console.error("DOCUMENT TYPE SLIDER FETCH FAILED:", res.status, res.statusText);
        return [];
      }
      
      const data = await res.json();
      if (!Array.isArray(data)) {
        console.error("DOCUMENT TYPE SLIDER: Invalid data format", data);
        return [];
      }

      let formatted = data.map((post) => ({
        slug: post.slug,
        heading: post.acf?.heading || post.title?.rendered || "",
        subtext: post.acf?.subtext || "",
        cs_image: post.acf?.cs_image || "",
        button_url: post.acf?.button_url || "",
        last_block:
          Array.isArray(post.acf?.last_block) &&
          post.acf.last_block.some(
            (v) => v === "yes" || v.startsWith("yes:")
          ),
        slider_sequence: parseInt(post.acf?.slider_sequence, 10) || 0,
      }));

      formatted = formatted.sort((a, b) => a.slider_sequence - b.slider_sequence);

      // Mark the last item in sequence as the special card
      if (formatted.length > 0) {
        formatted[formatted.length - 1].last_block = true;
      }

      formatted = formatted.sort((a, b) => {
        if (a.last_block !== b.last_block) return a.last_block ? 1 : -1;
        return 0;
      });

      // Cache the result
      dataCache[lang] = formatted;
      return formatted;
    } catch (e) {
      console.error("DOCUMENT TYPE SLIDER FETCH ERROR:", e);
      return [];
    } finally {
      delete fetchPromiseCache[lang];
    }
  })();
  
  return fetchPromiseCache[lang];
}

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

  const router = useRouter();
  const lang = router.locale || DEFAULT_LANG;
  
  // Initialize with cached data if available
  const [slides, setSlides] = useState(() => dataCache[lang] || []);
  const hasFetched = useRef(false);

  useEffect(() => {
    // Skip if we already have cached data and haven't re-fetched
    if (dataCache[lang] && slides.length > 0) {
      return;
    }
    
    if (hasFetched.current) return;
    hasFetched.current = true;

    fetchDocumentTypesData(lang).then((data) => {
      if (data.length > 0) {
        setSlides(data);
      }
    });
  }, [lang, slides.length]);

  return (
    <section id={sectionId} className={`w-full ${sectionBg} py-[60px] md:py-[80px] lg:py-[100px]`}>
      <div className="web-width mx-auto px-6 md:px-0">
        <div className="flex flex-col md:flex-row">

          {/* LEFT 15% spacer */}
          <div className="md:w-[15%] mb-6 md:mb-0">
            {(section?.section_label || section?.acf_fc_layout) && (
              <div className="flex items-center gap-2 mb-4 lg:hidden">
                <span className="w-2 h-2 rounded-full bg-[#2655C4]" />
                <span className={`uppercase font-montserrat font-medium text-[10px] tracking-wider ${isDark ? 'text-white' : 'text-[#061837]'}`}>
                  {section.section_label || section.acf_fc_layout?.replace(/_section$/, '').replace(/^industry_/, '').replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                </span>
              </div>
            )}
          </div>

          {/* RIGHT 85% */}
          <div className="md:w-[85%]">

            {/* TITLE (WYSIWYG) */}
            {section_title && (
              <h2
                className={`
                  font-heading font-semibold
                   text-[28px]
                      md:text-[34px]
                      lg:text-[40px]
                  leading-[36px]
                  sm:leading-[40px]
                  md:leading-[44px]
                  lg:leading-[48px]
                  [&_em]:text-[#2655C4]
                  [&_em]:font-bold
                  mb-8 max-w-[900px]
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
            <div style={{ minHeight: 200 }}>
              {slides.length > 0 ? (
                <DocumentTypeSlider slides={slides} isDark={isDark} desktopSlides={3} />
              ) : (
                <div className="flex items-center justify-center w-full h-[200px]">
                  <span className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#2655C4]" />
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}