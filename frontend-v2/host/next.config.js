/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/portfolio/:path*',
        destination: 'http://localhost:3001/portfolio/:path*',
      },
      {
        source: '/mail/:path*',
        destination: 'http://localhost:3002/mail/:path*',
      },
    ];
  },
};

module.exports = nextConfig;

