/** @type {import('next').NextConfig} */
const WP_URL = process.env.NEXT_PUBLIC_WP_URL?.replace(/\/$/, '') || '';

const nextConfig = {
  reactStrictMode: true,

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
