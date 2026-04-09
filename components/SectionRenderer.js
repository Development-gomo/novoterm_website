
import dynamic from "next/dynamic";
import HeroSection from "./sections/Homepage/HeroSection";

/* ===================== HOMEPAGE ===================== */
const HomeHeroFinal = dynamic(() => import("./sections/Homepage/homeherofinal"));
const AboutSection = dynamic(() => import("./sections/Homepage/AboutSection"));
const FullWidthExpertsSection = dynamic(() => import("./sections/Homepage/FullWidthExpertsSection"));
const CaseStudySection = dynamic(() => import("./sections/Homepage/CaseStudySection"));
const DocumentTypeSection = dynamic(() => import("./sections/Homepage/DocumentTypeSection"));
const WhyChooseUsSection = dynamic(() => import("./sections/Homepage/WhyChooseUsSection"));
const InsightsSection = dynamic(() => import("./sections/Homepage/InsightsSection"));
const ServicesSection = dynamic(() => import("./sections/Homepage/ServicesSection"));
const HomepageFaqSection = dynamic(() => import("./sections/Homepage/FaqSection"));
const ArticlesSection = dynamic(() => import("./sections/Homepage/ArticlesSection"));
const FullContentSection = dynamic(() => import("./sections/Homepage/FullContentSection"));
const NewHomeBanner = dynamic(() => import("./sections/Homepage/NewBanner"));
const NewHomeBannerText = dynamic(() => import("./sections/Homepage/newbannertext"));

/* ===================== SERVICE PAGE ===================== */
const ServicesHeroSection = dynamic(() => import("./sections/Service/ServicesHeroSection"));
const ServiceIntroFrontend = dynamic(() => import("./sections/Service/ServiceIntroSection"));
const TranslationMethodsSection = dynamic(() => import("./sections/Service/TranslationMethodsSection"));
const BenefitsSection = dynamic(() => import("./sections/Service/BenefitsSection"));
const OurApproachSection = dynamic(() => import("./sections/Service/OurApproachSection"));
const ContactSection = dynamic(() => import("./sections/Service/ContactSection"));
const FaqSection = dynamic(() => import("./sections/Service/FaqSection"));
const IndustriesSection = dynamic(() => import("./sections/Service/IndustriesSection"));
const ServiceCaseStudySection = dynamic(() => import("./sections/Service/ServiceCaseStudySection"));
const InnerDocumentTypeSection = dynamic(() => import("./sections/Service/InnerDocumentTypeSection"));
const InnerServiceSection = dynamic(() => import("./sections/Service/InnerServiceSection"));
const InnerWhyChooseUsSection = dynamic(() => import("./sections/Service/InnerWhyChooseUsSection"));

/* ===================== CASE STUDY PAGE ===================== */
const CaseStudyHeroSection = dynamic(() => import("./sections/CaseStudy/CaseStudyHeroSection"));
const CaseStudyIntroductionSection = dynamic(() => import("./sections/CaseStudy/CaseStudyIntroductionSection"));
const CaseStudyChallengeSection = dynamic(() => import("./sections/CaseStudy/CaseStudyChallengeSection"));
const CaseStudySolutionSection = dynamic(() => import("./sections/CaseStudy/CaseStudySolutionSection"));
const CaseStudyResultsSection = dynamic(() => import("./sections/CaseStudy/CaseStudyResultsSection"));
const CaseStudyTestimonialSection = dynamic(() => import("./sections/CaseStudy/CaseStudyTestimonialSection"));
const CaseStudyRelatedSection = dynamic(() => import("./sections/CaseStudy/CaseStudyRelatedSection"));
const CaseStudyExampleSection = dynamic(() => import("./sections/CaseStudy/CaseStudyExampleSection"));
const CaseStudyAboutSection = dynamic(() => import("./sections/CaseStudy/CaseStudyAboutSection"));

/* ===================== ABOUT US PAGE ===================== */
const InnerHeroSection = dynamic(() => import("./sections/AboutUs/InnerHeroSection"));
const TeamSection = dynamic(() => import("./sections/AboutUs/TeamSection"));
const PhilosophySection = dynamic(() => import("./sections/AboutUs/PhilosophySection"));
const LeadershipMessageSection = dynamic(() => import("./sections/AboutUs/LeadershipMessageSection"));
const HistorySection = dynamic(() => import("./sections/AboutUs/HistorySection"));
const ExpertsCTASection = dynamic(() => import("./sections/AboutUs/ExpertsCTASection"));

/* ===================== BLOG PAGE ===================== */
const BlogContentSection = dynamic(() => import("./sections/Blog/BlogContentSection"));

/* ===================== CONTACT PAGE ===================== */
const ContactHeroSection = dynamic(() => import("./sections/Contact/ContactHeroSection"));

/* ===================== INDUSTRY PAGE ===================== */
const IndustryHeroSection = dynamic(() => import("./sections/Industry/IndustryHeroSection"));
const IndustryIntroSection = dynamic(() => import("./sections/Industry/ServiceIntroFrontend"));
const IndustrySpecialHeading = dynamic(() => import("./sections/Industry/IndustrySpecialHeading"));
const IconBoxSection = dynamic(() => import("./sections/Industry/IconBoxSection"));
const NumberDocumentsSection = dynamic(() => import("./sections/Industry/NumberDocumentsSection"));
const ServiceSliderSection = dynamic(() => import("./sections/Industry/ServiceSliderSection"));
const IndustryInsightsSection = dynamic(() => import("./sections/Industry/IndustryInsightsSection"));




/* ===================== HELPERS ===================== */
const mediaOrNull = (img) => {
  if (!img) return null;
  if (typeof img === "string") return { url: img, alt: "" };
  if (img.url) return img;
  if (img.sizes?.medium)
    return { url: img.sizes.medium, alt: img.alt || "" };
  return null;
};

export default function SectionRenderer({ sections = [], currentSlug, pageType, postAcf }) {
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

      case "new_home_banner":
        return (
          <NewHomeBanner
            key={`new-home-banner-${index}`}
            block={block}
            sectionId={`section-${index}`}
          />
        );
      case "hero_section_final":
  return (
    <HomeHeroFinal
      key={`hero-section-final-${index}`}
      {...(block?.acf || block)} // ✅ handles both cases
      sectionId={`section-${index}`}
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


                case "new_home_banner_text":
                  return (
                    <NewHomeBannerText
                      key={`new-home-banner-text-${index}`}
                      block={block}
                      sectionId={`section-${index}`}
                    />
                  );
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
            add_padding_top={block.add_padding_top}
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
              postAcf={postAcf}
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

          case "case_study_about":
          return (
            <CaseStudyAboutSection
              key={`cs-about-${index}`}
              section={block}
              sectionId={`section-${index}`}
              index={index}
            />
          );

          case "case_study_example":
          return (
            <CaseStudyExampleSection
              key={`cs-example-${index}`}
              section={block}
              sectionId={`section-${index}`}
              index={index}
            />
          );

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
