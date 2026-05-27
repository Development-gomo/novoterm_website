// pages/[[...slug]].jsx

import SectionRenderer from "../../components/SectionRenderer";
import StickyPageNav from "../../components/StickyPageNav";
import LcpHeroPreload from "../../components/LcpHeroPreload";
import { buildSiteUrl, fetchPages, fetchPageBySlug, fetchClientLogos, fetchQuoteBlock, DEFAULT_LANG, SUPPORTED_LANGS, resolveLang, withLocalePrefix } from "../../lib/api";
import { SpeakableSchema, YoastHead } from "../../components/SEO/StructuredData";
import { fetchPreviewContentById } from "../../lib/wpPreview";

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
export async function getStaticProps({ params, locale, preview, previewData }) {
  const segments = params?.slug || [];
  const lang = resolveLang(locale);
  const slugPath = segments.join("/") || "home";

  // Only fetch the page in the requested language — a slug that belongs
  // to another locale (e.g. /en/kontakta-oss) must 404, not fall back.
  const page =
    preview && previewData?.type === "page" && previewData?.postId
      ? await fetchPreviewContentById(previewData.postId, "page", lang)
      : await fetchPageBySlug(slugPath, lang);

  if (!page) return { notFound: true };

  // Pre-fetch initial articles if any articles_section exists on this page
  let initialArticles = null;
  let initialDocumentTypes = null;
  let initialCaseStudies = null;
  let initialClientLogos = null;
  let initialCustomerQuotes = null;
  let initialTranslatorQuotes = null;
  const sections = page?.acf?.page_sections || [];
  const hasArticlesSection = sections.some(
    (s) => s?.acf_fc_layout === "articles_section"
  );
  const hasDocumentTypesSection = sections.some(
    (s) => s?.acf_fc_layout === "document_types"
  );
  const hasCaseStudySection = sections.some(
    (s) => s?.acf_fc_layout === "case_study_section"
  );
  const hasLogoSection = sections.some(
    (s) => s?.acf_fc_layout === "logo_section"
  );
  const quoteBlocks = sections.filter((s) => s?.acf_fc_layout === "translator_quote_block");
  const needsCustomerQuotes = quoteBlocks.some((s) => s?.quote_source === "customer");
  const needsTranslatorQuotes = quoteBlocks.some((s) => !s?.quote_source || s?.quote_source === "translator");

  // Prefetch articles
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

  // Prefetch document types
  if (hasDocumentTypesSection) {
    try {
      const wpUrl = process.env.NEXT_PUBLIC_WP_URL?.replace(/\/$/, "");
      const res = await fetch(
        `${wpUrl}/wp-json/wp/v2/document_type?acf_format=standard&lang=${lang}&per_page=100`
      );
      if (res.ok) {
        const data = await res.json();
        const formatted = data.map((post) => ({
          slug: post.slug,
          heading: post.acf.heading,
          subtext: post.acf.subtext,
          cs_image: post.acf.cs_image,
          button_url: post.acf.button_url || "",
          slider_sequence: parseInt(post.acf.slider_sequence, 10) || 0,
        }));
        formatted.sort((a, b) => a.slider_sequence - b.slider_sequence);
        if (formatted.length > 0) {
          formatted[formatted.length - 1].last_block = true;
        }
        initialDocumentTypes = formatted;
      }
    } catch (e) {
      console.error("SSR document types prefetch failed:", e);
    }
  }

  // Prefetch case studies
  if (hasCaseStudySection) {
    try {
      const wpUrl = process.env.NEXT_PUBLIC_WP_URL?.replace(/\/$/, "");
      const res = await fetch(
        `${wpUrl}/wp-json/wp/v2/case_study?acf_format=standard&lang=${lang}&per_page=100`
      );
      if (res.ok) {
        const data = await res.json();
        const formatted = data.map(post => ({
          slug: post.slug,
          title: post.acf.review_heading || "",
          review_heading: post.acf.review_heading || "",
          button_text: post.acf.button_text || "",
          button_link: post.acf.button_link || "",
          time_text: post.acf.time_text || "",
          subtext: post.acf.subtext || "",
          service_title: post.acf.service_title || "",
          service_used: post.acf.service_used || "",
          image: post.acf.cs_image || "",
          cs_image: post.acf.cs_image || "",
        }));
        initialCaseStudies = formatted;
      }
    } catch (e) {
      console.error("SSR case studies prefetch failed:", e);
    }
  }

  // Prefetch client logos from options page
  if (hasLogoSection) {
    try {
      initialClientLogos = await fetchClientLogos();
    } catch (e) {
      console.error("SSR client logos prefetch failed:", e);
    }
  }

  // Prefetch quote blocks from options pages
  if (needsCustomerQuotes) {
    try { initialCustomerQuotes = await fetchQuoteBlock("customer", lang); }
    catch (e) { console.error("SSR customer quotes prefetch failed:", e); }
  }
  if (needsTranslatorQuotes) {
    try { initialTranslatorQuotes = await fetchQuoteBlock("translator", lang); }
    catch (e) { console.error("SSR translator quotes prefetch failed:", e); }
  }

  return {
    props: {
      page,
      lang,
      translations: page.translations || null,
      yoastHead: page.yoast_head || null,
      initialArticles,
      initialDocumentTypes,
      initialCaseStudies,
      initialClientLogos,
      initialCustomerQuotes,
      initialTranslatorQuotes,
    },
    revalidate: 60
  };
}

export default function Page({ page, lang, yoastHead, initialArticles, initialDocumentTypes, initialCaseStudies, initialClientLogos, initialCustomerQuotes, initialTranslatorQuotes }) {
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
      <SpeakableSchema heading={page?.acf?.heading} summary={page?.acf?.article_summary} />

      {/* RENDER SECTIONS */}
      {sections.length ? (
        <>
          {page?.slug !== "home" && <StickyPageNav sections={sections} />}
          <SectionRenderer sections={sections} lang={lang} initialArticles={initialArticles} initialDocumentTypes={initialDocumentTypes} initialCaseStudies={initialCaseStudies} initialClientLogos={initialClientLogos} initialCustomerQuotes={initialCustomerQuotes} initialTranslatorQuotes={initialTranslatorQuotes} />
        </>
      ) : (
        <div>No sections found</div>
      )}
    </main>
  );
}
