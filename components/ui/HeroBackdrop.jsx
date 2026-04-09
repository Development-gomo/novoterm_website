import Image from "next/image";
import { HERO_IMAGE_QUALITY } from "../../lib/imageConstants";
import { pickWpImageUrl } from "../../lib/wpImage";

const DEFAULT_GRADIENT =
  "linear-gradient(180deg, rgba(6, 24, 55, 0.50) 0%, #061837 100%)";

/**
 * Full-bleed hero background via next/image (WebP/AVIF + responsive widths).
 * Replaces CSS background-image so PageSpeed/LCP can use optimized URLs.
 */
export default function HeroBackdrop({
  media,
  objectPosition = "object-center",
  gradient = DEFAULT_GRADIENT,
  priority = true,
  fallbackBg = "#061837",
}) {
  const bgUrl = pickWpImageUrl(media, "heroNext");

  if (!bgUrl) {
    return (
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundColor: "lightgray",
          backgroundImage: gradient,
          backgroundSize: "cover",
          backgroundPosition: "top center",
        }}
      />
    );
  }

  return (
    <>
      <div className="absolute inset-0 z-0" style={{ backgroundColor: fallbackBg }}>
        <Image
          src={bgUrl}
          alt=""
          fill
          priority={priority}
          fetchPriority={priority ? "high" : "auto"}
          sizes="100vw"
          quality={HERO_IMAGE_QUALITY}
          className={`object-cover ${objectPosition}`}
        />
      </div>
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{ background: gradient }}
      />
    </>
  );
}
