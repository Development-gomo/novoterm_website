import Router from "next/router";
import { useEffect, useRef, useState } from "react";

// Thin top bar shown during client-side page navigation. Progress trickles
// towards 90% while the next page loads, then completes and fades out.
export default function RouteProgressBar() {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const trickleRef = useRef(null);
  const hideRef = useRef(null);

  useEffect(() => {
    function clearTimers() {
      clearInterval(trickleRef.current);
      clearTimeout(hideRef.current);
    }

    function start(url, { shallow } = {}) {
      // Shallow and same-page hash changes don't load anything.
      const [nextPath] = url.split("#");
      const [currentPath] = Router.asPath.split("#");
      if (shallow || nextPath === currentPath) return;

      clearTimers();
      setVisible(true);
      setProgress(10);
      trickleRef.current = setInterval(() => {
        setProgress((value) => (value < 90 ? value + (90 - value) * 0.1 : value));
      }, 200);
    }

    function done() {
      clearInterval(trickleRef.current);
      setProgress(100);
      hideRef.current = setTimeout(() => {
        setVisible(false);
        setProgress(0);
      }, 300);
    }

    Router.events.on("routeChangeStart", start);
    Router.events.on("routeChangeComplete", done);
    Router.events.on("routeChangeError", done);

    return () => {
      clearTimers();
      Router.events.off("routeChangeStart", start);
      Router.events.off("routeChangeComplete", done);
      Router.events.off("routeChangeError", done);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-[10000] h-[3px] w-full"
      style={{ opacity: visible ? 1 : 0, transition: "opacity 300ms ease" }}
    >
      <div
        className="h-full bg-[#2655C4] shadow-[0_0_8px_#2655C4]"
        style={{ width: `${progress}%`, transition: "width 200ms ease-out" }}
      />
    </div>
  );
}
