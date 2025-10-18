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
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			fire: {
  				ink: '#2A1301',
  				primary: '#E23C2A',
  				secondary: '#FF9E00',
  				background: '#FFF3D4',
  				cta: '#FFD93D'
  			},
  			leaf: {
  				ink: '#183D2B',
  				primary: '#4CAF50',
  				secondary: '#8BC34A',
  				background: '#E7F5D9',
  				cta: '#FDD835'
  			},
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		fontFamily: {
  			pixel: [
  				'VT323',
  				'monospace'
  			],
  			body: [
  				'Inter',
  				'sans-serif'
  			]
  		},
  		boxShadow: {
  			gba: '0 2px 0 0 color-mix(in srgb, var(--color-ink) 50%, #000 20%)',
  			'gba-sm': '0 1px 0 0 color-mix(in srgb, var(--color-ink) 40%, #000 15%)',
  			'gba-lg': '0 4px 0 0 color-mix(in srgb, var(--color-ink) 60%, #000 25%)'
  		}
  	}
  },
  plugins: [require('@tailwindcss/typography'), require("tailwindcss-animate")],
};
