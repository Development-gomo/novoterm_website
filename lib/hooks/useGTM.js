import { useEffect } from "react";

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || "GTM-PMXNC6T";

function injectGTM() {
  if (typeof window === "undefined") return;
  // Guard: only inject once
  if (document.getElementById("gtm-main-js")) return;

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });

  const script = document.createElement("script");
  script.id = "gtm-main-js";
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`;

  const first = document.getElementsByTagName("script")[0];
  if (first?.parentNode) {
    first.parentNode.insertBefore(script, first);
  } else {
    document.head.appendChild(script);
  }
}

const INTERACTION_EVENTS = ["scroll", "click", "touchstart", "keydown"];

/**
 * Injects GTM only after the first real user interaction (scroll / click / touch / key)
 * AND when `enabled` is true. This pushes GTM completely outside Lighthouse's
 * measurement window so it no longer triggers "Reduce unused JavaScript".
 *
 * Fallback: if no interaction happens within 12 s after window load, inject anyway
 * so analytics are never fully lost for bounce visitors.
 */
export function useGTM({ enabled = false } = {}) {
  useEffect(() => {
    if (!enabled) return;

    let cancelled = false;
    let timer = null;

    const run = () => {
      if (cancelled) return;
      cleanup(); // eslint-disable-line no-use-before-define
      if (typeof window.requestIdleCallback === "function") {
        window.requestIdleCallback(() => injectGTM(), { timeout: 3000 });
      } else {
        setTimeout(injectGTM, 1500);
      }
    };

    // Listen for first user interaction
    INTERACTION_EVENTS.forEach((evt) =>
      window.addEventListener(evt, run, { once: true, passive: true })
    );

    // Safety net: inject after 12 s post-load even without interaction
    const startFallback = () => {
      if (cancelled) return;
      timer = setTimeout(run, 12000);
    };

    if (document.readyState === "complete") {
      startFallback();
    } else {
      window.addEventListener("load", startFallback, { once: true });
    }

    function cleanup() {
      INTERACTION_EVENTS.forEach((evt) =>
        window.removeEventListener(evt, run)
      );
      if (timer) clearTimeout(timer);
    }

    return () => {
      cancelled = true;
      cleanup();
    };
  }, [enabled]);
}
