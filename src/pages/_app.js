// /src/pages/_app.js
import "@/styles/globals.css";
import { useRouter } from "next/router";
import Head from "next/head";
import { useEffect, useState } from "react";

import { getHeaderData, getMainMenu, getFooterData } from "../../lib/api";

import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";

import { Montserrat, Cabin, Merriweather } from "next/font/google";

// Fonts
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

// MAIN APP
export default function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const path = router.asPath || "";
  const lang = path.startsWith("/en") ? "en" : "sv";

  const [headerData, setHeaderData] = useState(null);
  const [footerData, setFooterData] = useState(null);

    //  UPDATE <html lang> ON ROUTE CHANGE
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  // LOAD HEADER + MENU
  useEffect(() => {
    async function loadHeader() {
      try {
        const header = await getHeaderData();
        const menu = await getMainMenu();

        setHeaderData({
          logo: header.logo?.url,
          cta: {
            text: header.cta_text,
            url: header.cta_url,
          },
          languages: Object.values(header.languages || {}),
          menu: Array.isArray(menu.items) ? menu.items : menu,
        });
      } catch (err) {
        console.error("HEADER LOAD ERROR:", err);
      }
    }

    loadHeader();
  }, []);

  // LOAD FOOTER
  useEffect(() => {
    async function loadFooter() {
      try {
        const footer = await getFooterData();
        setFooterData(footer);
      } catch (err) {
        console.error("FOOTER LOAD ERROR:", err);
      }
    }

    loadFooter();
  }, []);

  return (
    <div className={`${montserrat.variable} ${merriweather.variable} ${cabin.variable}`}>
      
      {/* GLOBAL HEADER */}
      {headerData && <Header {...headerData} />}

      {/* PAGE CONTENT */}
      <Component {...pageProps} lang={lang} />

      {/* GLOBAL FOOTER */}
      {footerData && <Footer data={footerData} />}

    </div>
  );
}
