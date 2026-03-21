"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { wpToPath } from "../../../lib/api";

export default function HeroSection({
  background_image,
  heading_sv = "",
  heading_en = "",
  subheading_sv = "",
  subheading_en = "",
  button_text_sv = "",
  button_text_en = "",
  button_link = "#",
  circle_size = "100",
}) {
  const sceneRef = useRef(null);
  const swedishRef = useRef(null);
  const englishRef = useRef(null);
  const circleRef = useRef(null);

  const [ready, setReady] = useState(false);

  const bgUrl =
    typeof background_image === "string"
      ? background_image
      : background_image?.url ||
        background_image?.sizes?.large ||
        background_image?.sizes?.medium_large ||
        "";

  useEffect(() => {
    const scene = sceneRef.current;
    const swedishLayer = swedishRef.current;
    const englishLayer = englishRef.current;
    const circle = circleRef.current;

    if (!scene || !swedishLayer || !englishLayer || !circle) return;

    let isInside = false;

    // ✅ FINAL FIXED FUNCTION
    const update = (clientX, clientY) => {
      const rect = scene.getBoundingClientRect();

      const x = clientX - rect.left;
      const y = clientY - rect.top;

      // 🔵 English reveal
      englishLayer.style.clipPath = `circle(${circle_size}px at ${x}px ${y}px)`;

      // 🔴 Swedish cut
      const mask = `radial-gradient(circle ${circle_size}px at ${x}px ${y}px, transparent 98%, black 100%)`;
      swedishLayer.style.webkitMaskImage = mask;
      swedishLayer.style.maskImage = mask;

      // ⚪ Perfectly aligned circle
      circle.style.transform = `translate(${x - circle_size}px, ${y - circle_size}px)`;
    };

    const rect = scene.getBoundingClientRect();

    // ✅ Initial center (FIXED)
    update(rect.left + rect.width / 2, rect.top + rect.height / 2);

    setReady(true);

    const move = (clientX, clientY) => {
      if (!isInside) return;
      update(clientX, clientY);
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
  }, [circle_size]);

  return (
    <section
      ref={sceneRef}
      className="relative w-full min-h-screen overflow-hidden flex items-center"
      style={{
        cursor: "none",
        backgroundImage: `linear-gradient(180deg, rgba(6, 24, 55, 0.50) 0%, #061837 100%), url(${bgUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* CONTENT WRAPPER */}
      <div className="relative w-full min-h-[100vh] web-width px-6 py-24 lg:px-48 flex flex-col justify-center">

        {/* 🔴 SWEDISH */}
        <div ref={swedishRef} className="absolute inset-0 z-10">
          <div className="flex flex-col justify-center h-full">

            <div className="text-left">
              <h1
                className="font-heading uppercase font-semibold text-white text-[36px] sm:text-[48px] md:text-[60px] lg:text-[80px]"
                dangerouslySetInnerHTML={{ __html: heading_sv }}
              />
            </div>

            <div className="text-left mt-6 lg:ml-[235px]">
              {subheading_sv && (
                <div
                  className="font-body text-white text-[16px]"
                  dangerouslySetInnerHTML={{ __html: subheading_sv }}
                />
              )}
              {button_text_sv && (
                <Link href={wpToPath(button_link) || "#"} className="btn-primary">
                  {button_text_sv}
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* 🔵 ENGLISH */}
        <div
          ref={englishRef}
          className="absolute inset-0 z-20 pointer-events-none"
          style={{
            opacity: ready ? 1 : 0,
            clipPath: `circle(${circle_size}px at 50% 50%)`,
          }}
        >
          <div className="flex flex-col justify-center h-full">

            <div className="text-left">
              <h1
                className="font-heading uppercase font-semibold text-white text-[36px] sm:text-[48px] md:text-[60px] lg:text-[80px]"
                dangerouslySetInnerHTML={{ __html: heading_en }}
              />
            </div>

            <div className="text-left mt-6 lg:ml-[235px]">
              {subheading_en && (
                <div
                  className="font-body text-white text-[16px]"
                  dangerouslySetInnerHTML={{ __html: subheading_en }}
                />
              )}
              {button_text_en && (
                <Link href={wpToPath(button_link) || "#"} className="btn-primary">
                  {button_text_en}
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ⚪ SINGLE PERFECT CIRCLE */}
      <div
        ref={circleRef}
        className="pointer-events-none absolute z-30 rounded-full"
        style={{
          width: circle_size * 2,
          height: circle_size * 2,
          transform: "translate(-50%, -50%)",
          left: "50%",
          top: "50%",
          border: "2px solid #fff",
          boxShadow: "inset 0px 0px 15px #ffffff",
        }}
      />

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#061837] to-transparent" />
    </section>
  );
}