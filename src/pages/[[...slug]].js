// pages/[[...slug]].jsx

import SectionRenderer from "../../components/SectionRenderer";
import { fetchPages, fetchPageBySlug } from "../../lib/api";

// Generate paths for both Swedish & English
export async function getStaticPaths() {
  const pagesSv = await fetchPages(100, "sv");
  const pagesEn = await fetchPages(100, "en");

  const makePaths = (pages, langPrefix = "") =>
    (pages || [])
      .filter(p => p?.slug)
      .map(p => ({
        params: {
          slug: langPrefix
            ? [langPrefix, ...p.slug.split("/").filter(Boolean)]
            : p.slug.split("/").filter(Boolean),
        },
      }));

  return {
    paths: [
      ...makePaths(pagesSv),       // Swedish paths
      ...makePaths(pagesEn, "en")  // English paths
    ],
    fallback: "blocking"
  };
}

// MULTILINGUAL PAGE FETCHER
export async function getStaticProps({ params }) {
  const segments = params?.slug || [];

  // Detect language from URL
  const isEnglish = segments[0] === "en";

  let slugPath;
  let lang;

  if (isEnglish) {
    lang = "en";
    slugPath = segments.slice(1).join("/") || "home";
  } else {
    lang = "sv";
    slugPath = segments.join("/") || "home";
  }

  // Fetch the page from WP with language filter
  const page = await fetchPageBySlug(slugPath, lang);

  if (!page) return { notFound: true };

  return {
    props: {
      page,
      lang
    },
    revalidate: 60
  };
}

export default function Page({ page, lang }) {
  const title = page?.title?.rendered || "";

  // 🔥 FIXED FIELD NAME HERE
  const sections = page?.acf?.page_sections || [];

  return (
    <main className="w-full">

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
