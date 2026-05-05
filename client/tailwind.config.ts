import type { Config } from 'tailwindcss'
import typography from '@tailwindcss/typography'

const config: Config = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './data/**/*.{js,ts,jsx,tsx,mdx}',
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
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            fontSize: '1.0625rem',
            lineHeight: '1.75',
            color: '#374151',
            '> :first-child': { marginTop: '0' },
            h1: {
              fontFamily: 'DM Serif Display, Georgia, serif',
              color: '#0f1f3d',
              fontWeight: '800',
              fontSize: '2rem',
              marginTop: '2rem',
              marginBottom: '1rem',
              lineHeight: '1.2',
            },
            h2: {
              fontFamily: 'DM Serif Display, Georgia, serif',
              color: '#0f1f3d',
              fontWeight: '700',
              fontSize: '1.5rem',
              marginTop: '2.25rem',
              marginBottom: '0.75rem',
              lineHeight: '1.3',
              paddingLeft: '0.75rem',
              borderLeftWidth: '4px',
              borderLeftColor: '#f58220',
            },
            h3: {
              fontFamily: 'DM Serif Display, Georgia, serif',
              color: '#0f1f3d',
              fontWeight: '600',
              fontSize: '1.25rem',
              marginTop: '1.75rem',
              marginBottom: '0.5rem',
            },
            h4: {
              color: '#0f1f3d',
              fontWeight: '600',
              marginTop: '1.5rem',
              marginBottom: '0.375rem',
            },
            p: {
              marginTop: '0',
              marginBottom: '1rem',
            },
            ul: {
              marginTop: '0.75rem',
              marginBottom: '1.25rem',
              paddingLeft: '1.25rem',
              listStyleType: 'disc',
            },
            ol: {
              marginTop: '0.75rem',
              marginBottom: '1.25rem',
              paddingLeft: '1.25rem',
              listStyleType: 'decimal',
            },
            li: {
              marginTop: '0.375rem',
              marginBottom: '0.375rem',
            },
            'li > p': {
              marginTop: '0.5rem',
              marginBottom: '0.5rem',
            },
            strong: {
              color: '#0f1f3d',
              fontWeight: '600',
            },
            a: {
              color: '#1d4ed8',
              fontWeight: '500',
              textDecoration: 'underline',
              textUnderlineOffset: '2px',
              '&:hover': { color: '#1e40af' },
            },
            blockquote: {
              borderLeftColor: '#1d4ed8',
              fontStyle: 'normal',
              fontWeight: '400',
              color: '#374151',
            },
            hr: {
              marginTop: '2rem',
              marginBottom: '2rem',
              borderColor: '#e5e7eb',
            },
            img: {
              borderRadius: '0.75rem',
              marginTop: '1.5rem',
              marginBottom: '1.5rem',
            },
          },
        },
      },
    },
  },
  plugins: [typography],
}

export default config
