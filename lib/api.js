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

// Legacy WordPress slugs that should map to their modern equivalents.
// Values must match ROUTE_PREFIXES entries (without trailing slash).
const LEGACY_SLUGS = {
  "/case-study": "/client-case",
};

// Build route maps from ROUTE_PREFIXES (+ legacy slugs) so they stay in sync.
function buildRouteMaps() {
  const svMap = {};
  const enMap = {};
  for (const { sv, en } of Object.values(ROUTE_PREFIXES)) {
    svMap[`${en}/`] = `${sv}/`;
    enMap[`${sv}/`] = `${en}/`;
  }
  // Legacy slugs map to whichever locale is requested
  for (const [legacy, modern] of Object.entries(LEGACY_SLUGS)) {
    const entry = Object.values(ROUTE_PREFIXES).find(
      (r) => r.en === modern || r.sv === modern
    );
    if (entry) {
      svMap[`${legacy}/`] = `${entry.sv}/`;
      enMap[`${legacy}/`] = `${entry.en}/`;
    }
  }
  return { svMap, enMap };
}

const { svMap: SV_ROUTE_MAP, enMap: EN_ROUTE_MAP } = buildRouteMaps();

/**
 * Build a locale-aware path for a custom post type.
 * @param {"service"|"industry"|"caseStudy"} type – the CPT key
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
      if (path.startsWith(from)) {
        path = to + path.slice(from.length);
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

// Fetch Mega Menu data
export async function getMegaMenu(lang = DEFAULT_LANG) {
  const res = await fetch(`${themeBase()}/theme/v1/mega-menu?lang=${lang}`, { cache: "no-store" });
  if (!res.ok) throw new Error('Failed to fetch mega menu: ' + res.status);
  return res.json();
}

// Fetch all pages
export async function fetchPages(per_page = 100, lang = DEFAULT_LANG) {
  if (!WP_API) throw new Error("NEXT_PUBLIC_WP_URL is missing!");

  const res = await fetch(
    `${WP_API}/wp-json/wp/v2/pages?per_page=${per_page}&lang=${lang}`
  );

  if (!res.ok) throw new Error("Failed to fetch pages: " + res.status);
  return res.json();
}

// Fetch page by slug WITH multilingual support
export async function fetchPageBySlug(slug, lang = DEFAULT_LANG) {
  if (!WP_API) throw new Error("NEXT_PUBLIC_WP_URL is missing!");

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
