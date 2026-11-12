const RECAPTCHA_V2_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_V2_SITE_KEY || "";
const RECAPTCHA_V2_SCRIPT_ID = "google-recaptcha-v2";

let recaptchaV2ScriptPromise;
let recaptchaV2ScriptLang;

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

// reCAPTCHA fixes its widget language when api.js loads (from `hl`, or the
// browser language if `hl` is missing), so the script is loaded per site
// language and swapped when the visitor switches between sv and en.
export function loadRecaptchaV2Script(lang = "sv") {
  if (!RECAPTCHA_V2_SITE_KEY || typeof window === "undefined") {
    return Promise.resolve(null);
  }

  const hl = lang === "en" ? "en" : "sv";

  if (recaptchaV2ScriptPromise && recaptchaV2ScriptLang === hl) {
    return recaptchaV2ScriptPromise;
  }

  if (recaptchaV2ScriptLang && recaptchaV2ScriptLang !== hl) {
    document.getElementById(RECAPTCHA_V2_SCRIPT_ID)?.remove();
    for (const key of ["grecaptcha", "___grecaptcha_cfg"]) {
      try {
        delete window[key];
      } catch {
        window[key] = undefined;
      }
    }
  }

  recaptchaV2ScriptLang = hl;
  recaptchaV2ScriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.id = RECAPTCHA_V2_SCRIPT_ID;
    script.src = `https://www.google.com/recaptcha/api.js?render=explicit&hl=${hl}`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolveWhenRecaptchaReady(resolve);
    script.onerror = (error) => {
      recaptchaV2ScriptPromise = undefined;
      recaptchaV2ScriptLang = undefined;
      script.remove();
      reject(error);
    };
    document.head.appendChild(script);
  });

  return recaptchaV2ScriptPromise;
}
