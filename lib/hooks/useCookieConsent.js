import { useEffect, useState } from "react";

function readStoredCookiebotConsent() {
  if (typeof document === "undefined") return null;

  const cookie = document.cookie
    .split("; ")
    .find((entry) => entry.startsWith("CookieConsent="));

  if (!cookie) return null;

  try {
    const value = decodeURIComponent(cookie.split("=").slice(1).join("="));
    const hasTrueValue = (key) =>
      new RegExp(`${key}\\s*:?\\s*true|${key}['"]?\\s*:\\s*true`, "i").test(value);

    return {
      statistics: hasTrueValue("statistics"),
      marketing: hasTrueValue("marketing"),
      preferences: hasTrueValue("preferences"),
      hasResponded: true,
    };
  } catch {
    return null;
  }
}

/**
 * Tracks Cookiebot consent state reactively.
 *
 * Returns { statistics, marketing, preferences, hasResponded }.
 */
export function useCookieConsent() {
  const [consent, setConsent] = useState({
    statistics: false,
    marketing: false,
    preferences: false,
    hasResponded: false,
  });

  useEffect(() => {
    function sync() {
      const cb = window.Cookiebot;

      if (cb?.consent) {
        setConsent({
          statistics: !!cb.consent.statistics,
          marketing: !!cb.consent.marketing,
          preferences: !!cb.consent.preferences,
          hasResponded: !!cb.hasResponse,
        });
        return;
      }

      const storedConsent = readStoredCookiebotConsent();
      if (storedConsent) setConsent(storedConsent);
    }

    sync();

    const poll = window.setInterval(sync, 500);
    const stopPolling = window.setTimeout(() => window.clearInterval(poll), 6000);

    window.addEventListener("CookiebotOnLoad", sync);
    window.addEventListener("CookiebotOnConsentReady", sync);
    window.addEventListener("CookiebotOnAccept", sync);
    window.addEventListener("CookiebotOnDecline", sync);

    return () => {
      window.clearInterval(poll);
      window.clearTimeout(stopPolling);
      window.removeEventListener("CookiebotOnLoad", sync);
      window.removeEventListener("CookiebotOnConsentReady", sync);
      window.removeEventListener("CookiebotOnAccept", sync);
      window.removeEventListener("CookiebotOnDecline", sync);
    };
  }, []);

  return consent;
}
