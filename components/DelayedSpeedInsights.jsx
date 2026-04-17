"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const SpeedInsights = dynamic(
  () => import("@vercel/speed-insights/next").then((m) => m.SpeedInsights),
  { ssr: false }
);

/** Mount Speed Insights after user is done interacting (10+ seconds). */
export default function DelayedSpeedInsights() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Delay SpeedInsights even more to not contend with any LCP or user interactions
    const t = window.setTimeout(() => setShow(true), 12000);
    return () => window.clearTimeout(t);
  }, []);

  if (!show) return null;
  return <SpeedInsights />;
}
