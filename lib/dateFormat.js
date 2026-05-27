import { DEFAULT_LANG } from "./api";

const ARTICLE_DATE_LOCALES = {
  sv: "sv-SE",
  en: "en-GB",
};

function sentenceCaseMonth(dateString, locale) {
  return dateString.replace(/\p{L}[\p{L}\p{M}]*/u, (month) => {
    const firstLetter = month.slice(0, 1).toLocaleUpperCase(locale);
    const rest = month.slice(1).toLocaleLowerCase(locale);
    return `${firstLetter}${rest}`;
  });
}

export function formatArticleDate(dateInput, lang = DEFAULT_LANG) {
  if (!dateInput) return "";

  const date = dateInput instanceof Date ? dateInput : new Date(dateInput);

  if (Number.isNaN(date.getTime())) {
    return typeof dateInput === "string" ? dateInput : "";
  }

  const locale = ARTICLE_DATE_LOCALES[lang] || ARTICLE_DATE_LOCALES.sv;
  const formattedDate = date.toLocaleDateString(locale, {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  return sentenceCaseMonth(formattedDate, locale);
}
