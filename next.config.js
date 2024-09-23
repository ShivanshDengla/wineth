/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['assets.coingecko.com'], // Add the external domain here
  },
};

module.exports = nextConfig;
