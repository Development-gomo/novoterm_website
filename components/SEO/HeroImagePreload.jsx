import Head from "next/head";

/** Hint LCP image early (full-bleed heroes that use CSS background-image). */
export default function HeroImagePreload({ href }) {
  if (!href) return null;
  return (
    <Head>
      <link rel="preload" as="image" href={href} fetchPriority="high" />
    </Head>
  );
}
