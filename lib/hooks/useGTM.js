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
  script.type = "text/partytown"; // Partytown runs this in a web worker
  script.src = `https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`;

  const first = document.getElementsByTagName("script")[0];
  if (first?.parentNode) {
    first.parentNode.insertBefore(script, first);
  } else {
    document.head.appendChild(script);
  }
}

/**
 * Injects GTM after window load + requestIdleCallback when `enabled` is true.
 *
 * Usage:
 *   const { statistics, marketing } = useCookieConsent();
 *   useGTM({ enabled: statistics || marketing });
 *
 * The hook is safe to call unconditionally — it does nothing until enabled=true,
 * and once GTM is injected the guard inside injectGTM prevents double injection.
 */
export function useGTM({ enabled = false } = {}) {
  useEffect(() => {
    if (!enabled) return;

    let cancelled = false;

    const deferred = () => {
      if (cancelled) return;
      if (typeof window.requestIdleCallback === "function") {
        window.requestIdleCallback(() => injectGTM(), { timeout: 4000 });
      } else {
        // Safari fallback
        setTimeout(injectGTM, 2000);
      }
    };

    if (document.readyState === "complete") {
      deferred();
    } else {
      window.addEventListener("load", deferred, { once: true });
    }

    return () => {
      cancelled = true;
    };
  }, [enabled]);
}
