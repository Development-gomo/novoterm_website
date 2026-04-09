import Head from "next/head";
import { getImageProps } from "next/image";
import { HERO_IMAGE_QUALITY } from "../lib/imageConstants";
import { getLcpHeroImageUrl } from "../lib/lcpHeroUrl";

/**
 * Early hint for the LCP hero so the browser starts the image request before
 * hydration / extra JS (matches next/image URL generation for the same src).
 */
export default function LcpHeroPreload({ sections }) {
  const src = getLcpHeroImageUrl(sections);
  if (!src) return null;

  const { props } = getImageProps({
    src,
    alt: "",
    width: 1920,
    height: 1080,
    sizes: "100vw",
    quality: HERO_IMAGE_QUALITY,
  });

  return (
    <Head>
      <link
        rel="preload"
        as="image"
        href={props.src}
        imageSrcSet={props.srcSet}
        imageSizes={props.sizes}
      />
    </Head>
  );
}
