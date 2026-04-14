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

  return {
    props: {
      page,
      lang,
      translations: page.translations || null,
      yoastHead: page.yoast_head || null,
    },
    revalidate: 60
  };
}

export default function Page({ page, lang, yoastHead }) {
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
          <SectionRenderer sections={sections} lang={lang} />
        </>
      ) : (
        <div>No sections found</div>
      )}
    </main>
  );
}
