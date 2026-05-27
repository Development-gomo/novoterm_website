import SectionRenderer from "../../../components/SectionRenderer";
import StickyServiceNav from "../../../components/StickyServiceNav";
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
          localePath("service", previewData.slug || slug, previewLang),
          previewLang
        ),
        permanent: false,
      },
    };
  }

  // This route is only for Swedish — send English visitors to /en/services/:slug
  if (lang !== "sv") {
    return {
      redirect: { destination: `/en/services/${params.slug}`, permanent: true },
    };
  }

  let service = null;

  if (preview && previewData?.type === "service" && previewData?.postId) {
    service = await fetchPreviewContentById(previewData.postId, "service", lang);
  } else {
    const base = `${process.env.NEXT_PUBLIC_WP_URL}/wp-json/wp/v2/service?slug=${slug}&acf_format=standard`;
    const res = await fetch(`${base}&lang=${lang}`);
    const data = await res.json();
    service = Array.isArray(data) && data.length ? data[0] : null;
  }

  if (!service) {
    return { notFound: true };
  }

  return {
    props: {
      service,
      translations: service.translations || null,
      yoastHead: service.yoast_head || null,
      isPreview: Boolean(preview),
    },
  };
}

export default function SingleService({ service, yoastHead, lang }) {
  const sections = service.acf?.sections || [];
  const title = service.title?.rendered || "";
  const summary = service.acf?.article_summary || "";
  const canonicalUrl = buildSiteUrl(withLocalePrefix(`/tjanster/${service?.slug || ""}`, lang));

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
