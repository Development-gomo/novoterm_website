import { useEffect } from "react";

const COOKIEBOT_ID = "a20b27f4-0588-45c4-b8bf-2eba20b6700d";

export default function DeferredCookiebot() {
  useEffect(() => {
    const inject = () => {
      // Guard: don't inject if Cookiebot is already loaded (e.g., by GTM)
      if (
        document.getElementById("Cookiebot") || 
        document.getElementById("CookieBot") || 
        document.querySelector('script[src*="consent.cookiebot.com"]') ||
        window.Cookiebot
      ) {
        return;
      }
      const s = document.createElement("script");
      s.id = "Cookiebot";
      s.src = "https://consent.cookiebot.com/uc.js";
      s.dataset.cbid = COOKIEBOT_ID;
      s.type = "text/javascript";
      s.async = true;
      //s.defer = true;
      document.head.appendChild(s);
    };

    // Load after LCP settles — requestIdleCallback yields to paint/layout,
    // then a short rAF delay ensures the banner doesn't become the LCP element.
    if ("requestIdleCallback" in window) {
      requestIdleCallback(() => requestAnimationFrame(inject));
    } else {
      setTimeout(inject, 100);
    }
  }, []);

  return null;
}
