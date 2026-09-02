import { getVideoStaticPaths } from "../watch/[slug]";

export { default, getVideoStaticProps as getStaticProps } from "../watch/[slug]";

export async function getStaticPaths() {
  return getVideoStaticPaths("en");
}
