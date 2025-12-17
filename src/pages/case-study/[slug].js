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
    },
  };
}

export default function SingleCaseStudy({ caseStudy }) {
  return (
    <div className="max-w-5xl mx-auto p-10">
      <h1 className="text-4xl font-bold mb-4">
        {caseStudy.acf.review_heading}
      </h1>

      <img
        src={caseStudy.acf.cs_image}
        className="w-full mb-6 rounded-lg"
      />

      <div
        dangerouslySetInnerHTML={{ __html: caseStudy.content.rendered }}
      />
    </div>
  );
}
