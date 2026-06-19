export const LIGHT_SECTION_COLOR = "#E3EDFF";
export const DARK_SECTION_COLOR = "#061837";

export function getSectionBackground(value) {
  const color = typeof value === "string" ? value.trim() : "";

  if (!color || color.toLowerCase() === "light") return LIGHT_SECTION_COLOR;
  if (color.toLowerCase() === "dark") return DARK_SECTION_COLOR;

  return color;
}

function hexToRgb(color) {
  const hex = color.replace(/^#/, "");
  if (![3, 4, 6, 8].includes(hex.length) || !/^[\da-f]+$/i.test(hex)) {
    return null;
  }

  const expanded = hex.length <= 4
    ? hex.slice(0, 3).split("").map((character) => character + character).join("")
    : hex.slice(0, 6);

  return {
    r: parseInt(expanded.slice(0, 2), 16),
    g: parseInt(expanded.slice(2, 4), 16),
    b: parseInt(expanded.slice(4, 6), 16),
  };
}

export function isDarkSectionColor(value) {
  const color = getSectionBackground(value);
  const rgb = hexToRgb(color);

  if (!rgb) return false;

  const perceivedBrightness =
    (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;

  return perceivedBrightness < 128;
}
