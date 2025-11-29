/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class', 'class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        chart: {
          1: 'hsl(var(--chart-1))',
          2: 'hsl(var(--chart-2))',
          3: 'hsl(var(--chart-3))',
          4: 'hsl(var(--chart-4))',
          5: 'hsl(var(--chart-5))',
        },
        // Graduation dark theme colors
        'grad-single': {
          'bg-dark': '#0a0a0a',
          'bg-dark-alt': '#0f0f0f',
          'bg-dropdown': '#1a1a1a',
          text: '#f0f0f0',
          'text-muted-50': 'rgba(240, 240, 240, 0.5)',
          'text-muted-60': 'rgba(240, 240, 240, 0.6)',
          'blue-primary': '#0B6FBF',
          'yellow-bg': 'rgba(255, 249, 230, 0.1)',
          'yellow-border': 'rgba(244, 228, 167, 0.2)',
          'yellow-text': '#F4E4A7',
          'glass-10': 'rgba(255, 255, 255, 0.1)',
          'glass-20': 'rgba(255, 255, 255, 0.2)',
        },
      },
      fontFamily: {
        display: ['Oswald', 'sans-serif'],
        body: ['Manrope', 'sans-serif'],
      },
      cursor: {
        none: 'none',
      },
      keyframes: {
        'loader-slide-up': {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(-100%)' },
        },
      },
      animation: {
        'loader-slide-up': 'loader-slide-up 0.8s cubic-bezier(0.65, 0, 0.35, 1) forwards',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
        28: '28px', // Pill button
      },
      spacing: {
        58: '58%',
        42: '42%',
      },
      flexBasis: {
        58: '58%',
        42: '42%',
      },
      boxShadow: {
        'button-blue': '0 4px 12px rgba(11, 111, 191, 0.25)',
        'button-blue-hover': '0 6px 20px rgba(11, 111, 191, 0.35)',
        'button-blue-active': '0 2px 8px rgba(11, 111, 191, 0.2)',
        dropdown: '0 8px 24px rgba(0, 0, 0, 0.5)',
      },
      backgroundImage: {
        'gradient-blue': 'linear-gradient(135deg, #0B6FBF 0%, #7EC8E3 100%)',
      },
    },
  },
  safelist: [
    'animate-pulse',
    'animate-spin',
    'animate-bounce',
    'dark:bg-background',
    'dark:text-foreground',
    'motion-safe',
    'motion-reduce',
    'light',
    'dark',
  ],
  plugins: [require('@tailwindcss/typography'), require('tailwindcss-animate')],
};
