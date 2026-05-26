import { DEFAULT_LANG } from "./api";

const ARTICLE_DATE_LOCALES = {
  sv: "sv-SE",
  en: "en-GB",
};

export function formatArticleDate(dateInput, lang = DEFAULT_LANG) {
  if (!dateInput) return "";

  const date = dateInput instanceof Date ? dateInput : new Date(dateInput);

  if (Number.isNaN(date.getTime())) {
    return typeof dateInput === "string" ? dateInput : "";
  }

  return date
    .toLocaleDateString(ARTICLE_DATE_LOCALES[lang] || ARTICLE_DATE_LOCALES.sv, {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
    .toLowerCase();
}
