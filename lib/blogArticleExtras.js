import { localePath, wpJsonOrNull } from "./api";
import { formatArticleDate } from "./dateFormat";
import { plainTextFromHtml } from "./html";

function readTimeLabel(lang) {
  return lang === "en" ? "min read" : "min läsning";
}

function getFeaturedImage(post) {
  const media = post?._embedded?.["wp:featuredmedia"]?.[0];
  return (
    media?.source_url ||
    media?.media_details?.sizes?.["2048x2048"]?.source_url ||
    media?.media_details?.sizes?.["1536x1536"]?.source_url ||
    media?.media_details?.sizes?.large?.source_url ||
    media?.media_details?.sizes?.medium_large?.source_url ||
    "/default-blog.jpg"
  );
}

export async function fetchArticleCategoryPromo(categoryId, lang) {
  if (!categoryId) return null;

  const data = await wpJsonOrNull(
    `wp/v2/categories/${categoryId}?acf_format=standard&lang=${lang}`,
    { cache: "no-store" },
    { label: `Article category promo (${categoryId}, ${lang})`, fallback: null }
  );

  if (!data?.acf) return null;

  return {
    title: data.acf.title || "",
    description: data.acf.description || "",
    buttonText: data.acf.button_text || "",
    buttonUrl: data.acf.button_url || "",
  };
}

export async function fetchRelatedArticlePosts({
  categoryId,
  currentSlug,
  lang,
  limit = 3,
}) {
  if (!categoryId) return [];

  const data = await wpJsonOrNull(
    `wp/v2/posts?_embed&per_page=6&categories=${categoryId}&lang=${lang}`,
    { cache: "no-store" },
    { label: `Related article posts (${categoryId}, ${lang})`, fallback: [] }
  );

  if (!Array.isArray(data)) return [];

  return data
    .filter((post) => post.slug !== currentSlug)
    .map((post) => {
      const cleanContent = plainTextFromHtml(post.content?.rendered || "");
      const wordCount = cleanContent ? cleanContent.split(/\s+/).length : 0;

      return {
        title: plainTextFromHtml(post.title?.rendered || ""),
        excerpt: `${plainTextFromHtml(post.excerpt?.rendered || "").slice(0, 100)}...`,
        url: localePath("article", post.slug, lang),
        image: getFeaturedImage(post),
        category: plainTextFromHtml(
          post._embedded?.["wp:term"]?.[0]?.[0]?.name || "General"
        ),
        date: formatArticleDate(post.date, lang),
        readTime: `${Math.max(1, Math.ceil(wordCount / 200))} ${readTimeLabel(lang)}`,
      };
    })
    .slice(0, limit);
}
