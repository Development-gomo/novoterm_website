// components/SectionRenderer.js
"use client";

import HeroSection from "./sections/HeroSection";
import FeatureRows from "./sections/FeatureRows";
import EarningsCalculator from "./sections/EarningsCalculator";

/* ---------- helpers ---------- */
const mediaOrNull = (img) => {
  if (!img) return null;
  if (typeof img === "string") return { url: img, alt: "" };
  if (img.url) return img; // ACF array/object
  if (img.sizes?.medium) return { url: img.sizes.medium, alt: img.alt || "" };
  return null;
};
const numOrUndef = (n) => (typeof n === "number" && !Number.isNaN(n) ? n : undefined);

/* ---------- renderer ---------- */
export default function SectionRenderer({ sections = [] }) {
  if (!Array.isArray(sections) || sections.length === 0) return null;

  return sections.map((block, i) => {
    const layout = block?.acf_fc_layout;

    if (process.env.NODE_ENV !== "production") {
      console.debug("[SectionRenderer] block", i, layout, block);
    }

    switch (layout) {
      /* ===== HERO ===== */
      case "hero_section":
        return (
          <HeroSection
            key={`hero-${i}`}
            headline={block.headline}
            subheadline={block.subheadline}
            cta_text={block.cta_text}
            cta_link={block.cta_link}
            main_mockup={mediaOrNull(block.main_mockup)}
            stats_image={mediaOrNull(block.stats_image)}
            testimonial_image={mediaOrNull(block.testimonial_image)}
            bg_shape_left={mediaOrNull(block.bg_shape_left)}
            bg_shape_right={mediaOrNull(block.bg_shape_right)}
            bg_shape_extra={mediaOrNull(block.bg_shape_extra)}
          />
        );

      /* ===== FEATURE ROWS ===== */
      case "feature_rows":
        return <FeatureRows key={`fr-${i}`} acfLayout={block} />;

      /* ===== SERVICES (via shortcode page) ===== */
      case "services_section":
      case "services_slider_section":
        return (
          <ServicesSectionFromShortcode
            key={`services-${i}`}
            pill={block.label_pill}
            heading={block.title}
            wpBase={process.env.NEXT_PUBLIC_WP_URL}
            shortcodePageSlug={block.shortcode_page_slug || "services-slider-embed"}
          />
        );

      /* ===== EARNINGS CALCULATOR (ACF) ===== */
      case "earnings_calculator":
      case "earnings_calculator_section":
      case "calculator_section":
      case "calc_section": {
        if (block?.calc_enable === false) return null;

        // CPM map from repeater (label → cpm)
        const cpmMap =
          Array.isArray(block?.calc_regions) && block.calc_regions.length
            ? Object.fromEntries(
                block.calc_regions
                  .map((r) => [r?.label, Number(r?.cpm)])
                  .filter(([label, cpm]) => label && !Number.isNaN(cpm))
              )
            : undefined; // falls back to component defaults

        // Initial slider values
        const initial = {
          visitors: numOrUndef(block?.calc_visitors?.default),
          pageviews: numOrUndef(block?.calc_pageviews?.default),
          adsPerPage: numOrUndef(block?.calc_ads?.default),
          // region default can be added if you add a field in ACF
        };

        return (
          <EarningsCalculator
            key={`calc-${i}`}
            initial={initial}
            cpmMap={cpmMap}
            pill={block?.calc_pill}
            title={block?.calc_heading}
            subtitle={block?.calc_sub_heading}
            image={mediaOrNull(block?.calc_image)} // Image under CTA
            ctaText={block?.calc_cta_text || "Get Started"}
            ctaLink={block?.calc_cta_link || "#"}
          />
        );
      }

      /* ===== UNKNOWN ===== */
      default:
        if (process.env.NODE_ENV !== "production") {
          return (
            <div
              key={`unknown-${i}`}
              className="my-4 rounded-lg border border-dashed border-amber-400 bg-amber-50 p-4 text-amber-800"
            >
              Unknown layout: <code className="font-mono">{String(layout)}</code>
            </div>
          );
        }
        return null;
    }
  });
}
