import { useState, useEffect } from "react";
import DotIndicator from "./ui/DotIndicator";

// Detect if a background color is dark by checking luminance
const isDarkBackground = (element) => {
  if (!element) return false;
  const bg = window.getComputedStyle(element).backgroundColor;
  const match = bg.match(/\d+/g);
  if (!match || match.length < 3) return false;
  const [r, g, b] = match.map(Number);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance < 0.5;
};

// Convert acf_fc_layout to readable label
// e.g. "industry_special_heading" → "Special Heading"
const formatLabel = (layout) => {
  if (!layout) return null;
  return layout
    .replace(/_section$/, '')
    .replace(/^industry_/, '')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
};

const isHeroSection = (layout) => /hero/i.test(layout);
const EXCLUDED_FROM_NAV = ["number_documents_examples"];

export default function StickyIndustryNav({ sections = [], heroLayout = null }) {
  const [activeSection, setActiveSection] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isDark, setIsDark] = useState(false);

  // Build nav items — extract section_label from right_column for inner_why_choose_us if needed
  const navItems = sections
    .map((section, index) => {
      let label = section.section_label;
      if (!label && section.acf_fc_layout === 'inner_why_choose_us') {
        label = section.right_column?.section_label;
      }
      return {
        label,
        acf_fc_layout: section.acf_fc_layout,
        index,
      };
    })
    .filter((item) => item.label && !isHeroSection(item.acf_fc_layout) && !EXCLUDED_FROM_NAV.includes(item.acf_fc_layout));

  useEffect(() => {
    const handleScroll = () => {
      // -- Visibility: hide while hero is still visible --
      const firstSection = document.getElementById(`section-0`);
      if (firstSection && isHeroSection(sections[0]?.acf_fc_layout)) {
        const rect = firstSection.getBoundingClientRect();
        if (rect.bottom > 0) {
          setIsVisible(false);
          return;
        }
      }

      // Hide when approaching footer
      const footer = document.querySelector('footer');
      if (footer) {
        const footerRect = footer.getBoundingClientRect();
        if (footerRect.top < window.innerHeight * 0.5) {
          setIsVisible(false);
          return;
        }
      }

      setIsVisible(true);

      // -- Active section tracking --
      const sectionElements = navItems.map((item) =>
        document.getElementById(`section-${item.index}`)
      );

      let currentIndex = 0;

      sectionElements.forEach((element, index) => {
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 120) {
            currentIndex = index;
          }
        }
      });

      setActiveSection(currentIndex);

      // -- Detect dark/light from active section's background --
      const activeEl = sectionElements[currentIndex];
      setIsDark(isDarkBackground(activeEl));
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [navItems.length]);

  const scrollToSection = (index) => {
    const element = document.getElementById(`section-${index}`);
    if (element) {
      const offset = 100;
      const offsetPosition =
        element.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    }
  };

  if (navItems.length === 0) return null;

  const STICKY_START = 120;
  const LABEL_HEIGHT = 40;

  return (
    <div
      className={`hidden lg:block fixed left-0 top-0 w-full pointer-events-none transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      style={{ zIndex: 40 }}
    >
      <div className="web-width mx-auto px-6 md:px-0 relative">
        {navItems.map((item, idx) => {
          const isActive = activeSection === idx;
          const stickyTop = STICKY_START + idx * LABEL_HEIGHT;

          return (
            <div
              key={idx}
              className="pointer-events-auto absolute w-[15%]"
              style={{ top: `${stickyTop}px`, zIndex: 10 + idx }}
            >
              <button
                onClick={() => scrollToSection(item.index)}
                className={`flex items-center gap-3 transition-all duration-300 cursor-pointer ${
                  isActive ? "opacity-100" : "opacity-40 hover:opacity-70"
                }`}
              >
                <DotIndicator
                  variant={isActive ? (isDark ? "white" : "blue") : "gray"}
                />
                <span
                  className={`uppercase font-montserrat font-medium text-[10px] sm:text-[10px] md:text-[12px] tracking-wider transition-all duration-300 ${
                    isActive
                      ? isDark
                        ? "text-white"
                        : "text-[#061837]"
                      : isDark
                      ? "text-gray-400"
                      : "text-gray-500"
                  }`}
                >
                  {item.label}
                </span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
