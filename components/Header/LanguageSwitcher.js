import Link from "next/link";
import { useRouter } from "next/router";
import { DEFAULT_LANG, wpToPath } from "../../lib/api";

function extractImgSrc(html) {
  if (!html || typeof html !== "string") return "";
  const match = html.match(/src="([^"]+)"/);
  return match ? match[1] : "";
}

const getLangCode = (l) => l.code || l.language_code || l.lang || "";

export default function LanguageSwitcher({ languages = [], translations = null }) {
  const router = useRouter();

  if (!languages.length) return null;

  const currentLocale = router.locale || DEFAULT_LANG;
  const otherLang = languages.find((l) => getLangCode(l) !== currentLocale);
  if (!otherLang) return null;

  const flagSrc =
    otherLang.country_flag_url ||
    otherLang.flag_url ||
    extractImgSrc(otherLang.flag_html) ||
    extractImgSrc(otherLang.flag);

  const otherLocale = getLangCode(otherLang);

  // Use the WPML translation URL if available.
  // If no translation exists for this content, go to the home page of the target locale
  // rather than applying the current slug (which only exists in the current language).
  const translationWpUrl = translations?.[otherLocale];
  let href = "/"; // default: home page of the target locale
  if (translationWpUrl) {
    // wpToPath gives e.g. "/en/services/ai-translation"
    // Strip the locale prefix because <Link locale={otherLocale}> re-adds it
    const raw = wpToPath(translationWpUrl);
    href = raw.replace(new RegExp(`^/${otherLocale}(?=/|$)`), "") || "/";
  }

  return (
    <div className="flex items-center">
      <Link
        href={href}
        locale={otherLocale}
        className="block w-6 h-6 rounded-full overflow-hidden cursor-pointer"
        aria-label={otherLang.native_name}
      >
        <img
          src={flagSrc}
          alt={otherLang.native_name}
          className="w-full h-full object-cover"
        />
      </Link>
    </div>
  );
}
