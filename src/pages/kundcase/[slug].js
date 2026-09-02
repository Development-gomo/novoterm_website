import SectionRenderer from "../../../components/SectionRenderer";
import StickyPageNav from "../../../components/StickyPageNav";
import { SpeakableSchema, YoastHead } from "../../../components/SEO/StructuredData";
import { buildSiteUrl, fetchWpPostBySlug, fetchWpSlugs, localePath, resolveLang, withLocalePrefix } from "../../../lib/api";
import { fetchPreviewContentById } from "../../../lib/wpPreview";

const REVALIDATE_SECONDS = 60;

export async function getStaticPaths() {
  const slugs = await fetchWpSlugs("case_study", "sv");

  return {
    paths: slugs.map((slug) => ({ params: { slug }, locale: "sv" })),
    fallback: "blocking",
  };
}

export async function getStaticProps({ params, locale, preview, previewData }) {
  const lang = resolveLang(locale);
  const { slug } = params;
  const previewLang = previewData?.lang ? resolveLang(previewData.lang) : null;

  if (preview && previewLang && previewLang !== lang) {
    return {
      redirect: {
        destination: withLocalePrefix(
          localePath("caseStudy", previewData.slug || slug, previewLang),
          previewLang
        ),
        permanent: false,
      },
    };
  }

  // This route is only for Swedish — send English visitors to /en/client-case/:slug
  if (lang !== "sv") {
    return {
      redirect: { destination: `/en/client-case/${params.slug}`, permanent: true },
    };
  }

  let caseStudy = null;

  if (preview && previewData?.type === "case_study" && previewData?.postId) {
    try {
      caseStudy = await fetchPreviewContentById(previewData.postId, "case_study", lang);
    } catch (error) {
      console.error("Case study preview fetch failed:", error);
    }
  } else {
    caseStudy = await fetchWpPostBySlug("case_study", slug, lang);
  }

  if (!caseStudy) {
    return { notFound: true, revalidate: REVALIDATE_SECONDS };
  }

  return {
    props: {
      caseStudy,
      currentSlug: caseStudy.slug || slug,
      translations: caseStudy.translations || null,
      yoastHead: caseStudy.yoast_head || null,
      isPreview: Boolean(preview),
    },
    revalidate: REVALIDATE_SECONDS,
  };
}

export default function CaseStudyPage({ caseStudy, currentSlug, yoastHead, lang }) {
  const title = caseStudy?.title?.rendered || "";
  const summary = caseStudy?.acf?.article_summary || "";
  const canonicalUrl = buildSiteUrl(withLocalePrefix(`/kundcase/${currentSlug}`, lang));

  return (
    <>
      <YoastHead yoastHead={yoastHead} canonicalUrl={canonicalUrl} />
      <SpeakableSchema heading={caseStudy?.acf?.heading} summary={caseStudy?.acf?.article_summary} />
      {caseStudy?.acf?.sections && (
        <>
          <StickyPageNav sections={caseStudy.acf.sections} />
          <SectionRenderer
            sections={caseStudy.acf.sections}
            currentSlug={currentSlug}
            postAcf={caseStudy.acf}
          />
        </>
      )}
    </>
  );
}
