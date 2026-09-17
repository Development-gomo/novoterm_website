const RECAPTCHA_V2_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_V2_SITE_KEY || "";
const RECAPTCHA_V2_SCRIPT_ID = "google-recaptcha-v2";

let recaptchaV2ScriptPromise;

function resolveWhenRecaptchaReady(resolve) {
  const grecaptcha = window.grecaptcha;

  if (!grecaptcha) {
    resolve(null);
    return;
  }

  if (typeof grecaptcha.ready === "function") {
    grecaptcha.ready(() => resolve(window.grecaptcha));
    return;
  }

  resolve(grecaptcha);
}

export function isRecaptchaV2Enabled() {
  return Boolean(RECAPTCHA_V2_SITE_KEY);
}

export function getRecaptchaV2SiteKey() {
  return RECAPTCHA_V2_SITE_KEY;
}

export function loadRecaptchaV2Script() {
  if (!RECAPTCHA_V2_SITE_KEY || typeof window === "undefined") {
    return Promise.resolve(null);
  }

  if (window.grecaptcha?.render) {
    return new Promise((resolve) => resolveWhenRecaptchaReady(resolve));
  }

  if (recaptchaV2ScriptPromise) return recaptchaV2ScriptPromise;

  recaptchaV2ScriptPromise = new Promise((resolve, reject) => {
    const existingScript = document.getElementById(RECAPTCHA_V2_SCRIPT_ID);

    if (existingScript) {
      existingScript.addEventListener("load", () => resolveWhenRecaptchaReady(resolve), { once: true });
      existingScript.addEventListener("error", reject, { once: true });
      return;
    }

    const script = document.createElement("script");
    script.id = RECAPTCHA_V2_SCRIPT_ID;
    script.src = "https://www.google.com/recaptcha/api.js?render=explicit";
    script.async = true;
    script.defer = true;
    script.onload = () => resolveWhenRecaptchaReady(resolve);
    script.onerror = reject;
    document.head.appendChild(script);
  });

  return recaptchaV2ScriptPromise;
}
