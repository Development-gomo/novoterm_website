"use client";

import { useEffect, useState } from "react";
import { useGTM } from "../lib/hooks/useGTM";

/**
 * Loads GTM after a delay using requestIdleCallback for better performance.
 * This prevents GTM from competing with critical resources.
 *
 * Consent is handled internally by GTM via its Cookiebot integration
 * (implementation=gtm). GTM will show the cookie banner and gate its
 * tags based on user consent.
 */
export default function DeferredGtm() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Load GTM during idle browser time (after page is interactive)
    if ("requestIdleCallback" in window) {
      const id = requestIdleCallback(() => setReady(true), { timeout: 5000 });
      return () => cancelIdleCallback(id);
    } else {
      // Fallback for browsers without requestIdleCallback
      const timer = setTimeout(() => setReady(true), 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  // GTM handles consent internally via its Cookiebot integration
  useGTM({ enabled: ready });

  return null;
}
