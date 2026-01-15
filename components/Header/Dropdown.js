import { useState, useRef, useEffect } from "react";
import Link from "next/link";

export default function Dropdown({ item }) {
  const [open, setOpen] = useState(false);
  const timeoutRef = useRef(null);
  const containerRef = useRef(null);

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
    timeoutRef.current = setTimeout(() => setOpen(false), 180);
  }

  function toggleClick(e) {
    e.preventDefault();
    setOpen((s) => !s);
  }

  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

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
      {/* Parent label */}
      <button
        onClick={toggleClick}
        className="text-white font-medium flex items-center gap-2 hover:opacity-90 focus:outline-none"
        aria-expanded={open}
        aria-haspopup="true"
      >
        <span>{item.title}</span>

        {/* SVG Arrow */}
        <span
          className={`transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="6"
            viewBox="0 0 12 6"
            fill="none"
          >
            <path
              d="M5.625 6C5.525 6 5.4375 5.9625 5.3625 5.8875L0.1125 0.6375C-0.0375 0.4875 -0.0375 0.25 0.1125 0.1125C0.2625 -0.0375 0.5 -0.0375 0.6375 0.1125L5.625 5.1L10.6125 0.1125C10.7625 -0.0375 11 -0.0375 11.1375 0.1125C11.2875 0.2625 11.2875 0.5 11.1375 0.6375L5.8875 5.8875C5.8125 5.9625 5.725 6 5.625 6Z"
              fill="white"
            />
          </svg>
        </span>
      </button>

      {/* Dropdown panel */}
      {open && childArray.length > 0 && (
        <div
          className="absolute   left-0 top-full mt-1 bg-white text-black rounded-lg shadow-lg p-3 min-w-[220px] z-50 font-montserrat text-[14px]"
          role="menu"
          onMouseEnter={openNow}
          onMouseLeave={closeSoon}
        >
          {childArray.map((sub) => (
            <Link
              key={sub.ID || sub.id || sub.title}
              href={sub.url || "#"}
              className="block py-2   font-montserrat text-[14px] px-2 text-gray-800 hover:text-blue-600"
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
