export default function StepIndicator({ activeStep = 1 }) {
  const steps = [
    { label: "UNDERSTAND", number: 1 },
    { label: "ASSIGN", number: 2 },
    { label: "TRANSLATE", number: 3 },
    { label: "DELIVER", number: 4 },
  ];

  return (
    <div className="relative w-full mt-[48px]">

      {/* ===== CONNECTING LINE ===== */}
      <div className="absolute top-[34px] left-[40px] right-[40px] h-[1px] bg-white/30" />

      {/* ===== STEPS ===== */}
      <div className="relative flex justify-between">

        {steps.map((step) => {
          const isActive = step.number === activeStep;
          const isCompleted = step.number < activeStep;

          return (
            <div
              key={step.number}
              className="flex flex-col items-center w-[120px]"
            >
              {/* LABEL */}
              <span className="text-[12px] tracking-widest text-[#6C8EDC] mb-[12px]">
                {step.label}
              </span>

              {/* CIRCLE */}
              <div
                className={`
                  w-[48px] h-[48px] rounded-full
                  flex items-center justify-center
                  text-[16px] font-medium
                  z-10
                  transition-all
                  ${
                    isActive
                      ? "bg-[#2B5BD7] text-white"
                      : "border border-white/40 text-white/60 bg-[#0A1A3A]"
                  }
                `}
              >
                {step.number}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
