// pages/[[...slug]].jsx
import SectionRenderer from "../../components/SectionRenderer";
import { fetchPages, fetchPageBySlug } from "../../lib/api";

export async function getStaticPaths() {
  const pages = await fetchPages();
  const paths = (pages || [])
    .filter(p => p?.slug)
    .map(p => ({
      // split nested slugs like "about/team" → ["about","team"]
      params: { slug: p.slug.split('/').filter(Boolean) },
    }));

  return { paths, fallback: "blocking" };
}

export async function getStaticProps({ params }) {
  const slugPath = (params?.slug || []).join('/') || "home";
  const page = await fetchPageBySlug(slugPath);
  if (!page) return { notFound: true };
  return { props: { page }, revalidate: 60 };
}

export default function Page({ page }) {
  const title = page?.title?.rendered || "";
  const sections = page?.acf?.hackathon_builder || [];

  return (
    <main className="container mx-auto p-6">
      <h1
        className="text-3xl font-bold mb-6"
        dangerouslySetInnerHTML={{ __html: title }}
      />
      {sections.length ? (
        <SectionRenderer sections={sections} />
      ) : (
        <div>No sections found</div>
      )}
    </main>
  );
}
