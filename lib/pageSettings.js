function isAcfTrue(value) {
  return value === true || value === 1 || value === "1" || value === "true";
}

export function getLayoutOptions(acf = {}) {
  const settings = acf?.page_settings || {};
  const fallbackFooterText = settings.fallback_footer_text ?? acf?.fallback_footer_text ?? "";

  return {
    hideHeader: isAcfTrue(settings.hide_header ?? acf?.hide_header),
    hideFooter: isAcfTrue(settings.hide_footer ?? acf?.hide_footer),
    fallbackFooterText: typeof fallbackFooterText === "string" ? fallbackFooterText.trim() : "",
  };
}
