// pages/[[...slug]].jsx

import SectionRenderer from "../../components/SectionRenderer";
import StickyPageNav from "../../components/StickyPageNav";
import LcpHeroPreload from "../../components/LcpHeroPreload";
import { buildSiteUrl, fetchPages, fetchPageBySlug, DEFAULT_LANG, SUPPORTED_LANGS, resolveLang, withLocalePrefix } from "../../lib/api";
import { SpeakableSchema, YoastHead } from "../../components/SEO/StructuredData";

// Generate paths for both languages with locale so Next.js i18n
// routes each path to getStaticProps with the correct locale.
export async function getStaticPaths() {
  const allPages = await Promise.all(
    SUPPORTED_LANGS.map((lang) => fetchPages(100, lang))
  );

  const paths = SUPPORTED_LANGS.flatMap((locale, i) =>
    (allPages[i] || [])
      .filter((p) => p?.slug && p.slug !== "home") // "home" is served at "/" by the catch-all root
      .map((p) => ({
        params: { slug: p.slug.split("/").filter(Boolean) },
        locale,
      }))
  );

  return { paths, fallback: "blocking" };
}

// MULTILINGUAL PAGE FETCHER
export async function getStaticProps({ params, locale }) {
  const segments = params?.slug || [];
  const lang = resolveLang(locale);
  const slugPath = segments.join("/") || "home";

  // Only fetch the page in the requested language — a slug that belongs
  // to another locale (e.g. /en/kontakta-oss) must 404, not fall back.
  const page = await fetchPageBySlug(slugPath, lang);

  if (!page) return { notFound: true };

  // Pre-fetch initial articles if any articles_section exists on this page
  let initialArticles = null;
  const sections = page?.acf?.page_sections || [];
  const hasArticlesSection = sections.some(
    (s) => s?.acf_fc_layout === "articles_section"
  );
  if (hasArticlesSection) {
    try {
      const wpUrl = process.env.NEXT_PUBLIC_WP_URL?.replace(/\/$/, "");
      const res = await fetch(
        `${wpUrl}/wp-json/wp/v2/posts?_embed&lang=${lang}&per_page=7&page=1&orderby=date&order=desc`
      );
      if (res.ok) {
        const totalPages = parseInt(res.headers.get("X-WP-TotalPages") || "1", 10);
        const rawPosts = await res.json();
        // Trim to only the fields ArticlesSection.formatPost() needs
        const posts = (rawPosts || []).map((p) => {
          const fm = p._embedded?.["wp:featuredmedia"]?.[0];
          return {
            id: p.id,
            slug: p.slug,
            date: p.date,
            title: { rendered: p.title?.rendered || "" },
            excerpt: { rendered: p.excerpt?.rendered || "" },
            content: { rendered: p.content?.rendered || "" },
            _embedded: {
              "wp:term": [[{ name: p._embedded?.["wp:term"]?.[0]?.[0]?.name || "General" }]],
              "wp:featuredmedia": fm ? [{
                source_url: fm.source_url || "",
                media_details: {
                  sizes: {
                    medium_large: { source_url: fm.media_details?.sizes?.medium_large?.source_url || "" },
                    large: { source_url: fm.media_details?.sizes?.large?.source_url || "" },
                  },
                },
              }] : [],
            },
          };
        });
        initialArticles = { posts, totalPages };
      }
    } catch (e) {
      console.error("SSR articles prefetch failed:", e);
    }
  }

  return {
    props: {
      page,
      lang,
      translations: page.translations || null,
      yoastHead: page.yoast_head || null,
      initialArticles,
    },
    revalidate: 60
  };
}

export default function Page({ page, lang, yoastHead, initialArticles }) {
  const title = page?.title?.rendered || "";
  const summary = page?.acf?.article_summary || "";
  const pagePath = page?.slug === "home" ? "/" : `/${page?.slug || ""}`;
  const canonicalUrl = buildSiteUrl(withLocalePrefix(pagePath, lang));

  // Unified page builder field - all pages use page_sections
  const sections = page?.acf?.page_sections || [];

  return (
    <main className="w-full">
      <LcpHeroPreload sections={sections} />
      <YoastHead yoastHead={yoastHead} canonicalUrl={canonicalUrl} />
      <SpeakableSchema title={title} summary={summary} />

      {/* RENDER SECTIONS */}
      {sections.length ? (
        <>
          {page?.slug !== "home" && <StickyPageNav sections={sections} />}
          <SectionRenderer sections={sections} lang={lang} initialArticles={initialArticles} />
        </>
      ) : (
        <div>No sections found</div>
      )}
    </main>
  );
}
