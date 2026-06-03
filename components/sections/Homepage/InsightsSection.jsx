    import { useEffect, useState } from "react";
    import { useRouter } from "next/router";
    import Link from "next/link";
    import InsightsSlider from "../../Sliders/Homepage_sliders/InsightsSlider";
    import LazyWhenVisible from "../../ui/LazyWhenVisible";
    import DotIndicator from "../../ui/DotIndicator";
    import { DEFAULT_LANG, localePath, wpToPath } from "../../../lib/api";
    import { formatArticleDate } from "../../../lib/dateFormat";

    export default function InsightsSection({
    section_title,
    heading,
    paragraph,
    button,
    button_url,
    }) {
    const router = useRouter();
    const lang = router.locale || DEFAULT_LANG;
    const [slides, setSlides] = useState([]);

    useEffect(() => {
        async function loadPosts() {
        try {
            const res = await fetch(
            `/wp-api/wp/v2/posts?_embed&lang=${lang}`
            );

        let data = await res.json();

            data = data.sort((a, b) => new Date(b.date) - new Date(a.date));

            const formatted = data.map((post) => {
            // CATEGORY (fallback to General)
            const category =
                post?._embedded?.["wp:term"]?.[0]?.[0]?.name || "General";

            const fm = post?._embedded?.["wp:featuredmedia"]?.[0];
            const image =
                fm?.media_details?.sizes?.large?.source_url ||
                fm?.source_url ||
                fm?.media_details?.sizes?.medium_large?.source_url ||
                "/default-blog.jpg";

            const date = formatArticleDate(post.date, lang);

            // READING TIME based on content
            const clean = post.content.rendered.replace(/<[^>]*>/g, "");
            const words = clean.split(/\s+/).length;
            const readTime = `${Math.max(1, Math.ceil(words / 200))} min read`;

            return {
                title: post.title.rendered,
                excerpt:
                post.excerpt.rendered.replace(/<[^>]*>/g, "").slice(0, 120) +
                "...",
                url: localePath("article", post.slug, lang),
                image,
                category,
                date,
                readTime,
            };
            });

            setSlides(formatted);
        } catch (e) {
            console.log("INSIGHTS FETCH ERROR:", e);
        }
        }

        loadPosts();
    }, [lang]);

    return (
        <section className="relative w-full py-15 md:py-[100px] bg-[#E3EDFF]">
        <div className="web-width mx-auto px-6 md:px-0">

            {/* DOT LABEL */}
            <div className="flex items-center gap-2 mb-6">
            <DotIndicator/>

            <span className="uppercase font-montserrat font-medium text-[10px] sm:text-[10px] md:text-[12px] tracking-wider text-black">
                {section_title}
            </span>
            </div>

            {/* HEADING */}
            <h2
            className="text-[35px] md:text-[40px] font-heading font-semibold text-[#000] leading-[1.15] max-w-[561px] mb-4"
            dangerouslySetInnerHTML={{ __html: heading }}
            />

            {/* PARAGRAPH */}
            <div
            className="text-[16px] text-[#000] leading-[1.7] max-w-[533px] mb-12"
            dangerouslySetInnerHTML={{ __html: paragraph }}
            />

            {/* SLIDER */}
            {slides.length > 0 && (
            <LazyWhenVisible minHeight={400}>
                <InsightsSlider slides={slides} lang={lang} />
            </LazyWhenVisible>
            )}

            {/* BUTTON */}
            {button && (
            <div className="text-center mt-10">
                <Link href={wpToPath(button_url) || "#"} locale={lang} className="btn-primary inline-block">
                {button}
                </Link>
            </div>
            )}
            
        </div>
        </section>
    );
    }
