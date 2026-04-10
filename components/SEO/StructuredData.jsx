import Head from "next/head";

const DEFAULT_SITE_URL = "https://www.novoterm.se";

function safeOrigin(url, fallback = "") {
  if (!url) return fallback;
  try {
    return new URL(url).origin;
  } catch {
    return fallback;
  }
}

const BACKEND_ORIGIN = safeOrigin(process.env.NEXT_PUBLIC_WP_URL);
const PUBLIC_ORIGIN = safeOrigin(
  process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_BASE_URL,
  DEFAULT_SITE_URL
);

function mapToPublicOrigin(value) {
  if (!value || !BACKEND_ORIGIN || BACKEND_ORIGIN === PUBLIC_ORIGIN) return value;
  return value.split(BACKEND_ORIGIN).join(PUBLIC_ORIGIN);
}

// ─── YoastHead ────────────────────────────────────────────────────────────────
// Parses the yoast_head HTML string WordPress/Yoast adds to REST responses and
// renders each tag individually inside next/head.

function parseAttrs(tagStr) {
  const attrs = {};
  const re = /([\w-]+)=["']([^"']*)["']/g;
  let m;
  while ((m = re.exec(tagStr)) !== null) {
    // Map HTML attr names → React prop names where needed
    const key = m[1] === "class" ? "className" : m[1] === "http-equiv" ? "httpEquiv" : m[1];
    attrs[key] = mapToPublicOrigin(m[2]);
  }
  return attrs;
}

export function YoastHead({ yoastHead }) {
  if (!yoastHead) return null;

  const els = [];

  // <title>
  const titleM = yoastHead.match(/<title>([\s\S]*?)<\/title>/);
  if (titleM) els.push(<title key="yt">{titleM[1]}</title>);

  // <meta ...>
  [...yoastHead.matchAll(/<meta\s([\s\S]*?)\/?>/g)].forEach((m, i) => {
    els.push(<meta key={`ym${i}`} {...parseAttrs(m[0])} />);
  });

  // <link ...>
  [...yoastHead.matchAll(/<link\s([\s\S]*?)\/?>/g)].forEach((m, i) => {
    els.push(<link key={`yl${i}`} {...parseAttrs(m[0])} />);
  });

  // <script type="application/ld+json">
  [...yoastHead.matchAll(/<script\s([^>]*)>([\s\S]*?)<\/script>/g)].forEach((m, i) => {
    els.push(
      <script key={`ys${i}`} {...parseAttrs(m[1])}
        dangerouslySetInnerHTML={{ __html: mapToPublicOrigin(m[2]) }} />
    );
  });

  return <Head>{els}</Head>;
}

// ─── SpeakableSchema ──────────────────────────────────────────────────────────
// Injects a Speakable JSON-LD block into <head> when an article_summary
// ACF field is present on the page.
//
// Props:
//   title   – plain-text page title  (page.title.rendered, stripped)
//   summary – value of the article_summary ACF field
//   url     – canonical URL for the page (optional but recommended)

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
      cssSelector: ["h1"],
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
