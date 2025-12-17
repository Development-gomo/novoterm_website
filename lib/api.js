const WP_API = process.env.NEXT_PUBLIC_WP_URL?.replace(/\/$/, "");

// Fetch all pages
export async function fetchPages(per_page = 100, lang = "sv") {
  if (!WP_API) throw new Error("NEXT_PUBLIC_WP_API_URL is missing!");

  const res = await fetch(
    `${WP_API}/wp-json/wp/v2/pages?per_page=${per_page}&lang=${lang}`
  );

  if (!res.ok) throw new Error("Failed to fetch pages: " + res.status);
  return res.json();
}

// Fetch page by slug WITH multilingual support
export async function fetchPageBySlug(slug, lang = "sv") {
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

// menu

const WP = process.env.NEXT_PUBLIC_WP_URL;

export async function getHeaderData() {
  const res = await fetch(`${WP}/wp-json/theme/v1/header`);
  return res.json();
}

export async function getMainMenu() {
  const res = await fetch(`${WP}/wp-json/menus/v1/menus/main-menu`);
  return res.json();
}

// Footer

export async function getFooterData() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_WP_URL}/wp-json/theme/v1/footer`, {
    cache: "no-store",
  });

  return res.json();
}
