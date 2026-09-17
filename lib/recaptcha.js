const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "";
const RECAPTCHA_V2_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_V2_SITE_KEY || "";
const RECAPTCHA_SCRIPT_ID = "google-recaptcha-v3";
const RECAPTCHA_V2_SCRIPT_ID = "google-recaptcha-v2";

let recaptchaScriptPromise;
let recaptchaV2ScriptPromise;

export function isRecaptchaV2Enabled() {
  return Boolean(RECAPTCHA_V2_SITE_KEY);
}

export function getRecaptchaV2SiteKey() {
  return RECAPTCHA_V2_SITE_KEY;
}

export function loadRecaptchaScript() {
  if (!RECAPTCHA_SITE_KEY || typeof window === "undefined") {
    return Promise.resolve(null);
  }

  if (window.grecaptcha?.execute) {
    return Promise.resolve(window.grecaptcha);
  }

  if (recaptchaScriptPromise) return recaptchaScriptPromise;

  recaptchaScriptPromise = new Promise((resolve, reject) => {
    const existingScript = document.getElementById(RECAPTCHA_SCRIPT_ID);

    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(window.grecaptcha), { once: true });
      existingScript.addEventListener("error", reject, { once: true });
      return;
    }

    const script = document.createElement("script");
    script.id = RECAPTCHA_SCRIPT_ID;
    script.src = `https://www.google.com/recaptcha/api.js?render=${encodeURIComponent(RECAPTCHA_SITE_KEY)}`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve(window.grecaptcha);
    script.onerror = reject;
    document.head.appendChild(script);
  });

  return recaptchaScriptPromise;
}

export function loadRecaptchaV2Script() {
  if (!RECAPTCHA_V2_SITE_KEY || typeof window === "undefined") {
    return Promise.resolve(null);
  }

  if (window.grecaptcha?.render) {
    return Promise.resolve(window.grecaptcha);
  }

  if (recaptchaV2ScriptPromise) return recaptchaV2ScriptPromise;

  recaptchaV2ScriptPromise = new Promise((resolve, reject) => {
    const existingScript = document.getElementById(RECAPTCHA_V2_SCRIPT_ID);

    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(window.grecaptcha), { once: true });
      existingScript.addEventListener("error", reject, { once: true });
      return;
    }

    const script = document.createElement("script");
    script.id = RECAPTCHA_V2_SCRIPT_ID;
    script.src = "https://www.google.com/recaptcha/api.js?render=explicit";
    script.async = true;
    script.defer = true;
    script.onload = () => resolve(window.grecaptcha);
    script.onerror = reject;
    document.head.appendChild(script);
  });

  return recaptchaV2ScriptPromise;
}

export async function getRecaptchaToken(action = "contact_form") {
  const grecaptcha = await loadRecaptchaScript();
  if (!RECAPTCHA_SITE_KEY || !grecaptcha?.execute) return "";

  await new Promise((resolve) => grecaptcha.ready(resolve));
  return grecaptcha.execute(RECAPTCHA_SITE_KEY, { action });
}
