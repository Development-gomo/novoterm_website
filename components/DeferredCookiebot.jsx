import { useEffect } from "react";

const COOKIEBOT_ID = "a20b27f4-0588-45c4-b8bf-2eba20b6700d";

export default function DeferredCookiebot() {
  useEffect(() => {
    const inject = () => {
      const s = document.createElement("script");
      s.id = "Cookiebot";
      s.src = "https://consent.cookiebot.com/uc.js";
      s.dataset.cbid = COOKIEBOT_ID;
      s.async = true;
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
