import SectionRenderer from "../../../components/SectionRenderer";
import StickyServiceNav from "../../../components/StickyServiceNav";
import { SpeakableSchema } from "../../../components/SEO/StructuredData";

export async function getServerSideProps({ params }) {
  const { slug } = params;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_WP_URL}/wp-json/wp/v2/service?slug=${slug}&acf_format=standard`
  );

  const data = await res.json();

  if (!data.length) {
    return { notFound: true };
  }

  return {
    props: {
      service: data[0],
    },
  };
}

export default function SingleService({ service }) {
  const sections = service.acf?.sections || [];
  const title = service.title?.rendered || "";
  const summary = service.acf?.article_summary || "";

  return (
    <main>
      <SpeakableSchema title={title} summary={summary} />
      {sections.length > 0 ? (
        <>
          <StickyServiceNav sections={sections} />
          <SectionRenderer sections={sections} />
        </>
      ) : (
        // fallback if no flexible content added
        <div className="max-w-5xl mx-auto p-10">
          <h1 className="text-4xl font-bold mb-4">
            {service.acf.heading}
          </h1>

          <div
            dangerouslySetInnerHTML={{
              __html: service.acf.description_text,
            }}
          />
        </div>
      )}
    </main>
  );
}
