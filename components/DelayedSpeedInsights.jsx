"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const SpeedInsights = dynamic(
  () => import("@vercel/speed-insights/next").then((m) => m.SpeedInsights),
  { ssr: false }
);

/** Mount Speed Insights after first seconds so it does not contend with LCP. */
export default function DelayedSpeedInsights() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const t = window.setTimeout(() => setShow(true), 8000);
    return () => window.clearTimeout(t);
  }, []);

  if (!show) return null;
  return <SpeedInsights />;
}
