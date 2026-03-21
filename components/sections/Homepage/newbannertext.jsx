"use client";
import { useEffect, useRef, useState } from "react";

export default function NewHomeBannerText({ block, sectionId }) {
  const sceneRef = useRef(null);
  const swedishRef = useRef(null);
  const englishRef = useRef(null);
  const circleRef = useRef(null);

  const [ready, setReady] = useState(false); // 🔥 important

  const swedishText = block?.swedish_text;
  const englishText = block?.english_text;
  const size = parseInt(block?.circle_size) || 200;

  useEffect(() => {
    const scene = sceneRef.current;
    const swedishLayer = swedishRef.current;
    const englishLayer = englishRef.current;
    const circle = circleRef.current;

    if (!scene || !swedishLayer || !englishLayer || !circle) return;

    let isInside = false;

    const update = (x, y) => {
      // 🔵 English visible ONLY inside circle
      englishLayer.style.clipPath = `circle(${size}px at ${x}px ${y}px)`;

      // 🔴 Swedish hidden inside circle
      const mask = `radial-gradient(circle ${size}px at ${x}px ${y}px, transparent 98%, black 100%)`;
      swedishLayer.style.webkitMaskImage = mask;
      swedishLayer.style.maskImage = mask;

      circle.style.left = `${x}px`;
      circle.style.top = `${y}px`;
    };

    const rect = scene.getBoundingClientRect();
    const cx = rect.width / 2;
    const cy = rect.height / 2;

    update(cx, cy);

    // 🔥 NOW safe to show
    setReady(true);

    const move = (clientX, clientY) => {
      if (!isInside) return;

      const rect = scene.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;

      update(x, y);
    };

    const handleMouseMove = (e) => move(e.clientX, e.clientY);

    const handleTouchMove = (e) => {
      const touch = e.touches[0];
      move(touch.clientX, touch.clientY);
    };

    const handleEnter = () => (isInside = true);
    const handleLeave = () => (isInside = false);

    scene.addEventListener("mouseenter", handleEnter);
    scene.addEventListener("mouseleave", handleLeave);
    scene.addEventListener("mousemove", handleMouseMove);
    scene.addEventListener("touchmove", handleTouchMove);

    return () => {
      scene.removeEventListener("mouseenter", handleEnter);
      scene.removeEventListener("mouseleave", handleLeave);
      scene.removeEventListener("mousemove", handleMouseMove);
      scene.removeEventListener("touchmove", handleTouchMove);
    };
  }, [size]);

  if (!swedishText || !englishText) return null;

  return (
    <div
      ref={sceneRef}
      className="relative w-full h-[500px] md:h-screen flex items-center justify-center overflow-hidden bg-[#0f172a]"
      style={{ cursor: "none" }}
    >
      {/* 🔴 SWEDISH */}
      <div
        ref={swedishRef}
        className="absolute inset-0 flex items-center justify-center px-6"
      >
        <div
          className="max-w-4xl text-center text-white text-2xl md:text-4xl font-semibold"
          dangerouslySetInnerHTML={{ __html: swedishText }}
        />
      </div>

      {/* 🔵 ENGLISH (hidden until ready) */}
      <div
        ref={englishRef}
        className="absolute inset-0 flex items-center justify-center px-6"
        style={{
          opacity: ready ? 1 : 0, // 🔥 prevents initial overlap
          clipPath: `circle(${size}px at 50% 50%)`,
        }}
      >
        <div
          className="max-w-4xl text-center text-white text-2xl md:text-4xl font-semibold"
          dangerouslySetInnerHTML={{ __html: englishText }}
        />
      </div>

      {/* ⚪ CIRCLE */}
      <div
        ref={circleRef}
        className="pointer-events-none absolute z-30 rounded-full"
        style={{
          width: size * 2,
          height: size * 2,
          transform: "translate(-50%, -50%)",
          left: "50%",
          top: "50%",
          border: "2px solid #fff",
          boxShadow: "inset 0px 0px 15px #ffffff",
        }}
      />
    </div>
  );
}