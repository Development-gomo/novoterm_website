import { useState } from "react";
import Link from "next/link";

export default function MobileMenu({ menu }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Hamburger Icon */}
      <button onClick={() => setOpen(true)} className="lg:hidden">
        <img src="/menu.svg" alt="menu" className="h-7" />
      </button>

      {/* Background Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-[60]"
          onClick={() => setOpen(false)}
        ></div>
      )}

      {/* Slide-in Drawer */}
      <div
        className={`fixed top-0 right-0 w-64 h-full bg-white text-black p-6 z-[70] transform transition-transform ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <button className="text-3xl mb-6" onClick={() => setOpen(false)}>
          ×
        </button>

        <nav className="flex flex-col gap-4">
          {menu.map((item) =>
            item.child_items ? (
              <details key={item.ID} className="mb-2">
                <summary className="cursor-pointer font-medium text-lg">
                  {item.title}
                </summary>
                <div className="ml-4 mt-2">
                  {item.child_items.map((sub) => (
                    <Link
                      key={sub.ID}
                      href={sub.url}
                      className="block py-1 text-gray-700"
                    >
                      {sub.title}
                    </Link>
                  ))}
                </div>
              </details>
            ) : (
              <Link
                key={item.ID}
                href={item.url}
                className="text-lg font-medium"
              >
                {item.title}
              </Link>
            )
          )}
        </nav>
      </div>
    </>
  );
}
