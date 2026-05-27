import SectionRenderer from "../../../components/SectionRenderer";
import StickyPageNav from "../../../components/StickyPageNav";
import { SpeakableSchema, YoastHead } from "../../../components/SEO/StructuredData";
import { buildSiteUrl, localePath, resolveLang, withLocalePrefix } from "../../../lib/api";
import { fetchPreviewContentById } from "../../../lib/wpPreview";

export async function getServerSideProps({ params, locale, preview, previewData }) {
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
    caseStudy = await fetchPreviewContentById(previewData.postId, "case_study", lang);
  } else {
    const base = `${process.env.NEXT_PUBLIC_WP_URL}/wp-json/wp/v2/case_study?slug=${slug}&acf_format=standard`;
    const res = await fetch(`${base}&lang=${lang}`);
    const data = await res.json();
    caseStudy = Array.isArray(data) && data.length ? data[0] : null;
  }

  if (!caseStudy) {
    return { notFound: true };
  }

  return {
    props: {
      caseStudy,
      currentSlug: caseStudy.slug || slug,
      translations: caseStudy.translations || null,
      yoastHead: caseStudy.yoast_head || null,
      isPreview: Boolean(preview),
    },
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
