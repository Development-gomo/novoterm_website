import SectionRenderer from "../../../components/SectionRenderer";
import { SpeakableSchema, YoastHead } from "../../../components/SEO/StructuredData";
import { buildSiteUrl, localePath, resolveLang, withLocalePrefix } from "../../../lib/api";
import { formatArticleDate } from "../../../lib/dateFormat";
import { fetchPreviewPostById } from "../../../lib/wpPreview";

export async function getServerSideProps({ params, locale, preview, previewData }) {
  const { slug } = params;
  const lang = resolveLang(locale);
  const previewLang = previewData?.lang ? resolveLang(previewData.lang) : null;

  if (preview && previewLang && previewLang !== lang) {
    return {
      redirect: {
        destination: withLocalePrefix(
          localePath("article", previewData.slug || slug, previewLang),
          previewLang
        ),
        permanent: false,
      },
    };
  }

  // /articles/* is English-only — redirect if reached under any other locale
  if (lang !== "en") {
    return { redirect: { destination: `/en/articles/${slug}`, permanent: true } };
  }

  let post = null;

  if (preview && previewData?.type === "post" && previewData?.postId) {
    post = await fetchPreviewPostById(previewData.postId, lang);
  } else {
    const base = `${process.env.NEXT_PUBLIC_WP_URL}/wp-json/wp/v2/posts?slug=${slug}&acf_format=standard&_embed`;

    // Only fetch in the requested language — wrong-locale slugs must 404.
    try {
      const res = await fetch(`${base}&lang=${lang}`);
      if (res.ok) {
        const data = await res.json();
        post = Array.isArray(data) && data.length ? data[0] : null;
      }
    } catch (e) {
      console.error("Failed to fetch post:", e);
    }
  }

  if (!post) {
    return { notFound: true };
  }

  const featuredImage = post._embedded?.["wp:featuredmedia"]?.[0]?.source_url || "";
  const categories = post._embedded?.["wp:term"]?.[0] || [];
  const author = post._embedded?.author?.[0]?.name || "";
  const publishedDate = formatArticleDate(post.date, lang);
  const wordCount = post.content?.rendered?.replace(/<[^>]*>/g, "").split(/\s+/).length || 0;
  const currentSlug = post.slug || slug;

  if (post.acf?.sections && Array.isArray(post.acf.sections)) {
    return { props: { post, sections: post.acf.sections, currentSlug, lang, translations: post.translations || null, yoastHead: post.yoast_head || null, isPreview: Boolean(preview) } };
  }

  return {
    props: {
      post,
      currentSlug,
      lang,
      translations: post.translations || null,
      yoastHead: post.yoast_head || null,
      isPreview: Boolean(preview),
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
          slug: currentSlug,
          display_author_card: post.acf?.display_author_card === true || post.acf?.display_author_card === 1,
          author_card_id: (() => {
            const ac = post.acf?.author_card;
            if (!ac) return null;
            if (typeof ac === "object") return ac.ID || ac.id || null;
            return Number(ac) || null;
          })(),
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
      <SpeakableSchema heading={post?.acf?.heading} summary={post?.acf?.article_summary} />
      {sections && <SectionRenderer sections={sections} currentSlug={currentSlug} />}
    </>
  );
}
