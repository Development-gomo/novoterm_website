import SectionRenderer from "../../../components/SectionRenderer";
import StickyServiceNav from "../../../components/StickyServiceNav";
import { SpeakableSchema, YoastHead } from "../../../components/SEO/StructuredData";
import { buildSiteUrl, resolveLang, withLocalePrefix } from "../../../lib/api";

export async function getServerSideProps({ params, locale }) {
  const { slug } = params;
  const lang = resolveLang(locale);

  // Swedish visitors should use /tjanster/:slug instead
  if (lang === "sv") {
    return {
      redirect: { destination: `/tjanster/${slug}`, permanent: true },
    };
  }

  const base = `${process.env.NEXT_PUBLIC_WP_URL}/wp-json/wp/v2/service?slug=${slug}&acf_format=standard`;

  // Only fetch in the requested language — wrong-locale slugs must 404.
  const res = await fetch(`${base}&lang=${lang}`);
  const data = await res.json();

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
export default function SingleService({ service, yoastHead, lang }) {
  const sections = service.acf?.sections || [];
  const title = service.title?.rendered || "";
  const summary = service.acf?.article_summary || "";
  const canonicalUrl = buildSiteUrl(withLocalePrefix(`/services/${service?.slug || ""}`, lang));

  return (
    <main>
      <YoastHead yoastHead={yoastHead} canonicalUrl={canonicalUrl} />
      <SpeakableSchema heading={service.acf.heading} summary={service.acf.article_summary} />
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
