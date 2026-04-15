import { DEFAULT_LANG, SUPPORTED_LANGS } from "../../lib/api";

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.novoterm.se").replace(/\/$/, "");
const WP_API = (process.env.NEXT_PUBLIC_WP_URL || "").replace(/\/$/, "");
if (!SITE_URL || !WP_API) {
  console.error("Missing environment variables for sitemap");
}

// CPTs to include: [wp rest endpoint, { sv: prefix, en: prefix }]
const POST_TYPES = [
  ["pages",       { sv: "",           en: "" }],
  ["posts",       { sv: "/artiklar",  en: "/articles" }],
  ["service",     { sv: "/tjanster",  en: "/services" }],
  ["industry",    { sv: "/branscher", en: "/industry" }],
  ["case_study",  { sv: "/kundcase",  en: "/client-case" }],
];

async function fetchAllPosts(endpoint, lang) {
  const url = `${WP_API}/wp-json/wp/v2/${endpoint}?per_page=100&lang=${lang}&_fields=slug,modified,yoast_head_json`;
  try {
    const res = await fetch(url);
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}


function toW3CDate(dateStr) {
  if (!dateStr) return new Date().toISOString();
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
}

function escapeXml(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}

export async function getServerSideProps({ res }) {
  const urls = [];

  for (const lang of SUPPORTED_LANGS) {
    const langPrefix = lang === DEFAULT_LANG ? "" : `/${lang}`;

    for (const [endpoint, prefixes] of POST_TYPES) {
      const pathPrefix = prefixes[lang] ?? prefixes.en;
      const posts = await fetchAllPosts(endpoint, lang);
      if (!Array.isArray(posts)) continue;

      for (const post of posts) {
        const slug = post.slug;
        // Skip pages marked as noindex in Yoast SEO (WP admin → Yoast → Advanced tab)
        if (post.yoast_head_json?.robots?.index === "noindex") continue;
        const lastmod = toW3CDate(post.modified);

        // Pages: "home" slug → root, others → /slug
        let path;
        if (endpoint === "pages") {
          path = slug === "home" ? "" : `/${slug}`;
        } else {
          path = `${pathPrefix}/${slug}`;
        }

        const loc = `${SITE_URL}${langPrefix}${path}`;

        // Determine priority & changefreq
        const isHome = endpoint === "pages" && slug === "home";
        const priority = isHome ? "1" : "0.8";
        const changefreq = isHome ? "weekly" : "monthly";

        urls.push({ loc, lastmod, changefreq, priority });
      }
    }

    // Also add the language root for non-default langs (e.g. /sv, /en)
    if (lang !== DEFAULT_LANG) {
      urls.push({
        loc: `${SITE_URL}/${lang}`,
        lastmod: new Date().toISOString(),
        changefreq: "weekly",
        priority: "1",
      });
    }
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${escapeXml(u.loc)}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate");
  res.write(xml);
  res.end();
  

  return { props: {} };
}

// Component is never rendered — XML is sent directly
export default function Sitemap() {
  return null;
}
