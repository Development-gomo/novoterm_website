import Head from "next/head";

/**
 * SpeakableSchema
 *
 * Injects a Speakable JSON-LD block into <head> when an article_summary
 * ACF field is present on the page.
 *
 * Props:
 *   title   – plain-text page title  (page.title.rendered, stripped)
 *   summary – value of the article_summary ACF field
 *   url     – canonical URL for the page (optional but recommended)
 */

const stripHtml = (html) =>
  html ? html.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim() : "";

export function SpeakableSchema({ title, summary, url }) {
  // Only emit schema when a non-empty summary exists
  if (!summary || !summary.trim()) return null;

  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    ...(url && { url }),
    name: stripHtml(title),
    description: stripHtml(summary),
    speakable: {
      "@type": "SpeakableSpecification",
      // Points to the heading and the rendered summary element on the page
      cssSelector: ["h1", "[data-speakable]"],
    },
  };

  return (
    <Head>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema, null, 2) }}
      />
    </Head>
  );
}
