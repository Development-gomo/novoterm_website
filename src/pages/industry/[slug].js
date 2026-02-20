import SectionRenderer from "../../../components/SectionRenderer";
import StickyServiceNav from "../../../components/StickyServiceNav";

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

  return (
    <main>
      {sections.length > 0 ? (
        <>
          <StickyServiceNav sections={sections} />
          <SectionRenderer sections={sections} />
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
