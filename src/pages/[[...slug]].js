// pages/[[...slug]].jsx

import SectionRenderer from "../../components/SectionRenderer";
import { fetchPages, fetchPageBySlug, DEFAULT_LANG, SUPPORTED_LANGS, resolveLang } from "../../lib/api";
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

  // Try requested language first, fall back to the other language
  let page = await fetchPageBySlug(slugPath, lang);
  if (!page) {
    page = await fetchPageBySlug(slugPath, SUPPORTED_LANGS.find((l) => l !== lang) ?? DEFAULT_LANG);
  }

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

  // Unified page builder field - all pages use page_sections
  const sections = page?.acf?.page_sections || [];

  return (
    <main className="w-full">
      <YoastHead yoastHead={yoastHead} />
      <SpeakableSchema title={title} summary={summary} />

      {/* PAGE TITLE */}
      {/* <h1
        className="text-3xl font-bold mb-6"
        dangerouslySetInnerHTML={{ __html: title }}
      /> */}

      {/* RENDER SECTIONS */}
      {sections.length ? (
        <SectionRenderer sections={sections} lang={lang} />
      ) : (
        <div>No sections found</div>
      )}
    </main>
  );
}
