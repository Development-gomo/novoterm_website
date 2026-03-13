import SectionRenderer from "../../../components/SectionRenderer";
import StickyServiceNav from "../../../components/StickyServiceNav";
import { SpeakableSchema, YoastHead } from "../../../components/SEO/StructuredData";
import { resolveLang } from "../../../lib/api";

export async function getServerSideProps({ params, locale }) {
  const { slug } = params;
  const lang = resolveLang(locale);

  const base = `${process.env.NEXT_PUBLIC_WP_URL}/wp-json/wp/v2/service?slug=${slug}&acf_format=standard`;

  // Fetch with language filter first, then fall back to default language
  let res = await fetch(`${base}&lang=${lang}`);
  let data = await res.json();

  if (!Array.isArray(data) || !data.length) {
    res = await fetch(base);
    data = await res.json();
  }

  if (!Array.isArray(data) || !data.length) {
    return { notFound: true };
  }

  return {
    props: {
      service: data[0],
      translations: data[0].translations || null,
      yoastHead: data[0].yoast_head || null,
    },
  };
}
export default function SingleService({ service, yoastHead }) {
  const sections = service.acf?.sections || [];
  const title = service.title?.rendered || "";
  const summary = service.acf?.article_summary || "";

  return (
    <main>
      <YoastHead yoastHead={yoastHead} />
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
