import { useState, useRef, useEffect } from "react";
import Link from "next/link";

/**
 * Robust Dropdown:
 * - safe child detection (many possible keys)
 * - mouse enter/leave with short delay to avoid flicker
 * - click to toggle (useful for touch)
 * - accessible: Esc to close, focus handling
 */
export default function Dropdown({ item }) {
  const [open, setOpen] = useState(false);
  const timeoutRef = useRef(null);
  const containerRef = useRef(null);

  // Support multiple possible child keys (child_items, children, submenu)
  const children =
    item?.child_items ||
    item?.children ||
    item?.submenu ||
    item?.child ||
    [];
  const childArray = Array.isArray(children) ? children : [];

  function openNow() {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setOpen(true);
  }
  function closeSoon() {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setOpen(false), 180); // small delay prevents flicker
  }

  // Toggle on click (useful for mobile / keyboard)
  function toggleClick(e) {
    e.preventDefault();
    setOpen((s) => !s);
  }

  // Close on Esc
  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Optional: close if clicked outside
  useEffect(() => {
    function onDocClick(e) {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open]);

  return (
    <div
      ref={containerRef}
      className="relative"
      onMouseEnter={openNow}
      onMouseLeave={closeSoon}
    >
      {/* Parent label — keep it focusable */}
      <button
        onClick={toggleClick}
        className="text-white font-medium flex items-center gap-1 hover:opacity-90 focus:outline-none"
        aria-expanded={open}
        aria-haspopup="true"
      >
        <span>{item.title}</span>
        <span className={`transition-transform ${open ? "rotate-180" : ""}`}>▾</span>
      </button>

      {/* Dropdown panel */}
      {open && childArray.length > 0 && (
        <div
          className="absolute left-0 top-full mt-1 bg-white text-black rounded-lg shadow-lg p-3 min-w-[220px] z-50"
          role="menu"
          onMouseEnter={openNow}
          onMouseLeave={closeSoon}
          style={{ willChange: "transform, opacity" }}
        >
          {childArray.map((sub) => (
            <Link
              key={sub.ID || sub.id || sub.title}
              href={sub.url || "#"}
              className="block py-2 px-2 text-gray-800 hover:text-blue-600"
              role="menuitem"
            >
              {sub.title}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
