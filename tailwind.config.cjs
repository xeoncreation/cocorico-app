/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
		colors: {
			primary: 'var(--color-primary)',
			secondary: 'var(--color-secondary)',
			accent: 'var(--color-accent)',
			surface: 'var(--color-surface)',
			text: 'var(--color-text)',
			background: 'hsl(var(--background))',
			foreground: 'hsl(var(--foreground))',
			card: { DEFAULT: 'hsl(var(--card))', foreground: 'hsl(var(--card-foreground))' },
			popover: { DEFAULT: 'hsl(var(--popover))', foreground: 'hsl(var(--popover-foreground))' },
			muted: { DEFAULT: 'hsl(var(--muted))', foreground: 'hsl(var(--muted-foreground))' },
			destructive: { DEFAULT: 'hsl(var(--destructive))', foreground: 'hsl(var(--destructive-foreground))' },
			border: 'hsl(var(--border))',
			input: 'hsl(var(--input))',
			ring: 'hsl(var(--ring))',
			chart: {
				'1': 'hsl(var(--chart-1))',
				'2': 'hsl(var(--chart-2))',
				'3': 'hsl(var(--chart-3))',
				'4': 'hsl(var(--chart-4))',
				'5': 'hsl(var(--chart-5))'
			},
			cocorico: {
				red: '#E53526',
				naranja: '#F97B32',
				mango: '#F97B32',
				datil: '#F3C751',
				avocado: '#2E8A56',
				turquoise: '#4CCEC6',
				// Legacy colors for compatibility
				yellow: '#F3C751',
				orange: '#F97B32',
				green: '#2E8A56',
				cream: '#FFE6D2',
				dark: '#1A1A1A'
			}
		},
		fontFamily: { 
			sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'SF Pro Text', 'system-ui', 'sans-serif'],
			display: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'SF Pro Display', 'system-ui', 'sans-serif']
		},
		transitionTimingFunction: { smooth: 'var(--motion)' },
		borderRadius: {
			lg: 'var(--radius)',
			md: 'calc(var(--radius) - 2px)',
			sm: 'calc(var(--radius) - 4px)'
		},
		boxShadow: { smooth: '0 4px 10px rgba(0,0,0,0.08)' }
  	}
  },
  plugins: [
    require("tailwindcss-animate"),
    require("@tailwindcss/typography"),
    function ({ addComponents, addUtilities }) {
      addComponents({
        '.coco-glass-card': { '@apply glass-card': {} },
        '.coco-glass-pill': { '@apply glass-pill flex items-center gap-2': {} },
        '.coco-glass-icon': { '@apply glass-icon-circle': {} }
      });
      addUtilities({
        '.scrollbar-hide': {
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none',
          '&::-webkit-scrollbar': {
            display: 'none'
          }
        }
      });
    }
  ],
}
