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

const escapeRegExp = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

function mapToPublicOrigin(value) {
  if (!value || !BACKEND_ORIGIN || BACKEND_ORIGIN === PUBLIC_ORIGIN) return value;
  // Media under /wp-content/ is only served by the backend host (the public
  // origin returns 500 for it), so those URLs keep the backend origin.
  // Replace unescaped URLs (in HTML attributes, URLs, etc.)
  let result = value.replace(
    new RegExp(`${escapeRegExp(BACKEND_ORIGIN)}(?!/wp-content/)`, "g"),
    PUBLIC_ORIGIN
  );
  // Also replace JSON-escaped URLs (forward slashes are escaped as \/ in JSON-LD)
  const escapedBackend = BACKEND_ORIGIN.replace(/\//g, "\\/");
  const escapedPublic = PUBLIC_ORIGIN.replace(/\//g, "\\/");
  result = result.replace(
    new RegExp(`${escapeRegExp(escapedBackend)}(?!\\\\/wp-content\\\\/)`, "g"),
    escapedPublic
  );
  return result;
}

// Serialise JSON-LD for a <script> tag without letting "</script>" in a value
// close the tag early.
const toJsonLd = (data) => JSON.stringify(data).replace(/</g, "\\u003c");

// ─── YoastHead ────────────────────────────────────────────────────────────────
// Parses the yoast_head HTML string WordPress/Yoast adds to REST responses and
// renders each tag individually inside next/head.

function isSwedishVideosCanonical(canonicalUrl = "") {
  return String(canonicalUrl).replace(/\/$/, "").endsWith("/videor");
}

function normalizeSwedishVideosValue(value, canonicalUrl) {
  const mapped = mapToPublicOrigin(value);
  if (!isSwedishVideosCanonical(canonicalUrl) || typeof mapped !== "string") return mapped;

  const publicOrigin = PUBLIC_ORIGIN.replace(/\/$/, "");
  const fromUrl = `${publicOrigin}/videos`;
  const toUrl = `${publicOrigin}/videor`;

  if (mapped === "Videos") return "Videor";
  if (mapped === "/videos") return "/videor";
  if (mapped === "/videos/") return "/videor/";
  if (!mapped.includes(fromUrl)) return mapped;

  return mapped
    .split(`${fromUrl}/`).join(`${toUrl}/`)
    .split(fromUrl).join(toUrl);
}

function normalizeStructuredDataValue(value, canonicalUrl) {
  if (Array.isArray(value)) {
    return value.map((item) => normalizeStructuredDataValue(item, canonicalUrl));
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [
        key,
        normalizeStructuredDataValue(item, canonicalUrl),
      ])
    );
  }

  if (typeof value === "string") {
    return normalizeSwedishVideosValue(value, canonicalUrl);
  }

  return value;
}

// Yoast builds its graph from the WordPress permalink (e.g. /novoterm-30-ar/),
// which differs from the frontend route (e.g. /artiklar/novoterm-30-ar). The
// WebPage node's url is that permalink, so use it to find what to rewrite.
function findWebPageUrl(data) {
  const nodes = Array.isArray(data?.["@graph"]) ? data["@graph"] : [data];
  const page = nodes.find((node) => [].concat(node?.["@type"]).includes("WebPage"));
  return typeof page?.url === "string" ? page.url : "";
}

function rewritePermalink(value, permalink, canonicalUrl) {
  if (Array.isArray(value)) {
    return value.map((item) => rewritePermalink(item, permalink, canonicalUrl));
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [
        key,
        rewritePermalink(item, permalink, canonicalUrl),
      ])
    );
  }

  if (typeof value === "string") {
    // Match only the exact permalink or permalink#fragment, never a prefix of
    // a longer path.
    for (const base of [permalink, permalink.replace(/\/$/, "")]) {
      if (value === base) return canonicalUrl;
      if (value.startsWith(`${base}#`)) return `${canonicalUrl}${value.slice(base.length)}`;
    }
  }

  return value;
}

function normalizeYoastJsonLd(jsonText, canonicalUrl) {
  const mapped = mapToPublicOrigin(jsonText);

  let data;
  try {
    data = JSON.parse(mapped);
  } catch {
    if (!isSwedishVideosCanonical(canonicalUrl)) return mapped;
    return normalizeSwedishVideosValue(mapped, canonicalUrl)
      .replace(/"name":"Videos"/g, '"name":"Videor"')
      .replace(/"name": "Videos"/g, '"name": "Videor"');
  }

  const permalink = findWebPageUrl(data);
  if (canonicalUrl && permalink) {
    data = rewritePermalink(data, permalink, canonicalUrl);
  }

  if (isSwedishVideosCanonical(canonicalUrl)) {
    data = normalizeStructuredDataValue(data, canonicalUrl);
  }

  return toJsonLd(data);
}

function parseAttrs(tagStr, canonicalUrl) {
  const attrs = {};
  const re = /([\w-]+)=["']([^"']*)["']/g;
  let m;
  while ((m = re.exec(tagStr)) !== null) {
    // Map HTML attr names → React prop names where needed
    const key = m[1] === "class" ? "className" : m[1] === "http-equiv" ? "httpEquiv" : m[1];
    attrs[key] = normalizeSwedishVideosValue(m[2], canonicalUrl);
  }
  return attrs;
}

// skipSchema – omit Yoast's JSON-LD graph when the page renders its own
// (e.g. ArticleSchema).
export function YoastHead({ yoastHead, canonicalUrl, skipSchema = false }) {
  if (!yoastHead) return null;

  const els = [];

  // <title>
  const titleM = yoastHead.match(/<title>([\s\S]*?)<\/title>/);
  if (titleM) {
    els.push(<title key="yt">{normalizeSwedishVideosValue(titleM[1], canonicalUrl)}</title>);
  }

  // <meta ...>
  [...yoastHead.matchAll(/<meta\s([\s\S]*?)\/?>/g)].forEach((m, i) => {
    const attrs = parseAttrs(m[0], canonicalUrl);
    const metaName = attrs.name?.toLowerCase();
    const metaProperty = attrs.property?.toLowerCase();

    if (canonicalUrl && (metaProperty === "og:url" || metaName === "twitter:url")) {
      return;
    }

    els.push(<meta key={`ym${i}`} {...attrs} />);
  });

  // <link ...>
  [...yoastHead.matchAll(/<link\s([\s\S]*?)\/?>/g)].forEach((m, i) => {
    const attrs = parseAttrs(m[0], canonicalUrl);

    if (canonicalUrl && attrs.rel?.toLowerCase() === "canonical") {
      return;
    }

    if (attrs.href) {
      attrs.href = normalizeSwedishVideosValue(attrs.href, canonicalUrl);
    }

    els.push(<link key={`yl${i}`} {...attrs} />);
  });

  // <script type="application/ld+json">
  [...yoastHead.matchAll(/<script\s([^>]*)>([\s\S]*?)<\/script>/g)].forEach((m, i) => {
    if (skipSchema && m[1].includes("yoast-schema-graph")) return;

    els.push(
      <script key={`ys${i}`} {...parseAttrs(m[1], canonicalUrl)}
        dangerouslySetInnerHTML={{ __html: normalizeYoastJsonLd(m[2], canonicalUrl) }} />
    );
  });

  if (canonicalUrl) {
    els.push(<link key="canonical" rel="canonical" href={canonicalUrl} />);
    els.push(<meta key="og-url" property="og:url" content={canonicalUrl} />);
  }

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

export function SpeakableSchema({ title, heading, summary, url }) {
  // Prefer heading if provided, else fallback to title
  const pageTitle = heading || title;
  // Only emit schema when a non-empty summary exists
  if (!summary || !summary.trim()) return null;

  // Ensure the schema uses the public (live) URL, not the backend URL
  const mappedUrl = url ? mapToPublicOrigin(url) : undefined;

  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    ...(mappedUrl && { url: mappedUrl }),
    name: stripHtml(pageTitle),
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

// ─── ArticleSchema ────────────────────────────────────────────────────────────
// Article JSON-LD for /artiklar and /articles, replacing Yoast's graph so the
// author is the Novoterm organisation and every URL uses the frontend route.
//
// Props:
//   post         – WP post object fetched with _embed
//   canonicalUrl – public URL of the article

const ORGANIZATION_ID = `${PUBLIC_ORIGIN}/#organization`;
const WEBSITE_ID = `${PUBLIC_ORIGIN}/#website`;

const ORGANIZATION = {
  "@type": "Organization",
  "@id": ORGANIZATION_ID,
  name: "Novoterm Translation AB",
  alternateName: "Novoterm",
  url: `${PUBLIC_ORIGIN}/`,
  logo: "https://backend.novoterm.se/wp-content/uploads/2025/11/Novoterm_Logo.png",
  foundingDate: "1996",
  email: "info@novoterm.se",
  telephone: "+46 8 21 17 19",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Kungsholms Strand 133",
    postalCode: "112 33",
    addressLocality: "Stockholm",
    addressCountry: "SE",
  },
  sameAs: [
    "https://www.facebook.com/Novoterm-Translation-AB-181508771904518/",
    "https://www.linkedin.com/company/novotermtranslation/",
  ],
};

const toIsoUtc = (gmt) => (gmt ? `${gmt.replace(/Z$/, "")}+00:00` : undefined);

export function ArticleSchema({ post, canonicalUrl }) {
  if (!post || !canonicalUrl) return null;

  const yoast = post.yoast_head_json || {};
  const inLanguage = (yoast.og_locale || "sv_SE").replace("_", "-");
  const headline = stripHtml(post.title?.rendered || yoast.og_title || "");
  const description = yoast.description || yoast.og_description || stripHtml(post.excerpt?.rendered);

  const media = post._embedded?.["wp:featuredmedia"]?.[0];
  const ogImage = yoast.og_image?.[0];
  const imageUrl = media?.source_url || ogImage?.url;
  const imageWidth = media?.media_details?.width || ogImage?.width;
  const imageHeight = media?.media_details?.height || ogImage?.height;

  const category = post._embedded?.["wp:term"]?.[0]?.[0]?.name;

  // Prefer Yoast's word count; fall back to counting the rendered content.
  const yoastArticle = (yoast.schema?.["@graph"] || []).find((node) =>
    [].concat(node?.["@type"]).includes("Article")
  );
  const contentText = stripHtml(post.content?.rendered);
  const wordCount = yoastArticle?.wordCount || (contentText ? contentText.split(" ").length : undefined);

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${canonicalUrl}#article`,
        headline,
        ...(description && { description }),
        ...(imageUrl && {
          image: {
            "@type": "ImageObject",
            url: mapToPublicOrigin(imageUrl),
            ...(imageWidth && { width: imageWidth }),
            ...(imageHeight && { height: imageHeight }),
          },
        }),
        datePublished: toIsoUtc(post.date_gmt),
        dateModified: toIsoUtc(post.modified_gmt),
        author: { "@type": "Organization", "@id": ORGANIZATION_ID, name: "Novoterm" },
        publisher: { "@id": ORGANIZATION_ID },
        mainEntityOfPage: { "@id": canonicalUrl },
        ...(category && { articleSection: category }),
        ...(wordCount && { wordCount }),
        inLanguage,
      },
      {
        "@type": "WebPage",
        "@id": canonicalUrl,
        url: canonicalUrl,
        name: headline,
        isPartOf: { "@id": WEBSITE_ID },
        inLanguage,
      },
      ORGANIZATION,
      {
        "@type": "WebSite",
        "@id": WEBSITE_ID,
        url: `${PUBLIC_ORIGIN}/`,
        name: "Novoterm",
        publisher: { "@id": ORGANIZATION_ID },
        inLanguage: "sv-SE",
      },
    ],
  };

  return (
    <Head>
      <script
        key="article-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: toJsonLd(schema) }}
      />
    </Head>
  );
}
