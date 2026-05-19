import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'sys-bg-base': '#161616',
        'sys-layer-01': '#262626',
        'sys-layer-02': '#393939',
        'text-primary': '#f4f4f4',
        'text-secondary': '#c6c6c6',
        'text-muted': '#8d8d8d',
        'accent-primary': '#0f62fe',
        'accent-hover': '#0043ce',
        'accent-light': '#78a9ff',
        'ruby-alert': '#da1e28',
        'magenta-glow': '#f96bee',
        // New UI Component Library Tokens
        'bg-primary': 'var(--color-bg-primary)',
        'bg-surface': 'var(--color-bg-surface)',
        'border': 'var(--color-border)',
        'text-main': 'var(--color-text-main)',
        'text-muted-alt': 'var(--color-text-muted)',
        'critical': 'var(--color-critical)',
        'moderate': 'var(--color-moderate)',
        'seasonal': 'var(--color-seasonal)',
        'station': 'var(--color-station)',
        'boundary': 'var(--color-boundary)',
      },
      fontFamily: {
        sans: ['var(--font-ibm-plex-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-ibm-plex-mono)', 'monospace'],
        main: ['var(--font-main)'],
      },
      spacing: {
        '8': '8px',
        '16': '16px',
        '24': '24px',
        '32': '32px',
        '48': '48px',
        '64': '64px',
        '96': '96px',
        '128': '128px',
      },
      borderRadius: {
        '4': '4px',
        '6': '6px',
        '8': '8px',
        'md': 'var(--radius-md)',
      },
      boxShadow: {
        'dual': '0 4px 12px rgba(0,0,0,0.4)',
        'elevated': '0 12px 24px -8px rgba(0,0,0,0.6), 0 4px 12px rgba(15,98,254,0.1)',
        'floating': '0 24px 48px -12px rgba(0,0,0,0.8), 0 12px 32px rgba(15,98,254,0.15)',
        'blue-glow': '0 4px 12px rgba(15,98,254,0.3)',
        'sm': 'var(--shadow-sm)',
        'md': 'var(--shadow-md)',
      }
    },
  },
  plugins: [],
};
export default config;
