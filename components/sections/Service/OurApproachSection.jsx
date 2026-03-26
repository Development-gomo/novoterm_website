import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { wpToPath } from "../../../lib/api";

export default function OurApproachSection({ section, sectionId, index = 0 }) {
  if (!section) return null;

  const { 
    heading, 
    cta_text, 
    cta_link, 
    cta_url,
    button_text,
    button_link,
    steps = [],
    section_theme = "dark"
  } = section;

  // Theme-based classes
  const isDark = section_theme === "dark";
  const sectionBg = isDark ? "bg-[#061837]" : "bg-[#E3EDFF]";
  const headingColor = isDark ? "text-white" : "text-[#061837]";
  const stepTagColor = isDark ? "text-[#6E8BFF]" : "text-[#2655C4]";
  const stepDescColor = isDark ? "text-white/85" : "text-[#061837]/85";
  
  // Support multiple field name variants
  const ctaText = cta_text || button_text;
  const ctaUrl = cta_link || cta_url || button_link;

  const [activeStep, setActiveStep] = useState(1);
  const [hasAnimated, setHasAnimated] = useState(false);
  const stepRefs = useRef([]);
  const sectionRef = useRef(null);

  useEffect(() => {
    // Intersection Observer to detect when section is visible
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true);
          }
        });
      },
      { threshold: 0.2 } // Trigger when 20% of section is visible
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, [hasAnimated]);

  useEffect(() => {
    if (!hasAnimated) return;

    // Automatically cycle through steps with timed delay
    const totalSteps = steps.length || 4;
    const interval = setInterval(() => {
      setActiveStep((prev) => {
        if (prev >= totalSteps) return prev; // Stop at last step
        return prev + 1;
      });
    }, 700); // 0.7 second delay between steps

    return () => clearInterval(interval);
  }, [hasAnimated, steps.length]);

  return (
    <section
      id={sectionId}
      ref={sectionRef}
      className={`w-full ${sectionBg} py-6 md:py-10 lg:py-[96px] ${isDark ? 'text-white' : 'text-[#061837]'}`}
    >
      <div className="web-width mx-auto px-6 md:px-0">
        <div className="flex flex-col lg:flex-row">

          {/* LEFT – 15% */}
          <div className="w-full lg:w-[15%] mb-6 lg:mb-0 relative">
          </div>

          {/* RIGHT – 85% */}
          <div className="w-full lg:w-[85%]">

            {/* HEADER */}
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-[36px] lg:mb-[48px] gap-6">
              <h2 className="max-w-[677px] font-heading text-[24px] sm:text-[28px] md:text-[40px] font-semibold leading-tight md:leading-[1.15]">
                {heading}
              </h2>
              {ctaText && ctaUrl && (
                <Link href={wpToPath(ctaUrl) || "#"} className="btn-primary whitespace-nowrap w-fit">
                  {ctaText}
                </Link>
              )}
            </div>

            {/* ================= MOBILE STACKED STEPS ================= */}
            <div className="flex flex-col gap-[32px] lg:hidden">
              {steps.map((step, index) => (
                <div key={index} className="border-b border-white/15 pb-[24px]">
                  <div className="flex items-center gap-3 mb-5 lg:mb-[12px]">
                    <span className="w-[32px] h-[32px] rounded-full bg-[#2F5BDE] flex items-center justify-center text-[14px] font-medium">
                      {step.step_number}
                    </span>
                    <span className="text-[12px] tracking-widest uppercase text-[#6E8BFF]">
                      {step.step_tag}
                    </span>
                  </div>
                  <h3 className="text-[22px] font-semibold mb-[10px]">
                    {step.step_title}
                  </h3>
                <p className={`text-[16px] leading-[24px] ${stepDescColor} w-full lg:w-[200px]`}>
  {step.step_description ? (
    <span dangerouslySetInnerHTML={{ __html: step.step_description }} />
  ) : (
    "Loading description..." // Fallback for SSR and client hydration
  )}
                  </p>
                </div>
              ))}
            </div>

            {/* ================= DESKTOP / TABLET TIMELINE ================= */}
            <div className="hidden lg:block">

              {/* LABELS */}
              <div className="grid grid-cols-4 gap-[48px] mb-[16px]">
                {steps.map((step, i) => (
                  <div key={i} className="text-[12px] tracking-widest text-[#5c83dd] font-montserrat">
                    {step.step_tag}
                  </div>
                ))}
              </div>

              {/* CIRCLES + CONNECTING LINES */}
              <div className="relative mb-[24px]">
                <div className="grid grid-cols-4 gap-[48px]">
                  {steps.map((step, index) => {
                    const stepNumber = step.step_number;
                    const isActive = stepNumber <= activeStep;
                    const isLast = index === steps.length - 1;

                    return (
                      <div key={index} className="relative flex items-center">
                        {/* Circle */}
                        <div className={`w-[56px] h-[56px] rounded-full flex items-center justify-center text-[14px] font-montserrat font-medium shrink-0 transition-all duration-700 ease-in-out z-10 ${isActive ? "bg-[#2655c4] text-white border-0 scale-110" : "border border-white/40 text-white/60 bg-transparent scale-100"}`}>
                          {stepNumber}
                        </div>
                        {/* Line extending to next column */}
                        {!isLast && (
                          <div className={`absolute left-[56px] right-[-48px] top-1/2 h-px transition-all duration-700 ease-in-out ${stepNumber < activeStep ? "bg-[#2F5BDE]" : "bg-white/30"}`} />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* TITLES */}
              <div className="grid grid-cols-4 gap-[48px] mb-[24px]">
                {steps.map((step, index) => (
                  <div key={index} ref={(el) => (stepRefs.current[index] = el)} data-step={step.step_number}>
                    <h3 className="text-[24px] leading-[32px] font-semibold w-[200px]">
                      {step.step_title}
                    </h3>
                  </div>
                ))}
              </div>

              {/* DESCRIPTIONS */}
              <div className="grid grid-cols-4 gap-[48px]">
                {steps.map((step, index) => (
                  <div key={`desc-${index}`}>
                    <p className={`text-[16px] leading-[24px] ${stepDescColor} w-[200px]`} dangerouslySetInnerHTML={{ __html: step.step_description }} />
                  </div>
                ))}
              </div>

            </div>

          </div>
        </div>
      </div>
    </section>
  );
}