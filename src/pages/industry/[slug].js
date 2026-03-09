import SectionRenderer from "../../../components/SectionRenderer";
import StickyIndustryNav from "../../../components/StickyIndustryNav";
import { SpeakableSchema } from "../../../components/SEO/StructuredData";

export async function getServerSideProps({ params }) {
  const { slug } = params;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_WP_URL}/wp-json/wp/v2/industry?slug=${slug}&acf_format=standard`
  );

  const data = await res.json();

  if (!data.length) {
    return { notFound: true };
  }

  return {
    props: {
      industry: data[0],
    },
  };
}

export default function SingleIndustry({ industry }) {
  const sections = industry.acf?.sections || [];
  const title = industry.title?.rendered || "";
  const summary = industry.acf?.article_summary || "";

  return (
    <main>
      <SpeakableSchema title={title} summary={summary} />
      {sections.length > 0 ? (
        <>
          <StickyIndustryNav sections={sections} />
          <SectionRenderer sections={sections} pageType="industry" />
        </>
      ) : (
        <div className="max-w-5xl mx-auto p-10">
          <h1 className="text-4xl font-bold mb-4">
            {industry.title?.rendered}
          </h1>
        </div>
      )}
    </main>
  );
}
