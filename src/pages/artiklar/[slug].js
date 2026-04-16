import SectionRenderer from "../../../components/SectionRenderer";
import { SpeakableSchema, YoastHead } from "../../../components/SEO/StructuredData";
import { buildSiteUrl, localePath, resolveLang, withLocalePrefix } from "../../../lib/api";

export async function getServerSideProps({ params, locale }) {
  const { slug } = params;
  const lang = resolveLang(locale);

  // /artiklar/* is Swedish-only — redirect if reached under any other locale
  if (lang !== "sv") {
    return { redirect: { destination: `/artiklar/${slug}`, permanent: true } };
  }

  const base = `${process.env.NEXT_PUBLIC_WP_URL}/wp-json/wp/v2/posts?slug=${slug}&acf_format=standard&_embed`;

  // Only fetch in the requested language — wrong-locale slugs must 404.
  const res = await fetch(`${base}&lang=${lang}`);
  const data = await res.json();

  if (!Array.isArray(data) || !data.length) {
    return { notFound: true };
  }

  const post = data[0];
  const featuredImage = post._embedded?.["wp:featuredmedia"]?.[0]?.source_url || "";
  const categories = post._embedded?.["wp:term"]?.[0] || [];
  const author = post._embedded?.author?.[0]?.name || "";
  const publishedDate = new Date(post.date).toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric",
  });
  const wordCount = post.content?.rendered?.replace(/<[^>]*>/g, "").split(/\s+/).length || 0;

  if (post.acf?.sections && Array.isArray(post.acf.sections)) {
    return { props: { post, sections: post.acf.sections, currentSlug: slug, lang, translations: post.translations || null, yoastHead: post.yoast_head || null } };
  }

  return {
    props: {
      post,
      currentSlug: slug,
      lang,
      translations: post.translations || null,
      yoastHead: post.yoast_head || null,
      sections: [
        {
          acf_fc_layout: "blog_content",
          featured_image: featuredImage,
          heading: post.title?.rendered || "",
          excerpt: post.excerpt?.rendered || "",
          content: post.content?.rendered || "",
          author,
          published_date: publishedDate,
          reading_time: Math.ceil(wordCount / 200),
          category: categories[0]?.name || "",
          category_id: categories[0]?.id || null,
          slug,
        },
      ],
    },
  };
}

export default function BlogPost({ post, sections, currentSlug, yoastHead, lang }) {
  const canonicalUrl = buildSiteUrl(withLocalePrefix(localePath("article", currentSlug, lang), lang));

  return (
    <>
      <YoastHead yoastHead={yoastHead} canonicalUrl={canonicalUrl} />
      <SpeakableSchema title={post?.title?.rendered || ""} summary={post?.acf?.article_summary || ""} />
      {sections && <SectionRenderer sections={sections} currentSlug={currentSlug} />}
    </>
  );
}
