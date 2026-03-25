import SectionRenderer from "../../../components/SectionRenderer";
import StickyPageNav from "../../../components/StickyPageNav";
import { SpeakableSchema, YoastHead } from "../../../components/SEO/StructuredData";
import { resolveLang } from "../../../lib/api";

export async function getServerSideProps({ params, locale }) {
  const { slug } = params;
  const lang = resolveLang(locale);

  const base = `${process.env.NEXT_PUBLIC_WP_URL}/wp-json/wp/v2/case_study?slug=${slug}&acf_format=standard`;

  // Only fetch in the requested language — wrong-locale slugs must 404.
  const res = await fetch(`${base}&lang=${lang}`);
  const data = await res.json();

  if (!Array.isArray(data) || !data.length) {
    return { notFound: true };
  }

  return {
    props: {
      caseStudy: data[0],
      currentSlug: slug,
      translations: data[0].translations || null,
      yoastHead: data[0].yoast_head || null,
    },
  };
}

export default function CaseStudyPage({ caseStudy, currentSlug, yoastHead }) {
  const title = caseStudy?.title?.rendered || "";
  const summary = caseStudy?.acf?.article_summary || "";

  return (
    <>
      <YoastHead yoastHead={yoastHead} />
      <SpeakableSchema title={title} summary={summary} />
      {caseStudy?.acf?.sections && (
        <>
          <StickyPageNav sections={caseStudy.acf.sections} />
          <SectionRenderer
            sections={caseStudy.acf.sections}
            currentSlug={currentSlug}
          />
        </>
      )}
    </>
  );
}
