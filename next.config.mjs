/** @type {import('next').NextConfig} */
const WP_URL = process.env.NEXT_PUBLIC_WP_URL?.replace(/\/$/, '') || '';

const nextConfig = {
  reactStrictMode: true,

    // Add the i18n (internationalization) configuration for multilingual support
  i18n: {
    locales: ['sv', 'en'], // Supported languages: Swedish and English
    defaultLocale: 'sv',    // Default language is Swedish
  },

  images: {
    domains: ["gomostaging.com"],
  },

  async rewrites() {
    return [
      {
        source: '/wp-api/:path*',
        destination: `${WP_URL}/wp-json/:path*`,
      },
    ];
  },
};


export default nextConfig;
