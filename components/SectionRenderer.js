"use client";

import HeroSection from "./sections/HeroSection";
import AboutSection from "./sections/AboutSection";
import FullWidthExpertsSection from "./sections/FullWidthExpertsSection";
import CaseStudySection from "./sections/CaseStudySection";
import DocumentTypeSection from "./sections/DocumentTypeSection";
import WhyChooseUsSection from "./sections/WhyChooseUsSection";
import InsightsSection from "./sections/InsightsSection";


/**
 * Normalize ACF image field
 */
const mediaOrNull = (img) => {
  if (!img) return null;

  if (typeof img === "string") {
    return { url: img, alt: "" };
  }

  if (img.url) return img;

  if (img.sizes?.medium) {
    return { url: img.sizes.medium, alt: img.alt || "" };
  }

  return null;
};

export default function SectionRenderer({ sections = [] }) {
 
  if (!Array.isArray(sections) || sections.length === 0) return null;

  return sections.map((block, index) => {
    const layout = block?.acf_fc_layout;

    switch (layout) {

      // -------------------------------------
      // HERO SECTION
      // -------------------------------------
      case "hero_section":
        return (
          <HeroSection
            key={`hero-${index}`}
            headline={block.heading}
            subheadline={block.subheading}
            button_text={block.button_text}
            button_link={block.button_link}
            background_image={mediaOrNull(block.background_image)}
          />
        );

      // -------------------------------------
      // ABOUT SECTION
      // -------------------------------------
      case "about_section":
        return (
          <AboutSection
            key={`about-${index}`}
            section_label={block.section_label}
            heading={block.heading}
            description={block.description}
            button_text={block.button_text}
            button_link={block.button_link}
            image={mediaOrNull(block.image)}
          />
        );

      // -------------------------------------
      // FULL WIDTH EXPERTS
      // -------------------------------------
      case "fullwidth_experts_section":
        return (
          <FullWidthExpertsSection
            key={`experts-${index}`}
            background_image={mediaOrNull(block.background_image)}
            section_label={block.section_label}
            intro_paragraph={block.intro_paragraph}
            heading={block.heading}
            cta_button_text={block.cta_button_text}
            cta_button_link={block.cta_button_link}
          />
        );


      // -------------------------------------
      // CASE STUDY SECTION
      // -------------------------------------

      case "case_study_section":
        return (
          <CaseStudySection
            key={index}
            section_title={block.section_title}
            heading={block.heading}
            paragraph={block.paragraph}
            
          />
        );

      // -------------------------------------
      // DOCUMENT TYPE SECTION
      // -------------------------------------

      case "document_types":
        return (
          <DocumentTypeSection
            key={index}
            section_title={block.section_title}
            heading={block.heading}
            paragraph={block.paragraph}
            button={block.button}
            button_url={block.button_url}
          />
        );

      // -------------------------------------
      // WHY CHOOSE US SECTION
      // -------------------------------------

       case "why_choose_us":   // MUST MATCH ACF LAYOUT NAME ✔️
        return (
          <WhyChooseUsSection
            key={index}
            left_column={block.left_column}
            right_column={block.right_column}
          />
        );

      // -------------------------------------
      // insights SECTION
      // -------------------------------------

case "insights_section":
  return (
    <InsightsSection
      key={index}
      section_title={block.section_title}
      heading={block.heading}
      paragraph={block.paragraph}
      button={block.button}
    />
  );



      // -------------------------------------
      // FALLBACK
      // -------------------------------------
      // default:
      //   return (
      //     <div key={`unknown-${index}`} className="p-6 text-red-600">
      //       Unknown layout: {layout}
      //     </div>
      //   );
    }
  });
}
