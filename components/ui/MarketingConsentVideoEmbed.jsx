import { useCookieConsent } from "../../lib/hooks/useCookieConsent";
import { getYouTubeVideoId } from "../../lib/videoEmbed";
import { useRouter } from "next/router";
import { useState } from "react";

const DEFAULT_ALLOW =
  "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";

export const WATCH_ON_YOUTUBE_TEXT = {
  en: "Watch on YouTube",
  sv: "Se videon på YouTube",
};

export function getYouTubeWatchUrl(src) {
  const videoId = getYouTubeVideoId(src);
  return videoId ? `https://www.youtube.com/watch?v=${encodeURIComponent(videoId)}` : "";
}

// Plain "Watch on YouTube" link, rendered in the server HTML so crawlers
// (which never give marketing consent) can still reach the video.
export function YouTubeWatchLink({ src, className = "" }) {
  const { locale } = useRouter();
  const watchUrl = getYouTubeWatchUrl(src);
  if (!watchUrl) return null;

  return (
    <a
      href={watchUrl}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(event) => event.stopPropagation()}
      // "!" so article prose link colours can't override it on the dark box.
      className={`font-montserrat text-[12px] text-white/80! underline underline-offset-2 transition hover:text-white! ${className}`}
    >
      {WATCH_ON_YOUTUBE_TEXT[locale] || WATCH_ON_YOUTUBE_TEXT.sv}
    </a>
  );
}

export default function MarketingConsentVideoEmbed({
  src,
  title = "Video",
  className = "",
  iframeClassName = "",
  height,
  frameBorder,
  allow = DEFAULT_ALLOW,
  allowFullScreen = true,
}) {
  const { marketing } = useCookieConsent();
  const [acceptedFromVideo, setAcceptedFromVideo] = useState(false);
  const router = useRouter();
  const isEnglish = router.locale === "en";
  const copy = isEnglish
    ? {
        message: "This video requires marketing consent.",
        action: "Accept & Play",
      }
    : {
        message: "Den här videon kräver marknadsföringssamtycke.",
        action: "Acceptera och spela",
      };

  function acceptMarketingConsent() {
    const cookiebot = window.Cookiebot;
    const current = cookiebot?.consent || {};

    if (typeof cookiebot?.submitCustomConsent === "function") {
      cookiebot.submitCustomConsent(
        !!current.preferences,
        !!current.statistics,
        true
      );
      setAcceptedFromVideo(true);
      return;
    }

    if (current.marketing) {
      setAcceptedFromVideo(true);
      return;
    }

    if (typeof cookiebot?.renew === "function") {
      cookiebot.renew();
    }
  }

  if (marketing || acceptedFromVideo) {
    return (
      <iframe
        src={src}
        data-cookieconsent="marketing"
        title={title}
        className={iframeClassName || className}
        height={height}
        allow={allow}
        allowFullScreen={allowFullScreen}
        frameBorder={frameBorder}
      />
    );
  }

  return (
    <div
      className={`flex min-h-[220px] w-full items-center justify-center bg-[#061837] p-6 text-center text-white ${className}`}
      style={height ? { height } : undefined}
      data-cookieblock-src={src}
      data-cookieconsent="marketing"
      role="region"
      aria-label={title}
    >
      <div className="max-w-[360px]">
        <p className="font-montserrat text-[14px] font-semibold leading-[1.5]">
          {copy.message}
        </p>
        <button
          type="button"
          className="mt-4 cursor-pointer rounded-full border border-white/40 px-5 py-2 font-montserrat text-[12px] font-semibold uppercase tracking-wide text-white transition hover:border-white hover:bg-white/10"
          onClick={acceptMarketingConsent}
        >
          {copy.action}
        </button>
        <YouTubeWatchLink src={src} className="mt-3 block" />
      </div>
    </div>
  );
}
