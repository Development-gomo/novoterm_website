// src/proxy.js
// 1. Fetches redirects from /api/wp-redirects and applies them (both sv & en).
// 2. Sets x-lang header so root layout can set <html lang> correctly.

import { NextResponse } from "next/server";

const DEFAULT_LANG = "sv";
const SUPPORTED_LANGS = ["sv", "en"];

// ─── In-memory redirect cache ────────────────────────────────────────────────
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes
let _redirectsCache = null;
let _cacheExpiry = 0;

async function getRedirects(origin) {
  if (_redirectsCache !== null && Date.now() < _cacheExpiry) {
    return _redirectsCache;
  }

  try {
    const res = await fetch(`${origin}/api/wp-redirects`, {
      cache: "no-store",
    });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        _redirectsCache = data;
        _cacheExpiry = Date.now() + CACHE_TTL_MS;
        return _redirectsCache;
      }
    }
  } catch {}

  return _redirectsCache ?? [];
}

// ─── Match pathname against redirect list ─────────────────────────────────────
function matchRedirect(redirects, pathname) {
  for (const r of redirects) {
    const source = r.url;
    const destination = r.action_data?.url;
    const code = r.action_code || 301;
    const matchType = r.match_type || "url";

    if (!source || !destination) continue;

    const ignoreTrailing = r.match_data?.source?.flag_trailing ?? false;
    const norm = (p) => (ignoreTrailing ? p.replace(/\/$/, "") : p);

    if (matchType === "url") {
      if (norm(pathname) === norm(source)) return { destination, code };
    } else if (matchType === "url-nocase") {
      if (norm(pathname).toLowerCase() === norm(source).toLowerCase())
        return { destination, code };
    } else if (matchType === "regex") {
      try {
        const re = new RegExp(source, "i");
        const match = pathname.match(re);
        if (match) {
          const resolved = destination.replace(
            /\$(\d+)/g,
            (_, n) => match[n] ?? ""
          );
          return { destination: resolved, code };
        }
      } catch {}
    }
  }
  return null;
}

// ─── Proxy (Next.js 16 convention, replaces middleware) ──────────────────────
export async function proxy(request) {
  try {
    const url = request.nextUrl;
    const { origin } = url;

    // In Next.js 16, nextUrl.locale may not exist.
    // Detect locale from the raw URL path instead.
    const rawPath = new URL(request.url).pathname;
    const firstSegment = rawPath.split("/")[1] || "";
    const lang = SUPPORTED_LANGS.includes(firstSegment)
      ? firstSegment
      : DEFAULT_LANG;
    const isNonDefaultLocale = lang !== DEFAULT_LANG;

    // Next.js i18n strips the locale prefix from nextUrl.pathname
    // So for /en/about: nextUrl.pathname = "/about", rawPath = "/en/about"
    // For /hallbarhet: nextUrl.pathname = "/hallbarhet", rawPath = "/hallbarhet"
    const strippedPath = isNonDefaultLocale
      ? rawPath.replace(new RegExp(`^/${lang}`), "") || "/"
      : rawPath;

    // 1. Check WordPress redirects
    const redirects = await getRedirects(origin);

    // WP stores some rules with locale prefix (/en/about) and some without (/hallbarhet)
    // Try both: stripped path first, then full raw path
    let hit = matchRedirect(redirects, strippedPath);
    if (!hit && isNonDefaultLocale) {
      hit = matchRedirect(redirects, rawPath);
    }

    if (hit) {
      let dest;

      if (hit.destination.startsWith("http")) {
        dest = new URL(hit.destination);
      } else {
        // Check if destination already has the locale prefix
        const destHasLocale =
          isNonDefaultLocale && hit.destination.startsWith(`/${lang}/`);

        if (isNonDefaultLocale && !destHasLocale) {
          const localeDest = `/${lang}${hit.destination.startsWith("/") ? "" : "/"}${hit.destination}`;
          dest = new URL(localeDest, origin);
        } else {
          dest = new URL(hit.destination, origin);
        }
      }

      return NextResponse.redirect(dest, { status: hit.code });
    }

    // 2. Pass through — set x-lang header for root layout
    const response = NextResponse.next();
    response.headers.set("x-lang", lang);
    return response;
  } catch (err) {
    // Never crash the proxy — let the request through on error
    console.error("[proxy] Error:", err.message);
    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/((?!_next|api|favicon\\.ico).*)"],
};