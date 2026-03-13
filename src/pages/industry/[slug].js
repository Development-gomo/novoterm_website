import SectionRenderer from "../../../components/SectionRenderer";
import StickyIndustryNav from "../../../components/StickyIndustryNav";
import { SpeakableSchema, YoastHead } from "../../../components/SEO/StructuredData";
import { resolveLang } from "../../../lib/api";

export async function getServerSideProps({ params, locale }) {
  const { slug } = params;
  const lang = resolveLang(locale);

  const base = `${process.env.NEXT_PUBLIC_WP_URL}/wp-json/wp/v2/industry?slug=${slug}&acf_format=standard`;

  let res = await fetch(`${base}&lang=${lang}`);
  let data = await res.json();

  if (!Array.isArray(data) || !data.length) {
    res = await fetch(base);
    data = await res.json();
  }

  if (!Array.isArray(data) || !data.length) {
    return { notFound: true };
  }

  return { props: { industry: data[0], translations: data[0].translations || null, yoastHead: data[0].yoast_head || null } };
}

export default function SingleIndustry({ industry, yoastHead }) {
  const sections = industry.acf?.sections || [];

  return (
    <main>
      <YoastHead yoastHead={yoastHead} />
      <SpeakableSchema title={industry.title?.rendered || ""} summary={industry.acf?.article_summary || ""} />
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
