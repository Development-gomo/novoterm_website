
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import InsightsSlider from "../../Sliders/Homepage_sliders/InsightsSlider";
import LazyWhenVisible from "../../ui/LazyWhenVisible";
import DotIndicator from "../../ui/DotIndicator";
import { DEFAULT_LANG, localePath, wpToPath, wpRestUrl } from "../../../lib/api";
import { formatArticleDate } from "../../../lib/dateFormat";
import { plainTextFromHtml } from "../../../lib/html";
import Link from "next/link";

export default function IndustryInsightsSection({ section, sectionId }) {
  if (!section) return null;

  const { section_title, heading, paragraph, button, button_url } = section;

  const router = useRouter();
  const lang = router.locale || DEFAULT_LANG;
  const [slides, setSlides] = useState([]);

  useEffect(() => {
    async function loadPosts() {
      try {
        const res = await fetch(wpRestUrl(`wp/v2/posts?_embed&lang=${lang}`));
        let data = await res.json();

        data = data.sort((a, b) => new Date(b.date) - new Date(a.date));

        const formatted = data.map((post) => {
          const category =
            plainTextFromHtml(post?._embedded?.["wp:term"]?.[0]?.[0]?.name || "General");

          const fm = post?._embedded?.["wp:featuredmedia"]?.[0];
          const image =
            fm?.media_details?.sizes?.large?.source_url ||
            fm?.source_url ||
            fm?.media_details?.sizes?.medium_large?.source_url ||
            "/default-blog.jpg";

          const date = formatArticleDate(post.date, lang);

          const clean = plainTextFromHtml(post.content.rendered);
          const words = clean.split(/\s+/).length;
          const readTime = `${Math.max(1, Math.ceil(words / 200))} min read`;

          return {
            title: plainTextFromHtml(post.title.rendered),
            excerpt: plainTextFromHtml(post.excerpt.rendered).slice(0, 120) + "...",
            url: localePath("article", post.slug, lang),
            image,
            category,
            date,
            readTime,
          };
        });

        setSlides(formatted);
      } catch (e) {
        console.log("INDUSTRY INSIGHTS FETCH ERROR:", e);
      }
    }

    loadPosts();
  }, [lang]);

  return (
    <section
      id={sectionId}
      className="relative w-full py-[40px] md:py-[60px] lg:py-[100px] bg-[#E3EDFF]"
    >
      <div className="web-width mx-auto px-6 md:px-0">
        <div className="flex flex-col lg:flex-row">

          {/* LEFT – 15% spacer */}
          <div className="w-full lg:w-[15%] mb-6 lg:mb-0">
            {(section?.section_label || section?.acf_fc_layout) && (
              <div className="flex items-center gap-2 mb-4 lg:hidden">
                <span className="w-2 h-2 rounded-full bg-[#2655C4]" />
                <span className="uppercase font-montserrat font-medium text-[10px] tracking-wider text-[#061837]">
                  {section.section_label || section.acf_fc_layout?.replace(/_section$/, '').replace(/^industry_/, '').replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                </span>
              </div>
            )}
          </div>

          {/* RIGHT – 85% */}
          <div className="w-full lg:w-[85%]">

            {/* HEADING */}
            {heading && (
              <h2
                className="font-heading font-semibold text-[28px] sm:text-[34px] md:text-[34px] lg:text-[40px] leading-[36px] sm:leading-[40px] md:leading-[44px] lg:leading-[48px] text-[#061837] [&_em]:text-[#2655C4] [&_em]:font-bold max-w-[780px] mb-4"
                dangerouslySetInnerHTML={{ __html: heading }}
              />
            )}

            {/* PARAGRAPH */}
            {paragraph && (
              <div
                className="text-[16px] text-[#061837]/80 leading-[1.7] max-w-[533px] mb-12"
                dangerouslySetInnerHTML={{ __html: paragraph }}
              />
            )}

            {/* SLIDER */}
            {slides.length > 0 && (
              <LazyWhenVisible minHeight={400}>
                <InsightsSlider slides={slides} lang={lang} />
              </LazyWhenVisible>
            )}

            {/* BUTTON */}
            {button && (
              <div className="text-center mt-10">
                <Link href={wpToPath(button_url) || "#"} className="btn-primary inline-block">
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
