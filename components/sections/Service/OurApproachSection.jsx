"use client";
import DotIndicator from "../../ui/DotIndicator";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function OurApproachSection({ section, index = 0}) {
  if (!section) return null;

  const { 
    section_label, 
    heading, 
    cta_text, 
    cta_link, 
    cta_url,
    button_text,
    button_link,
    steps = [] 
  } = section;
  
  // Support multiple field name variants
  const ctaText = cta_text || button_text;
  const ctaUrl = cta_link || cta_url || button_link;
  
  const STICKY_START = 120;
  const LABEL_HEIGHT = 32;
  const stickyTop = STICKY_START + index * LABEL_HEIGHT;

  const [activeStep, setActiveStep] = useState(1);
  const stepRefs = useRef([]);

  useEffect(() => {
    // Automatically cycle through steps with timed delay
    const totalSteps = steps.length || 4;
    const interval = setInterval(() => {
      setActiveStep((prev) => {
        if (prev >= totalSteps) return prev; // Stop at last step
        return prev + 1;
      });
    }, 1000); // 1 second delay between steps

    return () => clearInterval(interval);
  }, [steps.length]);

  return (
    <section className="w-full bg-[#061837] px-4 py-6 sm:px-6 md:py-10 lg:px-[80px] lg:py-[96px] text-white">
      <div className="mx-auto">
        <div className="flex flex-col lg:flex-row">

          {/* LEFT – 15% */}
          <div className="w-full lg:w-[15%] mb-6 lg:mb-0 relative">
                      {section_label && (
                        <div className="flex items-center gap-3 mt-2" style={{ position: "sticky", top: `${stickyTop}px`, zIndex: 10 + index }}>
                          <DotIndicator variant="white"/>
                          <span className="uppercase font-montserrat font-medium text-[10px] sm:text-[10px] md:text-[12px] tracking-wider">
                            {section_label}
                          </span>
                        </div>
                      )}
                    </div>

          {/* RIGHT – 85% */}
          <div className="w-full lg:w-[85%]">

            {/* HEADER */}
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-[36px] lg:mb-[48px] gap-6">
              <h2 className="max-w-[577px] font-heading text-[24px] sm:text-[28px] md:text-[40px] font-semibold leading-tight md:leading-[1.15]">
                {heading}
              </h2>
              {ctaText && ctaUrl && (
                <Link href={ctaUrl} className="btn-primary whitespace-nowrap w-fit">
                  {ctaText}
                </Link>
              )}
            </div>

            {/* ================= MOBILE STACKED STEPS ================= */}
            <div className="flex flex-col gap-[32px] lg:hidden">
              {steps.map((step, index) => (
                <div key={index} className="border-b border-white/15 pb-[24px]">
                  <div className="flex items-center gap-3 mb-[12px]">
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
                  <p className="text-[16px] leading-[1.7] text-white/85">
                    {step.step_description}
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
                        <div className={`w-[56px] h-[56px] rounded-full flex items-center justify-center text-[14px] font-montserrat font-medium shrink-0 transition-all duration-500 z-10 ${isActive ? "bg-[#2655c4] text-white" : "border border-white/40 text-white/60"}`}>
                          {stepNumber}
                        </div>
                        {/* Line extending to next column */}
                        {!isLast && (
                          <div className={`absolute left-[56px] right-[-48px] top-1/2 h-px transition-all duration-500 ${stepNumber < activeStep ? "bg-[#2F5BDE]" : "bg-white/30"}`} />
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
                    <p className="text-[16px] leading-[24px] text-white/85 w-[200px]">
                      {step.step_description}
                    </p>
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
