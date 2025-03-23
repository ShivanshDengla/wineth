/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['assets.coingecko.com'], // Add the external domain here
  },
  async headers() {
    // Check if we're in a preview deployment
    const isPreview = process.env.VERCEL_ENV === 'preview';
    
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
          // For preview deployments, explicitly allow embedding
          {
            key: 'Content-Security-Policy',
            value: isPreview 
              ? "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self' https:; frame-ancestors *;"
              : "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self' https:; frame-ancestors 'self' https://*.warpcast.com https://*.farcaster.xyz;"
          }
        ]
      }
    ];
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
