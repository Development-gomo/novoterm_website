"use client";

import { useEffect } from "react";

const CBID = process.env.NEXT_PUBLIC_COOKIEBOT_ID;
const INTERACTION_EVENTS = ["scroll", "click", "touchstart", "keydown"];

/**
 * Injects Cookiebot only after the first real user interaction.
 *
 * Why: if the Cookiebot banner renders before the page hero, Lighthouse
 * treats the banner as the LCP element — adding 4 s+ to the LCP score.
 * By deferring until interaction we guarantee the real hero is LCP.
 *
 * Fallback: if no interaction within 5 s of window load, inject anyway
 * so returning visitors still see the banner.
 */
export default function DeferredCookiebot() {
  useEffect(() => {
    if (!CBID) return;

    let cancelled = false;
    let timer = null;

    const inject = () => {
      if (cancelled) return;
      cleanup(); // eslint-disable-line no-use-before-define
      if (document.getElementById("cookiebot-deferred")) return;

      const script = document.createElement("script");
      script.id = "cookiebot-deferred";
      script.async = true;
      script.src = `https://consent.cookiebot.com/uc.js?cbid=${CBID}`;
      script.dataset.cbid = CBID;
      script.dataset.blockingmode = "auto";
      document.head.appendChild(script);
    };

    INTERACTION_EVENTS.forEach((evt) =>
      window.addEventListener(evt, inject, { once: true, passive: true })
    );

    // Safety net — inject after 5 s post-load even without interaction
    const startFallback = () => {
      if (cancelled) return;
      timer = setTimeout(inject, 5000);
    };

    if (document.readyState === "complete") {
      startFallback();
    } else {
      window.addEventListener("load", startFallback, { once: true });
    }

    function cleanup() {
      INTERACTION_EVENTS.forEach((evt) =>
        window.removeEventListener(evt, inject)
      );
      if (timer) clearTimeout(timer);
    }

    return () => {
      cancelled = true;
      cleanup();
    };
  }, []);

  return null;
}
