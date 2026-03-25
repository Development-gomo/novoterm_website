import Link from "next/link";
import Dropdown from "./Dropdown";
import LanguageSwitcher from "./LanguageSwitcher";
import MobileMenu from "./MobileMenu";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { wpToPath } from "../../lib/api";

export default function Header({
  logo,
  menu = [],
  languages = [],
  cta = {},
  translations = null,
  main_menu = [],
  section_2_label = "Who we are",
  who_we_are_links = [],
  section_3_label = "Impact",
  impact_links = [],
  section_4_label = "Language"
}) {
  // Map ACF keys to expected names
  const mappedMainMenu = main_menu.map((item) => ({
    menu_title: item.field_69bd2ace72d20 || item.menu_title,
    submenu_items: (item.field_69bd2ae972d21 || item.submenu_items || []).map((sub) => ({
      submenu_title: sub.field_69bd2b0b72d22 || sub.submenu_title,
      submenu_link: sub.field_69bd2b1972d23?.url || sub.submenu_link,
      highlight: false // Add highlight logic if needed
    }))
  }));

  const mappedWhoWeAreLinks = (who_we_are_links || []).map((link) => ({
    link_title: link.field_69bd2b6e72d26 || link.link_title,
    link_url: link.field_69bd2b7b72d27?.url || link.link_url
  }));

  const mappedImpactLinks = (impact_links || []).map((link) => ({
    link_title: link.field_69bd2c2872d29 || link.link_title,
    link_url: link.field_69bd2c2872d2a?.url || link.link_url
  }));
  const [scrolled, setScrolled] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  // Set the first menu as default active
  const [activeMegaMenu, setActiveMegaMenu] = useState(
    main_menu && main_menu.length > 0
      ? main_menu[0].field_69bd2ace72d20 || main_menu[0].menu_title
      : ""
  );
  const router = useRouter();

  // Blog single pages have a light hero, so header needs solid bg from the start
  const isBlogSingle = /^\/blog\/.+/.test(router.asPath);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Disable scroll when mega menu is open
  useEffect(() => {
    if (megaMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [megaMenuOpen]);

  const items = Array.isArray(menu) ? menu : [];
  const cleanMenu = items.filter(
    (item) => item.type !== "wpml_ls_menu_item"
  );

  return (
    <header
      className={`fixed top-0 left-0 w-full z-[9999] transition-all duration-300
        ${
          scrolled || isBlogSingle
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
            <>
              <Link
                href={wpToPath(cta.url)}
                className="btn-primary !hidden lg:!inline-flex"
              >
                {cta.text || "Get in touch"}
              </Link>
              {/* Hamburger menu for desktop */}
              <button
                className="hidden lg:flex items-center justify-center ml-2 p-2 bg-transparent border-none cursor-pointer"
                aria-label="Open Mega Menu"
                onClick={() => setMegaMenuOpen(true)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="13" viewBox="0 0 24 13" fill="none">
                  <line x1="0.5" y1="6.2143" x2="17.7857" y2="6.2143" stroke="white" strokeLinecap="round" />
                  <line x1="0.5" y1="11.9286" x2="10.9286" y2="11.9286" stroke="white" strokeLinecap="round" />
                  <line x1="0.5" y1="0.5" x2="23.5" y2="0.5" stroke="white" strokeLinecap="round" />
                </svg>
              </button>
            </>
          )}

          <div className="lg:hidden flex">
            <MobileMenu menu={cleanMenu} logo={logo} />
          </div>

          {/* Fullscreen Mega Menu */}
          {megaMenuOpen && (
            <div className="fixed top-0 left-0 w-screen h-screen z-[99999] bg-[#061837] flex flex-col transition-all overflow-hidden" style={{ backgroundColor: '#061837' }}>
              {/* Close button */}
              <button
                className="absolute top-8 right-8 text-white text-3xl p-2"
                aria-label="Close Mega Menu"
                onClick={() => setMegaMenuOpen(false)}
                style={{ zIndex: 100000 }}
              >
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <line x1="8" y1="8" x2="24" y2="24" stroke="white" strokeWidth="2" strokeLinecap="round" />
                  <line x1="24" y1="8" x2="8" y2="24" stroke="white" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
              <div className="web-width flex flex-1 w-full h-full flex-col py-10 justify-between" style={{ minHeight: '0' }}>
                {/* Section 1: Main menu and submenu (dynamic) */}
                <div className="flex flex-row mb-18 flex-shrink-0">
                  <div className="w-[584px]">
                    <nav className="flex flex-col gap-1 text-white text-[40px]  font-heading">
                      {mappedMainMenu.map((item, idx) => (
                        <span
                          key={item.menu_title || idx}
                          className={activeMegaMenu === item.menu_title ? "font-bold text-white" : "opacity-20 hover:opacity-100 cursor-pointer"}
                          onMouseEnter={() => setActiveMegaMenu(item.menu_title)}
                          style={{ pointerEvents: activeMegaMenu === item.menu_title ? 'none' : 'auto' }}
                        >
                          {item.menu_title}
                        </span>
                      ))}
                    </nav>
                  </div>
                  <div className="w-2/3 pr-24">
                    {mappedMainMenu.map((item, idx) => (
                      activeMegaMenu === item.menu_title && item.submenu_items && item.submenu_items.length > 0 && (
                        <div key={item.menu_title || idx} className="flex flex-row gap-8 mt-2">
                          {/* Split submenu_items into two columns */}
                          {(() => {
                            const half = Math.ceil(item.submenu_items.length / 2);
                            const col1 = item.submenu_items.slice(0, half);
                            const col2 = item.submenu_items.slice(half);
                            return (
                              <>
                                <ul className="flex flex-col gap-1 text-[#b6c2e2] text-[18px] font-normal  w-1/2">
                                  {col1.map((sub, subIdx) => (
                                    <li key={sub.submenu_title || subIdx} style={{ marginBottom: '0.15rem' }}>
                                      {sub.submenu_link ? (
                                        <Link href={sub.submenu_link}>
                                          • {sub.submenu_title}
                                        </Link>
                                      ) : (
                                        <>• {sub.submenu_title}</>
                                      )}
                                    </li>
                                  ))}
                                </ul>
                                <ul className="flex flex-col gap-1 text-[#b6c2e2] text-[18px] font-normal  w-1/2">
                                  {col2.map((sub, subIdx) => (
                                    <li key={sub.submenu_title || subIdx} style={{ marginBottom: '0.15rem' }}>
                                      {sub.submenu_link ? (
                                        <Link href={sub.submenu_link}>
                                          • {sub.submenu_title}
                                        </Link>
                                      ) : (
                                        <>• {sub.submenu_title}</>
                                      )}
                                    </li>
                                  ))}
                                </ul>
                              </>
                            );
                          })()}
                        </div>
                      )
                    ))}
                  </div>
                </div>
                {/* Section 2: Who we are (dynamic) */}
                <div className="flex flex-row mb-12 flex-shrink-0">
                  <div className="w-[584px]">
                    <span className="text-[#7b8bbd] text-[1rem] font-montserrat">{section_2_label}</span>
                  </div>
                  <div className="w-2/3 pr-24 flex">
                    <ul className="flex flex-col gap-1">
                      {mappedWhoWeAreLinks.map((link, idx) => (
                        <li key={link.link_title || idx} className="text-white font-thin text-[22px]" style={{ marginBottom: '0.15rem' }}>
                          {link.link_url ? (
                            <Link href={link.link_url}>{link.link_title}</Link>
                          ) : link.link_title}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                {/* Section 3: Impact (dynamic) */}
                <div className="flex flex-row mb-12 flex-shrink-0">
                  <div className="w-[584px]">
                    <span className="text-[#7b8bbd] text-[1rem] font-montserrat">{section_3_label}</span>
                  </div>
                  <div className="w-2/3 pr-24 flex">
                    <ul className="flex flex-col gap-1">
                      {mappedImpactLinks.map((link, idx) => (
                        <li key={link.link_title || idx} className="text-white font-thin text-[22px]" style={{ marginBottom: '0.15rem' }}>
                          {link.link_url ? (
                            <Link href={link.link_url}>{link.link_title}</Link>
                          ) : link.link_title}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                {/* Section 4: Language (label from ACF, LanguageSwitcher module) */}
                <div className="flex flex-row flex-shrink-0">
                  <div className="w-[584px]">
                    <span className="text-[#7b8bbd] text-[1rem] font-montserrat">{section_4_label}</span>
                  </div>
                  <div className="w-2/3 pr-24 flex items-center">
                    <LanguageSwitcher languages={languages} translations={translations} />
                  </div>
                </div>
              </div>
              {/* Decorative circle bottom right */}
              <img
                src="/hamburger_menu_logo.png"
                alt="Hamburger Menu Logo"
                className="absolute bottom-0 right-0 w-[331px] h-[408px] object-contan"
                style={{ zIndex: 1 }}
              />
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
