// pages/_document.js
import Document, { Html, Head, Main, NextScript } from "next/document";
import { DEFAULT_LANG } from "../../lib/api";

class MyDocument extends Document {
  render() {
    const lang = this.props.__NEXT_DATA__.locale || this.props.__NEXT_DATA__.props.pageProps.lang || DEFAULT_LANG;

    let siteOrigin = "https://www.novoterm.se";
    try {
      const base = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_BASE_URL;
      if (base) siteOrigin = new URL(base).origin;
    } catch {
      /* ignore */
    }

    return (
      <Html lang={lang}>
        <Head>
          {/* Google Fonts CDN — preconnect so font files start loading before render */}
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />

          {siteOrigin ? (
            <>
              <link rel="dns-prefetch" href={siteOrigin} />
              <link rel="preconnect" href={siteOrigin} crossOrigin="" />
            </>
          ) : null}
          {/* Early connection hints for GTM and Cookiebot */}
          <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
          <link rel="preconnect" href="https://www.googletagmanager.com" />
          <link rel="dns-prefetch" href="https://consent.cookiebot.com" />
          <link rel="preconnect" href="https://consent.cookiebot.com" />
        </Head>

        <body className="antialiased">
          <noscript>
            <iframe
              src="https://www.googletagmanager.com/ns.html?id=GTM-PMXNC6T"
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            ></iframe>
          </noscript>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
