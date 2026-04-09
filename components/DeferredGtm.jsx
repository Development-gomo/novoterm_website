"use client";

import { useEffect } from "react";

const GTM_ID = "GTM-PMXNC6T";

/**
 * Loads GTM after window "load" + idle so tag JS never competes with LCP/SI.
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

    const runAfterLoad = () => {
      if (cancelled) return;
      if (typeof window.requestIdleCallback === "function") {
        window.requestIdleCallback(() => inject(), { timeout: 8000 });
      } else {
        window.setTimeout(inject, 5500);
      }
    };

    if (document.readyState === "complete") {
      runAfterLoad();
    } else {
      window.addEventListener("load", runAfterLoad, { once: true });
    }

    return () => {
      cancelled = true;
      window.removeEventListener("load", runAfterLoad);
    };
  }, []);

  return null;
}
