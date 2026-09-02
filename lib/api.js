import { normalizeWpData } from "./html";

const WP_API = process.env.NEXT_PUBLIC_WP_URL?.replace(/\/$/, "");
export const SITE_ORIGIN = (process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_BASE_URL || "https://www.novoterm.se").replace(/\/$/, "");

// Use WordPress directly for public REST reads. The live /wp-api rewrite can
// be intercepted by the backend host's bot challenge and return HTML.
export function wpRestUrl(path = "") {
  const normalizedPath = String(path).replace(/^\/+/, "");
  const base = WP_API ? `${WP_API}/wp-json` : "/wp-api";
  const url = normalizedPath ? `${base}/${normalizedPath}` : base;

  // Keep browser-originated responses in a separate backend cache entry.
  // SiteGround otherwise may serve a server-cached response without CORS
  // headers to the browser.
  if (typeof window !== "undefined" && WP_API) {
    return `${url}${url.includes("?") ? "&" : "?"}_frontend=1`;
  }

  return url;
}

export async function wpJson(pathOrUrl = "", init) {
  const url = String(pathOrUrl).startsWith("http")
    ? pathOrUrl
    : wpRestUrl(pathOrUrl);
  const res = await fetch(url, init);
  const contentType = res.headers.get("content-type") || "";
  const text = await res.text();

  if (!res.ok) {
    throw new Error(
      `WordPress request failed: ${res.status} ${res.statusText || ""} ${text.slice(0, 160)}`.trim()
    );
  }

  try {
    return normalizeWpData(JSON.parse(text));
  } catch {
    throw new Error(
      `WordPress request returned non-JSON (${contentType || "unknown content-type"}): ${text.slice(0, 160)}`
    );
  }
}

export async function wpJsonOrNull(pathOrUrl = "", init, { label = "WordPress request", fallback = null } = {}) {
  try {
    return await wpJson(pathOrUrl, init);
  } catch (error) {
    console.error(`${label} failed:`, error);
    return fallback;
  }
}

export const DEFAULT_LANG = "sv";
export const SUPPORTED_LANGS = ["sv", "en"];

// Resolve a Next.js locale string to a supported language code.
// Falls back to DEFAULT_LANG for unknown/undefined locales.
export const resolveLang = (locale) =>
  SUPPORTED_LANGS.includes(locale) ? locale : DEFAULT_LANG;

export async function fetchWpPostBySlug(
  endpoint,
  slug,
  lang = DEFAULT_LANG,
  { acfFormat = "standard", embed = false, fields = "" } = {}
) {
  if (!WP_API || !slug) {
    console.error(`Cannot fetch ${endpoint} by slug: NEXT_PUBLIC_WP_URL or slug is missing.`);
    return null;
  }

  const url = new URL(`${WP_API}/wp-json/wp/v2/${endpoint}`);
  url.searchParams.set("slug", slug);
  url.searchParams.set("lang", resolveLang(lang));
  if (acfFormat) url.searchParams.set("acf_format", acfFormat);
  if (embed) url.searchParams.set("_embed", "1");
  if (fields) url.searchParams.set("_fields", fields);

  const data = await wpJson(url.toString(), { cache: "no-store" });

  return Array.isArray(data) && data.length ? data[0] : null;
}

export async function fetchWpSlugs(endpoint, lang = DEFAULT_LANG, perPage = 100) {
  if (!WP_API) {
    console.error(`Cannot fetch ${endpoint} slugs: NEXT_PUBLIC_WP_URL is missing.`);
    return [];
  }

  const url = new URL(`${WP_API}/wp-json/wp/v2/${endpoint}`);
  url.searchParams.set("per_page", String(perPage));
  url.searchParams.set("lang", resolveLang(lang));
  url.searchParams.set("_fields", "slug");

  const data = await wpJsonOrNull(
    url.toString(),
    { cache: "no-store" },
    { label: `WordPress ${endpoint} slugs (${lang})`, fallback: [] }
  );

  return (Array.isArray(data) ? data : [])
    .map((post) => post?.slug)
    .filter(Boolean);
}

export function withLocalePrefix(path = "/", lang = DEFAULT_LANG) {
  const normalizedPath = !path || path === "/"
    ? "/"
    : path.startsWith("/")
      ? path
      : `/${path}`;

  if (lang !== DEFAULT_LANG) {
    return normalizedPath === "/" ? `/${lang}` : `/${lang}${normalizedPath}`;
  }

  return normalizedPath;
}

export function buildSiteUrl(path = "/") {
  const normalizedPath = !path || path === "/"
    ? "/"
    : path.startsWith("/")
      ? path
      : `/${path}`;

  return normalizedPath === "/" ? `${SITE_ORIGIN}/` : `${SITE_ORIGIN}${normalizedPath}`;
}

// Locale-aware route prefixes for custom post types.
// Swedish (default) uses Swedish slugs; English keeps the English ones.
const ROUTE_PREFIXES = {
  service:    { sv: "/tjanster",   en: "/services" },
  industry:   { sv: "/branscher",  en: "/industry" },
  caseStudy:  { sv: "/kundcase",   en: "/client-case" },
  article:    { sv: "/artiklar",   en: "/articles" },
  video:      { sv: "/videor",     en: "/videos" },
};

// Legacy WordPress slugs that should map to their modern equivalents.
// Values must match ROUTE_PREFIXES entries (without trailing slash).
const LEGACY_SLUGS = {
  "/case-study": "/client-case",
  "/blog": "/articles",
  "/watch": "/videos",
};

// Build route maps from ROUTE_PREFIXES (+ legacy slugs) so they stay in sync.
function buildRouteMaps() {
  const svMap = {};
  const enMap = {};
  for (const { sv, en } of Object.values(ROUTE_PREFIXES)) {
    svMap[en] = sv;
    enMap[sv] = en;
  }
  // Legacy slugs map to whichever locale is requested
  for (const [legacy, modern] of Object.entries(LEGACY_SLUGS)) {
    const entry = Object.values(ROUTE_PREFIXES).find(
      (r) => r.en === modern || r.sv === modern
    );
    if (entry) {
      svMap[legacy] = entry.sv;
      enMap[legacy] = entry.en;
    }
  }
  return { svMap, enMap };
}

const { svMap: SV_ROUTE_MAP, enMap: EN_ROUTE_MAP } = buildRouteMaps();

/**
 * Build a locale-aware path for a custom post type.
 * @param {"service"|"industry"|"caseStudy"|"article"|"video"} type – the CPT key
 * @param {string} slug – the post slug
 * @param {string} lang – resolved language code ("sv" | "en")
 */
export function localePath(type, slug, lang) {
  const prefix = ROUTE_PREFIXES[type]?.[lang] || ROUTE_PREFIXES[type]?.en;
  return `${prefix}/${slug}`;
}

// Convert a full WordPress URL to a Next.js path.
// "/home" is normalized to "/" (WordPress uses "home" as the front-page slug).
// When `lang` is provided, translates known route segments (e.g. /services/ → /tjanster/ for sv).
export function wpToPath(url, lang) {
  if (!url) return "#";
  // ACF link fields return objects like { url, title, target }
  if (typeof url === "object") url = url.url || "";
  if (!url || url === "#") return "#";

  let path;
  if (WP_API && url.startsWith(WP_API)) {
    path = url.slice(WP_API.length) || "/";
  } else if (url.startsWith("/")) {
    // Already a relative path
    path = url;
  } else {
    try { path = new URL(url).pathname || "/"; } catch { return url; }
  }
  if (path === "/home") path = "/";

  // Strip any language prefix so route maps match cleanly
  // (WordPress/WPML may include /en/ or /sv/ in translation URLs)
  for (const loc of SUPPORTED_LANGS) {
    if (path.startsWith(`/${loc}/`)) {
      path = path.slice(loc.length + 1); // keep leading /
      break;
    }
    if (path === `/${loc}`) {
      path = "/";
      break;
    }
  }

  // Translate route segments based on language
  const routeMap = lang === "sv" ? SV_ROUTE_MAP : lang === "en" ? EN_ROUTE_MAP : null;
  if (routeMap) {
    for (const [from, to] of Object.entries(routeMap)) {
      if (path === from) {
        path = to;
        break;
      }

      if (path.startsWith(`${from}/`)) {
        path = `${to}${path.slice(from.length)}`;
        break;
      }
    }
  }

  return path;
}

// Shared base for the theme endpoints.
const themeBase = () =>
  wpRestUrl();

// Fetch Mega Menu data
export async function getMegaMenu(lang = DEFAULT_LANG) {
  return wpJson(`${themeBase()}/theme/v1/mega-menu?lang=${lang}`, { cache: "no-store" });
}

// Fetch all pages
export async function fetchPages(per_page = 100, lang = DEFAULT_LANG) {
  if (!WP_API) throw new Error("NEXT_PUBLIC_WP_URL is missing!");

  return wpJson(`${WP_API}/wp-json/wp/v2/pages?per_page=${per_page}&lang=${lang}`);
}

// Fetch page by slug WITH multilingual support
export async function fetchPageBySlug(slug, lang = DEFAULT_LANG) {
  if (!WP_API) throw new Error("NEXT_PUBLIC_WP_URL is missing!");

  const data = await wpJson(
    `${WP_API}/wp-json/wp/v2/pages?slug=${encodeURIComponent(
      slug
    )}&lang=${lang}&_embed`
  );

  return data[0] || null;
}

export async function getHeaderData(lang = DEFAULT_LANG) {
  return wpJson(`${themeBase()}/theme/v1/header?lang=${lang}`, { cache: "no-store" });
}

export async function getMainMenu(lang = DEFAULT_LANG) {
  return wpJson(`${themeBase()}/theme/v1/menu?lang=${lang}`, { cache: "no-store" });
}

export async function getFooterData(lang = DEFAULT_LANG) {
  return wpJson(`${themeBase()}/theme/v1/footer?lang=${lang}`, { cache: "no-store" });
}

export async function getHamburgerMenu(lang = DEFAULT_LANG) {
  return wpJson(`${themeBase()}/theme/v1/hamburger-menu?lang=${lang}`, { cache: "no-store" });
}

// Fetch logos from the "Client Logos" options page via public REST endpoint.
// Returns: [{ logo: { url, alt, sizes, ... } }, ...]
export async function fetchClientLogos() {
  try {
    return await wpJson(`${themeBase()}/theme/v1/client-logos`);
  } catch {
    return [];
  }
}

// Fetch quote slides from options page.
// source: "customer" | "translator"
export async function fetchQuoteBlock(source, lang = DEFAULT_LANG) {
  const endpoint = source === "customer"
    ? "customer-quote-block"
    : "translator-quote-block";
  try {
    return await wpJson(`${themeBase()}/theme/v1/${endpoint}?lang=${lang}`);
  } catch {
    return [];
  }
}

export async function fetchLanguages(lang = DEFAULT_LANG) {
  try {
    const data = await wpJson(`${themeBase()}/theme/v1/languages?lang=${lang}`, {
      cache: "no-store",
    });

    const list =
      Array.isArray(data)
        ? data
        : Array.isArray(data?.list_of_languages)
          ? data.list_of_languages
          : Array.isArray(data?.list_of_langauages)
            ? data.list_of_langauages
            : Array.isArray(data?.languages)
              ? data.languages
              : [];

    return list
      .map((item) => {
        if (typeof item === "string") return { name: item };
        return { name: item?.name || item?.language || item?.title || "" };
      })
      .filter((item) => item.name);
  } catch {
    return [];
  }
}

export async function fetchCaseStudies(lang = DEFAULT_LANG, perPage = 100) {
  if (!WP_API) return [];

  try {
    const data = await wpJson(
      `${WP_API}/wp-json/wp/v2/case_study?acf_format=standard&lang=${lang}&per_page=${perPage}`,
      { cache: "no-store" }
    );

    return Array.isArray(data)
      ? data.map((post) => ({
          id: post.id,
          slug: post.slug,
          title: post.acf?.review_heading || "",
          review_heading: post.acf?.review_heading || "",
          button_text: post.acf?.button_text || "",
          button_link: post.acf?.button_link || "",
          time_text: post.acf?.time_text || "",
          subtext: post.acf?.subtext || "",
          service_title: post.acf?.service_title || "",
          service_used: post.acf?.service_used || "",
          image: post.acf?.cs_image || "",
          cs_image: post.acf?.cs_image || "",
        }))
      : [];
  } catch (error) {
    console.error(`Case studies fetch failed (${lang}):`, error);
    return [];
  }
}

export async function fetchIndustries(lang = DEFAULT_LANG, perPage = 20) {
  if (!WP_API) return [];

  try {
    const data = await wpJson(
      `${WP_API}/wp-json/wp/v2/industry?_embed&acf_format=standard&lang=${lang}&per_page=${perPage}`,
      { cache: "no-store" }
    );
    const hiddenSlugs = ["vara-huvudomraden", "main-areas"];

    return Array.isArray(data)
      ? data
          .filter((item) => !hiddenSlugs.includes(item.slug))
          .map((item) => ({
            id: item.id,
            title: item.title?.rendered || "",
            slug: item.slug,
            image: item._embedded?.["wp:featuredmedia"]?.[0]?.source_url || "",
          }))
      : [];
  } catch (error) {
    console.error(`Industries fetch failed (${lang}):`, error);
    return [];
  }
}
