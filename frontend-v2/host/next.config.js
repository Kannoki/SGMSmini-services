/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  async rewrites() {
    const portfolioUrl = process.env.PORTFOLIO_APP_URL || 'http://localhost:3001';
    const mailUrl = process.env.MAIL_APP_URL || 'http://localhost:3002';

    return [
      {
        source: '/portfolio/:path*',
        destination: `${portfolioUrl}/portfolio/:path*`,
      },
      {
        source: '/mail/:path*',
        destination: `${mailUrl}/mail/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;

