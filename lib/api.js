// Fetch Mega Menu data
export async function getMegaMenu(lang = DEFAULT_LANG) {
  const res = await fetch(`${themeBase()}/theme/v1/mega-menu?lang=${lang}`, { cache: "no-store" });
  if (!res.ok) throw new Error('Failed to fetch mega menu: ' + res.status);
  return res.json();
}
const WP_API = process.env.NEXT_PUBLIC_WP_URL?.replace(/\/$/, "");

export const DEFAULT_LANG = "sv";
export const SUPPORTED_LANGS = ["sv", "en"];

// Resolve a Next.js locale string to a supported language code.
// Falls back to DEFAULT_LANG for unknown/undefined locales.
export const resolveLang = (locale) =>
  SUPPORTED_LANGS.includes(locale) ? locale : DEFAULT_LANG;

// Locale-aware route prefixes for custom post types.
// Swedish (default) uses Swedish slugs; English keeps the English ones.
const ROUTE_PREFIXES = {
  service:    { sv: "/tjanster",   en: "/services" },
  industry:   { sv: "/branscher",  en: "/industry" },
  caseStudy:  { sv: "/kundcase",   en: "/client-case" },
};

/**
 * Build a locale-aware path for a custom post type.
 * @param {"service"|"industry"} type – the CPT key
 * @param {string} slug – the post slug
 * @param {string} lang – resolved language code ("sv" | "en")
 */
export function localePath(type, slug, lang) {
  const prefix = ROUTE_PREFIXES[type]?.[lang] || ROUTE_PREFIXES[type]?.en;
  return `${prefix}/${slug}`;
}

// Map of English route segments to their Swedish equivalents.
const SV_ROUTE_MAP = {
  "/services/":    "/tjanster/",
  "/industry/":    "/branscher/",
  "/client-case/": "/kundcase/",
  "/case-study/":  "/kundcase/",   // legacy WP slug
};

// Map of Swedish (and legacy) route segments to their English equivalents.
const EN_ROUTE_MAP = {
  "/tjanster/":    "/services/",
  "/branscher/":   "/industry/",
  "/kundcase/":    "/client-case/",
  "/case-study/":  "/client-case/", // legacy WP slug
};

// Convert a full WordPress URL to a Next.js path.
// "/home" is normalized to "/" (WordPress uses "home" as the front-page slug).
// When `lang` is provided, translates known route segments (e.g. /services/ → /tjanster/ for sv).
export function wpToPath(url, lang) {
  if (!url) return "#";
  // ACF link fields return objects like { url, title, target }
  if (typeof url === "object") url = url.url || "";
  if (!url || url === "#") return "#";
  const base = process.env.NEXT_PUBLIC_WP_URL?.replace(/\/$/, "") || "";
  let path;
  if (base && url.startsWith(base)) {
    path = url.slice(base.length) || "/";
  } else {
    try { path = new URL(url).pathname || "/"; } catch { return url; }
  }
  if (path === "/home") path = "/";

  // Strip any language prefix so route maps match cleanly
  // (WordPress/WPML may include /en/ or /sv/ in translation URLs)
  for (const loc of SUPPORTED_LANGS) {
    const prefix = `/${loc}/`;
    if (path.startsWith(prefix)) {
      path = path.slice(prefix.length - 1); // keep leading /
      break;
    }
    if (path === `/${loc}`) {
      path = "/";
      break;
    }
  }

  // Translate route segments based on language
  if (lang === "sv") {
    for (const [en, sv] of Object.entries(SV_ROUTE_MAP)) {
      if (path.startsWith(en)) {
        path = sv + path.slice(en.length);
        break;
      }
    }
  } else if (lang === "en") {
    for (const [sv, en] of Object.entries(EN_ROUTE_MAP)) {
      if (path.startsWith(sv)) {
        path = en + path.slice(sv.length);
        break;
      }
    }
  }

  return path;
}

// On the server (getInitialProps / getServerSideProps) the /wp-api rewrite
// doesn't exist — use the direct WordPress URL instead.
const themeBase = () =>
  typeof window === "undefined"
    ? `${WP_API}/wp-json`
    : "/wp-api";

// Fetch all pages
export async function fetchPages(per_page = 100, lang = DEFAULT_LANG) {
  if (!WP_API) throw new Error("NEXT_PUBLIC_WP_API_URL is missing!");

  const res = await fetch(
    `${WP_API}/wp-json/wp/v2/pages?per_page=${per_page}&lang=${lang}`
  );

  if (!res.ok) throw new Error("Failed to fetch pages: " + res.status);
  return res.json();
}

// Fetch page by slug WITH multilingual support
export async function fetchPageBySlug(slug, lang = DEFAULT_LANG) {
  if (!WP_API) throw new Error("NEXT_PUBLIC_WP_API_URL is missing!");

  const res = await fetch(
    `${WP_API}/wp-json/wp/v2/pages?slug=${encodeURIComponent(
      slug
    )}&lang=${lang}&_embed`
  );

  if (!res.ok) throw new Error("Failed to fetch page: " + res.status);

  const data = await res.json();
  return data[0] || null;
}

export async function getHeaderData(lang = DEFAULT_LANG) {
  const res = await fetch(`${themeBase()}/theme/v1/header?lang=${lang}`, { cache: "no-store" });
  if (!res.ok) throw new Error('Failed to fetch header: ' + res.status);
  return res.json();
}

export async function getMainMenu(lang = DEFAULT_LANG) {
  const res = await fetch(`${themeBase()}/theme/v1/menu?lang=${lang}`, { cache: "no-store" });
  if (!res.ok) throw new Error('Failed to fetch menu: ' + res.status);
  return res.json();
}

export async function getFooterData(lang = DEFAULT_LANG) {
  const res = await fetch(`${themeBase()}/theme/v1/footer?lang=${lang}`, { cache: "no-store" });
  if (!res.ok) throw new Error('Failed to fetch footer: ' + res.status);
  return res.json();
}

export async function getHamburgerMenu(lang = DEFAULT_LANG) {
  const res = await fetch(`${themeBase()}/theme/v1/hamburger-menu?lang=${lang}`, { cache: "no-store" });
  if (!res.ok) throw new Error('Failed to fetch hamburger menu: ' + res.status);
  return res.json();
}

