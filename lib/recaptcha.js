const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "";
const RECAPTCHA_SCRIPT_ID = "google-recaptcha-v3";

let recaptchaScriptPromise;

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

export async function getRecaptchaToken(action = "contact_form") {
  const grecaptcha = await loadRecaptchaScript();
  if (!RECAPTCHA_SITE_KEY || !grecaptcha?.execute) return "";

  await new Promise((resolve) => grecaptcha.ready(resolve));
  return grecaptcha.execute(RECAPTCHA_SITE_KEY, { action });
}
