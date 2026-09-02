// pages/[[...slug]].jsx

import SectionRenderer from "../../components/SectionRenderer";
import StickyPageNav from "../../components/StickyPageNav";
import LcpHeroPreload from "../../components/LcpHeroPreload";
import { buildSiteUrl, fetchPages, fetchPageBySlug, fetchClientLogos, fetchQuoteBlock, fetchLanguages, DEFAULT_LANG, SUPPORTED_LANGS, resolveLang, withLocalePrefix } from "../../lib/api";
import { SpeakableSchema, YoastHead } from "../../components/SEO/StructuredData";
import { fetchPreviewContentById } from "../../lib/wpPreview";
import { fetchHeadlessVideos } from "../../lib/headlessVideo";

const PAGE_SLUG_ALIASES = {
  sv: {
    videos: "videor",
  },
};

const WP_PAGE_SLUG_ALIASES = {
  sv: {
    videor: "videos",
  },
};

function pageSlugToPath(slug = "", lang = DEFAULT_LANG) {
  const aliases = PAGE_SLUG_ALIASES[lang] || {};
  return aliases[slug] || slug;
}

function pathToWpPageSlug(path = "", lang = DEFAULT_LANG) {
  const aliases = WP_PAGE_SLUG_ALIASES[lang] || {};
  return aliases[path] || path;
}

function normalizeSwedishVideoListingString(value = "") {
  let result = value
    .split("https://backend.novoterm.se/videos/").join("https://backend.novoterm.se/videor/")
    .split("https:\\/\\/backend.novoterm.se\\/videos\\/").join("https:\\/\\/backend.novoterm.se\\/videor\\/");

  if (result === "Videos") return "Videor";
  if (["Titta på video", "Titta pa video"].includes(result.trim())) {
    return "Titta på videon";
  }

  return result
    .replace(/"name":"Videos"/g, '"name":"Videor"')
    .replace(/"name": "Videos"/g, '"name": "Videor"');
}

function normalizeSwedishVideoListingData(value) {
  if (Array.isArray(value)) {
    return value.map(normalizeSwedishVideoListingData);
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [
        key,
        normalizeSwedishVideoListingData(item),
      ])
    );
  }

  if (typeof value === "string") {
    return normalizeSwedishVideoListingString(value);
  }

  return value;
}

function normalizePageForRoute(page, lang, slugPath) {
  if (lang !== "sv" || slugPath !== "videor") return page;

  return {
    ...normalizeSwedishVideoListingData(page),
    slug: "videor",
  };
}

// Generate paths for both languages with locale so Next.js i18n
// routes each path to getStaticProps with the correct locale.
export async function getStaticPaths() {
  const allPages = await Promise.all(
    SUPPORTED_LANGS.map((lang) =>
      fetchPages(100, lang).catch((error) => {
        console.error(`Static path fetch failed for ${lang}:`, error);
        return [];
      })
    )
  );

  const paths = SUPPORTED_LANGS.flatMap((locale, i) =>
    (allPages[i] || [])
      .filter((p) => p?.slug && p.slug !== "home") // "home" is served at "/" by the catch-all root
      .map((p) => ({
        params: { slug: pageSlugToPath(p.slug, locale).split("/").filter(Boolean) },
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
  const wpSlugPath = pathToWpPageSlug(slugPath, lang);

  // Only fetch the page in the requested language — a slug that belongs
  // to another locale (e.g. /en/kontakta-oss) must 404, not fall back.
  let page = null;
  try {
    page =
      preview && previewData?.type === "page" && previewData?.postId
        ? await fetchPreviewContentById(previewData.postId, "page", lang)
        : await fetchPageBySlug(wpSlugPath, lang);
  } catch (error) {
    console.error(`Page fetch failed for "${wpSlugPath}" (${lang}):`, error);
    throw error;
  }

  if (!page) return { notFound: true };
  const routePage = normalizePageForRoute(page, lang, slugPath);

  // Pre-fetch initial posts if any article-driven section exists on this page.
  let initialArticles = null;
  let initialDocumentTypes = null;
  let initialCaseStudies = null;
  let initialIndustries = null;
  let initialClientLogos = null;
  let initialCustomerQuotes = null;
  let initialTranslatorQuotes = null;
  let initialHeadlessVideos = null;
  let initialLanguages = null;
  const sections = routePage?.acf?.page_sections || [];
  const hasArticlesSection = sections.some(
    (s) => s?.acf_fc_layout === "articles_section"
  );
  const hasInsightsSection = sections.some(
    (s) => s?.acf_fc_layout === "insights_section"
  );
  const hasDocumentTypesSection = sections.some(
    (s) => s?.acf_fc_layout === "document_types"
  );
  const hasCaseStudySection = sections.some(
    (s) => s?.acf_fc_layout === "case_study_section"
  );
  const hasServiceCaseStudySection = sections.some(
    (s) => s?.acf_fc_layout === "service_case_study_section"
  );
  const hasIndustriesSection = sections.some(
    (s) => s?.acf_fc_layout === "industries"
  );
  const hasLogoSection = sections.some(
    (s) => s?.acf_fc_layout === "logo_section"
  );
  const quoteBlocks = sections.filter((s) => s?.acf_fc_layout === "translator_quote_block");
  const hasVideosListingSection = sections.some(
    (s) => s?.acf_fc_layout === "videos_listing"
  );
  const hasLanguageModule = sections.some(
    (s) => s?.acf_fc_layout === "language_module"
  );
  const needsCustomerQuotes = quoteBlocks.some((s) => s?.quote_source === "customer");
  const needsTranslatorQuotes = quoteBlocks.some((s) => !s?.quote_source || s?.quote_source === "translator");

  // Prefetch posts for article grids and insight sliders.
  if (hasArticlesSection || hasInsightsSection) {
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
  if (hasCaseStudySection || hasServiceCaseStudySection) {
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

  if (hasVideosListingSection) {
    try {
      initialHeadlessVideos = await fetchHeadlessVideos({ perPage: 100, lang });
    } catch (e) {
      console.error("SSR headless videos prefetch failed:", e);
    }
  }

  if (hasIndustriesSection) {
    try {
      const wpUrl = process.env.NEXT_PUBLIC_WP_URL?.replace(/\/$/, "");
      const res = await fetch(
        `${wpUrl}/wp-json/wp/v2/industry?_embed&acf_format=standard&lang=${lang}&per_page=20`
      );
      if (res.ok) {
        const data = await res.json();
        const hiddenSlugs = ["vara-huvudomraden", "main-areas"];
        initialIndustries = Array.isArray(data)
          ? data
              .filter((item) => !hiddenSlugs.includes(item.slug))
              .map((item) => ({
                id: item.id,
                title: item.title?.rendered || "",
                slug: item.slug,
                image: item._embedded?.["wp:featuredmedia"]?.[0]?.source_url || "",
              }))
          : [];
      }
    } catch (e) {
      console.error("SSR industries prefetch failed:", e);
    }
  }

  if (hasLanguageModule) {
    try {
      initialLanguages = await fetchLanguages(lang);
    } catch (e) {
      console.error("SSR languages prefetch failed:", e);
    }
  }

  return {
    props: {
      page: routePage,
      lang,
      translations: routePage.translations || null,
      yoastHead: routePage.yoast_head || null,
      initialArticles,
      initialDocumentTypes,
      initialCaseStudies,
      initialIndustries,
      initialClientLogos,
      initialCustomerQuotes,
      initialTranslatorQuotes,
      initialHeadlessVideos,
      initialLanguages,
      isPreview: Boolean(preview),
    },
    revalidate: 60
  };
}

export default function Page({ page, lang, yoastHead, initialArticles, initialDocumentTypes, initialCaseStudies, initialIndustries, initialClientLogos, initialCustomerQuotes, initialTranslatorQuotes, initialHeadlessVideos, initialLanguages }) {
  const title = page?.title?.rendered || "";
  const summary = page?.acf?.article_summary || "";
  const localizedSlug = pageSlugToPath(page?.slug || "", lang);
  const pagePath = page?.slug === "home" ? "/" : `/${localizedSlug}`;
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
          <SectionRenderer sections={sections} lang={lang} initialArticles={initialArticles} initialDocumentTypes={initialDocumentTypes} initialCaseStudies={initialCaseStudies} initialIndustries={initialIndustries} initialClientLogos={initialClientLogos} initialCustomerQuotes={initialCustomerQuotes} initialTranslatorQuotes={initialTranslatorQuotes} initialHeadlessVideos={initialHeadlessVideos} initialLanguages={initialLanguages} />
        </>
      ) : (
        <div>No sections found</div>
      )}
    </main>
  );
}
