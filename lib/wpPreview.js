import crypto from "crypto";
import { DEFAULT_LANG, localePath, resolveLang, withLocalePrefix } from "./api";

const WP_URL = process.env.NEXT_PUBLIC_WP_URL?.replace(/\/$/, "");

const PREVIEW_TYPES = {
  post: {
    endpoint: "posts",
    path(post, lang) {
      return localePath("article", post?.slug || post?.id, lang);
    },
  },
  page: {
    endpoint: "pages",
    path(post) {
      return post?.slug === "home" ? "/" : `/${post?.slug || post?.id || ""}`;
    },
  },
  service: {
    endpoint: "service",
    path(post, lang) {
      return localePath("service", post?.slug || post?.id, lang);
    },
  },
  industry: {
    endpoint: "industry",
    path(post, lang) {
      return localePath("industry", post?.slug || post?.id, lang);
    },
  },
  case_study: {
    endpoint: "case_study",
    path(post, lang) {
      return localePath("caseStudy", post?.slug || post?.id, lang);
    },
  },
};

function getPreviewSecret() {
  return process.env.NEXT_PREVIEW_SECRET || process.env.PREVIEW_SECRET || "";
}

function safeEquals(a = "", b = "") {
  const aBuffer = Buffer.from(String(a));
  const bBuffer = Buffer.from(String(b));

  if (aBuffer.length !== bBuffer.length) return false;

  return crypto.timingSafeEqual(aBuffer, bBuffer);
}

function getPreviewAuthHeader() {
  const username = process.env.WP_PREVIEW_USERNAME || process.env.WP_API_USER;
  const password =
    process.env.WP_PREVIEW_APP_PASSWORD ||
    process.env.WP_PREVIEW_PASSWORD ||
    process.env.WP_API_PASS;

  if (!username || !password) return null;

  return `Basic ${Buffer.from(`${username}:${password}`).toString("base64")}`;
}

export function isValidPreviewSecret(secret) {
  const expected = getPreviewSecret();

  return Boolean(expected && secret && safeEquals(secret, expected));
}

export function normalizePreviewType(type) {
  return PREVIEW_TYPES[type] ? type : "post";
}

export function getPreviewPath(post, type = "post", lang = DEFAULT_LANG) {
  const resolvedLang = resolveLang(lang);
  const previewType = normalizePreviewType(type);
  const path = PREVIEW_TYPES[previewType].path(post, resolvedLang);

  return withLocalePrefix(path, resolvedLang);
}

export function getPostLang(post, fallbackLang = DEFAULT_LANG) {
  const rawLang =
    post?.lang ||
    post?.language ||
    post?.locale ||
    post?.wpml_current_locale ||
    fallbackLang;
  const shortLang = String(rawLang).split(/[-_]/)[0];

  return resolveLang(shortLang);
}

export async function fetchPreviewPostById(postId, lang = DEFAULT_LANG) {
  return fetchPreviewContentById(postId, "post", lang);
}

export async function fetchPreviewContentById(postId, type = "post", lang = DEFAULT_LANG) {
  if (!WP_URL) {
    throw new Error("NEXT_PUBLIC_WP_URL is missing.");
  }

  const authHeader = getPreviewAuthHeader();
  if (!authHeader) {
    throw new Error("WordPress preview credentials are missing.");
  }

  const previewType = normalizePreviewType(type);
  const endpoint = PREVIEW_TYPES[previewType].endpoint;
  const url = new URL(`${WP_URL}/wp-json/wp/v2/${endpoint}/${encodeURIComponent(postId)}`);
  url.searchParams.set("acf_format", "standard");
  url.searchParams.set("_embed", "1");
  url.searchParams.set("context", "edit");
  url.searchParams.set("lang", lang);

  const res = await fetch(url, {
    headers: {
      Authorization: authHeader,
    },
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`WordPress ${previewType} preview fetch failed: ${res.status} ${detail}`);
  }

  return res.json();
}
