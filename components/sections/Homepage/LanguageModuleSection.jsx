import { useEffect, useMemo, useRef, useState } from "react";
import DotIndicator from "../../ui/DotIndicator";
import { wpRestUrl } from "../../../lib/api";
import { getSectionBackground, isDarkSectionColor } from "../../../lib/sectionTheme";

const INITIAL_VISIBLE_COUNT = 18;

function html(value = "") {
  return { __html: value || "" };
}

function normalizeHeadingHtml(value = "") {
  const headingHtml = String(value)
    .replace(/&lt;em&gt;/gi, "<em>")
    .replace(/&lt;\/em&gt;/gi, "</em>");

  if (/<em[\s>]/i.test(headingHtml)) {
    return headingHtml;
  }

  return headingHtml
    .replace(/(över\s+40\s+språk)/i, "<em>$1</em>")
    .replace(/(40\+?\s+languages)/i, "<em>$1</em>")
    .replace(/(native[-–—]level expertise)/i, "<em>$1</em>");
}

function normalizeLanguages(data) {
  const list =
    Array.isArray(data)
      ? data
      : Array.isArray(data?.list_of_languages)
        ? data.list_of_languages
        : Array.isArray(data?.list_of_langauages)
          ? data.list_of_langauages
          : Array.isArray(data?.languages)
            ? data.languages
            : [];

  return list
    .map((item) => {
      if (typeof item === "string") return { name: item };
      return { name: item?.name || item?.language || item?.title || "" };
    })
    .filter((item) => item.name);
}

export default function LanguageModuleSection({
  section,
  sectionId,
  initialLanguages = [],
  lang = "sv",
}) {
  const sectionRef = useRef(null);
  const [expanded, setExpanded] = useState(false);
  const [loadedLanguages, setLoadedLanguages] = useState(initialLanguages);

  if (!section) return null;

  const {
    select_theme = "#E3EDFF",
    section_label,
    heading,
    description,
    read_more_button = "View more languages",
    read_less_button = "View fewer languages",
    list_of_languages,
    list_of_langauages,
    languages: sectionLanguages,
  } = section;

  const fallbackLanguages = normalizeLanguages(
    Array.isArray(list_of_languages) && list_of_languages.length
      ? list_of_languages
      : Array.isArray(list_of_langauages) && list_of_langauages.length
        ? list_of_langauages
        : sectionLanguages
  );

  useEffect(() => {
    setLoadedLanguages(initialLanguages);
  }, [initialLanguages]);

  useEffect(() => {
    if (loadedLanguages.length > 0) return;

    let cancelled = false;
    fetch(wpRestUrl(`theme/v1/languages?lang=${encodeURIComponent(lang)}`))
      .then((response) => (response.ok ? response.json() : []))
      .then((data) => {
        if (!cancelled) setLoadedLanguages(normalizeLanguages(data));
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [lang, loadedLanguages.length]);

  const languages = useMemo(() => {
    if (Array.isArray(loadedLanguages) && loadedLanguages.length) {
      return loadedLanguages;
    }

    return fallbackLanguages;
  }, [fallbackLanguages, loadedLanguages]);
  const visibleLanguages = expanded
    ? languages
    : languages.slice(0, INITIAL_VISIBLE_COUNT);
  const hasMore = languages.length > INITIAL_VISIBLE_COUNT;
  const sectionBackground = getSectionBackground(select_theme);
  const isDark = isDarkSectionColor(select_theme);
  const textColor = isDark ? "text-white" : "text-[#061837]";
  const bodyColor = isDark ? "text-white/85" : "text-[#061837]";
  const rowBorder = isDark ? "border-[#5C83DD]/50" : "border-[#5C83DD]";
  const fadeColor = isDark ? "rgba(6, 24, 55, 0.68)" : "rgba(227, 237, 255, 0.68)";

  function getFadeClass(index) {
    if (expanded || !hasMore) return "";
    if (index >= INITIAL_VISIBLE_COUNT - 3) return "opacity-45";
    if (index >= INITIAL_VISIBLE_COUNT - 6) return "opacity-55";
    if (index >= INITIAL_VISIBLE_COUNT - 9) return "opacity-65";
    return "";
  }

  function handleToggle() {
    setExpanded((value) => {
      const nextValue = !value;

      if (value) {
        window.requestAnimationFrame(() => {
          sectionRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        });
      }

      return nextValue;
    });
  }

  return (
    <section
      ref={sectionRef}
      id={sectionId}
      className="w-full py-[56px] md:py-[72px] lg:py-[84px]"
      style={{ backgroundColor: sectionBackground }}
    >
      <div className="web-width mx-auto px-6 md:px-0">
        <div className="grid grid-cols-1 gap-7 lg:grid-cols-[15%_1fr] lg:gap-0">
          <div>
            {section_label && (
              <div className="flex items-center gap-2 lg:hidden">
                <DotIndicator variant={isDark ? "white" : "default"} />
                <span className={`uppercase font-montserrat font-medium text-[10px] tracking-wider ${textColor}`}>
                  {section_label}
                </span>
              </div>
            )}
          </div>

          <div className="max-w-[1090px]">
            {heading && (
              <div
                className={`language-module-heading font-heading text-[28px] sm:text-[40px] md:text-[48px] font-semibold leading-[1.15] md:leading-[58px] mb-5 max-w-[760px] ${textColor} [&_em]:!italic [&_em]:font-semibold [&_em]:text-[#2655C4] [&_p]:m-0 [&_h1]:m-0 [&_h2]:m-0 [&_h3]:m-0 [&_p]:text-[inherit] [&_h1]:text-[inherit] [&_h2]:text-[inherit] [&_h3]:text-[inherit] [&_p]:leading-[inherit] [&_h1]:leading-[inherit] [&_h2]:leading-[inherit] [&_h3]:leading-[inherit]`}
                dangerouslySetInnerHTML={html(normalizeHeadingHtml(heading))}
              />
            )}

            {description && (
                         <div
                className={`font-cabin text-[14px] md:text-[16px] leading-[24px] max-w-[600px] mb-8 ${bodyColor} [&_p]:mb-3 last:[&_p]:mb-0`}
                dangerouslySetInnerHTML={html(description)}
              />
            )}

            {languages.length > 0 && (
              <>
                <div className="relative">
                  <div
                    className={`grid grid-cols-1 md:grid-cols-[repeat(2,342px)] lg:grid-cols-[repeat(3,342px)] gap-x-8 overflow-hidden transition-[max-height] duration-700 ease-in-out ${
                      expanded ? "max-h-[3200px]" : "max-h-[1060px] md:max-h-[540px] lg:max-h-[370px]"
                    }`}
                  >
                    {visibleLanguages.map((item, index) => {
                      const name = item?.name || "";
                      const firstRowBorder =
                        index === 0
                          ? "border-t-0"
                          : index === 1
                            ? "md:border-t-0"
                            : index === 2
                              ? "lg:border-t-0"
                              : "";
                      const lastRowBorder = [
                        index === visibleLanguages.length - 1
                          ? "border-b border-dashed"
                          : "",
                        index >= Math.floor((visibleLanguages.length - 1) / 2) * 2
                          ? "md:border-b md:border-dashed"
                          : "md:border-b-0",
                        index >= Math.floor((visibleLanguages.length - 1) / 3) * 3
                          ? "lg:border-b lg:border-dashed"
                          : "lg:border-b-0",
                      ].join(" ");

                      return (
                        <div
                          key={`${name}-${index}`}
                          className={`flex items-center gap-4 border-t border-dashed py-4 ${rowBorder} ${firstRowBorder} ${lastRowBorder} ${getFadeClass(index)}`}
                        >
                          <div className="w-[28px] h-[28px] shrink-0 rounded-full bg-[#2655C4] flex items-center justify-center text-white text-[11px] font-semibold">
                            {index + 1}
                          </div>
                          <span className={`font-cabin text-[16px] italic leading-[24px] ${bodyColor}`}>
                            {name}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {!expanded && hasMore && (
                    <div
                      className="pointer-events-none absolute inset-x-0 bottom-0 h-[120px]"
                      style={{
                        background: `linear-gradient(180deg, rgba(227, 237, 255, 0) 0%, ${fadeColor} 100%)`,
                      }}
                    />
                  )}
                </div>

                {hasMore && (
                  <div className="mt-[40px] flex justify-center">
                    <button
                      type="button"
                      onClick={handleToggle}
                      className="btn-primary inline-flex items-center gap-2"
                    >
                      {expanded ? read_less_button : read_more_button}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        :global(.language-module-heading em) {
          color: #2655C4;
          font-family: var(--font-merriweather), serif !important;
          font-style: italic !important;
          font-weight: 600;
          line-height: inherit;
        }
      `}</style>
    </section>
  );
}
