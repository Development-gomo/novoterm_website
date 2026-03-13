import Link from "next/link";
import Dropdown from "./Dropdown";
import LanguageSwitcher from "./LanguageSwitcher";
import MobileMenu from "./MobileMenu";
import { useEffect, useState } from "react";
import { wpToPath } from "../../lib/api";

export default function Header({ logo, menu = [], languages = [], cta = {}, translations = null }) {
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
      <div className=" mx-auto flex justify-between items-center py-4 px-6 lg:py-4 lg:px-0 web-width">

        {/* Logo */}
        <Link href="/" className="shrink-0">
          <img
            src={logo}  className="h-7 md:h-[30px] lg:h-8"
            alt="Novoterm Logo"
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
                href={wpToPath(item.url)}
                className="text-white hover:opacity-75 text-[14px] font-normal font-montserrat">
                {item.title}
              </Link>
            )
          )}
        </nav>
        <div className="flex items-center gap-4">

          {/* Language switcher – visible everywhere */}
          <LanguageSwitcher languages={languages} translations={translations} />

          {/* CTA button – hidden on mobile, shown on desktop */}
          {cta?.url && (
            <Link
              href={wpToPath(cta.url)}
              className="btn-primary !hidden lg:!inline-flex"
            >
              {cta.text || "Get in touch"}
            </Link>
          )}

          <div className="lg:hidden flex">
            <MobileMenu menu={cleanMenu} logo={logo} />
          </div>
        </div>
      </div>
    </header>
  );
}
