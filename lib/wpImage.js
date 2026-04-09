/**
 * Prefer smaller WordPress `sizes` URLs from ACF media objects to cut bytes (LCP, CLS).
 * Raw `url` is often full-resolution; `medium_large` / `large` are usually enough for UI.
 */
const HERO_KEYS = ["medium_large", "large", "1536x1536", "2048x2048"];
/** Smaller WP derivatives first: faster fetch to the image optimizer (better mobile LCP); large screens still get enough pixels via next/image widths. */
const HERO_NEXT_IMAGE_KEYS = ["large", "medium_large", "1536x1536", "2048x2048"];
const CARD_KEYS = ["medium_large", "medium", "large", "1536x1536"];

export function pickWpImageUrl(media, intent = "hero") {
  if (!media) return "";
  if (typeof media === "string") return media;

  const sizes = media.sizes;
  const keys =
    intent === "card"
      ? CARD_KEYS
      : intent === "heroNext"
        ? HERO_NEXT_IMAGE_KEYS
        : HERO_KEYS;

  if (sizes && typeof sizes === "object") {
    for (const key of keys) {
      const val = sizes[key];
      if (typeof val === "string" && val.length) return val;
    }
  }

  return typeof media.url === "string" ? media.url : "";
}
