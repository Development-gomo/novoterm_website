import { useState, useEffect } from "react";
import Link from "next/link";

export default function MobileMenu({ menu = [], logo }) {
  const [open, setOpen] = useState(false);

  // 🔒 LOCK BODY SCROLL
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      {/* ☰ Hamburger */}
      <button
        onClick={() => setOpen(true)}
        className="lg:hidden text-white text-3xl w-10 h-10 flex items-center justify-center z-[10001]"
        aria-label="Open menu"
      >
        ☰
      </button>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/60 z-[10000]"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Drawer */}
      {open && (
        <aside
          className="fixed top-0 right-0 h-full w-[320px] max-w-[85vw]
                     bg-[#0B2347] text-white z-[10001]
                     flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
            {logo ? (
              <img src={logo} alt="Logo" className="h-7" />
            ) : (
              <span className="text-xl font-semibold">Menu</span>
            )}

            <button
              onClick={() => setOpen(false)}
              className="text-3xl leading-none"
              aria-label="Close menu"
            >
              ×
            </button>
          </div>

          {/* Menu */}
          <nav className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
            {menu.map((item) => (
              <div key={item.ID} className="space-y-3">
                <p className="text-sm uppercase tracking-wider text-white/60">
                  {item.title}
                </p>


                {Array.isArray(item.child_items) && (
                  <ul className="space-y-2">
                    {item.child_items.map((sub) => (
                      <li key={sub.ID}>
                        <Link
                          href={sub.url}
                          onClick={() => setOpen(false)}
                          className="flex items-center gap-2 text-white/90 hover:text-white transition"
                        >
                          <span className="opacity-50">–</span>
                          <span>{sub.title}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}

                <div className="border-b border-white/10 pt-4" />
              </div>
            ))}
          </nav>
        </aside>
      )}
    </>
  );
}
