import { useEffect } from "react";

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || "GTM-PMXNC6T";

/**
 * Injects a minimal jQuery stub to prevent "jQuery is not defined" errors
 * from legacy GTM tags that reference jQuery. The stub does nothing but
 * prevents script errors from breaking the page.
 */
function injectJQueryStub() {
  if (typeof window === "undefined") return;
  if (window.jQuery || window.$) return; // Real jQuery already loaded

  const noop = () => ({
    ready: noop,
    on: noop,
    off: noop,
    find: noop,
    each: noop,
    addClass: noop,
    removeClass: noop,
    css: noop,
    attr: noop,
    val: noop,
    html: noop,
    text: noop,
    append: noop,
    prepend: noop,
    remove: noop,
    click: noop,
    submit: noop,
    trigger: noop,
    ajax: () => Promise.resolve(),
    get: () => Promise.resolve(),
    post: () => Promise.resolve(),
  });

  const jQueryStub = function (selector) {
    // Return a chainable stub for any selector
    return noop();
  };

  // Add static methods
  jQueryStub.ajax = () => Promise.resolve();
  jQueryStub.get = () => Promise.resolve();
  jQueryStub.post = () => Promise.resolve();
  jQueryStub.fn = {};
  jQueryStub.extend = noop;
  jQueryStub.ready = (fn) => {
    if (document.readyState !== "loading") fn();
    else document.addEventListener("DOMContentLoaded", fn);
  };

  window.jQuery = jQueryStub;
  window.$ = jQueryStub;
}

function injectGTM() {
  if (typeof window === "undefined") return;
  // Guard: only inject once
  if (document.getElementById("gtm-main-js")) return;

  // Inject jQuery stub before GTM to prevent "jQuery is not defined" errors
  injectJQueryStub();

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });

  const script = document.createElement("script");
  script.id = "gtm-main-js";
  script.async = true; // Load async instead of Partytown (Cookiebot doesn't support CORS)
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
