"use client";

/* ===================== HOMEPAGE ===================== */
import HeroSection from "./sections/Homepage/HeroSection";
import AboutSection from "./sections/Homepage/AboutSection";
import FullWidthExpertsSection from "./sections/Homepage/FullWidthExpertsSection";
import CaseStudySection from "./sections/Homepage/CaseStudySection";
import DocumentTypeSection from "./sections/Homepage/DocumentTypeSection";
import WhyChooseUsSection from "./sections/Homepage/WhyChooseUsSection";
import InsightsSection from "./sections/Homepage/InsightsSection";
import ServicesSection from "./sections/Homepage/ServicesSection";

/* ===================== SERVICE PAGE ===================== */
import ServicesHeroSection from "./sections/Service/ServicesHeroSection";
import ServiceIntroFrontend from "./sections/Service/ServiceIntroSection";
import TranslationMethodsSection from "./sections/Service/TranslationMethodsSection";
import BenefitsSection from "./sections/Service/BenefitsSection";
import OurApproachSection from "./sections/Service/OurApproachSection";
import ContactSection from "./sections/Service/ContactSection";
import FaqSection from "./sections/Service/FaqSection";
import IndustriesSection from "./sections/Service/IndustriesSection";

/* ===================== CASE STUDY PAGE ===================== */
import CaseStudyHeroSection from "./sections/CaseStudy/CaseStudyHeroSection";
import CaseStudyIntroductionSection from "./sections/CaseStudy/CaseStudyIntroductionSection";
import CaseStudyChallengeSection from "./sections/CaseStudy/CaseStudyChallengeSection";
import CaseStudySolutionSection from "./sections/CaseStudy/CaseStudySolutionSection";
import CaseStudyResultsSection from "./sections/CaseStudy/CaseStudyResultsSection";
import CaseStudyTestimonialSection from "./sections/CaseStudy/CaseStudyTestimonialSection";
import CaseStudyRelatedSection from "./sections/CaseStudy/CaseStudyRelatedSection";

/* ===================== ABOUT US PAGE ===================== */
import AboutHeroSection from "./sections/AboutUs/AboutHeroSection";
import TeamSection from "./sections/AboutUs/TeamSection";
import PhilosophySection from "./sections/AboutUs/PhilosophySection";
import LeadershipMessageSection from "./sections/AboutUs/LeadershipMessageSection";
import HistorySection from "./sections/AboutUs/HistorySection";
import ExpertsCTASection from "./sections/AboutUs/ExpertsCTASection";






/* ===================== HELPERS ===================== */
const mediaOrNull = (img) => {
  if (!img) return null;
  if (typeof img === "string") return { url: img, alt: "" };
  if (img.url) return img;
  if (img.sizes?.medium)
    return { url: img.sizes.medium, alt: img.alt || "" };
  return null;
};

export default function SectionRenderer({ sections = [], currentSlug  }) {
  if (!Array.isArray(sections) || sections.length === 0) return null;

  return sections.map((block, index) => {
    const layout = block?.acf_fc_layout;

    switch (layout) {

      /* ===================== HOMEPAGE ===================== */
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

      case "case_study_section":
        return (
          <CaseStudySection
            key={`case-${index}`}
            section_title={block.section_title}
            heading={block.heading}
            paragraph={block.paragraph}
          />
        );

      case "document_types":
        return (
          <DocumentTypeSection
            key={`docs-${index}`}
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
            key={`why-${index}`}
            left_column={block.left_column}
            right_column={block.right_column}
          />
        );

      case "insights_section":
        return (
          <InsightsSection
            key={`insights-${index}`}
            section_title={block.section_title}
            heading={block.heading}
            paragraph={block.paragraph}
            button={block.button}
          />
        );

      case "service_section":
        return (
          <ServicesSection
            key={`services-${index}`}
            section_label={block.section_label}
            heading={block.heading}
            description={block.description}
          />
        );

      /* ===================== SERVICE PAGE ===================== */
      case "services_hero":
        return <ServicesHeroSection key={index} {...block} />;

      case "service_intro":
        return <ServiceIntroFrontend key={index} section={block} />;

      case "translation_methods":
        return <TranslationMethodsSection key={index} section={block} />;

      case "benefits_section":
        return <BenefitsSection key={index} section={block} />;

      case "our_approach":
        return <OurApproachSection key={index} section={block} />;

      case "contact_section":
        return <ContactSection key={index} section={block} />;

      case "faq_section":
        return <FaqSection key={index} section={block} />;

      case "industries":
        return <IndustriesSection key={index} data={block} />;

      /* ===================== CASE STUDY PAGE ===================== */
      case "casestudy_hero":
        return (
          <CaseStudyHeroSection
            key={`cs-hero-${index}`}
            section={block}
          />
        );

        case "casestudy_introduction":
          return (
            <CaseStudyIntroductionSection
              key={`cs-intro-${index}`}
              section={block}
            />
          ); 

          case "casestudy_challenge":
          return (
            <CaseStudyChallengeSection
              key={`cs-challenge-${index}`}
              section={block}
            />
          );
          
          case "casestudy_solution":
          return (
            <CaseStudySolutionSection
              key={`cs-solution-${index}`}
              section={block}
            />
          );

            case "casestudy_results":
          return <CaseStudyResultsSection key={`cs-results-${index}`} section={block} />;

          case "casestudy_testimonial":
          return <CaseStudyTestimonialSection key={`cs-testimonial-${index}`} section={block} />;

          case "casestudy_related":
        return (
          <CaseStudyRelatedSection
            key={`cs-related-${index}`}
            section={block}
            currentSlug={currentSlug}
          />
        );

        // About us page sections can be added here similarly
        case "about_hero":
        return (
          <AboutHeroSection
            key={`about-hero-${index}`}
            section={block}
          />
        );

        case "philosophy_section":
  return (
    <PhilosophySection
      key={`philosophy-${index}`}
      section={block}
    />
  );     
          case "team_section":
  return (
    <TeamSection
      key={`team-${index}`}
      section={block}
    />
  );

      case "leadership_message":
  return (
    <LeadershipMessageSection
      key={`leader-${index}`}
      section={block}
    />
  );

      case "history_section":
  return (
    <HistorySection
      key={`history-${index}`}
      section={block}
    />
  );
  
  case "experts_cta_section":
  return (
    <ExpertsCTASection
      key={`experts-cta-${index}`}
      section={block}
    />
  );




      default:
        return null;
    }
  });
}
