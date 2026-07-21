const namedEntities = {
  amp: "&",
  apos: "'",
  hellip: "...",
  lt: "<",
  gt: ">",
  nbsp: " ",
  quot: '"',
};

export function decodeHtmlEntities(value = "") {
  return String(value).replace(/&(#(?:x[0-9a-f]+|\d+)|[a-z][\w]+);/gi, (match, entity) => {
    if (entity[0] === "#") {
      const isHex = entity[1]?.toLowerCase() === "x";
      const codePoint = parseInt(entity.slice(isHex ? 2 : 1), isHex ? 16 : 10);
      return Number.isFinite(codePoint) && codePoint >= 0 && codePoint <= 0x10ffff
        ? String.fromCodePoint(codePoint)
        : match;
    }

    return namedEntities[entity.toLowerCase()] ?? match;
  });
}

export function stripHtml(value = "") {
  return String(value).replace(/<[^>]*>/g, "");
}

export function plainTextFromHtml(value = "") {
  return decodeHtmlEntities(stripHtml(value)).trim();
}
