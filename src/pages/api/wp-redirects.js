// Pages Router API route — called by middleware to fetch WP redirects
// Endpoint: /api/wp-redirects

const WP_BASE =
  process.env.NEXT_PUBLIC_WP_URL?.replace(/\/$/, "") + "/wp-json";

const PER_PAGE = 200;

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const allItems = [];
  let page = 0;

  const credentials = Buffer.from(
    `${process.env.WP_API_USER}:${process.env.WP_API_PASS}`
  ).toString("base64");

  try {
    while (true) {
      const response = await fetch(
        `${WP_BASE}/redirection/v1/redirect?per_page=${PER_PAGE}&page=${page}`,
        {
          cache: "no-store",
          headers: { Authorization: `Basic ${credentials}` },
        }
      );

      if (!response.ok) break;

      const data = await response.json();
      const items = Array.isArray(data?.items) ? data.items : [];
      allItems.push(...items);

      if (items.length < PER_PAGE) break;
      page++;
    }
  } catch (err) {
    console.error("Failed to fetch WP redirects:", err.message);
  }

  // Cache the response for 5 minutes on CDN
  res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=60");
  return res.status(200).json(allItems);
}
