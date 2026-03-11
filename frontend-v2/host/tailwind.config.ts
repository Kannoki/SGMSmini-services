import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#6366F1',
          dark: '#4F46E5',
          light: '#A5B4FC',
        },
        background: '#020817',
        surface: '#020617',
      },
      boxShadow: {
        'soft-lg': '0 18px 45px rgba(15, 23, 42, 0.7)',
      },
    },
  },
  plugins: [],
};

export default config;

