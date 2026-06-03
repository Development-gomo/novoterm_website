import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import BlogSlider from "../../Sliders/Blog_sliders/BlogSlider";
import { DEFAULT_LANG, localePath } from "../../../lib/api";
import { formatArticleDate } from "../../../lib/dateFormat";
import { pickWpImageUrl } from "../../../lib/wpImage";
import AuthorCard from "./AuthorCard";

const excerptMarkerPattern =
  /\s*(?:\[(?:\.{2,}|&hellip;|&#8230;|\u2026)\]|(?:&hellip;|&#8230;|\u2026))\s*<\/p>\s*$/i;

function hasAutoExcerptMarker(html = "") {
  return excerptMarkerPattern.test(html);
}

function cleanExcerptHtml(html = "") {
  return html.replace(excerptMarkerPattern, "</p>").trim();
}

function getOpeningParagraphsHtml(html = "", limit = 2) {
  const matches = html.match(/<p\b[^>]*>[\s\S]*?<\/p>/gi);
  return matches ? matches.slice(0, limit).join("").trim() : "";
}

const translations = {
  sv: {
    toc: "Innehållsförteckning",
    shareText: "Gillar du vad du ser? Dela denna artikel",
    relatedHeading: "Missa inte dessa",
    minRead: "min läsning",
  },
  en: {
    toc: "Table of contents",
    shareText: "Like what you see? Share this article",
    relatedHeading: "Don't miss out on these",
    minRead: "min read",
  },
};

export default function BlogContentSection({ section }) {
  const router = useRouter();
  const lang = router.locale || DEFAULT_LANG;
  const t = translations[lang] || translations.sv;

  const [relatedPosts, setRelatedPosts] = useState([]);
  const [toc, setToc] = useState([]);
  const [promo, setPromo] = useState(null);
  const [processedContent, setProcessedContent] = useState("");
  const [pageUrl, setPageUrl] = useState("");
  const [authorCards, setAuthorCards] = useState([]);

  useEffect(() => {
    setPageUrl(window.location.href);
  }, []);

  const {
    featured_image,
    heading,
    excerpt,
    content,
    author,
    published_date,
    reading_time,
    category,
    category_id,
    slug,
    display_author_card,
    author_card_id,
  } = section || {};

  const bgUrl = pickWpImageUrl(featured_image, "heroNext");
  const introHtml =
    hasAutoExcerptMarker(excerpt) && content
      ? getOpeningParagraphsHtml(content) || cleanExcerptHtml(excerpt)
      : cleanExcerptHtml(excerpt);

  /* =========================
     AUTHOR CARD
  ========================== */
  useEffect(() => {
    if (!display_author_card || !author_card_id) return;
    async function fetchAuthorCard() {
      try {
        const res = await fetch(
          `/wp-api/wp/v2/author-card/${author_card_id}?acf_format=standard`
        );
        const data = await res.json();
        if (Array.isArray(data?.acf?.individual_author_card)) {
          setAuthorCards(data.acf.individual_author_card);
        }
      } catch (err) {
        console.error("Author card fetch error:", err);
      }
    }
    fetchAuthorCard();
  }, [author_card_id]);

  /* =========================
     TOC GENERATION
  ========================== */
  useEffect(() => {
    if (!content) return;

    const parser = new DOMParser();
    const doc = parser.parseFromString(content, "text/html");

    const headings = doc.querySelectorAll("h2");
    const tocItems = [];

    headings.forEach((h, index) => {
      let text = h.textContent;

      let id = text
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

      if (!id) id = `heading-${index}`;

      h.setAttribute("id", id);

      tocItems.push({ id, text });
    });

    setToc(tocItems);
    setProcessedContent(doc.body.innerHTML);
  }, [content]);

  /* =========================
     CATEGORY PROMO (ACF)
  ========================== */
  useEffect(() => {
    async function loadPromo() {
      if (!category_id) return;

      try {
const res = await fetch(
  `/wp-api/wp/v2/categories/${category_id}?acf_format=standard&lang=${lang}`
);
        const data = await res.json();

        if (data?.acf) {
          setPromo({
            title: data.acf.title,
            description: data.acf.description,
            buttonText: data.acf.button_text,
            buttonUrl: data.acf.button_url,
          });
        }
      } catch (err) {
        console.error("Promo fetch error:", err);
      }
    }

    loadPromo();
  }, [category_id]);

  /* =========================
     RELATED POSTS
  ========================== */
  useEffect(() => {
    async function loadRelatedPosts() {
      try {
        const res = await fetch(
          `/wp-api/wp/v2/posts?_embed&per_page=6&categories=${category_id}&lang=${lang}`
        );
        const data = await res.json();

        const formatted = data
          .filter((post) => post.slug !== slug)
          .map((post) => ({
            title: post.title?.rendered || "",
            excerpt:
              post.excerpt?.rendered
                ?.replace(/<[^>]*>/g, "")
                .slice(0, 100) + "..." || "",
            url: localePath("article", post.slug, lang),
            image:
              post._embedded?.["wp:featuredmedia"]?.[0]?.source_url ||
              "/default-blog.jpg",
            category:
              post._embedded?.["wp:term"]?.[0]?.[0]?.name || "General",
            date: formatArticleDate(post.date, lang),
            readTime: `${Math.max(
              1,
              Math.ceil(
                post.content.rendered
                  .replace(/<[^>]*>/g, "")
                  .split(/\s+/).length / 200
              )
            )} ${t.minRead}`,
          }));

        setRelatedPosts(formatted.slice(0, 3));
      } catch (error) {
        console.error("Error fetching related posts:", error);
      }
    }

    if (category_id) loadRelatedPosts();
  }, [lang, category_id, slug]);

  /* =========================
     SCROLL
  ========================== */
  const handleScroll = (id) => {
    const el = document.getElementById(id);
    if (el) {
      window.scrollTo({
        top: el.offsetTop - 100,
        behavior: "smooth",
      });
    }
  };

  return (
    <>
      {/* HERO BANNER */}
      <section className="relative w-full bg-[#Fff] pb-[60px] pt-[140px] web-width mx-auto px-6 md:px-0">
        <div className="">
          <div className="flex flex-col items-start gap-4">
            {category && (
              <span className="text-[#2555C4] uppercase text-[18px] font-semibold tracking-wider">
                {category}
              </span>
            )}

            {published_date && (
              <span className="text-[#2555C4] text-[18px] font-montserrat font-bold">
                {formatArticleDate(published_date, lang)}
              </span>
            )}

            <h1
              className="font-heading font-semibold text-[#061837] text-[20px] sm:text-[28px] md:text-[36px] lg:text-[48px] leading-tight tracking-[0.5px]"
              dangerouslySetInnerHTML={{ __html: heading }}
            />

            {introHtml && (
              <div
                className="text-[16px] md:text-[18px] text-[#3A3A3A] space-y-3 mt-2"
                dangerouslySetInnerHTML={{ __html: introHtml }}
              />
            )}

            <div className="flex items-center gap-4 mt-4">
              <div className="flex flex-col text-sm text-[#606164] font-montserrat">
                {/* <span className="font-semibold text-[#061837] font-montserrat">{author}</span> */}
                <span className="font-montserrat">
                  {lang === "sv" && section?.reading_time_sv ? section.reading_time_sv : (reading_time || "5")} {t.minRead}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED IMAGE – parallax */}
      {bgUrl && (
        <div className="relative w-full h-[500px] overflow-hidden">
          <Image
            src={bgUrl}
            alt={heading ? heading.replace(/<[^>]*>/g, "") : ""}
            fill
            sizes="100vw"
            quality={72}
            loading="lazy"
            className="object-cover object-[0px_-50px]"
          />
        </div>
      )}

      {/* CONTENT SECTION */}
      <section className="w-full bg-white py-[60px] web-width mx-auto px-6 md:px-0">
      <div className="">

        {/* LAYOUT */}
        <div className="flex gap-[60px]">

          {/* LEFT SIDEBAR */}
          <div className="w-[28%] hidden lg:block sticky top-[120px] h-fit">

            {/* TOC */}
            {toc.length > 0 && (
              <div className="mb-10">
                <h3 className="text-[20px] font-semibold mb-4">
                  {t.toc}
                </h3>
                <ul className="space-y-3">
                  {toc.map((item, i) => (
                    <li key={i}>
                      <button
                        onClick={() => handleScroll(item.id)}
                        className="text-[#2555C4] text-left hover:underline  cursor-pointer"
                      >
                        {item.text}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* PROMO MODULE */}
            {promo && (promo.title || promo.description) && (
              <div className="bg-[#D1DAE8] rounded-[3px] p-[32px]">
                {promo.title && (
                  <h3 className="text-[18px] font-semibold mb-2">
                    {promo.title}
                  </h3>
                )}

                {promo.description && (
                  <p className="text-[14px] mb-4" dangerouslySetInnerHTML={{ __html: promo.description }} />
                )}

                {promo.buttonText && promo.buttonUrl && (
                  <a
                    href={promo.buttonUrl}
                    className="btn-primary"
                  >
                    {promo.buttonText}
                  </a>
                )}
              </div>
            )}
          </div>

          {/* RIGHT CONTENT */}
          <div className="flex-1">
            <div
              className="prose max-w-none [&_h2]:font-montserrat [&_h2]:text-[28px] [&_h2]:font-semibold [&_h2]:leading-snug [&_h2]:mb-4 [&_h3]:font-montserrat [&_h3]:text-[22px] [&_h3]:font-semibold [&_h3]:leading-snug [&_h3]:mb-3 [&_p]:font-cabin [&_p]:text-[16px] [&_p]:leading-[1.7] [&_p]:mb-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4 [&_li]:mb-2 [&_li]:font-cabin [&_li]:text-[16px] [&_li::marker]:text-[#2555C4] [&_a]:text-[#2555C4] [&_a:hover]:underline [&_a:hover]:text-[#2555C4]"
              dangerouslySetInnerHTML={{ __html: processedContent || content }}
            />

            {/* AUTHOR CARD */}
            {display_author_card && authorCards.length > 0 && (
              <div className="mt-10 space-y-4">
                {authorCards.map((card, i) => (
                  <AuthorCard key={i} card={card} />
                ))}
              </div>
            )}

            {/* SOCIAL */}
            <div className="mt-10 p-6 bg-[#e9f1fb] rounded-[3px] flex justify-between items-center flex-wrap gap-4">
              <p className="font-semibold text-[#061837]">
                {t.shareText}
              </p>

              <div className="flex gap-3">
     

                {/* Facebook */}
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-[40px] h-[40px] rounded-full bg-[#D1D9E6] flex items-center justify-center hover:bg-[#2555C4] hover:text-white transition text-[#061837]"
                >
                  <svg width="10" height="18" viewBox="0 0 10 18" fill="currentColor">
                    <path d="M6.39 18V9.79h2.75l.41-3.2H6.39V4.55c0-.93.26-1.56 1.59-1.56h1.7V.13A22.82 22.82 0 0 0 7.19 0C4.71 0 3.03 1.49 3.03 4.23v2.36H.28v3.2h2.75V18h3.36z"/>
                  </svg>
                </a>

                {/* LinkedIn */}
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(pageUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-[40px] h-[40px] rounded-full bg-[#D1D9E6] flex items-center justify-center hover:bg-[#2555C4] hover:text-white transition text-[#061837]"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>

                {/* Email */}
                <a
                  href={`mailto:?subject=${encodeURIComponent(heading ? heading.replace(/<[^>]*>/g, "") : "")}&body=${encodeURIComponent(pageUrl)}`}
                  className="w-[40px] h-[40px] rounded-full bg-[#D1D9E6] flex items-center justify-center hover:bg-[#2555C4] hover:text-white transition text-[#061837]"
                >
                  <svg width="18" height="14" viewBox="0 0 20 16" fill="currentColor">
                    <path d="M18 0H2C.9 0 .01.9.01 2L0 14c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V2c0-1.1-.9-2-2-2zm0 4-8 5-8-5V2l8 5 8-5v2z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* RELATED */}
        {relatedPosts.length > 0 && (
          <div className="mt-20">
            <h2 className="text-[28px] font-semibold mb-10">
              {t.relatedHeading}
            </h2>
            <BlogSlider slides={relatedPosts} />
          </div>
        )}
      </div>
    </section>
    </>
  );
}
