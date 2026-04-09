import { pickWpImageUrl } from "./wpImage";

function mediaOrNull(img) {
  if (!img) return null;
  if (typeof img === "string") return { url: img, alt: "" };
  if (img.url) return img;
  if (img.sizes?.medium) return { url: img.sizes.medium, alt: img.alt || "" };
  return null;
}

/**
 * First above-the-fold hero image URL (matches SectionRenderer hero blocks).
 * Used for LCP preload; must use the same pickWpImageUrl intent as components.
 */
export function getLcpHeroImageUrl(sections) {
  if (!Array.isArray(sections)) return "";
  for (const block of sections) {
    const layout = block?.acf_fc_layout;
    if (layout === "hero_section") {
      const url = pickWpImageUrl(mediaOrNull(block.background_image), "heroNext");
      if (url) return url;
    }
    if (layout === "hero_section_final") {
      const acf = block?.acf || block;
      const url = pickWpImageUrl(mediaOrNull(acf.background_image), "heroNext");
      if (url) return url;
    }
    if (layout === "new_home_banner") {
      const sw = mediaOrNull(block.swedish_image);
      const en = mediaOrNull(block.english_image);
      const isEn =
        block?.lang === "en" ||
        (typeof block?.locale === "string" && block.locale.startsWith("en")) ||
        block?.language === "en";
      const primary = isEn ? en : sw;
      const url = pickWpImageUrl(primary, "heroNext");
      if (url) return url;
    }
  }
  return "";
}
