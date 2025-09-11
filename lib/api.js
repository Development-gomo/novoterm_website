const WP_API = process.env.NEXT_PUBLIC_WP_API_URL;

export async function fetchPages(per_page = 100) {
  const res = await fetch(`${WP_API}/wp-json/wp/v2/pages?per_page=${per_page}`);
  if (!res.ok) throw new Error("Failed to fetch pages: " + res.status);
  return res.json();
}

export async function fetchPageBySlug(slug) {
  const res = await fetch(
    `${WP_API}/wp-json/wp/v2/pages?slug=${encodeURIComponent(slug)}&_embed`
  );
  if (!res.ok) throw new Error("Failed to fetch page: " + res.status);
  const data = await res.json();
  return data[0] || null;
}
