/** @type {import('next').NextConfig} */
const WP_URL = process.env.NEXT_PUBLIC_WP_URL?.replace(/\/$/, '') || '';

// next/image only loads remotes from these hosts (see https://nextjs.org/docs/messages/next-image-unconfigured-host)
const imageHostnames = new Set(["backend.novoterm.se", "gomostaging.com", "i.ytimg.com"]);
if (WP_URL) {
  try {
    imageHostnames.add(new URL(WP_URL).hostname);
  } catch {
    /* ignore invalid NEXT_PUBLIC_WP_URL */
  }
}

const nextConfig = {
  reactStrictMode: true,
  bundlePagesRouterDependencies: true,

  compiler: {
    removeConsole:
      process.env.NODE_ENV === "production"
        ? { exclude: ["error", "warn"] }
        : false,
  },

  experimental: {
    optimizePackageImports: ["swiper", "gsap", "framer-motion"],
  },

  // Next 16 uses Turbopack by default in dev. An explicit config keeps
  // custom production webpack settings from tripping the dev-time warning.
  turbopack: {},

  onDemandEntries: {
    maxInactiveAge: 15 * 60 * 1000, // Reduce inactive page holds
    pagesBufferLength: 2, // Fewer pages in buffer
  },

  // Add the i18n (internationalization) configuration for multilingual support
  i18n: {
    locales: ['sv', 'en'],
    defaultLocale: 'sv',
    localeDetection: false, // Don't auto-redirect based on browser language
  },

  images: {
    formats: ["image/webp"],
    qualities: [55, 60, 70, 72, 75, 100],
    minimumCacheTTL: 60 * 60 * 24 * 7,
    deviceSizes: [320, 384, 640, 750, 828, 1080, 1200, 1280, 1920],
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
  
  // Add custom headers for caching Cookiebot
  async headers() {
    return [
      {
        source: '/uc.js', // Directly matching Cookiebot script URL
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable', // Cache for 1 year
          },
        ],
      },
    ];
  },

  webpack(config, { dev, isServer }) {
    if (!dev && !isServer) {
      config.optimization = {
        ...config.optimization,
        minimize: true,
        moduleIds: "deterministic",
        chunkIds: "deterministic",
        splitChunks: {
          ...config.optimization?.splitChunks,
          chunks: "all",
          minSize: 20_000,
          maxSize: 180_000,
          cacheGroups: {
            ...config.optimization?.splitChunks?.cacheGroups,
            framework: {
              test: /[\\/]node_modules[\\/](react|react-dom|next)[\\/]/,
              name: "framework",
              chunks: "all",
              priority: 40,
              enforce: true,
            },
            vendors: {
              test: /[\\/]node_modules[\\/]/,
              name(module) {
                const match = module.context?.match(
                  /[\\/]node_modules[\\/](.*?)([\\/]|$)/
                );
                const packageName = match?.[1]?.replace("@", "") || "vendor";
                return `vendor.${packageName}`;
              },
              chunks: "all",
              priority: 20,
              reuseExistingChunk: true,
            },
            commons: {
              name: "commons",
              minChunks: 2,
              priority: 10,
              reuseExistingChunk: true,
            },
          },
        },
      };
    }

    return config;
  },
};

export default nextConfig;
