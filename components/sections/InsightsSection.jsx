    "use client";

    import { useEffect, useState } from "react";
    import InsightsSlider from "../../components/InsightsSlider";
    import DotIndicator from "../ui/DotIndicator";

    export default function InsightsSection({
    section_title,
    heading,
    paragraph,
    button,
    button_url,
    }) {
    const [slides, setSlides] = useState([]);

    useEffect(() => {
        async function loadPosts() {
        try {
            // IMPORTANT: Correct WordPress REST API route for your website
            const res = await fetch(
            `${process.env.NEXT_PUBLIC_WP_URL}/index.php?rest_route=/wp/v2/posts&_embed`
            );

        let data = await res.json();

            data = data.sort((a, b) => new Date(b.date) - new Date(a.date));

            console.log("RAW POSTS:", data);

            const formatted = data.map((post) => {
            // CATEGORY (fallback to General)
            const category =
                post?._embedded?.["wp:term"]?.[0]?.[0]?.name || "General";

            // FEATURED IMAGE (fallback placeholder)
            const image =
                post?._embedded?.["wp:featuredmedia"]?.[0]?.source_url ||
                "/default-blog.jpg";

            // DATE
            const date = new Date(post.date).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
            });

            // READING TIME based on content
            const clean = post.content.rendered.replace(/<[^>]*>/g, "");
            const words = clean.split(/\s+/).length;
            const readTime = `${Math.max(1, Math.ceil(words / 200))} MIN READ`;

            return {
                title: post.title.rendered,
                excerpt:
                post.excerpt.rendered.replace(/<[^>]*>/g, "").slice(0, 120) +
                "...",
                url: `/blog/${post.slug}`,
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
    }, []);

    return (
        <section className="relative w-full p-[80px] bg-[#E9F0FF]">
        <div className="mx-auto">

            {/* DOT LABEL */}
            <div className="flex items-center gap-2 mb-6">
            <DotIndicator/>

            <span className="uppercase text-[14px] tracking-wider text-black">
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
            {slides.length > 0 && <InsightsSlider slides={slides} />}

            {/* BUTTON */}
            {button && (
            <div className="text-center mt-10">
                <a href={button_url || "#"} className="btn-primary inline-block">
                {button}
                </a>
            </div>
            )}
            
        </div>
        </section>
    );
    }
