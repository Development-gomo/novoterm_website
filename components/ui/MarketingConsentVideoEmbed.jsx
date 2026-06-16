import { useCookieConsent } from "../../lib/hooks/useCookieConsent";
import { useRouter } from "next/router";
import { useState } from "react";

const DEFAULT_ALLOW =
  "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";

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
      </div>
    </div>
  );
}
