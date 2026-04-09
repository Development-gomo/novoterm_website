"use client";
import { useEffect, useRef } from "react";
import Image from "next/image";
import { pickWpImageUrl } from "../../../lib/wpImage";

const HERO_QUALITY = 72;

export default function NewHomeBanner({ block, sectionId }) {
  const sceneRef = useRef(null);
  const revealRef = useRef(null);
  const circleRef = useRef(null);

  const getImageUrl = (img) => {
    if (!img) return undefined;
    const u = pickWpImageUrl(img, "heroNext");
    return u || undefined;
  };

  const swedish = getImageUrl(block?.swedish_image);
  const english = getImageUrl(block?.english_image);
  const size = parseInt(block?.circle_size) || 200;

  const isEnglish =
    block?.lang === "en" ||
    block?.locale?.startsWith("en") ||
    block?.language === "en";

  const foregroundImage = isEnglish ? english : swedish;
  const revealImage = isEnglish ? swedish : english;

  useEffect(() => {
    const scene = sceneRef.current;
    const revealLayer = revealRef.current;
    const circle = circleRef.current;

    if (!scene || !revealLayer || !circle) return;

    let isInside = false;

    const setCenter = () => {
      const rect = scene.getBoundingClientRect();
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      revealLayer.style.clipPath = `circle(${size}px at ${centerX}px ${centerY}px)`;
      circle.style.left = `${centerX}px`;
      circle.style.top = `${centerY}px`;
    };

    setCenter();

    const move = (clientX, clientY) => {
      if (!isInside) return;

      const rect = scene.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;

      revealLayer.style.clipPath = `circle(${size}px at ${x}px ${y}px)`;
      circle.style.left = `${x}px`;
      circle.style.top = `${y}px`;
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

    window.addEventListener("resize", setCenter);

    return () => {
      scene.removeEventListener("mouseenter", handleEnter);
      scene.removeEventListener("mouseleave", handleLeave);
      scene.removeEventListener("mousemove", handleMouseMove);
      scene.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("resize", setCenter);
    };
  }, [size, isEnglish]);

  if (!foregroundImage || !revealImage) return null;

  return (
    <div
      id={sectionId}
      ref={sceneRef}
      className="relative w-full h-[500px] md:h-screen overflow-hidden"
      style={{ cursor: "none" }}
    >
      <div className="absolute inset-0 z-0">
        <Image
          src={foregroundImage}
          alt=""
          fill
          priority
          fetchPriority="high"
          sizes="100vw"
          quality={HERO_QUALITY}
          className="object-cover object-center"
        />
      </div>

      <div
        ref={revealRef}
        className="absolute inset-0 z-10"
        style={{
          clipPath: `circle(${size}px at 50% 50%)`,
        }}
      >
        <Image
          src={revealImage}
          alt=""
          fill
          sizes="100vw"
          quality={HERO_QUALITY}
          loading="lazy"
          className="object-cover object-center"
        />
      </div>

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
