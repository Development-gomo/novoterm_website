import { useState, useEffect } from "react";
import Link from "next/link";
import { wpToPath } from "../../lib/api";

export default function MobileMenu({ menu = [], logo }) {
  const [open, setOpen] = useState(false);
  const [openItems, setOpenItems] = useState({});

  const toggleItem = (id) =>
    setOpenItems((prev) => ({ ...prev, [id]: !prev[id] }));

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      {/* Hamburger */}
      <button
        onClick={() => setOpen(true)}
        className="text-white text-3xl w-10 h-10 flex items-center justify-center z-[10001]"
        aria-label="Open menu"
      >
        ☰
      </button>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/60 z-[10001]"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Drawer */}
      {open && (
        <aside
          className="fixed top-0 right-0 h-screen w-[320px] max-w-[85vw]
                     bg-[#0B2347] text-white z-[10002]
                     flex flex-col overflow-hidden"
        >
          {/* Drawer Header */}
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

          {/* Menu Items */}
          <nav className="flex-1 overflow-y-auto px-6 py-4">
            {menu.map((item) => {
              const subItems =
                Array.isArray(item.child_items) && item.child_items.length > 0
                  ? item.child_items
                  : Array.isArray(item.children) && item.children.length > 0
                  ? item.children
                  : [];
              const hasChildren = subItems.length > 0;
              const isOpen = openItems[item.ID];

              return (
                <div key={item.ID} className="border-b border-white/10">
                  <div className="flex items-center justify-between py-3">
                    <Link
                      href={wpToPath(item.url)}
                      onClick={() => setOpen(false)}
                      className="text-white font-medium hover:opacity-80 transition"
                    >
                      {item.title}
                    </Link>
                    {hasChildren && (
                      <button
                        onClick={() => toggleItem(item.ID)}
                        className="text-white/60 hover:text-white px-2 py-1 text-lg leading-none"
                        aria-label="Toggle submenu"
                      >
                        {isOpen ? "−" : "+"}
                      </button>
                    )}
                  </div>

                  {hasChildren && isOpen && (
                    <ul className="pb-3 pl-3 space-y-2">
                      {subItems.map((sub) => (
                        <li key={sub.ID}>
                          <Link
                            href={wpToPath(sub.url)}
                            onClick={() => setOpen(false)}
                            className="flex items-center gap-2 text-white/75 hover:text-white transition text-sm"
                          >
                            <span className="opacity-50">–</span>
                            <span>{sub.title}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </nav>
        </aside>
      )}
    </>
  );
}
