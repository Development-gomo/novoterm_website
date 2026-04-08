// pages/_document.js
import Document, { Html, Head, Main, NextScript } from "next/document";
import { DEFAULT_LANG } from "../../lib/api";

class MyDocument extends Document {
  render() {
    const lang = this.props.__NEXT_DATA__.locale || this.props.__NEXT_DATA__.props.pageProps.lang || DEFAULT_LANG;

    return (
      <Html lang={lang}>
        <Head />

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
