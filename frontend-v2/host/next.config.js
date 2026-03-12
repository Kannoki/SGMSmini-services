const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: {
    externalDir: true,
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      highcharts: path.resolve(__dirname, 'node_modules/highcharts'),
      'highcharts-react-official': path.resolve(__dirname, 'node_modules/highcharts-react-official'),
    };
    return config;
  },
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

