/** @type {import('next').NextConfig} */
const WP_URL = process.env.NEXT_PUBLIC_WP_URL?.replace(/\/$/, '') || '';

// next/image only loads remotes from these hosts (see https://nextjs.org/docs/messages/next-image-unconfigured-host)
const imageHostnames = new Set(["backend.novoterm.se", "gomostaging.com"]);
if (WP_URL) {
  try {
    imageHostnames.add(new URL(WP_URL).hostname);
  } catch {
    /* ignore invalid NEXT_PUBLIC_WP_URL */
  }
}

const nextConfig = {
  reactStrictMode: true,

  compiler: {
    removeConsole:
      process.env.NODE_ENV === "production"
        ? { exclude: ["error", "warn"] }
        : false,
  },

  experimental: {
    optimizePackageImports: ["swiper", "gsap", "framer-motion"],
  },

  // Add the i18n (internationalization) configuration for multilingual support
  i18n: {
    locales: ['sv', 'en'],
    defaultLocale: 'sv',
    localeDetection: false, // Don't auto-redirect based on browser language
  },

  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [60, 70, 75],
    minimumCacheTTL: 60 * 60 * 24 * 7,
    deviceSizes: [384, 640, 750, 828, 1080, 1200, 1280, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [...imageHostnames].map((hostname) => ({
      protocol: "https",
      hostname,
    })),
  },

  async rewrites() {
    return [
      {
        source: '/wp-api/:path*',
        destination: `${WP_URL}/wp-json/:path*`,
      },
    ];
  },

  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
      {
        source: '/en/home',
        destination: '/en',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
