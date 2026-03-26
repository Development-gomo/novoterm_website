import React, { useRef, useState, useEffect } from "react";

// Helper to get language from <html lang="..."> or default to 'en'
function getLang() {
  if (typeof document !== 'undefined') {
    return document.documentElement.lang?.toLowerCase() || 'en';
  }
  return 'en';
}

// Max height for collapsed content (in px)
const COLLAPSED_HEIGHT = 300;
const SCROLL_DURATION = 2000; // ms

export default function ReadMoreContent({ html, textColor }) {
  const contentRef = useRef(null);
  const [expanded, setExpanded] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const [lang, setLang] = useState('en');

  useEffect(() => {
    setLang(getLang());
  }, []);

  useEffect(() => {
    if (contentRef.current) {
      setShowButton(contentRef.current.scrollHeight > COLLAPSED_HEIGHT + 10);
    }
  }, [html]);

  // Smooth scroll to content on expand/collapse
  const handleToggle = () => {
    if (!expanded) {
      setExpanded(true);
      setTimeout(() => {
        if (contentRef.current) {
          contentRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 10);
    } else {
      setExpanded(false);
      setTimeout(() => {
        if (contentRef.current) {
          contentRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 10);
    }
  };

  // Button text by language
  const btnText = expanded
    ? (lang === 'sv' ? 'Läs mindre' : 'Read less')
    : (lang === 'sv' ? 'Läs mer' : 'Read more');

  return (
    <>
      <div
        ref={contentRef}
        className={`font-body text-[14px] sm:text-[15px] md:text-[16px] leading-[1.6] md:leading-[1.7] mb-6 [&_em]:text-[#2655C4] [&_a]:text-[#2655C4] [&_a]:underline [&_h2]:font-heading [&_h2]:font-semibold [&_h2]:text-[22px] [&_h2]:md:text-[26px] [&_h2]:leading-snug [&_h2]:mb-3 [&_h3]:font-heading [&_h3]:font-semibold [&_h3]:text-[18px] [&_h3]:md:text-[22px] [&_h3]:leading-snug [&_h3]:mb-3 [&_h4]:font-heading [&_h4]:font-semibold [&_h4]:text-[16px] [&_h4]:md:text-[18px] [&_h4]:mb-2 [&_p]:mb-4 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-4 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-4 [&_li]:mb-1 [&_strong]:font-semibold [&_br]:block ${textColor} ${!expanded && showButton ? "max-h-[220px] overflow-hidden relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-12 " : ""}`}
        style={{ position: "relative", transition: `max-height ${SCROLL_DURATION}ms` }}
        dangerouslySetInnerHTML={{ __html: html }}
      />
      {showButton && (
        <button
          className="btn-primary mb-2 focus:outline-none"
          onClick={handleToggle}
          type="button"
        >
          {btnText}
        </button>
      )}
    </>
  );
}