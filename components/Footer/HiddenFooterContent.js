import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { DEFAULT_LANG, wpToPath } from "../../lib/api";

function getLinkUrl(value) {
  if (!value) return "";
  if (Array.isArray(value)) return getLinkUrl(value[0]);
  if (typeof value === "string") return value;
  return value.url || value.href || value.link || "";
}

function getLinkTitle(value) {
  if (!value || typeof value === "string") return "";
  if (Array.isArray(value)) return getLinkTitle(value[0]);
  return value.title || "";
}

function getLinkTarget(value) {
  if (!value || typeof value === "string") return undefined;
  return value.target || undefined;
}

function getImageUrl(value) {
  if (!value) return "";
  if (typeof value === "string") return value;
  return value.url || value.source_url || value.sizes?.thumbnail || value.sizes?.medium || "";
}

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function hasStructuredContent(data) {
  if (!data || typeof data !== "object") return false;
  return Boolean(
    data.heading ||
      data.cta_text ||
      getLinkUrl(data.cta_url) ||
      data.bottom_footer_text ||
      asArray(data.social_media_links).length ||
      asArray(data.footer_column).length
  );
}

export default function HiddenFooterContent({ data }) {
  const router = useRouter();
  const lang = router?.locale || DEFAULT_LANG;

  if (typeof data === "string") {
    const text = data.trim();
    if (!text) return null;

    return (
      <div className="w-full border-t border-[#2D4B83] bg-[#061837] px-6 py-3 text-center font-montserrat text-[12px] leading-relaxed text-white/70">
        {text}
      </div>
    );
  }

  if (!hasStructuredContent(data)) return null;

  const ctaUrl = getLinkUrl(data.cta_url);
  const ctaTarget = getLinkTarget(data.cta_url);
  const ctaText = data.cta_text || getLinkTitle(data.cta_url);
  const socialLinks = asArray(data.social_media_links).filter((item) => getLinkUrl(item?.url));
  const footerColumns = asArray(data.footer_column).filter(
    (column) => column?.column_name || asArray(column?.column_items).length
  );

  return (
    <footer className="w-full border-t border-[#1B3358] bg-[#061837] text-white">
      <div className="web-width mx-auto px-6 py-[30px] md:px-0 md:py-[38px] lg:py-[46px]">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-9">
          <div className="min-w-0">
            {data.heading && (
              <h2 className="max-w-none text-[32px] font-semibold leading-[1.18] text-white md:text-[40px] lg:whitespace-nowrap lg:text-[40px] xl:text-[42px]">
                {data.heading}
              </h2>
            )}

            {(ctaText || socialLinks.length > 0) && (
              <div className="mt-7 flex flex-wrap items-center gap-4">
                {ctaText && ctaUrl && (
                  <Link
                    href={wpToPath(ctaUrl, lang)}
                    target={ctaTarget}
                    rel={ctaTarget === "_blank" ? "noopener noreferrer" : undefined}
                    className="btn-primary"
                  >
                    {ctaText}
                  </Link>
                )}

                {socialLinks.length > 0 && (
                  <div className="flex flex-wrap items-center gap-3">
                    {socialLinks.map((item, index) => {
                      const url = getLinkUrl(item.url);
                      const target = getLinkTarget(item.url) || "_blank";
                      const iconUrl = getImageUrl(item.icon);
                      const label = getLinkTitle(item.url) || "Social media";

                      return (
                        <a
                          key={`${url}-${index}`}
                          href={url}
                          target={target}
                          rel={target === "_blank" ? "noopener noreferrer" : undefined}
                          aria-label={label}
                          className="flex h-[48px] w-[48px] items-center justify-center rounded-[6px] bg-white transition hover:bg-white/85"
                        >
                          {iconUrl ? (
                            <Image
                              src={iconUrl}
                              alt=""
                              width={22}
                              height={22}
                              className="h-[22px] w-[22px] object-contain"
                            />
                          ) : (
                            <span className="text-[15px] font-semibold text-[#315EEA]">
                              {label.charAt(0)}
                            </span>
                          )}
                        </a>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>

          {footerColumns.length > 0 && (
            <div className="grid min-w-0 gap-7 border-t border-white/10 pt-8 sm:grid-cols-2 lg:grid-cols-[minmax(0,1.8fr)_minmax(0,0.99fr)_minmax(0,0.9fr)] lg:border-l lg:border-t-0 lg:gap-7 lg:pl-9 lg:pt-3">
              {footerColumns.map((column, index) => (
                <div key={`${column.column_name || "column"}-${index}`} className="min-w-0">
                  {column.column_name && (
                    <p className="mb-4 text-[13px] font-semibold uppercase tracking-[0.07em] text-[#6F91FF]">
                      {column.column_name}
                    </p>
                  )}

                  <ul className="space-y-2">
                    {asArray(column.column_items).map((item, itemIndex) => {
                      const itemUrl = getLinkUrl(item?.link);
                      const itemName = item?.name || getLinkTitle(item?.link);
                      if (!itemName) return null;

                      return (
                        <li key={`${itemName}-${itemIndex}`}>
                          {itemUrl ? (
                            <Link
                              href={wpToPath(itemUrl, lang)}
                              className="text-[16px] leading-[1.55] text-white transition hover:text-[#6F91FF]"
                            >
                              {itemName}
                            </Link>
                          ) : (
                            <span className="text-[16px] leading-[1.55] text-white">
                              {itemName}
                            </span>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </footer>
  );
}
