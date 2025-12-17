import Link from "next/link";
import Dropdown from "./Dropdown";
import LanguageSwitcher from "./LanguageSwitcher";
import MobileMenu from "./MobileMenu";
import { useEffect, useState } from "react";

export default function Header({ logo, menu = [], languages = [], cta = {} }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 50);
    }

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const items = Array.isArray(menu) ? menu : [];

  // Remove WPML menu items
  const cleanMenu = items.filter((item) => item.type !== "wpml_ls_menu_item");

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 
        ${scrolled ? "bg-[#061837]/95 backdrop-blur-md shadow-lg" : "bg-transparent"}
      `}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center py-4 px-6">

        {/* Logo */}
        <Link href="/">
          <img src={logo} className="h-[28px] md:h-[30px] lg:h-[32px] w-auto" alt="Logo" />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-10">
          {cleanMenu.map((item) =>
            Array.isArray(item.children) && item.children.length > 0 ? (
              <Dropdown key={item.ID} item={item} />
            ) : (
              <Link
                key={item.ID}
                href={item.url || "#"}
                className="text-white font-medium hover:opacity-75"
              >
                {item.title}
              </Link>
            )
          )}
        </nav>

        {/* Right Side */}
        <div className="flex items-center gap-6">
          <LanguageSwitcher languages={languages} />

          {cta?.url && (
            <Link href={cta.url} className="btn-primary">
              {cta.text}
            </Link>
          )}

          <MobileMenu menu={cleanMenu} />
        </div>
      </div>
    </header>
  );
}
