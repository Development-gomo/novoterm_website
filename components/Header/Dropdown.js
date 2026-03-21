import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { wpToPath } from "../../lib/api";

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
        className="text-white font-normal flex items-center gap-2 hover:opacity-90 focus:outline-none text-[14px] font-montserrat"
        aria-expanded={open}
        aria-haspopup="true"
      >
        <span>{item.title}</span>
        <span
          className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
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

      {/* Dropdown panel - three column card style, dynamic from menu structure */}
      {open && (
        <div
          className="absolute left-0 top-full mt-2 bg-white text-black rounded-xl shadow-2xl p-0 min-w-[900px] z-50 font-montserrat text-[15px] flex gap-0"
          role="menu"
          onMouseEnter={openNow}
          onMouseLeave={closeSoon}
        >
          {/* First column: dynamically render if children exist */}
          <div className="flex-1 bg-[#f4f8fd] rounded-tl-xl rounded-bl-xl p-6 flex flex-col min-w-[300px] max-w-[350px] border-r border-gray-200">
            <div className="font-bold text-2xl text-[#1a2a43] mb-2">{item.title}</div>
            {item.description && (
              <div className="text-[#1a2a43] text-[15px] mb-6">{item.description}</div>
            )}
            <button className="w-10 h-10 flex items-center justify-center bg-[#2956d3] rounded mb-6 hover:bg-blue-700 transition-colors" aria-label={item.title}>
              <svg width="22" height="22" fill="none" viewBox="0 0 18 18"><path d="M7 13l5-4-5-4v8z" fill="#fff"/></svg>
            </button>
            <div className="flex flex-col gap-0 mt-auto">
              {childArray.map((sub, idx) => (
                <a
                  key={sub.ID || sub.id || sub.title}
                  href={wpToPath(sub.url) || '#'}
                  className={`flex items-center group py-3 border-b border-dotted border-[#dbe6f7] ${idx === 0 ? 'text-[#2956d3] font-semibold' : 'text-[#1a2a43] font-medium'} ${sub.italic ? 'italic' : ''}`}
                >
                  {idx === 0 ? (
                    <span className="w-2 h-2 rounded-full bg-[#2956d3] mr-3"></span>
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-transparent border border-[#dbe6f7] mr-3"></span>
                  )}
                  <span className={idx === 0 ? 'underline' : ''}>{sub.title}</span>
                  <span className={`ml-auto ${idx === 0 ? 'text-[#2956d3]' : 'text-[#1a2a43]'}`}>
                    <svg width="22" height="22" fill="none" viewBox="0 0 18 18"><path d="M7 13l5-4-5-4v8z" fill="currentColor"/></svg>
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* Second column: example static, replace with dynamic if needed */}
          <div className="flex-1 bg-[#f7f7fa] p-6 flex flex-col min-w-[300px] max-w-[350px] border-r border-gray-200">
            <div className="font-bold text-2xl text-[#1a2a43] mb-2">Language editing</div>
            <div className="text-[#1a2a43] text-[15px] mb-6">Our language editing combines linguistic precision and context ensuring your message reads naturally and communicates effectively.</div>
            <button className="w-10 h-10 flex items-center justify-center bg-[#2956d3] rounded mb-6 hover:bg-blue-700 transition-colors" aria-label="Go to Language editing">
              <svg width="22" height="22" fill="none" viewBox="0 0 18 18"><path d="M7 13l5-4-5-4v8z" fill="#fff"/></svg>
            </button>
            <div className="flex flex-col gap-0 mt-auto">
              <a href="#" className="flex items-center text-[#1a2a43] font-semibold group py-3 border-b border-dotted border-[#e2e2ea]">
                <span className="font-semibold">Proofreading</span>
                <span className="ml-auto text-[#1a2a43]">
                  <svg width="22" height="22" fill="none" viewBox="0 0 18 18"><path d="M7 13l5-4-5-4v8z" fill="currentColor"/></svg>
                </span>
              </a>
              <a href="#" className="flex items-center text-[#1a2a43] font-semibold group py-3 border-b border-dotted border-[#e2e2ea]">
                <span className="font-semibold">Copy editing</span>
                <span className="ml-auto text-[#1a2a43]">
                  <svg width="22" height="22" fill="none" viewBox="0 0 18 18"><path d="M7 13l5-4-5-4v8z" fill="currentColor"/></svg>
                </span>
              </a>
              <a href="#" className="flex items-center text-[#1a2a43] font-semibold group py-3 border-b border-dotted border-[#e2e2ea] italic">
                <span>Language review</span>
                <span className="ml-auto text-[#1a2a43]">
                  <svg width="22" height="22" fill="none" viewBox="0 0 18 18"><path d="M7 13l5-4-5-4v8z" fill="currentColor"/></svg>
                </span>
              </a>
            </div>
          </div>

          {/* Image column */}
          <div className="flex-1 min-w-[260px] max-w-[350px] rounded-tr-xl rounded-br-xl overflow-hidden flex items-stretch">
            <img src="/thumbnail.jpg" alt="Menu visual" className="object-cover w-full h-full" />
          </div>
        </div>
      )}
    </div>
  );
}
