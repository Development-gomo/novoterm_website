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

// Convert a full WordPress URL to a Next.js path.
// "/home" is normalized to "/" (WordPress uses "home" as the front-page slug).
export function wpToPath(url) {
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
  return path === "/home" ? "/" : path;
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

