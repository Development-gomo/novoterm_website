// pages/_document.js
import Document, { Html, Head, Main, NextScript } from "next/document";
import { DEFAULT_LANG } from "../../lib/api";

class MyDocument extends Document {
  render() {
    const lang = this.props.__NEXT_DATA__.locale || this.props.__NEXT_DATA__.props.pageProps.lang || DEFAULT_LANG;

    let wpOrigin = "";
    try {
      const base = process.env.NEXT_PUBLIC_WP_URL;
      if (base) wpOrigin = new URL(base).origin;
    } catch {
      /* ignore */
    }

    return (
      <Html lang={lang}>
        <Head>
          <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
          <link rel="dns-prefetch" href="https://consent.cookiebot.com" />
          <link rel="preconnect" href="https://www.googletagmanager.com" crossOrigin="" />
          {wpOrigin ? (
            <link rel="preconnect" href={wpOrigin} crossOrigin="" />
          ) : null}
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
