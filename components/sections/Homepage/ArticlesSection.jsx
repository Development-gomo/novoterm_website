import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import DotIndicator from "../../ui/DotIndicator";
import { DEFAULT_LANG, localePath, wpRestUrl } from "../../../lib/api";
import { formatArticleDate } from "../../../lib/dateFormat";
import { plainTextFromHtml } from "../../../lib/html";

const POSTS_PER_PAGE = 6;
const INITIAL_POSTS_COUNT = POSTS_PER_PAGE + 1;
const POSTS_FETCH_LIMIT = 100;

function isAcfTrue(value) {
  return value === true || value === 1 || value === "1" || value === "true";
}

function normalizeTerm(term) {
  if (!term || typeof term !== "object") return null;
  const id = term.id ?? term.term_id;
  if (!id || !term.name) return null;

  return {
    id,
    name: plainTextFromHtml(term.name),
  };
}

function formatPost(post, lang) {
  const category =
    plainTextFromHtml(post?._embedded?.["wp:term"]?.[0]?.[0]?.name || "General");
  const fm = post?._embedded?.["wp:featuredmedia"]?.[0];
  const image =
    fm?.source_url ||
    fm?.media_details?.sizes?.["2048x2048"]?.source_url ||
    fm?.media_details?.sizes?.["1536x1536"]?.source_url ||
    fm?.media_details?.sizes?.large?.source_url ||
    fm?.media_details?.sizes?.medium_large?.source_url ||
    "/default-blog.jpg";
  const date = formatArticleDate(post.date, lang);
  const clean = plainTextFromHtml(post.content?.rendered || "");
  const words =
    typeof post.wordCount === "number"
      ? post.wordCount
      : clean.trim()
        ? clean.trim().split(/\s+/).length
        : 0;
  let readTimeLabel = "min read";
  if (lang === "sv") readTimeLabel = "min läsning";
  else if (lang === "en") readTimeLabel = "min read";
  const readTime = `${Math.max(1, Math.ceil(words / 200))} ${readTimeLabel}`;

  return {
    id: post.id,
    title: plainTextFromHtml(post.title.rendered),
    excerpt: plainTextFromHtml(post.excerpt.rendered).slice(0, 120) + "...",
    url: localePath("article", post.slug, lang),
    image,
    category,
    date,
    readTime,
  };
}

function isHiddenFromListing(post) {
  return isAcfTrue(post?.acf?.hide_from_listing);
}

function isLatestPostOverride(post) {
  return isAcfTrue(post?.acf?.display_as_latest_post);
}

function getOrderedListingPosts(posts) {
  const visiblePosts = Array.isArray(posts)
    ? posts.filter((post) => !isHiddenFromListing(post))
    : [];
  const featuredOverride = visiblePosts.find(isLatestPostOverride);
  const featured = featuredOverride || visiblePosts[0] || null;

  if (!featured) return [];

  return [
    featured,
    ...visiblePosts.filter((post) => post.id !== featured.id),
  ];
}

export default function ArticlesSection({
  section_heading,
  category_filter,
  max_posts,
  cta_text,
  initialArticles,
}) {
  const router = useRouter();
  const lang = router.locale || DEFAULT_LANG;
  const categoryFilterTerms = Array.isArray(category_filter)
    ? category_filter
    : category_filter
    ? [category_filter]
    : [];
  const seededCategories = categoryFilterTerms
    .map(normalizeTerm)
    .filter(Boolean);

  // category_filter from ACF can be a single term or an array of terms
  const allowedCategoryIds = categoryFilterTerms.map((t) =>
    String(t?.term_id || t?.id || t)
  );

  const initialPosts = Array.isArray(initialArticles?.posts)
    ? initialArticles.posts
    : [];

  const [categories, setCategories] = useState(seededCategories);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [allPosts, setAllPosts] = useState(initialPosts);
  const [visibleCount, setVisibleCount] = useState(INITIAL_POSTS_COUNT);
  const [loading, setLoading] = useState(false);

  const limit = max_posts || 50;
  const orderedPosts = getOrderedListingPosts(allPosts);
  const cappedPosts = orderedPosts.slice(0, Math.min(visibleCount, limit));
  const formattedPosts = cappedPosts.map((post) => formatPost(post, lang));
  const featuredPost = formattedPosts[0] || null;
  const gridPosts = formattedPosts.slice(1);
  const hasMore =
    visibleCount < Math.min(orderedPosts.length, limit);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch categories for dropdown — only show ones selected in backend
  useEffect(() => {
    async function loadCategories() {
      if (seededCategories.length > 0) {
        setCategories(seededCategories);
        return;
      }

      try {
        const res = await fetch(
          wpRestUrl(`wp/v2/categories?per_page=100&hide_empty=false&lang=${lang}`)
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        let filtered = data;
        // If ACF specifies allowed categories, only show those
        if (allowedCategoryIds.length > 0) {
          filtered = filtered.filter((c) =>
            allowedCategoryIds.includes(String(c.id))
          );
        }
        setCategories(
          filtered
            .map((cat) => ({
              ...cat,
              name: plainTextFromHtml(cat.name),
            }))
            .filter((cat) => cat.id && cat.name)
        );
      } catch (e) {
        setCategories(seededCategories);
        console.warn("Categories unavailable; showing articles without filter options.");
      }
    }
    loadCategories();
  }, [lang, category_filter]);

  const toggleCategory = (catId) => {
    setSelectedCategories((prev) =>
      prev.includes(catId)
        ? prev.filter((id) => id !== catId)
        : [...prev, catId]
    );
  };

  // Fetch posts — always use the same per_page so WordPress pagination never overlaps between calls
  const fetchPosts = useCallback(
    async () => {
      setLoading(true);
      try {
        // Fetch enough posts to evaluate ACF listing flags before slicing the visible list.
        let endpoint = wpRestUrl(`wp/v2/posts?acf_format=standard&_embed=wp:featuredmedia,wp:term&_fields=id,title,excerpt,content,date,slug,acf,_links,_embedded&lang=${lang}&per_page=${POSTS_FETCH_LIMIT}&page=1&orderby=date&order=desc`);

        if (selectedCategories.length > 0) {
          endpoint += `&categories=${selectedCategories.join(",")}`;
        }

        const res = await fetch(endpoint);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        if (!Array.isArray(data)) {
          setLoading(false);
          return;
        }

        setAllPosts(data);
        setVisibleCount(INITIAL_POSTS_COUNT);
      } catch (e) {
        console.error("ARTICLES FETCH ERROR:", e);
      }
      setLoading(false);
    },
    [lang, selectedCategories, limit]
  );

  // Track whether initial SSR data has been consumed
  const ssrConsumedRef = useRef(false);

  // Initial load & category change
  useEffect(() => {
    // Skip client fetch on first mount if we already have SSR data
    if (initialPosts.length > 0 && !ssrConsumedRef.current && selectedCategories.length === 0) {
      ssrConsumedRef.current = true;
      return;
    }
    fetchPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang, selectedCategories]);

  const handleLoadMore = () => {
    if (loading) return;
    setVisibleCount((count) =>
      Math.min(count + POSTS_PER_PAGE, limit, orderedPosts.length)
    );
  };

  const filterLabel = lang === "en" ? "Filter:" : "Filtrera:";
  const categoryLabel = lang === "en" ? "Category" : "Kategori";

  return (
    <section className="relative w-full py-15 md:py-[100px] bg-white">
      <div className="web-width mx-auto px-6 md:px-0">
        {/* HEADER ROW */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">
          {/* Section Title */}
          <h2
            className="text-[28px] md:text-[40px] font-heading font-semibold text-[#000] leading-[1.15]"
            dangerouslySetInnerHTML={{ __html: section_heading }}
          />

          {/* Category Filter Dropdown */}
          <div className="flex items-center gap-3" ref={dropdownRef}>
            <span className="text-[15px] font-montserrat text-[#081B33]">
              {filterLabel}
            </span>
            <div className="relative">
              <button
                type="button"
                onClick={() => setDropdownOpen((v) => !v)}
                className="flex items-center gap-2 bg-[#2655c4] text-white font-montserrat text-[14px] font-medium px-6 py-3 rounded-full cursor-pointer hover:bg-[#1B3A6F] transition"
              >
                {categoryLabel}
                <svg
                  className={`transition-transform ${
                    dropdownOpen ? "rotate-180" : ""
                  }`}
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="8"
                  viewBox="0 0 12 8"
                  fill="none"
                >
                  <path
                    d="M1 1L6 6L11 1"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              {/* Dropdown Panel */}
              {dropdownOpen && categories.length > 0 && (
                <div className="absolute right-0 top-full mt-3 bg-white rounded-[8px] shadow-lg border border-[#E3EDFF] p-6 z-50 min-w-[520px]">
                  <div className="grid grid-cols-2 gap-x-10 gap-y-4">
                    {categories.map((cat) => (
                      <label
                        key={cat.id}
                        className="flex items-center gap-3 cursor-pointer text-[15px] font-montserrat text-[#081B33] hover:text-[#2655c4] transition whitespace-nowrap"
                      >
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(
                            String(cat.id)
                          )}
                          onChange={() => toggleCategory(String(cat.id))}
                          className="w-[18px] h-[18px] rounded border-[#D1D9E6] text-[#2655c4] focus:ring-[#2655c4] cursor-pointer accent-[#2655c4]"
                        />
                        {cat.name}
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* FEATURED ARTICLE */}
        {featuredPost && (
          <Link
            href={featuredPost.url}
            locale={lang}
            className="group block mb-12"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0 rounded-[3px] overflow-hidden border border-[#D1D9E6]">
              {/* Left — Image */}
              <div className="relative h-[280px] md:h-[420px]">
                <Image
                  src={featuredPost.image}
                  alt=""
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  loading="lazy"
                  className="object-cover object-center"
                />
              </div>

              {/* Right — Content Panel */}
              <div className="bg-[#081B33] text-white p-8 md:p-12 flex flex-col justify-center">
                <span className="uppercase text-[12px] font-montserrat font-semibold tracking-wider text-white mb-4">
                  {featuredPost.category}
                </span>
                <h3
                  className="text-[24px] md:text-[32px] leading-[1.25] font-semibold text-[#E3EDFF] mb-4 group-hover:text-white transition"
                >
                  {featuredPost.title}
                </h3>
                <p className="text-[15px] leading-[1.7] text-white/70 mb-6">
                  {featuredPost.excerpt}
                </p>
                <span className="text-[14px] text-white/50">
                  {featuredPost.date}
                </span>
              </div>
            </div>
          </Link>
        )}

        {/* POSTS GRID */}
        {gridPosts.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {gridPosts.map((post) => (
              <Link
                key={post.id}
                href={post.url}
                locale={lang}
                className="block rounded-[3px] overflow-hidden border border-[#D1D9E6] flex flex-col transition hover:shadow-lg"
                style={{ minHeight: 432 }}
              >
                {/* IMAGE */}
                <div className="relative h-[240px] flex-shrink-0">
                  <Image
                    src={post.image}
                    alt=""
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    loading="lazy"
                    className="object-cover object-center"
                  />
                  <span className="absolute bottom-4 left-4 bg-[#2655c4] text-white font-montserrat text-xs px-3 py-1 rounded-[4px] uppercase">
                    {post.category}
                  </span>
                </div>

                {/* CONTENT */}
                <div className="bg-[#081B33] text-white px-6 py-6 flex flex-col flex-1 justify-between min-h-0">
                  <h3
                    className="text-[22px] leading-[32px] text-[#E3EDFF] font-semibold mb-10 overflow-hidden"
            
                  >
                    {post.title}
                  </h3>
                  <div className="flex justify-between text-white/50 text-[14px] font-normal">
                    <span>{post.date}</span>
                    <span>{post.readTime}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* LOAD MORE BUTTON */}
        {hasMore && cta_text && (
          <div className="text-center mt-10">
            <button
              onClick={handleLoadMore}
              disabled={loading}
              className="btn-primary inline-block cursor-pointer disabled:opacity-50"
            >
              {loading ? "Loading..." : cta_text}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
