import { useEffect, useState } from "react";

/**
 * Tracks Cookiebot consent state reactively.
 *
 * Returns { statistics, marketing, preferences, hasResponded }.
 *
 * - On first visit: all false until the user accepts/declines the banner.
 * - On returning visit: Cookiebot fires CookiebotOnAccept synchronously on
 *   page load, so `hasResponded` becomes true almost immediately.
 * - If Cookiebot is not configured (NEXT_PUBLIC_COOKIEBOT_ID not set), all
 *   values remain false — callers should treat that as "no consent gate".
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
      if (!cb?.consent) return;
      setConsent({
        statistics: !!cb.consent.statistics,
        marketing: !!cb.consent.marketing,
        preferences: !!cb.consent.preferences,
        hasResponded: !!cb.hasResponse,
      });
    }

    // Returning visitor — Cookiebot may already have fired by mount time
    sync();

    window.addEventListener("CookiebotOnAccept", sync);
    window.addEventListener("CookiebotOnDecline", sync);

    return () => {
      window.removeEventListener("CookiebotOnAccept", sync);
      window.removeEventListener("CookiebotOnDecline", sync);
    };
  }, []);

  return consent;
}
