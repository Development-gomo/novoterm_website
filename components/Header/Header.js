import Link from "next/link";
import Dropdown from "./Dropdown";
import LanguageSwitcher from "./LanguageSwitcher";
import MobileMenu from "./MobileMenu";
import { useEffect, useState } from "react";




export default function Header({ logo, menu = [], languages = [], cta = {} }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const items = Array.isArray(menu) ? menu : [];
  const cleanMenu = items.filter(
    (item) => item.type !== "wpml_ls_menu_item"
  );

  return (
    <header
      className={`fixed top-0 left-0 w-full z-[9999] transition-all duration-300
        ${
          scrolled
            ? "bg-[#061837]/95 backdrop-blur-md shadow-lg"
            : "bg-transparent"
        }
      `}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center py-4 px-6">

        {/* Logo */}
        <Link href="/" className="shrink-0">
          <img
            src={logo}  className="h-[28px] md:h-[30px] lg:h-[32px]"
            alt="Logo"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden menu-font lg:flex items-center  gap-10">
          {cleanMenu.map((item) =>
            Array.isArray(item.children) && item.children.length > 0 ? (
              <Dropdown key={item.ID} item={item} />
            ) : (
              <Link
                key={item.ID}
                href={item.url || "#"}
                className="text-white hover:opacity-75">
                {item.title}
              </Link>
            )
          )}
        </nav>
        

        {/* Right Side */}
        <div className="flex items-center gap-4">

          {/* Language switcher – visible everywhere */}
          <LanguageSwitcher languages={languages} />

          {/* ❌ CTA – FORCE HIDDEN ON MOBILE */}
          {cta?.url && (
            <Link
              href={cta.url}
              className="btn-primary !hidden lg:!inline-flex"
            >
              Get in touch
            </Link>
          )}

          {/* ✅ Mobile menu – FORCE VISIBLE ON MOBILE */}
          <div className="lg:!hidden relative z-[10000] flex">
            <MobileMenu menu={cleanMenu} />
          </div>
        </div>
      </div>
    </header>
  );
}
