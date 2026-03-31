import "@/styles/globals.css";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import {
  getHeaderData,
  getMainMenu,
  getFooterData,
  getHamburgerMenu,
  getMegaMenu,
  DEFAULT_LANG,
} from "../../lib/api";

import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";

import { Montserrat, Cabin, Merriweather } from "next/font/google";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-montserrat",
});

const merriweather = Merriweather({
  subsets: ["latin-ext"],
  style: ["normal", "italic"],
  weight: ["300", "400", "600"],
  variable: "--font-merriweather",
  display: "swap",
});

const cabin = Cabin({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cabin",
});

function buildHeaderData(header, menu) {
  return {
    logo: header.logo?.url,
    cta: { text: header.cta_text, url: header.cta_url },
    languages: Object.values(header.languages || {}),
    menu: Array.isArray(menu.items) ? menu.items : menu,
  };
}

export default function MyApp({
  Component,
  pageProps,
  initialHeader,
  initialFooter,
  initialHamburgerMenu,
  initialMegaMenu,
}) {
  const router = useRouter();
  const lang = router.locale || DEFAULT_LANG;

  const [headerData, setHeaderData] = useState(initialHeader || null);
  const [footerData, setFooterData] = useState(initialFooter || null);
  const [hamburgerMenuData, setHamburgerMenuData] = useState(initialHamburgerMenu || null);
  const [megaMenuData, setMegaMenuData] = useState(initialMegaMenu || null);
  useEffect(() => {
    if (initialMegaMenu) {
      setMegaMenuData(initialMegaMenu);
      return;
    }
    async function loadMegaMenu() {
      try {
        const data = await getMegaMenu(lang);
        setMegaMenuData(data?.items || []);
      } catch (err) {
        console.error("MEGA MENU LOAD ERROR:", err);
      }
    }
    loadMegaMenu();
  }, [lang, initialMegaMenu]);

  // Keep <html lang> in sync with the active locale
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  // Re-fetch header + menu on client-side locale changes
  useEffect(() => {
    // Prefer server-provided data for each route/locale transition.
    // This avoids stale menu state while waiting for client fetches.
    if (initialHeader) {
      setHeaderData(initialHeader);
      return;
    }

    async function loadHeader() {
      try {
        const [header, menu] = await Promise.all([
          getHeaderData(lang),
          getMainMenu(lang),
        ]);
        setHeaderData(buildHeaderData(header, menu));
      } catch (err) {
        console.error("HEADER LOAD ERROR:", err);
      }
    }
    loadHeader();
  }, [lang, initialHeader]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (initialFooter) {
      setFooterData(initialFooter);
      return;
    }

    async function loadFooter() {
      try {
        const footer = await getFooterData(lang);
        setFooterData(footer);
      } catch (err) {
        console.error("FOOTER LOAD ERROR:", err);
      }
    }
    loadFooter();
  }, [lang, initialFooter]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (initialHamburgerMenu) {
      setHamburgerMenuData(initialHamburgerMenu);
      return;
    }
    async function loadHamburgerMenu() {
      try {
        const data = await getHamburgerMenu(lang);
        setHamburgerMenuData(data);
      } catch (err) {
        console.error("HAMBURGER MENU LOAD ERROR:", err);
      }
    }
    loadHamburgerMenu();
  }, [lang, initialHamburgerMenu]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className={`${montserrat.variable} ${merriweather.variable} ${cabin.variable}`}>
      {headerData && (
        <Header
          {...headerData}
          {...hamburgerMenuData}
          megaMenuData={megaMenuData}
          translations={pageProps.translations || null}
        />
      )}
      <Component {...pageProps} lang={lang} />
      {footerData && <Footer data={footerData} />}
    </div>
  );
}

MyApp.getInitialProps = async ({ Component, ctx }) => {
  const lang = ctx.locale || DEFAULT_LANG;

  // Fetch header, menu, footer, hamburger menu, mega menu in parallel on the server
  const [header, menu, footer, hamburgerMenu, megaMenu] = await Promise.all([
    getHeaderData(lang).catch(() => null),
    getMainMenu(lang).catch(() => null),
    getFooterData(lang).catch(() => null),
    getHamburgerMenu(lang).catch(() => null),
    getMegaMenu(lang).catch(() => null),
  ]);

  let pageProps = {};
  if (Component.getInitialProps) {
    pageProps = await Component.getInitialProps(ctx);
  }

  return {
    pageProps,
    initialHeader: header && menu ? buildHeaderData(header, menu) : null,
    initialFooter: footer,
    initialHamburgerMenu: hamburgerMenu,
    initialMegaMenu: megaMenu?.items || [],
  };
};
