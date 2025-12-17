import Link from "next/link";

// Extract src="..." from HTML string
function extractImgSrc(html) {
  if (!html || typeof html !== "string") return "";
  const match = html.match(/src="([^"]+)"/);
  return match ? match[1] : "";
}

export default function LanguageSwitcher({ languages = [] }) {
  if (!languages.length) return null;

  const currentPath =
    typeof window !== "undefined" ? window.location.pathname : "/";

  const isEnglish = currentPath.startsWith("/en");

  const langEN = languages.find((l) => l.code === "en");
  const langSV = languages.find((l) => l.code === "sv");

  const langToShow = isEnglish ? langSV : langEN;

  if (!langToShow) return null;

  const flagSrc =
    langToShow.country_flag_url ||
    langToShow.flag_url ||
    extractImgSrc(langToShow.flag_html) ||
    extractImgSrc(langToShow.flag);

  function getURL(lang) {
    return lang.code === "en"
      ? "/en" + currentPath.replace("/en", "")
      : currentPath.replace("/en", "");
  }

  return (
    <div className="flex items-center">
      <Link href={getURL(langToShow)}>
        <img
          src={flagSrc}
          className="h-5 w-auto border border-gray-600 rounded cursor-pointer"
          alt={langToShow.native_name}
        />
      </Link>
    </div>
  );
}
