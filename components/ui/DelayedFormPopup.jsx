import { useEffect, useState } from "react";
import CF7ContactForm from "./CF7ContactForm";

const DAY_MS = 24 * 60 * 60 * 1000;

function normalizeFrequency(value) {
  return ["every_visit", "once_per_session", "once_per_day"].includes(value)
    ? value
    : "every_visit";
}

function getFormId(form) {
  if (Array.isArray(form)) return getFormId(form[0]);
  if (!form || typeof form !== "object") return form;

  return form.ID || form.id || form.post_id || form.value || form?.acf?.form_id || null;
}

function getStorageKey(formId) {
  return `novoterm-popup-form-${formId || "default"}`;
}

function hasSeenPopup(frequency, storageKey) {
  if (typeof window === "undefined") return true;
  if (frequency === "every_visit") return false;

  try {
    if (frequency === "once_per_session") {
      return window.sessionStorage.getItem(storageKey) === "1";
    }

    const timestamp = Number(window.localStorage.getItem(storageKey));
    return Number.isFinite(timestamp) && Date.now() - timestamp < DAY_MS;
  } catch {
    return false;
  }
}

function markPopupSeen(frequency, storageKey) {
  if (typeof window === "undefined" || frequency === "every_visit") return;

  try {
    if (frequency === "once_per_session") {
      window.sessionStorage.setItem(storageKey, "1");
      return;
    }

    window.localStorage.setItem(storageKey, String(Date.now()));
  } catch {
    // Storage can be disabled; the popup should still work.
  }
}

export default function DelayedFormPopup({ config }) {
  const formId = getFormId(config?.form);
  const isEnabled = Boolean(config?.enabled && formId);
  const frequency = normalizeFrequency(config?.frequency);
  const delayMs = Math.max(Number(config?.delaySeconds || 0), 0) * 1000;
  const storageKey = getStorageKey(formId);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isEnabled || hasSeenPopup(frequency, storageKey)) return undefined;

    const timerId = window.setTimeout(() => {
      markPopupSeen(frequency, storageKey);
      setIsOpen(true);
    }, delayMs);

    return () => window.clearTimeout(timerId);
  }, [delayMs, frequency, isEnabled, storageKey]);

  useEffect(() => {
    if (!isOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  if (!isEnabled || !isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-[#061837]/70 px-4 py-8"
      role="dialog"
      aria-modal="true"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) setIsOpen(false);
      }}
    >
      <div className="relative w-full max-w-[680px]">
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="absolute right-2 top-2 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-white/40 bg-[#061837] text-white shadow-[0_10px_30px_rgba(0,0,0,0.28)] transition hover:bg-white/10 cursor-pointer sm:-right-4 sm:-top-4"
          aria-label="Close popup form"
        >
          <svg
            aria-hidden="true"
            className="h-6 w-6"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path d="M6.75 6.75L17.25 17.25" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            <path d="M17.25 6.75L6.75 17.25" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
        </button>
        <div className="popup-cf7-panel max-h-[calc(100dvh-32px)] w-full overflow-hidden rounded-[3px] border border-white/15 bg-[#061837] px-5 py-4 shadow-[0_24px_80px_rgba(0,0,0,0.35)] sm:px-8 sm:py-7">
          <div className="pr-10 sm:pr-0">
            {config.heading && (
              <h2
                className="mb-4 font-heading text-[24px] font-semibold leading-tight text-white sm:text-[30px]"
                dangerouslySetInnerHTML={{ __html: config.heading }}
              />
            )}
            <CF7ContactForm formId={config.form} sectionTheme="dark" />
          </div>
          <style jsx global>{`
            .popup-cf7-panel form {
              max-width: none !important;
              padding: 0 !important;
            }

            .popup-cf7-panel form > p:first-of-type {
              font-size: 20px !important;
              line-height: 1.25 !important;
              margin-bottom: 12px !important;
            }

            .popup-cf7-panel form .mb-8 {
              margin-bottom: 12px !important;
            }

            .popup-cf7-panel form .mb-4 {
              margin-bottom: 8px !important;
            }

            .popup-cf7-panel form .mt-4 {
              margin-top: 10px !important;
            }

            .popup-cf7-panel form .gap-4 {
              gap: 10px !important;
            }

            .popup-cf7-panel form .space-y-4 > :not([hidden]) ~ :not([hidden]) {
              margin-top: 10px !important;
            }

            .popup-cf7-panel form p {
              line-height: 1.35 !important;
            }

            .popup-cf7-panel form label {
              padding-top: 9px !important;
              padding-bottom: 9px !important;
            }

            .popup-cf7-panel form input:not([type="radio"]):not([type="checkbox"]):not([type="file"]),
            .popup-cf7-panel form select {
              height: 40px !important;
              min-height: 40px !important;
              padding-top: 0 !important;
              padding-bottom: 0 !important;
              font-size: 13px !important;
            }

            .popup-cf7-panel form textarea {
              min-height: 64px !important;
              padding-top: 9px !important;
              padding-bottom: 9px !important;
              font-size: 13px !important;
            }

            .popup-cf7-panel form label:has(input[type="file"]) {
              height: 44px !important;
              margin-top: 10px !important;
            }

            .popup-cf7-panel form button[type="submit"] {
              min-height: 40px !important;
              padding-top: 9px !important;
              padding-bottom: 9px !important;
              font-size: 14px !important;
            }
          `}</style>
        </div>
      </div>
    </div>
  );
}
