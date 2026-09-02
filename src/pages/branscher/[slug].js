import SectionRenderer from "../../../components/SectionRenderer";
import StickyIndustryNav from "../../../components/StickyIndustryNav";
import { SpeakableSchema, YoastHead } from "../../../components/SEO/StructuredData";
import { buildSiteUrl, fetchWpPostBySlug, fetchWpSlugs, localePath, resolveLang, withLocalePrefix } from "../../../lib/api";
import { fetchPreviewContentById } from "../../../lib/wpPreview";

const REVALIDATE_SECONDS = 60;

export async function getStaticPaths() {
  const slugs = await fetchWpSlugs("industry", "sv");

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
          localePath("industry", previewData.slug || slug, previewLang),
          previewLang
        ),
        permanent: false,
      },
    };
  }

  // This route is only for Swedish — send English visitors to /en/industry/:slug
  if (lang !== "sv") {
    return {
      redirect: { destination: `/en/industry/${params.slug}`, permanent: true },
    };
  }

  let industry = null;

  if (preview && previewData?.type === "industry" && previewData?.postId) {
    try {
      industry = await fetchPreviewContentById(previewData.postId, "industry", lang);
    } catch (error) {
      console.error("Industry preview fetch failed:", error);
    }
  } else {
    industry = await fetchWpPostBySlug("industry", slug, lang);
  }

  if (!industry) {
    return { notFound: true, revalidate: REVALIDATE_SECONDS };
  }

  return {
    props: {
      industry,
      translations: industry.translations || null,
      yoastHead: industry.yoast_head || null,
      isPreview: Boolean(preview),
    },
    revalidate: REVALIDATE_SECONDS,
  };
}

export default function SingleIndustry({ industry, yoastHead, lang }) {
  const sections = industry.acf?.sections || [];
  const canonicalUrl = buildSiteUrl(withLocalePrefix(`/branscher/${industry?.slug || ""}`, lang));

  return (
    <main>
      <YoastHead yoastHead={yoastHead} canonicalUrl={canonicalUrl} />
      <SpeakableSchema heading={industry.acf?.heading} summary={industry.acf?.article_summary} />
      {sections.length > 0 ? (
        <>
          <StickyIndustryNav sections={sections} />
          <SectionRenderer sections={sections} pageType="industry" />
        </>
      ) : (
        <div className="max-w-5xl mx-auto p-10">
          <h1 className="text-4xl font-bold mb-4">{industry.title?.rendered}</h1>
        </div>
      )}
    </main>
  );
}
