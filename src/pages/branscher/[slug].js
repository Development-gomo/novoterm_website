import SectionRenderer from "../../../components/SectionRenderer";
import StickyIndustryNav from "../../../components/StickyIndustryNav";
import { SpeakableSchema, YoastHead } from "../../../components/SEO/StructuredData";
import { buildSiteUrl, resolveLang, withLocalePrefix } from "../../../lib/api";

export async function getServerSideProps({ params, locale }) {
  const lang = resolveLang(locale);

  // This route is only for Swedish — send English visitors to /en/industry/:slug
  if (lang !== "sv") {
    return {
      redirect: { destination: `/en/industry/${params.slug}`, permanent: true },
    };
  }

  const { slug } = params;
  const base = `${process.env.NEXT_PUBLIC_WP_URL}/wp-json/wp/v2/industry?slug=${slug}&acf_format=standard`;

  const res = await fetch(`${base}&lang=${lang}`);
  const data = await res.json();

  if (!Array.isArray(data) || !data.length) {
    return { notFound: true };
  }

  return {
    props: {
      industry: data[0],
      translations: data[0].translations || null,
      yoastHead: data[0].yoast_head || null,
    },
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
