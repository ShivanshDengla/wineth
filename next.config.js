/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['assets.coingecko.com'], // Add the external domain here
  },
  async rewrites() {
    return [
      {
        source: '/.well-known/walletconnect.txt',
        destination: '/api/walletconnect',
      },
    ]
  }
};

module.exports = nextConfig;
