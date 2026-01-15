"use client";

// Homepage Sections
import HeroSection from "./sections/Homepage/HeroSection";
import AboutSection from "./sections/Homepage/AboutSection";
import FullWidthExpertsSection from "./sections/Homepage/FullWidthExpertsSection";
import CaseStudySection from "./sections/Homepage/CaseStudySection";
import DocumentTypeSection from "./sections/Homepage/DocumentTypeSection";
import WhyChooseUsSection from "./sections/Homepage/WhyChooseUsSection";
import InsightsSection from "./sections/Homepage/InsightsSection";
import ServicesSection from "./sections/Homepage/ServicesSection";

// Service Sections
import ServicesHeroSection from "./sections/Service/ServicesHeroSection";
import ServiceIntroFrontend from "./sections/Service/ServiceIntroSection";
import TranslationMethodsSection from "./sections/Service/TranslationMethodsSection";
import BenefitsSection from "./sections/Service/BenefitsSection";
import OurApproachSection from "./sections/Service/OurApproachSection";
import ContactSection from "./sections/Service/ContactSection";
import FaqSection from "./sections/Service/FaqSection";
import IndustriesSection from "./sections/Service/IndustriesSection";
import ServiceCaseStudySection from "./sections/Service/ServiceCaseStudySection";

/**
 * Normalize ACF image field
 */
const mediaOrNull = (img) => {
  if (!img) return null;
  if (typeof img === "string") return { url: img, alt: "" };
  if (img.url) return img;
  if (img.sizes?.medium) return { url: img.sizes.medium, alt: img.alt || "" };
  return null;
};

export default function SectionRenderer({ sections = [] }) {
  if (!Array.isArray(sections) || sections.length === 0) return null;

  return sections.map((block, index) => {
    const layout = block?.acf_fc_layout;

    switch (layout) {

      /* ===================== HOMEPAGE ===================== */

      case "hero_section":
        return (
          <HeroSection
            key={`hero-${index}`} // ✅ key added
            headline={block.heading}
            subheadline={block.subheading}
            button_text={block.button_text}
            button_link={block.button_link}
            background_image={mediaOrNull(block.background_image)}
          />
        );

      case "about_section":
        return (
          <AboutSection
            key={`about-${index}`} // ✅ key added
            section_label={block.section_label}
            heading={block.heading}
            description={block.description}
            button_text={block.button_text}
            button_link={block.button_link}
            image={mediaOrNull(block.image)}
          />
        );

      case "fullwidth_experts_section":
        return (
          <FullWidthExpertsSection
            key={`experts-${index}`} // ✅ key added
            background_image={mediaOrNull(block.background_image)}
            section_label={block.section_label}
            intro_paragraph={block.intro_paragraph}
            heading={block.heading}
            cta_button_text={block.cta_button_text}
            cta_button_link={block.cta_button_link}
          />
        );

      case "case_study_section":
        return (
          <CaseStudySection
            key={`case-${index}`} // ✅ key added
            section_title={block.section_title}
            heading={block.heading}
            paragraph={block.paragraph}
          />
        );

      case "document_types":
        return (
          <DocumentTypeSection
            key={`docs-${index}`} // ✅ key added
            section_title={block.section_title}
            heading={block.heading}
            paragraph={block.paragraph}
            button={block.button}
            button_url={block.button_url}
          />
        );

      case "why_choose_us":
        return (
          <WhyChooseUsSection
            key={`why-${index}`} // ✅ key added
            left_column={block.left_column}
            right_column={block.right_column}
          />
        );

      case "insights_section":
        return (
          <InsightsSection
            key={`insights-${index}`} // ✅ key added
            section_title={block.section_title}
            heading={block.heading}
            paragraph={block.paragraph}
            button={block.button}
          />
        );

      case "service_section":
        return (
          <ServicesSection
            key={`services-${index}`} // ✅ key added
            section_label={block.section_label}
            heading={block.heading}
            description={block.description}
          />
        );

      /* ===================== SERVICE PAGE ===================== */

      case "services_hero":
        return (
          <ServicesHeroSection
            key={`service-hero-${index}`} // ✅ key added
            {...block}
          />
        );

      case "service_intro":
        return (
          <ServiceIntroFrontend
            key={`service-intro-${index}`} // ✅ FIXED (THIS CAUSED WARNING)
            section={block}
          />
        );

      case "translation_methods":
        return (
          <TranslationMethodsSection
            key={`methods-${index}`} // ✅ key added
            section={block}
          />
        );

      case "benefits_section":
        return (
          <BenefitsSection
            key={`benefits-${index}`} // ✅ key already correct
            section={block}
          />
          
        );
        case "our_approach":
        return <OurApproachSection key={index} section={block} />;

        case "contact_section":
  return <ContactSection key={index} section={block} />;

  case "faq_section":
  return <FaqSection key={`faq-${index}`} section={block} />;
 case "industries":
            return (
              <IndustriesSection
                key={index}
                data={block}    
              />
            );
            
case "service_case_study":
  return (
    <ServiceCaseStudySection
      key={index}
      section_title={block.section_title}
      heading={block.heading}
      paragraph={block.paragraph}
    />
  );

      default:
        return null;
    }
  });
}
