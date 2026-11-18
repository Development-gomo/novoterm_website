// Shared helpers for WordPress blog posts.

export function isAcfTrue(value) {
  return value === true || value === 1 || value === "1" || value === "true";
}

// ACF "Hide from listing": the post stays published, reachable by URL and in
// the sitemap, but is not shown in any list/carousel on the website.
export function isHiddenFromListing(post) {
  return isAcfTrue(post?.acf?.hide_from_listing);
}

export function visiblePosts(posts) {
  return Array.isArray(posts) ? posts.filter((post) => !isHiddenFromListing(post)) : [];
}
