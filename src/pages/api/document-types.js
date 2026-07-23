import { DEFAULT_LANG, resolveLang, wpJson } from "../../../lib/api";

function formatDocumentTypes(data = []) {
  const formatted = (Array.isArray(data) ? data : []).map((post) => ({
    slug: post.slug,
    heading: post.acf?.heading || post.title?.rendered || "",
    subtext: post.acf?.subtext || "",
    cs_image: post.acf?.cs_image || "",
    button_url: post.acf?.button_url || "",
    slider_sequence: parseInt(post.acf?.slider_sequence, 10) || 0,
  }));

  formatted.sort((a, b) => a.slider_sequence - b.slider_sequence);

  if (formatted.length > 0) {
    formatted[formatted.length - 1].last_block = true;
  }

  return formatted;
}

export default async function handler(req, res) {
  const lang = resolveLang(req.query.lang || DEFAULT_LANG);

  try {
    const data = await wpJson(
      `wp/v2/document_type?acf_format=standard&lang=${lang}&per_page=100`
    );
    const documentTypes = formatDocumentTypes(data);

    res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=3600");
    return res.status(200).json(documentTypes);
  } catch (error) {
    console.error("Document types API failed:", error);
    return res.status(502).json({ message: "Failed to fetch document types." });
  }
}
