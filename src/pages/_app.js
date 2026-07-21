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
import DeferredGtm from "../../components/DeferredGtm";
// DeferredCookiebot removed - GTM handles Cookiebot via its integration (implementation=gtm)
import DelayedSpeedInsights from "../../components/DelayedSpeedInsights";
import PreviewBanner from "../../components/PreviewBanner";

import { Montserrat, Cabin, Merriweather } from "next/font/google";

// const archivo = Archivo({
//   subsets: ["latin"],
//   weight: ["400", "600", "700"],
//   variable: "--font-archivo",
//   display: "swap",
// });

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-montserrat",
  display: "swap",
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
  display: "swap",
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
}) {
  const router = useRouter();
  const lang = router.locale || DEFAULT_LANG;

  const [headerData, setHeaderData] = useState(null);
  const [footerData, setFooterData] = useState(null);
  const [hamburgerMenuData, setHamburgerMenuData] = useState(null);
  const [megaMenuData, setMegaMenuData] = useState(null);
  useEffect(() => {
    async function loadMegaMenu() {
      try {
        const data = await getMegaMenu(lang);
        setMegaMenuData(data?.items || []);
      } catch (err) {
        console.error("MEGA MENU LOAD ERROR:", err);
      }
    }
    loadMegaMenu();
  }, [lang]);

  // Keep <html lang> in sync with the active locale
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  // Re-fetch header + menu on client-side locale changes
  useEffect(() => {
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
  }, [lang]);

  useEffect(() => {
    async function loadFooter() {
      try {
        const footer = await getFooterData(lang);
        setFooterData(footer);
      } catch (err) {
        console.error("FOOTER LOAD ERROR:", err);
      }
    }
    loadFooter();
  }, [lang]);

  useEffect(() => {
    async function loadHamburgerMenu() {
      try {
        const data = await getHamburgerMenu(lang);
        setHamburgerMenuData(data);
      } catch (err) {
        console.error("HAMBURGER MENU LOAD ERROR:", err);
      }
    }
    loadHamburgerMenu();
  }, [lang]);

  return (
    <>
      {/* Cookiebot is handled by GTM via its integration (implementation=gtm) */}
      {/* GTM — consent-gated internally via GTM's Cookiebot integration */}
      <DeferredGtm />

    <div className={`${montserrat.variable} ${merriweather.variable} ${cabin.variable}`}>
      {headerData && (
        <Header
          {...headerData}
          {...hamburgerMenuData}
          megaMenuData={megaMenuData}
          translations={pageProps.translations || null}
        />
      )}
      {pageProps.isPreview && <PreviewBanner />}
      <Component {...pageProps} lang={lang} />
      {footerData && <Footer data={footerData} />}
      <DelayedSpeedInsights />
    </div>
    </>
  );
}
