/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
    qualities: [75, 85, 90],
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
