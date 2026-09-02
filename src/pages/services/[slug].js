import SectionRenderer from "../../../components/SectionRenderer";
import StickyServiceNav from "../../../components/StickyServiceNav";
import { SpeakableSchema, YoastHead } from "../../../components/SEO/StructuredData";
import { buildSiteUrl, fetchCaseStudies, fetchIndustries, fetchWpPostBySlug, fetchWpSlugs, localePath, resolveLang, withLocalePrefix } from "../../../lib/api";
import { fetchPreviewContentById } from "../../../lib/wpPreview";

const REVALIDATE_SECONDS = 60;

export async function getStaticPaths() {
  const slugs = await fetchWpSlugs("service", "en");

  return {
    paths: slugs.map((slug) => ({ params: { slug }, locale: "en" })),
    fallback: "blocking",
  };
}

export async function getStaticProps({ params, locale, preview, previewData }) {
  const { slug } = params;
  const lang = resolveLang(locale);
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

  // Swedish visitors should use /tjanster/:slug instead
  if (lang === "sv") {
    return {
      redirect: { destination: `/tjanster/${slug}`, permanent: true },
    };
  }

  let service = null;

  // Only fetch in the requested language — wrong-locale slugs must 404.
  if (preview && previewData?.type === "service" && previewData?.postId) {
    try {
      service = await fetchPreviewContentById(previewData.postId, "service", lang);
    } catch (error) {
      console.error("Service preview fetch failed:", error);
    }
  } else {
    service = await fetchWpPostBySlug("service", slug, lang);
  }

  if (!service) {
    return { notFound: true, revalidate: REVALIDATE_SECONDS };
  }

  const sections = service.acf?.sections || [];
  const needsCaseStudies = sections.some(
    (section) =>
      section?.acf_fc_layout === "case_study_section" ||
      section?.acf_fc_layout === "service_case_study_section"
  );
  const needsIndustries = sections.some(
    (section) => section?.acf_fc_layout === "industries"
  );
  const initialCaseStudies = needsCaseStudies ? await fetchCaseStudies(lang) : null;
  const initialIndustries = needsIndustries ? await fetchIndustries(lang) : null;

  return {
    props: {
      service,
      lang,
      translations: service.translations || null,
      yoastHead: service.yoast_head || null,
      initialCaseStudies,
      initialIndustries,
      isPreview: Boolean(preview),
    },
    revalidate: REVALIDATE_SECONDS,
  };
}
export default function SingleService({ service, yoastHead, lang, initialCaseStudies, initialIndustries }) {
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
          <SectionRenderer
            sections={sections}
            lang={lang}
            initialCaseStudies={initialCaseStudies}
            initialIndustries={initialIndustries}
          />
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
