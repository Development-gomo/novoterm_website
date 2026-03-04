import SectionRenderer from "../../../components/SectionRenderer";
import { SpeakableSchema } from "../../../components/SEO/StructuredData";

export async function getServerSideProps({ params }) {
  const { slug } = params;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_WP_URL}/wp-json/wp/v2/posts?slug=${slug}&acf_format=standard&_embed`
  );

  const data = await res.json();

  if (!data.length) {
    return { notFound: true };
  }

  const post = data[0];

  // Extract featured image
  const featuredImage = post._embedded?.['wp:featuredmedia']?.[0]?.source_url || '';

  // Extract category
  const categories = post._embedded?.['wp:term']?.[0] || [];
  const categoryName = categories[0]?.name || '';

  // Extract author
  const author = post._embedded?.author?.[0]?.name || '';

  // Format date
  const publishedDate = new Date(post.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Calculate reading time (approx 200 words per minute)
  const wordCount = post.content?.rendered?.replace(/<[^>]*>/g, '').split(/\s+/).length || 0;
  const readingTime = Math.ceil(wordCount / 200);

  // Build sections array
  const sections = [
    {
      acf_fc_layout: 'blog_hero',
      featured_image: featuredImage,
    },
    {
      acf_fc_layout: 'blog_content',
      heading: post.title?.rendered || '',
      excerpt: post.excerpt?.rendered || '',
      content: post.content?.rendered || '',
      author: author,
      published_date: publishedDate,
      reading_time: readingTime,
      category: categoryName,
    }
  ];

  // If ACF sections exist, use those instead
  if (post.acf?.sections && Array.isArray(post.acf.sections)) {
    return {
      props: {
        post: data[0],
        sections: post.acf.sections,
        currentSlug: slug,
      },
    };
  }

  return {
    props: {
      post: data[0],
      sections: sections,
      currentSlug: slug,
    },
  };
}

export default function BlogPost({ post, sections, currentSlug }) {
  const title = post?.title?.rendered || "";
  const summary = post?.acf?.article_summary || "";

  return (
    <>
      <SpeakableSchema title={title} summary={summary} />
      {sections && (
        <SectionRenderer
          sections={sections}
          currentSlug={currentSlug}
        />
      )}
    </>
  );
}
