import SectionRenderer from "../../../components/SectionRenderer";

export async function getServerSideProps({ params }) {
  const { slug } = params;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_WP_URL}/wp-json/wp/v2/case_study?slug=${slug}&acf_format=standard`
  );

  const data = await res.json();

  if (!data.length) {
    return { notFound: true };
  }

  return {
    props: {
      caseStudy: data[0],
      currentSlug: slug,
    },
  };
}

export default function CaseStudyPage({ caseStudy, currentSlug }) {
  return (
    <>
      {caseStudy?.acf?.sections && (
        <SectionRenderer
          sections={caseStudy.acf.sections}
          currentSlug={currentSlug}
        />
      )}
    </>
  );
}
