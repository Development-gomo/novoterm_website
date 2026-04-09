"use client";

import { useEffect, useRef, useState } from "react";

/** Delays mounting children until near viewport — cuts Swiper/JS cost during LCP. */
export default function LazyWhenVisible({
  children,
  minHeight = 360,
  rootMargin = "160px",
}) {
  const ref = useRef(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (show) return;
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setShow(true);
      return;
    }
    const ob = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShow(true);
          ob.disconnect();
        }
      },
      { rootMargin, threshold: 0.01 }
    );
    ob.observe(el);
    return () => ob.disconnect();
  }, [show, rootMargin]);

  return (
    <div ref={ref} style={{ minHeight: show ? undefined : minHeight }}>
      {show ? children : null}
    </div>
  );
}
