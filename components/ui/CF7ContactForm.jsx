
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

const FORM_IDS = {
  en: 20289,
  sv: 321,
};

const CF7_LOCALES = {
  en: "en_US",
  sv: "sv_SE",
};

function normalizeFormId(formId) {
  if (Array.isArray(formId)) return normalizeFormId(formId[0]);
  if (!formId || typeof formId !== "object") return formId;

  return (
    formId.ID ||
    formId.id ||
    formId.post_id ||
    formId.value ||
    formId?.acf?.form_id ||
    null
  );
}

function getSelectedFormId(formId) {
  const normalizedFormId = String(normalizeFormId(formId) ?? "").trim();
  return /^\d+$/.test(normalizedFormId) && normalizedFormId !== "0"
    ? normalizedFormId
    : null;
}

function resolveFormId(formId, lang) {
  return getSelectedFormId(formId) || String(FORM_IDS[lang] || FORM_IDS.sv);
}

function attachCf7Meta(formData, formId, lang) {
  const resolvedFormId = resolveFormId(formId, lang);

  formData.set("_wpcf7", resolvedFormId);
  formData.set("_wpcf7_unit_tag", `wpcf7-f${resolvedFormId}-o1`);
  formData.set("_wpcf7_locale", CF7_LOCALES[lang] || CF7_LOCALES.sv);
  formData.set("_wpcf7_container_post", "0");
  formData.set("_wpcf7_posted_data_hash", "");

  if (resolvedFormId === "320") {
    const phone = formData.get("phone") || "";
    const area = formData.get("area") || "";
    const fullName = formData.get("full_name") || "";
    const email = formData.get("email") || "";
    const companyName = formData.get("company_name") || "";
    const message = formData.get("message") || "";
    const formType = formData.get("form_type") || formData.get("event_name") || area || "Website contact";

    formData.set("your-name", fullName || companyName || "Website visitor");
    formData.set("your-email", email);
    formData.set("your-subject", formType);
    formData.set(
      "your-message",
      [
        companyName && `Company: ${companyName}`,
        phone && `Phone: ${phone}`,
        area && `Area: ${area}`,
        message,
      ].filter(Boolean).join("\n")
    );
  }

  return resolvedFormId;
}

function cf7InvalidFieldsToErrors(invalidFields = []) {
  return invalidFields.reduce((acc, field) => {
    if (field?.field && field?.message) acc[field.field] = field.message;
    return acc;
  }, {});
}

function cf7Message(result, fallback) {
  return result?.message || result?.invalid_fields?.[0]?.message || fallback;
}

async function submitCf7Form(formData, formId, lang) {
  const resolvedFormId = attachCf7Meta(formData, formId, lang);
  const res = await fetch(`/api/cf7-form?formId=${encodeURIComponent(resolvedFormId)}`, {
    method: "POST",
    body: formData,
  });

  const result = await res.json().catch(() => ({}));
  if (!res.ok && !result.status) {
    throw new Error(result.message || "Submission failed.");
  }

  return result;
}

function isRequiredField(field) {
  return field?.type?.includes("*");
}

function getFieldLabel(field) {
  return field?.labels?.[0] || field?.raw_values?.[0] || field?.name || "";
}

function getFieldPlaceholder(field) {
  return field?.options?.includes("placeholder") ? getFieldLabel(field) : "";
}

function getSubmitLabel(fields, lang) {
  const submitField = fields.find((field) => field.basetype === "submit");
  return submitField?.labels?.[0] || (lang === "sv" ? "Skicka" : "Submit");
}

export default function ContactForm({ sectionTheme = "light", formId, mode = "contact", eventName = "" }) {
  const router = useRouter();
  const lang = router.locale || "sv";
  const selectedFormId = getSelectedFormId(formId);
  const resolvedFormId = resolveFormId(formId, lang);
  const shouldLoadCf7 = Boolean(selectedFormId);

  // Translation dictionary
  const t = (sv, en) => lang === "sv" ? sv : en;
  const [type, setType] = useState("company");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [fileName, setFileName] = useState("");
  const [errors, setErrors] = useState({});
  const [cf7Form, setCf7Form] = useState(null);
  const [cf7Loading, setCf7Loading] = useState(shouldLoadCf7);
  const fallbackFormId = cf7Form?.fields?.length ? formId : undefined;

  useEffect(() => {
    if (!shouldLoadCf7) {
      setCf7Form(null);
      setCf7Loading(false);
      return;
    }

    let ignore = false;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);
    setCf7Form(null);
    setCf7Loading(true);

    fetch(`/api/cf7-form?formId=${encodeURIComponent(selectedFormId)}`, {
      signal: controller.signal,
    })
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.message || "Could not load form.");
        return data;
      })
      .then((data) => {
        if (!ignore) setCf7Form(data?.fields?.length ? data : null);
      })
      .catch(() => {
        if (!ignore) setCf7Form(null);
      })
      .finally(() => {
        clearTimeout(timeoutId);
        if (!ignore) setCf7Loading(false);
      });

    return () => {
      ignore = true;
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, [selectedFormId, shouldLoadCf7]);

  function redirectToPrivateThankYou() {
    const privateThankYouPath = lang === "en"
      ? "/en/thankyou-private"
      : "/thank-you-private/";

    setType("private");
    router.push(privateThankYouPath, undefined, { locale: false });
  }

  const errorMsg = {
    company_name:  t("Företagsnamn får inte innehålla siffror.", "Company name must not contain numbers."),
    full_name:     t("Namnet får inte innehålla siffror.", "Name must not contain numbers."),
    phone_invalid: t("Telefonnummer får endast innehålla siffror och + - ( ).", "Phone number may only contain digits and + - ( )."),
    phone_min:     t("Telefonnummer måste ha minst 7 siffror.", "Phone number must have at least 7 digits."),
    phone_max:     t("Telefonnummer får ha max 15 siffror.", "Phone number must have at most 15 digits."),
    email:         t("Ange en giltig e-postadress.", "Please enter a valid email address."),
  };

  function validateFields(formData) {
    const newErrors = {};
    const companyName = formData.get("company_name") || "";
    const fullName    = formData.get("full_name") || "";
    const phone       = formData.get("phone") || "";
    const email       = formData.get("email") || "";

    if (/\d/.test(companyName)) newErrors.company_name = errorMsg.company_name;
    if (/\d/.test(fullName))    newErrors.full_name    = errorMsg.full_name;

    // Strict email: local@domain.tld where tld is 2–6 chars
    const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,6}$/;
    if (email && !emailRegex.test(email)) newErrors.email = errorMsg.email;

    if (phone) {
      if (/[a-zA-Z]/.test(phone))          newErrors.phone = errorMsg.phone_invalid;
      else if (!/^[+\d\s\-()\s]+$/.test(phone)) newErrors.phone = errorMsg.phone_invalid;
      else {
        const digits = phone.replace(/\D/g, "");
        if (digits.length < 7)       newErrors.phone = errorMsg.phone_min;
        else if (digits.length > 15) newErrors.phone = errorMsg.phone_max;
      }
    }

    return newErrors;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("");

    const formData = new FormData(e.target);
    const validationErrors = validateFields(formData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setLoading(true);
    formData.set("user_type", type === "private" ? "PRIVATPERSON" : "FÖRETAG");

    try {
      const result = await submitCf7Form(formData, fallbackFormId, lang);

      if (result.status === "mail_sent") {
        const thankYouPage = type === "company"
          ? (lang === "en" ? "thank-you-company" : "thank-you-company")
          : (lang === "en" ? "thankyou-private" : "thank-you-private");
        const redirectPath = lang === "en" ? `/en/${thankYouPage}` : `/${thankYouPage}/`;
        router.push(redirectPath);
        return;
      } else {
        setErrors(cf7InvalidFieldsToErrors(result.invalid_fields));
        setStatus(cf7Message(result, "Something went wrong."));
      }
    } catch (err) {
      setStatus("Submission failed. Please try again later.");
    }

    setLoading(false);
  }

  // If sectionTheme is 'light', force dark form styles
  const isParentLight = sectionTheme === "light";
  const textColor = isParentLight ? "text-[#061837]" : "text-white";
  const borderColor = isParentLight ? "border-[#061837]" : "border-white/50";
  const placeholderColor = isParentLight ? "placeholder-[#061837]/70" : "placeholder-white/70";

  const isNewsletter = mode === "newsletter_unsubscribe";
  const newsletterTextColor = isParentLight ? "text-[#061837]" : "text-white";
  const newsletterBorderColor = isParentLight ? "border-[#061837]" : "border-white/50";
  const newsletterPlaceholderColor = isParentLight ? "placeholder-[#061837]/70" : "placeholder-white/70";

  async function handleNewsletterSubmit(e) {
    e.preventDefault();
    setStatus("");

    const formData = new FormData(e.target);
    const email = formData.get("email") || "";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,6}$/;

    if (!emailRegex.test(email)) {
      setErrors({ email: errorMsg.email });
      return;
    }

    setErrors({});
    setLoading(true);

    formData.set("user_type", "FÖRETAG");
    formData.set("area", "Annat");
    formData.set("company_name", "Newsletter");
    formData.set("full_name", "Newsletter Subscriber");
    formData.set("phone", "0000000");
    formData.set("form_type", "Newsletter unsubscribe");

    try {
      const result = await submitCf7Form(formData, fallbackFormId, lang);

      if (result.status === "mail_sent") {
        const redirectPath = lang === "en"
          ? "/en/unsubscribe-thank-you"
          : "/unsubscribe-thank-you/";
        router.push(redirectPath);
        return;
      }

      setErrors(cf7InvalidFieldsToErrors(result.invalid_fields));
      setStatus(cf7Message(result, "Something went wrong."));
    } catch (err) {
      setStatus("Submission failed. Please try again later.");
    }

    setLoading(false);
  }

  const isEvent = mode === "event";

  async function handleEventSubmit(e) {
    e.preventDefault();
    setStatus("");

    const formData = new FormData(e.target);
    const validationErrors = validateFields(formData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    if (eventName) formData.append("event_name", eventName);
    formData.set("area", "Annat");
    formData.set("user_type", "FÖRETAG");
    formData.set("form_type", eventName || "Event Registration");
    if (!formData.get("company_name")) formData.set("company_name", "Event Registration");
    if (!formData.get("phone")) formData.set("phone", "0000000");

    try {
      const result = await submitCf7Form(formData, fallbackFormId, lang);

      if (result.status === "mail_sent") {
        const redirectPath = lang === "en" ? "/en/event-thank-you" : "/event-thankyou/";
        router.push(redirectPath);
        return;
      }

      setErrors(cf7InvalidFieldsToErrors(result.invalid_fields));
      setStatus(cf7Message(result, "Something went wrong."));
    } catch (err) {
      setStatus("Submission failed. Please try again later.");
    }

    setLoading(false);
  }

  async function handleDynamicSubmit(e) {
    e.preventDefault();
    setStatus("");
    setErrors({});
    setLoading(true);

    try {
      const formData = new FormData(e.target);
      if (eventName && formData.has("event_name")) formData.set("event_name", eventName);
      if (eventName && formData.has("form_type")) formData.set("form_type", eventName);

      const result = await submitCf7Form(formData, resolvedFormId, lang);

      if (result.status === "mail_sent") {
        if (mode === "newsletter_unsubscribe") {
          router.push(lang === "en" ? "/en/unsubscribe-thank-you" : "/unsubscribe-thank-you/");
          return;
        }

        if (mode === "event") {
          router.push(lang === "en" ? "/en/event-thank-you" : "/event-thankyou/");
          return;
        }

        router.push(lang === "en" ? "/en/thank-you-company" : "/thank-you-company/");
        return;
      }

      setErrors(cf7InvalidFieldsToErrors(result.invalid_fields));
      setStatus(cf7Message(result, "Something went wrong."));
    } catch (err) {
      setStatus("Submission failed. Please try again later.");
    }

    setLoading(false);
  }

  const dynamicTextColor = isParentLight ? "text-[#061837]" : "text-white";
  const dynamicBorderColor = isParentLight ? "border-[#061837]" : "border-white/50";
  const dynamicPlaceholderColor = isParentLight ? "placeholder-[#061837]/70" : "placeholder-white/70";
  const dynamicInputClass = `w-full min-h-[48px] px-4 rounded-[3px] border bg-transparent ${dynamicTextColor} text-[14px] outline-none ${dynamicPlaceholderColor}`;
  const dynamicGroupClass = "flex flex-col sm:flex-row gap-4";
  const dynamicChoiceClass = `group flex items-center gap-3 px-[24px] py-[16px] border ${dynamicBorderColor} rounded-[3px] w-full cursor-pointer`;
  const dynamicFieldLabelClass = "text-[18px] font-montserrat font-medium mb-4";
  const dynamicHelpTextClass = "text-[12px] opacity-60 mt-1 mb-4";

  function getHiddenFieldValue(field) {
    if (field.values?.[0]) return field.values[0];
    if (field.name === "page-title") return typeof document === "undefined" ? "" : document.title;
    if (field.name === "page-url") return typeof window === "undefined" ? "" : window.location.href;
    return "";
  }

  function getFileUploadLabel(field) {
    return field.labels?.[0] || field.raw_values?.[0] || t("LADDA UPP FIL", "Upload file");
  }

  function isPrivatePersonChoice(value, label) {
    const choice = `${value || ""} ${label || ""}`.toLocaleUpperCase();
    return choice.includes("PRIVATPERSON") || choice.includes("PRIVATE INDIVIDUAL");
  }

  function renderDynamicField(field) {
    if (!field?.name && field?.basetype !== "submit") return null;
    if (field.basetype === "submit") return null;

    const required = isRequiredField(field);
    const label = getFieldLabel(field);
    const placeholder = getFieldPlaceholder(field);
    const errorClass = errors[field.name] ? "border-red-500" : dynamicBorderColor;

    if (field.basetype === "hidden") {
      return <input key={field.name} type="hidden" name={field.name} value={getHiddenFieldValue(field)} />;
    }

    if (field.basetype === "radio" || field.basetype === "checkbox") {
      const isCheckbox = field.basetype === "checkbox";
      return (
        <div key={field.name} className="mb-8">
          <div className={dynamicGroupClass}>
            {(field.values || []).map((value, index) => {
              const choiceLabel = field.labels?.[index] || value;
              const redirectsToPrivate = !isCheckbox && isPrivatePersonChoice(value, choiceLabel);

              return (
                <label
                  key={`${field.name}-${value}`}
                  className={dynamicChoiceClass}
                  onClick={redirectsToPrivate ? redirectToPrivateThankYou : undefined}
                >
                  <input
                    type={isCheckbox ? "checkbox" : "radio"}
                    name={field.name}
                    value={value}
                    defaultChecked={!isCheckbox && index === 0}
                    required={required}
                    className="peer sr-only"
                  />
                  <span
                    className={`flex w-[18px] h-[18px] flex-shrink-0 items-center justify-center border-2 border-gray-400 ${isCheckbox ? "rounded-[3px]" : "rounded-full"} peer-checked:bg-[#2655C4] peer-checked:border-[#2655C4] peer-checked:[&>span]:opacity-100`}
                  >
                    <span className={`${isCheckbox ? "w-[8px] h-[8px] rounded-[1px]" : "w-[8px] h-[8px] rounded-full"} bg-white opacity-0`} />
                  </span>
                  <span className="text-[13px] uppercase tracking-widest">
                    {choiceLabel}
                  </span>
                </label>
              );
            })}
          </div>
        </div>
      );
    }

    if (field.basetype === "acceptance") {
      return (
        <label
          key={field.name}
          className={`group flex items-center gap-3 px-[24px] py-[16px] border ${errorClass} rounded-[3px] w-full cursor-pointer`}
        >
          <input
            type="checkbox"
            name={field.name}
            value={field.values?.[0] || "1"}
            required={required}
            className="peer sr-only"
          />
          <span className="flex w-[18px] h-[18px] flex-shrink-0 items-center justify-center border-2 border-gray-400 rounded-[3px] peer-checked:bg-[#2655C4] peer-checked:border-[#2655C4] peer-checked:[&>span]:opacity-100">
            <span className="w-[8px] h-[8px] rounded-[1px] bg-white opacity-0" />
          </span>
          <span className="text-[13px] uppercase tracking-widest">
            {label || field.name}
          </span>
        </label>
      );
    }

    if (field.basetype === "select") {
      const hasFirstLabel = field.options?.includes("first_as_label");
      const defaultValue = hasFirstLabel ? "" : (field.values?.[0] || "");
      return (
        <div key={field.name} className="relative w-full">
          <select
            name={field.name}
            required={required}
            className={`${dynamicInputClass} ${errorClass} pr-10 appearance-none`}
            defaultValue={defaultValue}
            onChange={() => setErrors((prev) => ({ ...prev, [field.name]: undefined }))}
          >
            {(field.values || []).map((value, index) => (
              <option
                key={`${field.name}-${value}-${index}`}
                value={hasFirstLabel && index === 0 ? "" : value}
                className="text-black bg-white"
                disabled={hasFirstLabel && index === 0}
              >
                {field.labels?.[index] || value}
              </option>
            ))}
          </select>
          <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-current">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="6"
              viewBox="0 0 12 6"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M5.625 6L0.1125 0.6375C-0.0375 0.4875 -0.0375 0.25 0.1125 0.1125C0.2625 -0.0375 0.5 -0.0375 0.6375 0.1125L5.625 5.1L10.6125 0.1125C10.7625 -0.0375 11 -0.0375 11.1375 0.1125C11.2875 0.2625 11.2875 0.5 11.1375 0.6375L5.625 6Z"
                fill="currentColor"
              />
            </svg>
          </span>
        </div>
      );
    }

    if (field.basetype === "textarea") {
      return (
        <textarea
          key={field.name}
          name={field.name}
          placeholder={placeholder || label}
          required={required}
          className={`w-full min-h-[105px] px-4 py-3 rounded-[3px] border ${errorClass} bg-transparent ${dynamicTextColor} text-[14px] outline-none resize-none ${dynamicPlaceholderColor}`}
          onChange={() => setErrors((prev) => ({ ...prev, [field.name]: undefined }))}
        />
      );
    }

    if (field.basetype === "file") {
      return (
        <label
          key={field.name}
          className={`inline-flex items-center gap-3 h-[56px] px-[24px] border border-dashed ${dynamicBorderColor} ${dynamicTextColor} rounded-[3px] text-[13px] cursor-pointer bg-white/[0.05] ${dynamicPlaceholderColor}`}
        >
          <input
            type="file"
            name={field.name}
            required={required}
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                setFileName(e.target.files[0].name);
              }
            }}
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="15"
            viewBox="0 0 16 15"
            fill="none"
            aria-hidden="true"
            className="flex-shrink-0"
          >
            <path
              d="M7.98512 0C7.9785 0.000678357 7.97188 0.00135671 7.96526 0.0027136C7.95269 0.00339196 7.94078 0.00542721 7.92886 0.00678392C7.91629 0.00881916 7.90438 0.0115327 7.89247 0.0142463C7.88122 0.0162816 7.87063 0.0189952 7.85938 0.0223871C7.84747 0.0257793 7.83555 0.0298496 7.82298 0.0339199C7.81438 0.0379904 7.80511 0.0413824 7.79585 0.0454529C7.78129 0.0522368 7.76607 0.0596992 7.75217 0.0671617C7.74555 0.0705537 7.73959 0.0739456 7.73364 0.0780161C7.71842 0.0868353 7.70386 0.0970121 7.6893 0.107867C7.68533 0.111258 7.68136 0.11465 7.67672 0.118721C7.66349 0.129575 7.65025 0.141109 7.63702 0.153997C7.63371 0.156711 7.62974 0.159424 7.62576 0.162138L3.99514 3.88528H3.9958C3.79132 4.09558 3.79132 4.43547 3.9958 4.64509C4.20029 4.85471 4.53186 4.85471 4.73635 4.64509L7.4721 1.84466V10.541C7.4721 10.6842 7.5277 10.8212 7.6263 10.9223C7.72491 11.0234 7.85859 11.0797 7.99822 11.0797C8.1372 11.0797 8.27089 11.0234 8.36949 10.9223C8.46809 10.8212 8.52368 10.6842 8.52368 10.541V1.84466L11.2562 4.64509C11.3548 4.74617 11.4885 4.80316 11.6281 4.80316C11.7678 4.80316 11.9015 4.74618 12.0001 4.64509C12.2039 4.43547 12.2039 4.09558 12.0001 3.88528L8.38995 0.182631H8.38928C8.38266 0.175847 8.37605 0.169063 8.36877 0.162278V0.15753C8.35553 0.143962 8.34097 0.130393 8.32575 0.118183C8.32046 0.114112 8.31516 0.110042 8.30987 0.105971C8.29729 0.0964739 8.28472 0.0876544 8.27149 0.0801918C8.26354 0.0747646 8.25494 0.0700158 8.24634 0.0659453C8.23376 0.0591613 8.22119 0.0530558 8.20795 0.0469492C8.19869 0.0428789 8.18942 0.0388084 8.1795 0.0354164C8.16692 0.0306676 8.15369 0.0272756 8.14111 0.0232051C8.13052 0.0204917 8.11994 0.0177779 8.10935 0.0150645C8.09743 0.0123507 8.08618 0.0103157 8.07427 0.00828042C8.0617 0.00624518 8.04912 0.00488851 8.03655 0.00353162C8.0253 0.00285327 8.01339 0.00285322 8.00148 0.00285322C7.99684 0.00217487 7.99155 0.00217491 7.98692 0.00217491L7.98512 0ZM0.525466 9.03486C0.235609 9.03486 0.000660729 9.27501 0 9.57146V14.462C0 14.6052 0.0549286 14.7422 0.153535 14.8426C0.252141 14.9437 0.385824 15.0007 0.525458 15H15.4745C15.6142 15.0007 15.7479 14.9437 15.8465 14.8426C15.9451 14.7422 16 14.6052 16 14.462V9.57146C16 9.27501 15.7644 9.03416 15.4745 9.03486C15.1847 9.03486 14.9497 9.27501 14.9491 9.57146V13.9247H1.05088V9.57146C1.05022 9.27501 0.81534 9.03416 0.525466 9.03486Z"
              fill="currentColor"
            />
          </svg>
          <span className="uppercase tracking-widest truncate max-w-[240px]">
            {fileName || getFileUploadLabel(field)}
          </span>
        </label>
      );
    }

    const inputType = ["email", "tel", "url", "number", "date"].includes(field.basetype)
      ? field.basetype
      : "text";

    return (
      <input
        key={field.name}
        type={inputType}
        name={field.name}
        placeholder={placeholder || label}
        required={required}
        className={`${dynamicInputClass} ${errorClass}`}
        onChange={() => setErrors((prev) => ({ ...prev, [field.name]: undefined }))}
      />
    );
  }

  function getDynamicFieldByName(fields, name) {
    return fields.find((field) => field.name === name);
  }

  function renderDynamicLayout(fields, layout = []) {
    const renderedNames = new Set();
    const items = [];

    layout.forEach((item, index) => {
      if (item.type === "heading" && item.text) {
        items.push(
          <p
            key={`heading-${index}-${item.text}`}
            className={dynamicFieldLabelClass}
          >
            {item.text}
          </p>
        );
        return;
      }

      if (item.type === "note" && item.text) {
        items.push(
          <p
            key={`note-${index}-${item.text}`}
            className={dynamicHelpTextClass}
          >
            {item.text}
          </p>
        );
        return;
      }

      if (item.type === "row") {
        const rowFields = item.fields
          .map((name) => getDynamicFieldByName(fields, name))
          .filter(Boolean);

        rowFields.forEach((field) => renderedNames.add(field.name));

        if (rowFields.length) {
          items.push(
            <div
              key={`row-${index}-${item.fields.join("-")}`}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              {rowFields.map(renderDynamicField)}
            </div>
          );
        }
        return;
      }

      if (item.type === "field") {
        const field = getDynamicFieldByName(fields, item.name);
        if (!field) return;

        renderedNames.add(field.name);
        items.push(renderDynamicField(field));
      }
    });

    fields
      .filter((field) => field.name && field.basetype !== "submit" && !renderedNames.has(field.name))
      .forEach((field) => items.push(renderDynamicField(field)));

    return items;
  }

  function renderStyledContactForm(fields) {
    const {
      userTypeField,
      companyField,
      fullNameField,
      phoneField,
      emailField,
      areaField,
      messageField,
      fileField,
    } = getStyledContactFields(fields);
    const companyValue = userTypeField?.values?.[0] || "FÖRETAG";
    const privateValue = userTypeField?.values?.[1] || "PRIVATPERSON";
    const areaHasFirstLabel = areaField?.options?.includes("first_as_label");
    const formCopy = cf7Form?.copy || {};
    const firstHeading = formCopy.headings?.[0] || t("Företagskund eller privatperson? Välj nedan:", "Business client or private individual? Select below:");
    const secondHeading = formCopy.headings?.[1] || t("Berätta om dig själv", "Tell us about you");
    const note = formCopy.notes?.[0] || `* ${t("Obligatoriskt fält", "Mandatory field")}`;

    return (
      <form
        onSubmit={handleDynamicSubmit}
        className={`w-full max-w-[520px] ${dynamicTextColor}`}
        noValidate
      >
        <p className="text-[18px] font-montserrat font-medium mb-4">
          {firstHeading}
        </p>

        {userTypeField && <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <label className={`flex items-center gap-3 px-[24px] py-[16px] border ${dynamicBorderColor} rounded-[3px] w-full cursor-pointer`}>
            <input
              type="radio"
              name={userTypeField.name}
              value={companyValue}
              checked={type === "company"}
              onChange={() => setType("company")}
              className="hidden"
            />
            <span className={`flex w-[18px] h-[18px] rounded-full flex-shrink-0 items-center justify-center ${type === "company" ? "bg-[#2655C4]" : "border-2 border-gray-400"}`}>
              {type === "company" && <span className="w-[8px] h-[8px] rounded-full bg-white" />}
            </span>
            <span className="text-[13px] uppercase tracking-widest">
              {userTypeField.labels?.[0] || companyValue}
            </span>
          </label>

          <label
            className={`flex items-center gap-3 px-[24px] py-[16px] border ${dynamicBorderColor} rounded-[3px] w-full cursor-pointer`}
            onClick={redirectToPrivateThankYou}
          >
            <input
              type="radio"
              name={userTypeField.name}
              value={privateValue}
              checked={type === "private"}
              onChange={() => setType("private")}
              className="hidden"
            />
            <span className={`flex w-[18px] h-[18px] rounded-full flex-shrink-0 items-center justify-center ${type === "private" ? "bg-[#2655C4]" : "border-2 border-gray-400"}`}>
              {type === "private" && <span className="w-[8px] h-[8px] rounded-full bg-white" />}
            </span>
            <span className="text-[13px] uppercase tracking-widest">
              {userTypeField.labels?.[1] || privateValue}
            </span>
          </label>
        </div>}

        <div className="mb-4">
          <p className="text-[18px] font-montserrat font-medium">
            {secondHeading}
          </p>
          <p className="text-[12px] opacity-60 mt-1">
            {note}
          </p>
        </div>

        <div className="space-y-4">
          {renderStyledInput(companyField)}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {renderStyledInput(fullNameField)}
            {renderStyledInput(phoneField, "tel")}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {renderStyledInput(emailField, "email")}

            <div className="relative w-full">
              <select
                name={areaField.name}
                required={isRequiredField(areaField)}
                className={`w-full h-[48px] px-4 pr-10 rounded-[3px] border ${errors.area ? "border-red-500" : dynamicBorderColor} bg-transparent ${dynamicTextColor} text-[14px] outline-none appearance-none`}
                defaultValue=""
                onChange={() => setErrors((prev) => ({ ...prev, area: undefined }))}
              >
                {(areaField.values || []).map((value, index) => (
                  <option
                    key={`${areaField.name}-${value}-${index}`}
                    value={areaHasFirstLabel && index === 0 ? "" : value}
                    disabled={areaHasFirstLabel && index === 0}
                    className="text-black bg-white"
                  >
                    {areaField.labels?.[index] || value}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {messageField && (
            <textarea
              name={messageField.name}
              placeholder={getFieldPlaceholder(messageField) || getFieldLabel(messageField)}
              required={isRequiredField(messageField)}
              className={`w-full min-h-[105px] px-4 py-3 rounded-[3px] border ${errors[messageField.name] ? "border-red-500" : dynamicBorderColor} bg-transparent ${dynamicTextColor} text-[14px] outline-none resize-none ${dynamicPlaceholderColor}`}
              onChange={() => setErrors((prev) => ({ ...prev, [messageField.name]: undefined }))}
            />
          )}
        </div>

        {fileField && (
          <label className={`inline-flex items-center gap-3 h-[56px] px-[24px] mt-4 border border-dashed ${dynamicBorderColor} ${dynamicTextColor} rounded-[3px] text-[13px] cursor-pointer bg-white/[0.05] ${dynamicPlaceholderColor}`}>
            <input
              type="file"
              name={fileField.name}
              required={isRequiredField(fileField)}
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setFileName(e.target.files[0].name);
                }
              }}
            />
            <span className="uppercase tracking-widest truncate max-w-[240px]">
              {fileName || t("LADDA UPP FIL", "Upload file")}
            </span>
          </label>
        )}

        <div className="mt-4">
          {Object.keys(errors).length > 0 && (
            <p className="text-red-500 text-[13px] mb-3">{Object.values(errors).find(Boolean)}</p>
          )}
          <button
            type="submit"
            disabled={loading || (userTypeField && type !== "company")}
            className="btn-primary cursor-pointer disabled:opacity-50"
          >
            {loading ? t("Skickar...", "Sending...") : getSubmitLabel(fields, lang)}
          </button>

          {status && (
            <p className="mt-2 text-[12px] text-red-500">{status}</p>
          )}
        </div>
      </form>
    );
  }

  if (shouldLoadCf7) {
    if (cf7Loading) {
      return (
        <div className={`w-full max-w-[520px] ${dynamicTextColor} text-[14px]`}>
          {t("Laddar formulär...", "Loading form...")}
        </div>
      );
    }

    if (cf7Form?.fields?.length) {
      return (
        <form
          onSubmit={handleDynamicSubmit}
          className={`w-full max-w-[520px] ${dynamicTextColor}`}
          noValidate
        >
          <div className="space-y-4">
            {cf7Form.layout?.length
              ? renderDynamicLayout(cf7Form.fields, cf7Form.layout)
              : cf7Form.fields.map(renderDynamicField)}
          </div>

          <div className="mt-4">
            {Object.keys(errors).length > 0 && (
              <p className="text-red-500 text-[13px] mb-3">{Object.values(errors).find(Boolean)}</p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary cursor-pointer disabled:opacity-50"
            >
              {loading ? t("Skickar...", "Sending...") : getSubmitLabel(cf7Form.fields, lang)}
            </button>

            {status && (
              <p className="mt-2 text-[12px] text-red-500">{status}</p>
            )}
          </div>
        </form>
      );
    }
  }

  if (isEvent) {
    return (
      <form
        onSubmit={handleEventSubmit}
        className={`w-full max-w-[520px] ${newsletterTextColor}`}
        noValidate
      >
        <div className="mb-4">
          <p className="text-[18px] font-montserrat font-medium">
            {t("Registrera dig", "Register")}
          </p>
          <p className="text-[12px] opacity-60 mt-1">
            * {t("Obligatoriskt fält", "Mandatory field")}
          </p>
        </div>

        <div className="space-y-4">
          <input
            type="text"
            name="full_name"
            placeholder={t("FULLSTÄNDIGT NAMN*", "FULL NAME*")}
            required
            className={`w-full h-[48px] px-4 rounded-[3px] border ${errors.full_name ? "border-red-500" : newsletterBorderColor} bg-transparent ${newsletterTextColor} text-[14px] outline-none ${newsletterPlaceholderColor}`}
            onKeyDown={(e) => { if (/^\d$/.test(e.key)) e.preventDefault(); }}
            onChange={() => setErrors((prev) => ({ ...prev, full_name: undefined }))}
          />

          <input
            type="email"
            name="email"
            placeholder={t("E-POST*", "E-MAIL*")}
            required
            className={`w-full h-[48px] px-4 rounded-[3px] border ${errors.email ? "border-red-500" : newsletterBorderColor} bg-transparent ${newsletterTextColor} text-[14px] outline-none ${newsletterPlaceholderColor}`}
            onChange={() => setErrors((prev) => ({ ...prev, email: undefined }))}
          />

          <input
            type="tel"
            name="phone"
            placeholder={t("TELEFONNUMMER", "PHONE NUMBER")}
            className={`w-full h-[48px] px-4 rounded-[3px] border ${errors.phone ? "border-red-500" : newsletterBorderColor} bg-transparent ${newsletterTextColor} text-[14px] outline-none ${newsletterPlaceholderColor}`}
            onKeyDown={(e) => {
              const ctrl = ["Backspace","Delete","Tab","ArrowLeft","ArrowRight","Home","End"];
              if (!ctrl.includes(e.key) && !/^[\d+\-() ]$/.test(e.key)) e.preventDefault();
            }}
            onChange={() => setErrors((prev) => ({ ...prev, phone: undefined }))}
          />

          <input
            type="text"
            name="company_name"
            placeholder={t("FÖRETAGSNAMN", "COMPANY NAME")}
            className={`w-full h-[48px] px-4 rounded-[3px] border ${newsletterBorderColor} bg-transparent ${newsletterTextColor} text-[14px] outline-none ${newsletterPlaceholderColor}`}
            onKeyDown={(e) => { if (/^\d$/.test(e.key)) e.preventDefault(); }}
          />

          <textarea
            name="message"
            placeholder={t("MEDDELANDE", "MESSAGE")}
            className={`w-full min-h-[105px] px-4 py-3 rounded-[3px] border ${newsletterBorderColor} bg-transparent ${newsletterTextColor} text-[14px] outline-none resize-none ${newsletterPlaceholderColor}`}
          />

          {Object.keys(errors).length > 0 && (
            <p className="text-red-500 text-[13px]">{Object.values(errors).find(Boolean)}</p>
          )}
          {status && <p className="text-red-500 text-[13px]">{status}</p>}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary cursor-pointer disabled:opacity-50"
          >
            {loading
              ? (lang === "sv" ? "Skickar..." : "Sending...")
              : t("SKICKA", "Submit")}
          </button>
        </div>
      </form>
    );
  }

  if (isNewsletter) {
    return (
      <form
        onSubmit={handleNewsletterSubmit}
        className={`w-full max-w-[520px] ${newsletterTextColor}`}
        noValidate
      >
        <div className="mb-4">
          <p className="text-[18px] font-montserrat font-medium">
            {t("Avsluta prenumeration", "Unsubscribe from newsletter")}
          </p>
          <p className="text-[12px] opacity-60 mt-1">
            * {t("Obligatoriskt fält", "Mandatory field")}
          </p>
        </div>

        <div className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder={t("E-POST*", "E-MAIL*")}
            required
            className={`w-full h-[48px] px-4 rounded-[3px] border ${errors.email ? "border-red-500" : newsletterBorderColor} bg-transparent ${newsletterTextColor} text-[14px] outline-none ${newsletterPlaceholderColor}`}
            onChange={() => setErrors((prev) => ({ ...prev, email: undefined }))}
          />

          {Object.keys(errors).length > 0 && (
            <p className="text-red-500 text-[13px]">
              {Object.values(errors).find(Boolean)}
            </p>
          )}

          {status && (
            <p className="text-red-500 text-[13px]">{status}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary cursor-pointer disabled:opacity-50"
          >
            {loading
              ? (lang === "sv" ? "Skickar..." : "Sending...")
              : t("AVPRENUMERERA", "Unsubscribe")}
          </button>
        </div>
      </form>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`w-full max-w-[520px] ${textColor} p-6 rounded-lg`}
    >

      {/* ================= RADIO QUESTION ================= */}
      <p className="text-[18px] font-montserrat font-medium mb-4">
        {t("Företagskund eller privatperson? Välj nedan:", "Business client or private individual? Select below:")}
      </p>

      <div className="flex gap-4 mb-8">
        {/* COMPANY */}
        <label className={`flex items-center gap-3 px-[24px] py-[16px] border ${borderColor} rounded-[3px] w-full cursor-pointer `}>
          <input
            type="radio"
            checked={type === "company"}
            onChange={() => setType("company")}
            className="hidden"
          />
          <span className={`flex w-[18px] h-[18px] rounded-full flex-shrink-0 items-center justify-center ${type === "company" ? "bg-[#2655C4]" : "border-2 border-gray-400"}`}>
            {type === "company" && <span className="w-[8px] h-[8px] rounded-full bg-white" />}
          </span>
          <span className="text-[13px] uppercase tracking-widest">
            {t("FÖRETAG", "BUSINESS")}
          </span>
        </label>

        {/* PRIVATE */}
        <label
          className={`flex items-center gap-3 px-[24px] py-[16px] border ${borderColor} rounded-[3px] w-full cursor-pointer`}
          onClick={redirectToPrivateThankYou}
        >
          <input
            type="radio"
            checked={type === "private"}
            onChange={() => setType("private")}
            className="hidden"
          />
          <span className={`flex w-[18px] h-[18px] rounded-full flex-shrink-0 items-center justify-center ${type === "private" ? "bg-[#2655C4]" : "border-2 border-gray-400"}`}>
            {type === "private" && <span className="w-[8px] h-[8px] rounded-full bg-white" />}
          </span>
          <span className="text-[13px] uppercase tracking-widest">
            {t("PRIVATPERSON", "PRIVATE INDIVIDUAL")}
          </span>
        </label>
      </div>

      {/* ================= SECTION TITLE ================= */}
      {type === "company" && (
        <div className="mb-4">
          <p className="text-[18px] font-montserrat font-medium">{t("Berätta om dig själv", "Tell us about you")}</p>
          <p className="text-[12px] opacity-60 mt-1">* {t("Obligatoriskt fält", "Mandatory field")}</p>
        </div>
      )}

      {/* ================= INPUTS ================= */}
      {type === "company" && <div className="space-y-4">

        <input
          type="text"
          name="company_name"
          placeholder={t("FÖRETAGSNAMN*", "COMPANY NAME*")}
          required
          className={`w-full h-[48px] px-4 rounded-[3px] border ${errors.company_name ? "border-red-500" : borderColor} ${textColor} text-[14px] outline-none ${placeholderColor}`}
          onKeyDown={(e) => { if (/^\d$/.test(e.key)) e.preventDefault(); }}
          onChange={() => setErrors((prev) => ({ ...prev, company_name: undefined }))}
        />

        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            name="full_name"
            placeholder={t("FULLSTÄNDIGT NAMN*", "FULL NAME*")}
            required
            className={`h-[48px] px-4 rounded-[3px] border ${errors.full_name ? "border-red-500" : borderColor} ${textColor} text-[14px] outline-none ${placeholderColor}`}
            onKeyDown={(e) => { if (/^\d$/.test(e.key)) e.preventDefault(); }}
            onChange={() => setErrors((prev) => ({ ...prev, full_name: undefined }))}
          />

          <input
            type="tel"
            name="phone"
            placeholder={t("TELEFONNUMMER*", "PHONE NUMBER*")}
            required
            className={`h-[48px] px-4 rounded-[3px] border ${errors.phone ? "border-red-500" : borderColor} ${textColor} text-[14px] outline-none ${placeholderColor}`}
            onKeyDown={(e) => {
              const controlKeys = ["Backspace","Delete","Tab","ArrowLeft","ArrowRight","Home","End"];
              if (!controlKeys.includes(e.key) && !/^[\d+\-() ]$/.test(e.key)) e.preventDefault();
            }}
            onChange={() => setErrors((prev) => ({ ...prev, phone: undefined }))}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <input
            type="email"
            name="email"
            placeholder={t("E-POST*", "E-MAIL*")}
            required
            className={`h-12 px-4 rounded-[3px] border ${errors.email ? "border-red-500" : borderColor} ${textColor} text-[14px] outline-none ${placeholderColor}`}
            onChange={() => setErrors((prev) => ({ ...prev, email: undefined }))}
          />


          <div className="relative w-full">
            <select
              name="area"
              required
              className={`w-full h-[48px] px-4 pr-10 rounded-[3px] border ${borderColor} ${textColor} text-[14px] outline-none appearance-none`}
            >
              <option value="" className={`text-black bg-white ${textColor}`}>
                {t("ÖNSKAD SPRÅKTJÄNST*", "AREA OF INTEREST*")}
              </option>
              <option value="Översättning" className={`text-black bg-white ${textColor}`}>{t("Översättning", "Translation")}</option>
              <option value="Granskning" className={`text-black bg-white ${textColor}`}>{t("Granskning", "Review")}</option>
              <option value="Annat" className={`text-black bg-white ${textColor}`}>{t("Annat", "Other ")}</option>
            </select>

            <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="6" viewBox="0 0 12 6" fill="none">
                <path d="M5.625 6L0.1125 0.6375C-0.0375 0.4875 -0.0375 0.25 0.1125 0.1125C0.2625 -0.0375 0.5 -0.0375 0.6375 0.1125L5.625 5.1L10.6125 0.1125C10.7625 -0.0375 11 -0.0375 11.1375 0.1125C11.2875 0.2625 11.2875 0.5 11.1375 0.6375L5.625 6Z" fill={isParentLight ? "#061837" : "white"}/>
              </svg>
            </span>
          </div>
        </div>

        <textarea
          name="message"
          placeholder={t("MEDDELANDE", "MESSAGE")}
          className={`w-full min-h-[105px] px-4 py-3 rounded-[3px] border ${borderColor} ${textColor} text-[14px] outline-none resize-none ${placeholderColor}`}
        />
      </div>}

      {/* ================= UPLOAD ================= */}
      {type === "company" && (
    <label className={`inline-flex items-center gap-3 h-[56px] px-[24px] mt-4 border border-dashed  border-${borderColor} ${textColor}  rounded-[3px] text-[13px] cursor-pointer  bg-white/[0.05] ${placeholderColor}`}>
  <input
    type="file"
    name="file"
    className="hidden"
    onChange={(e) => {
      if (e.target.files && e.target.files[0]) {
        setFileName(e.target.files[0].name);
      }
    }}
  />

  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="15" viewBox="0 0 16 15" fill="none"  >
    <path d="M7.98512 0C7.9785 0.000678357 7.97188 0.00135671 7.96526 0.0027136C7.95269 0.00339196 7.94078 0.00542721 7.92886 0.00678392C7.91629 0.00881916 7.90438 0.0115327 7.89247 0.0142463C7.88122 0.0162816 7.87063 0.0189952 7.85938 0.0223871C7.84747 0.0257793 7.83555 0.0298496 7.82298 0.0339199C7.81438 0.0379904 7.80511 0.0413824 7.79585 0.0454529C7.78129 0.0522368 7.76607 0.0596992 7.75217 0.0671617C7.74555 0.0705537 7.73959 0.0739456 7.73364 0.0780161C7.71842 0.0868353 7.70386 0.0970121 7.6893 0.107867C7.68533 0.111258 7.68136 0.11465 7.67672 0.118721C7.66349 0.129575 7.65025 0.141109 7.63702 0.153997C7.63371 0.156711 7.62974 0.159424 7.62576 0.162138L3.99514 3.88528H3.9958C3.79132 4.09558 3.79132 4.43547 3.9958 4.64509C4.20029 4.85471 4.53186 4.85471 4.73635 4.64509L7.4721 1.84466V10.541C7.4721 10.6842 7.5277 10.8212 7.6263 10.9223C7.72491 11.0234 7.85859 11.0797 7.99822 11.0797C8.1372 11.0797 8.27089 11.0234 8.36949 10.9223C8.46809 10.8212 8.52368 10.6842 8.52368 10.541V1.84466L11.2562 4.64509C11.3548 4.74617 11.4885 4.80316 11.6281 4.80316C11.7678 4.80316 11.9015 4.74618 12.0001 4.64509C12.2039 4.43547 12.2039 4.09558 12.0001 3.88528L8.38995 0.182631H8.38928C8.38266 0.175847 8.37605 0.169063 8.36877 0.162278V0.15753C8.35553 0.143962 8.34097 0.130393 8.32575 0.118183C8.32046 0.114112 8.31516 0.110042 8.30987 0.105971C8.29729 0.0964739 8.28472 0.0876544 8.27149 0.0801918C8.26354 0.0747646 8.25494 0.0700158 8.24634 0.0659453C8.23376 0.0591613 8.22119 0.0530558 8.20795 0.0469492C8.19869 0.0428789 8.18942 0.0388084 8.1795 0.0354164C8.16692 0.0306676 8.15369 0.0272756 8.14111 0.0232051C8.13052 0.0204917 8.11994 0.0177779 8.10935 0.0150645C8.09743 0.0123507 8.08618 0.0103157 8.07427 0.00828042C8.0617 0.00624518 8.04912 0.00488851 8.03655 0.00353162C8.0253 0.00285327 8.01339 0.00285322 8.00148 0.00285322C7.99684 0.00217487 7.99155 0.00217491 7.98692 0.00217491L7.98512 0ZM0.525466 9.03486C0.235609 9.03486 0.000660729 9.27501 0 9.57146V14.462C0 14.6052 0.0549286 14.7422 0.153535 14.8426C0.252141 14.9437 0.385824 15.0007 0.525458 15H15.4745C15.6142 15.0007 15.7479 14.9437 15.8465 14.8426C15.9451 14.7422 16 14.6052 16 14.462V9.57146C16 9.27501 15.7644 9.03416 15.4745 9.03486C15.1847 9.03486 14.9497 9.27501 14.9491 9.57146V13.9247H1.05088V9.57146C1.05022 9.27501 0.81534 9.03416 0.525466 9.03486Z" fill={isParentLight ? "#061837" : "white"} />
  </svg>

  <span className="uppercase tracking-widest truncate max-w-[240px]">
    {fileName ? fileName : t("LADDA UPP FIL", "Upload file")}
  </span>
</label>
      )}

      {/* ================= SUBMIT ================= */}
      <div className="mt-4">
        {Object.keys(errors).length > 0 && (
          <p className="text-red-500 text-[13px] mb-3">{Object.values(errors).find(Boolean)}</p>
        )}
        {type === "company" && (
          <button
            type="submit"
            disabled={loading}
            className="btn-primary cursor-pointer disabled:opacity-50"
          >
            {loading ? (lang === "sv" ? "Skickar..." : "Sending...") : t("SKICKA", "Submit")}
          </button>
        )}

        {status && (
          <p className="mt-2 text-[12px] text-white">{status}</p>
        )}
      </div>
    </form>
  );
}
