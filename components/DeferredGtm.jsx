"use client";

import { useEffect } from "react";

const GTM_ID = "GTM-PMXNC6T";

/**
 * Loads GTM after the browser is idle (or max 5s wait) so mobile LCP/FCP
 * compete less with tag manager parse + Cookiebot-triggered tags.
 */
export default function DeferredGtm() {
  useEffect(() => {
    let cancelled = false;
    const inject = () => {
      if (cancelled || typeof window === "undefined") return;
      if (document.getElementById("deferred-gtm-js")) return;

      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });

      const script = document.createElement("script");
      script.id = "deferred-gtm-js";
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`;

      const first = document.getElementsByTagName("script")[0];
      if (first?.parentNode) {
        first.parentNode.insertBefore(script, first);
      } else {
        document.head.appendChild(script);
      }
    };

    let id;
    let usedIdle = false;
    if (typeof window !== "undefined" && "requestIdleCallback" in window) {
      usedIdle = true;
      id = window.requestIdleCallback(() => inject(), { timeout: 5000 });
    } else {
      id = window.setTimeout(inject, 4000);
    }

    return () => {
      cancelled = true;
      if (usedIdle) window.cancelIdleCallback(id);
      else window.clearTimeout(id);
    };
  }, []);

  return null;
}
