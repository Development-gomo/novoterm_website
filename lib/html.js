// Keep escaped markup and quote delimiters escaped when strings are later used as HTML.
const htmlStructuralCodePoints = new Set([34, 39, 60, 62, 96]);

function decodeHtmlEntitiesOnce(value = "") {
  return String(value)
    .replace(/&amp;/gi, "&")
    .replace(/&#(x[0-9a-f]+|\d+);/gi, (match, entity) => {
      const isHex = entity[0]?.toLowerCase() === "x";
      const codePoint = parseInt(entity.slice(isHex ? 1 : 0), isHex ? 16 : 10);
      if (htmlStructuralCodePoints.has(codePoint)) return match;

      return Number.isFinite(codePoint) && codePoint >= 0 && codePoint <= 0x10ffff
        ? String.fromCodePoint(codePoint)
        : match;
    });
}

export function decodeHtmlEntities(value = "") {
  let decoded = String(value);

  for (let i = 0; i < 5; i += 1) {
    const next = decodeHtmlEntitiesOnce(decoded);
    if (next === decoded) break;
    decoded = next;
  }

  return decoded;
}

export function normalizeWpData(value) {
  if (typeof value === "string") {
    return decodeHtmlEntities(value);
  }

  if (Array.isArray(value)) {
    return value.map(normalizeWpData);
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, normalizeWpData(item)])
    );
  }

  return value;
}

export function stripHtml(value = "") {
  return String(value).replace(/<[^>]*>/g, "");
}

export function plainTextFromHtml(value = "") {
  return decodeHtmlEntities(stripHtml(value)).trim();
}
