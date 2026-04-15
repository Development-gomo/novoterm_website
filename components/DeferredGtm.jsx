"use client";

import { useEffect, useState } from "react";
import { useCookieConsent } from "../lib/hooks/useCookieConsent";
import { useGTM } from "../lib/hooks/useGTM";

const COOKIEBOT_CONFIGURED = !!process.env.NEXT_PUBLIC_COOKIEBOT_ID;

/**
 * Loads GTM after user consent via Cookiebot.
 *
 * - If NEXT_PUBLIC_COOKIEBOT_ID is set: waits for the user to accept
 *   statistics or marketing cookies before injecting GTM.
 * - If NEXT_PUBLIC_COOKIEBOT_ID is not set: injects GTM immediately after
 *   window load + idle (original deferred behaviour — no consent gate needed).
 *
 * GTM is always injected at most once regardless of re-renders.
 */
export default function DeferredGtm() {
  const { statistics, marketing, hasResponded } = useCookieConsent();

  // When Cookiebot is not configured we fall back to unconditional deferred load
  const [noCookiebotReady, setNoCookiebotReady] = useState(false);
  useEffect(() => {
    if (!COOKIEBOT_CONFIGURED) setNoCookiebotReady(true);
  }, []);

  const gtmEnabled = COOKIEBOT_CONFIGURED
    ? hasResponded && (statistics || marketing)
    : noCookiebotReady;

  useGTM({ enabled: gtmEnabled });

  return null;
}
