"use client";
import DotIndicator from "../../ui/DotIndicator";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function OurApproachSection({ section, index = 0}) {
  if (!section) return null;

  const { section_label, heading, cta_text, cta_link, steps = [] } = section;
  
  const STICKY_START = 120;
  const LABEL_HEIGHT = 32;
  const stickyTop = STICKY_START + index * LABEL_HEIGHT;

  const [activeStep, setActiveStep] = useState(1);
  const stepRefs = useRef([]);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const currentY = window.scrollY;
      const direction = currentY > lastScrollY.current ? "down" : "up";
      lastScrollY.current = currentY;

      stepRefs.current.forEach((el) => {
        if (!el) return;
        const step = Number(el.dataset.step);
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.6) {
          setActiveStep((prev) => {
            if (direction === "down" && step === prev + 1) return prev + 1;
            if (direction === "up" && step === prev && prev > 1) return prev - 1;
            return prev;
          });
        }
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-[48px] lg:mb-[72px] gap-6">
              <h2 className="max-w-[720px] font-heading text-[24px] sm:text-[28px] md:text-[40px] font-semibold leading-tight md:leading-[1.15]">
                {heading}
              </h2>
              {cta_text && cta_link && (
                <Link href={cta_link} className="btn-primary whitespace-nowrap w-fit">
                  {cta_text}
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

              {/* TIMELINE */}
              <div className="relative mb-[48px] lg:mb-[64px]">

                {/* LABELS */}
                <div className="grid grid-cols-4 mb-[16px] gap-y-2">
                  {steps.map((step, i) => (
                    <div key={i} className="text-[12px] tracking-widest text-[#6E8BFF]">
                      {step.step_tag}
                    </div>
                  ))}
                </div>

                {/* LINE + CIRCLES */}
                <div className="flex items-center">
                  {steps.map((step, index) => {
                    const stepNumber = step.step_number;
                    const isActive = stepNumber <= activeStep;
                    const isLast = index === steps.length - 1;

                    return (
                      <div key={index} className="flex items-center flex-1">
                        <div className={`w-[56px] h-[56px] rounded-full flex items-center justify-center text-[16px] font-medium shrink-0 transition-all duration-500 ${isActive ? "bg-[#2F5BDE] text-white" : "border border-white/40 text-white/60"}`}>
                          {stepNumber}
                        </div>
                        {!isLast && (
                          <div className={`h-px flex-1 transition-all duration-500 ${stepNumber < activeStep ? "bg-[#2F5BDE]" : "bg-white/30"}`} />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* CONTENT */}
              <div className="grid grid-cols-4 gap-[48px]">
                {steps.map((step, index) => (
                  <div key={index} ref={(el) => (stepRefs.current[index] = el)} data-step={step.step_number}>
                    <h3 className="text-[26px] font-semibold mb-[14px]">
                      {step.step_title}
                    </h3>
                    <p className="text-[16px] leading-[1.7] text-white/85">
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
