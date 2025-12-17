import { useState, useEffect, useRef } from "react";

export default function TranslationCursorHero({
  textEn,
  textSv,
  backgroundImage,
}) {
  // Track circle position
  const [pos, setPos] = useState({ x: -999, y: -999 });

  // Detect current language from URL
  const [isEnglish, setIsEnglish] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsEnglish(window.location.pathname.startsWith("/en"));
    }
  }, []);

  // "Outside text" = current language text
  const outsideText = isEnglish ? textEn : textSv;

  // "Inside circle" text = opposite language
  const translatedText = isEnglish ? textSv : textEn;

  // Mouse tracker
  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <section
      className="relative h-screen w-full overflow-hidden flex items-center justify-start px-10 text-white"
      onMouseMove={handleMouseMove}
      style={{
        backgroundImage: `linear-gradient(180deg, rgba(6,24,55,0.50) 0%, #061837 100%), url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* MAIN HERO TEXT */}
      <div className="relative z-10 max-w-4xl">
        <h1 className="text-[64px] leading-tight font-montserrat font-bold">
          {outsideText}
        </h1>

        <p className="mt-6 text-lg max-w-xl opacity-80">
          Novoterm unites human precision with AI-driven efficiency.
        </p>

        <button className="mt-6 bg-blue-600 px-6 py-3 rounded font-medium">
          Get started
        </button>
      </div>

      {/* TRANSLATION BUBBLE CURSOR */}
      <div
        className="absolute pointer-events-none flex items-center justify-center rounded-full text-center"
        style={{
          left: pos.x - 90,
          top: pos.y - 90,
          width: 180,
          height: 180,
          background: "rgba(255,255,255,0.10)",
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
          borderRadius: "999px",
          border: "1px solid rgba(255,255,255,0.15)",
          mixBlendMode: "screen",
        }}
      >
        <span className="text-[28px] font-bold font-montserrat">
          {translatedText}
        </span>
      </div>
    </section>
  );
}
