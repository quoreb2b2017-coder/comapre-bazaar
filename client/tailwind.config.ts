import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './data/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#0f1f3d',
          mid: '#1a3057',
          light: '#253f6a',
        },
        brand: {
          DEFAULT: '#1d4ed8',
          mid: '#2563eb',
          light: '#dbeafe',
          hover: '#1e40af',
        },
        accent: {
          DEFAULT: '#f59e0b',
          light: '#fef9c3',
        },
      },
      fontFamily: {
        serif: ['DM Serif Display', 'Georgia', 'serif'],
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
