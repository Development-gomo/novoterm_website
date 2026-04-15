import { useEffect } from "react";

const COOKIEBOT_ID = "a20b27f4-0588-45c4-b8bf-2eba20b6700d";
const EVENTS = ["scroll", "click", "touchstart", "keydown"];
const FALLBACK_MS = 5000;

export default function DeferredCookiebot() {
  useEffect(() => {
    let loaded = false;

    const load = () => {
      if (loaded) return;
      loaded = true;
      const s = document.createElement("script");
      s.id = "Cookiebot";
      s.src = "https://consent.cookiebot.com/uc.js";
      s.dataset.cbid = COOKIEBOT_ID;
      s.async = true;
      document.head.appendChild(s);
      EVENTS.forEach((e) =>
        window.removeEventListener(e, load, { capture: true })
      );
    };

    EVENTS.forEach((e) =>
      window.addEventListener(e, load, { capture: true, once: true, passive: true })
    );
    const timer = setTimeout(load, FALLBACK_MS);

    return () => {
      clearTimeout(timer);
      EVENTS.forEach((e) =>
        window.removeEventListener(e, load, { capture: true })
      );
    };
  }, []);

  return null;
}
