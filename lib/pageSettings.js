function isAcfTrue(value) {
  return value === true || value === 1 || value === "1" || value === "true";
}

function normalizeDelaySeconds(value) {
  const numericValue = Number(value);
  return Number.isFinite(numericValue) && numericValue > 0 ? numericValue : 0;
}

export function getLayoutOptions(acf = {}) {
  const settings = acf?.page_settings || {};
  const hiddenFooterContent = settings.fallback_footer_text ?? acf?.fallback_footer_text ?? null;
  const popupForm = settings.popup_form ?? acf?.popup_form ?? null;
  const popupFormHeading = settings.popup_form_heading ?? acf?.popup_form_heading ?? "";
  const popupFrequency = settings.popup_frequency ?? acf?.popup_frequency ?? "every_visit";

  return {
    hideHeader: isAcfTrue(settings.hide_header ?? acf?.hide_header),
    hideFooter: isAcfTrue(settings.hide_footer ?? acf?.hide_footer),
    hiddenFooterContent,
    fallbackFooterText: typeof hiddenFooterContent === "string" ? hiddenFooterContent.trim() : "",
    popup: {
      enabled: isAcfTrue(settings.enable_popup_form ?? acf?.enable_popup_form),
      form: popupForm,
      heading: typeof popupFormHeading === "string" ? popupFormHeading.trim() : "",
      delaySeconds: normalizeDelaySeconds(settings.popup_delay_seconds ?? acf?.popup_delay_seconds),
      frequency: typeof popupFrequency === "string" ? popupFrequency : "every_visit",
    },
  };
}
