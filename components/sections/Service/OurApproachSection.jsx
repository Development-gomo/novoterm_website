"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function OurApproachSection({ section }) {
  if (!section) return null;

  const {
    section_label,
    heading,
    cta_text,
    cta_link,
    steps = [],
  } = section;

  const [activeStep, setActiveStep] = useState(1);
  const stepRefs = useRef([]);
  const lastScrollY = useRef(0);

  /* ================= SCROLL LOGIC ================= */
  useEffect(() => {
    const onScroll = () => {
      const currentY = window.scrollY;
      const direction = currentY > lastScrollY.current ? "down" : "up";
      lastScrollY.current = currentY;

      stepRefs.current.forEach((el) => {
        if (!el) return;

        const step = Number(el.dataset.step);
        const rect = el.getBoundingClientRect();

        // Trigger zone (middle of viewport)
        if (rect.top < window.innerHeight * 0.6) {
          setActiveStep((prev) => {
            if (direction === "down" && step === prev + 1) {
              return prev + 1;
            }
            if (direction === "up" && step === prev && prev > 1) {
              return prev - 1;
            }
            return prev;
          });
        }
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section className="w-full bg-gradient-to-b from-[#061A3A] to-[#071F46] px-[80px] py-[96px] text-white">
      <div className="mx-auto">
        <div className="flex">

          {/* LEFT – 15% */}
          <div className="w-[15%]">
            {section_label && (
              <div className="flex items-center gap-3 mt-2">
                <span className="w-[10px] h-[10px] rounded-full bg-[#3B6FFF]" />
                <span className="uppercase text-[12px] tracking-widest text-white/80">
                  {section_label}
                </span>
              </div>
            )}
          </div>

          {/* RIGHT – 85% */}
          <div className="w-[85%]">

            {/* HEADER */}
            <div className="flex items-start justify-between mb-[72px]">
              <h2 className="max-w-[720px] text-[44px] leading-[1.2] font-semibold">
                {heading}
              </h2>

              {cta_text && cta_link && (
                <Link href={cta_link} className="btn-primary whitespace-nowrap">
                  {cta_text}
                </Link>
              )}
            </div>

            {/* ================= TIMELINE ================= */}
            <div className="relative mb-[64px]">

              {/* LABELS */}
              <div className="grid grid-cols-4 mb-[16px]">
                {steps.map((step, i) => (
                  <div
                    key={i}
                    className="text-[12px] tracking-widest text-[#6E8BFF]"
                  >
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

                      {/* CIRCLE */}
                      <div
                        className={`
                          w-[56px] h-[56px]
                          rounded-full flex items-center justify-center
                          text-[16px] font-medium shrink-0
                          transition-all duration-500
                          ${
                            isActive
                              ? "bg-[#2F5BDE] text-white"
                              : "border border-white/40 text-white/60"
                          }
                        `}
                      >
                        {stepNumber}
                      </div>

                      {/* CONNECTOR */}
                      {!isLast && (
                        <div
                          className={`
                            h-px flex-1 transition-all duration-500
                            ${
                              stepNumber < activeStep
                                ? "bg-[#2F5BDE]"
                                : "bg-white/30"
                            }
                          `}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ================= CONTENT ================= */}
            <div className="grid grid-cols-4 gap-[48px]">
              {steps.map((step, index) => (
                <div
                  key={index}
                  ref={(el) => (stepRefs.current[index] = el)}
                  data-step={step.step_number}
                >
                  <h3 className="text-[26px] font-semibold mb-[14px]">
                    {step.step_title}
                  </h3>

                  <p className="text-[15px] leading-[1.7] text-white/85">
                    {step.step_description}
                  </p>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
    