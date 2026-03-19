
/* ===================== HOMEPAGE ===================== */
import HeroSection from "./sections/Homepage/HeroSection";
import AboutSection from "./sections/Homepage/AboutSection";
import FullWidthExpertsSection from "./sections/Homepage/FullWidthExpertsSection";
import CaseStudySection from "./sections/Homepage/CaseStudySection";
import DocumentTypeSection from "./sections/Homepage/DocumentTypeSection";
import WhyChooseUsSection from "./sections/Homepage/WhyChooseUsSection";
import InsightsSection from "./sections/Homepage/InsightsSection";
import ServicesSection from "./sections/Homepage/ServicesSection";
import HomepageFaqSection from "./sections/Homepage/FaqSection";
import ArticlesSection from "./sections/Homepage/ArticlesSection";
import FullContentSection from "./sections/Homepage/FullContentSection";


/* ===================== SERVICE PAGE ===================== */
import ServicesHeroSection from "./sections/Service/ServicesHeroSection";
import ServiceIntroFrontend from "./sections/Service/ServiceIntroSection";
import TranslationMethodsSection from "./sections/Service/TranslationMethodsSection";
import BenefitsSection from "./sections/Service/BenefitsSection";
import OurApproachSection from "./sections/Service/OurApproachSection";
import ContactSection from "./sections/Service/ContactSection";
import FaqSection from "./sections/Service/FaqSection";
import IndustriesSection from "./sections/Service/IndustriesSection";
import ServiceCaseStudySection from "./sections/Service/ServiceCaseStudySection";
import InnerDocumentTypeSection from "./sections/Service/InnerDocumentTypeSection";
import InnerServiceSection from "./sections/Service/InnerServiceSection";
import InnerWhyChooseUsSection from "./sections/Service/InnerWhyChooseUsSection";

/* ===================== CASE STUDY PAGE ===================== */
import CaseStudyHeroSection from "./sections/CaseStudy/CaseStudyHeroSection";
import CaseStudyIntroductionSection from "./sections/CaseStudy/CaseStudyIntroductionSection";
import CaseStudyChallengeSection from "./sections/CaseStudy/CaseStudyChallengeSection";
import CaseStudySolutionSection from "./sections/CaseStudy/CaseStudySolutionSection";
import CaseStudyResultsSection from "./sections/CaseStudy/CaseStudyResultsSection";
import CaseStudyTestimonialSection from "./sections/CaseStudy/CaseStudyTestimonialSection";
import CaseStudyRelatedSection from "./sections/CaseStudy/CaseStudyRelatedSection";

/* ===================== ABOUT US PAGE ===================== */
import InnerHeroSection from "./sections/AboutUs/InnerHeroSection";
import TeamSection from "./sections/AboutUs/TeamSection";
import PhilosophySection from "./sections/AboutUs/PhilosophySection";
import LeadershipMessageSection from "./sections/AboutUs/LeadershipMessageSection";
import HistorySection from "./sections/AboutUs/HistorySection";
import ExpertsCTASection from "./sections/AboutUs/ExpertsCTASection";

/* ===================== BLOG PAGE ===================== */
import BlogContentSection from "./sections/Blog/BlogContentSection";

/* ===================== CONTACT PAGE ===================== */
import ContactHeroSection from "./sections/Contact/ContactHeroSection";

/* ===================== INDUSTRY PAGE ===================== */
import IndustryHeroSection from "./sections/Industry/IndustryHeroSection";
import IndustryIntroSection from "./sections/Industry/ServiceIntroFrontend";
import IndustrySpecialHeading from "./sections/Industry/IndustrySpecialHeading";
import IconBoxSection from "./sections/Industry/IconBoxSection";
import NumberDocumentsSection from "./sections/Industry/NumberDocumentsSection";
import ServiceSliderSection from "./sections/Industry/ServiceSliderSection";
import IndustryInsightsSection from "./sections/Industry/IndustryInsightsSection";




/* ===================== HELPERS ===================== */
const mediaOrNull = (img) => {
  if (!img) return null;
  if (typeof img === "string") return { url: img, alt: "" };
  if (img.url) return img;
  if (img.sizes?.medium)
    return { url: img.sizes.medium, alt: img.alt || "" };
  return null;
};

export default function SectionRenderer({ sections = [], currentSlug, pageType }) {
  if (!Array.isArray(sections) || sections.length === 0) return null;

  return sections.map((block, index) => {
    const layout = block?.acf_fc_layout;

    switch (layout) {
      case "full_content_section":
        return (
          <FullContentSection
            key={`full-content-${index}`}
            section={block}
            sectionId={`section-${index}`}
          />
        );

      /* ===================== HOMEPAGE ===================== */
      case "hero_section":
        return (
          <HeroSection
            key={`hero-${index}`}
            heading={block.heading}
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
            display_mode={block.display_mode || "slider_single"}
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
        if (pageType === "industry") {
          return (
            <IndustryInsightsSection
              key={`industry-insights-${index}`}
              section={block}
              sectionId={`section-${index}`}
            />
          );
        }
        return (
          <InsightsSection
            key={`insights-${index}`}
            section_title={block.section_title}
            heading={block.heading}
            paragraph={block.paragraph}
            button={block.button}
            button_url={block.button_url}
          />
        );

      case "service_section":
        return (
          <ServicesSection
            key={`services-${index}`}
            section={block}
            sectionId={`section-${index}`}
          />
        );

      case "articles_section":
        return (
          <ArticlesSection
            key={`articles-${index}`}
            section_heading={block.section_heading}
            category_filter={block.category_filter}
            max_posts={block.max_posts}
            cta_text={block.cta_text}
          />
        );

      case "faq_section_global":
        return (
          <HomepageFaqSection
            key={`faq-global-${index}`}
            section={block}
            sectionId={`section-${index}`}
            index={index}
          />
        );

      

      /* ===================== SERVICE PAGE ===================== */
      case "services_hero":
        return <ServicesHeroSection key={index} {...block} sectionId={`section-${index}`} index={index} />;

      case "service_intro":
        return <ServiceIntroFrontend key={index} section={block} sectionId={`section-${index}`} index={index} />;

      case "translation_methods":
        return <TranslationMethodsSection key={index} section={block} sectionId={`section-${index}`} index={index} />;

      case "benefits_section":
        return <BenefitsSection key={index} section={block} sectionId={`section-${index}`} index={index} />;

      case "our_approach":
        return <OurApproachSection key={index} section={block} sectionId={`section-${index}`} index={index} />;

      case "contact_section":
        return <ContactSection key={index} section={block} sectionId={`section-${index}`} index={index} />;

      case "faq_section":
        return <FaqSection key={index} section={block} sectionId={`section-${index}`} index={index} />;

      case "industries":
        return <IndustriesSection key={index} data={block} sectionId={`section-${index}`} index={index} />;

      case "service_case_study_section":
        return (
          <ServiceCaseStudySection 
            key={index} 
            heading={block.heading}
            paragraph={block.paragraph}
            sectionLabel={block.section_label}
            sectionId={`section-${index}`}
            index={index}
          />
        );

      case "inner_document_types":
        return <InnerDocumentTypeSection key={index} section={block} sectionId={`section-${index}`} index={index} />;

      case "inner_service_section":
        return <InnerServiceSection key={index} section={block} sectionId={`section-${index}`} index={index} />;

      case "inner_why_choose_us":
        return <InnerWhyChooseUsSection key={index} section={block} sectionId={`section-${index}`} index={index} />;

      /* ===================== CASE STUDY PAGE ===================== */
      case "casestudy_hero":
        return (
          <CaseStudyHeroSection
            key={`cs-hero-${index}`}
            section={block}
            sectionId={`section-${index}`}
          />
        );

        case "casestudy_introduction":
          return (
            <CaseStudyIntroductionSection
              key={`cs-intro-${index}`}
              section={block}
              sectionId={`section-${index}`}
              index={index}
            />
          ); 

          case "casestudy_challenge":
          return (
            <CaseStudyChallengeSection
              key={`cs-challenge-${index}`}
              section={block}
              sectionId={`section-${index}`}
              index={index}
            />
          );
          
          case "casestudy_solution":
          return (
            <CaseStudySolutionSection
              key={`cs-solution-${index}`}
              section={block}
              sectionId={`section-${index}`}
              index={index}
            />
          );

            case "casestudy_results":
          return <CaseStudyResultsSection key={`cs-results-${index}`} section={block} sectionId={`section-${index}`} index={index} />;

          case "casestudy_testimonial":
          return <CaseStudyTestimonialSection key={`cs-testimonial-${index}`} section={block} sectionId={`section-${index}`} index={index} />;

          case "casestudy_related":
        return (
          <CaseStudyRelatedSection
            key={`cs-related-${index}`}
            section={block}
            currentSlug={currentSlug}
            sectionId={`section-${index}`}
            index={index}
          />
        );

      /* ===================== ABOUT US PAGE ===================== */
case "inner_hero_section":
  return (
    <InnerHeroSection
      key={`inner-hero-${index}`}
      section={block}
      sectionId={`section-${index}`}
    />
  );


      case "philosophy_section":
        return (
          <PhilosophySection
            key={`philosophy-${index}`}
            section={block}
            sectionId={`section-${index}`}
            index={index}
          />
        );

      case "team_section":
        return (
          <TeamSection
            key={`team-${index}`}
            section={block}
            sectionId={`section-${index}`}
            index={index}
          />
        );

      case "leadership_message":
        return (
          <LeadershipMessageSection
            key={`leader-${index}`}
            section={block}
            sectionId={`section-${index}`}
            index={index}
          />
        );

      case "history_section":
        return (
          <HistorySection
            key={`history-${index}`}
            section={block}
            sectionId={`section-${index}`}
            index={index}
          />
        );
  
      case "experts_cta_section":
        return (
          <ExpertsCTASection
            key={`experts-cta-${index}`}
            section={block}
            sectionId={`section-${index}`}
            index={index}
          />
        );

      /* ===================== BLOG PAGE ===================== */

      case "blog_content":
        return (
          <BlogContentSection
            key={`blog-content-${index}`}
            section={block}
          />
        );

      /* ===================== CONTACT PAGE ===================== */
      case "contact_hero":
        return (
          <ContactHeroSection
            key={`contact-hero-${index}`}
            section={block}
          />
        );

      /* ===================== INDUSTRY PAGE ===================== */
      case "industry_hero":
        return (
          <IndustryHeroSection
            key={`industry-hero-${index}`}
            heading={block.heading}
            sub_heading={block.sub_heading}
            background_image={block.background_image}
            cta_text={block.cta_text}
            cta_url={block.cta_url}
            sectionId={`section-${index}`}
            index={index}
          />
        );

      case "industry_intro":
        // Remove bottom padding if the next section is also industry_intro with the same light theme
        const nextBlock = sections[index + 1];
        const currentTheme = block.section_theme || "light";
        const nextTheme = nextBlock?.section_theme || "light";
        const nextIsIntro = nextBlock?.acf_fc_layout === "industry_intro";
        const removePb = nextIsIntro && currentTheme === "light" && nextTheme === "light";

        return <IndustryIntroSection key={index} section={block} sectionId={`section-${index}`} index={index} removeBottomPadding={removePb} />;

      case "industry_special_heading":
        return <IndustrySpecialHeading key={index} section={block} sectionId={`section-${index}`} />;

      case "icon_box_section":
        return <IconBoxSection key={index} section={block} sectionId={`section-${index}`} index={index} />;

      case "number_documents_examples":
        return <NumberDocumentsSection key={index} section={block} sectionId={`section-${index}`} />;

      case "service_slider":
        return <ServiceSliderSection key={index} section={block} sectionId={`section-${index}`} />;

      case "industry_insights":
        return (
          <IndustryInsightsSection
            key={`industry-insights-${index}`}
            section={block}
            sectionId={`section-${index}`}
          />
        );

      default:
        return null;
    }
  });
}
