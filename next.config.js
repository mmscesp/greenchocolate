/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: false,
    qualities: [50, 68, 72, 74, 75, 78, 80, 82, 85, 88, 90],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  async headers() {
    const csp = [
      "default-src 'self'",
      "base-uri 'self'",
      "frame-ancestors 'none'",
      "form-action 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https:",
      "style-src 'self' 'unsafe-inline' https:",
      "img-src 'self' data: blob: https:",
      "media-src 'self' data: blob: https:",
      "font-src 'self' data: https:",
      "connect-src 'self' https: wss:",
      "object-src 'none'",
      'upgrade-insecure-requests',
    ].join('; ');

    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Content-Security-Policy',
            value: csp,
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/learn',
        destination: '/editorial',
        permanent: true,
      },
      {
        source: '/learn/:path*',
        destination: '/editorial/:path*',
        permanent: true,
      },
      {
        source: '/blog',
        destination: '/editorial',
        permanent: true,
      },
      {
        source: '/blog/:path*',
        destination: '/editorial/:path*',
        permanent: true,
      },
      {
        source: '/:lang(en|es|fr|de|it|pl|ru|pt)/learn',
        destination: '/:lang/editorial',
        permanent: true,
      },
      {
        source: '/:lang(en|es|fr|de|it|pl|ru|pt)/learn/:path*',
        destination: '/:lang/editorial/:path*',
        permanent: true,
      },
      {
        source: '/:lang(en|es|fr|de|it|pl|ru|pt)/blog',
        destination: '/:lang/editorial',
        permanent: true,
      },
      {
        source: '/:lang(en|es|fr|de|it|pl|ru|pt)/blog/:path*',
        destination: '/:lang/editorial/:path*',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;

