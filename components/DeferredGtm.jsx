"use client";

import { useEffect, useState } from "react";
import { useGTM } from "../lib/hooks/useGTM";

/**
 * Loads GTM after window load in a deferred manner.
 *
 * Consent is handled internally by GTM via its Cookiebot integration
 * (implementation=gtm). GTM will show the cookie banner and gate its
 * tags based on user consent.
 *
 * A jQuery stub is injected before GTM to prevent "jQuery is not defined"
 * errors from legacy tags that reference jQuery.
 */
export default function DeferredGtm() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  // GTM handles consent internally via its Cookiebot integration
  useGTM({ enabled: ready });

  return null;
}
