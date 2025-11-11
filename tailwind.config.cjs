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
  		// Theme tokens based on CSS variables from styles/globals.css
  		colors: {
  			// Override to bind Tailwind primary/secondary/accent to theme variables
  			primary: 'var(--color-primary)',
  			secondary: 'var(--color-secondary)',
  			accent: 'var(--color-accent)',
  			surface: 'var(--color-surface)',
  			text: 'var(--color-text)'
  		},
  		fontFamily: {
  			sans: ['Inter', 'sans-serif'],
  		},
  		transitionTimingFunction: {
  			smooth: 'var(--motion)'
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
		colors: {
			background: 'hsl(var(--background))',
			foreground: 'hsl(var(--foreground))',
			card: {
				DEFAULT: 'hsl(var(--card))',
				foreground: 'hsl(var(--card-foreground))'
			},
			popover: {
				DEFAULT: 'hsl(var(--popover))',
				foreground: 'hsl(var(--popover-foreground))'
			},
			// Keep existing design tokens available
			muted: {
				DEFAULT: 'hsl(var(--muted))',
				foreground: 'hsl(var(--muted-foreground))'
			},
			destructive: {
				DEFAULT: 'hsl(var(--destructive))',
				foreground: 'hsl(var(--destructive-foreground))'
			},
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
				yellow: '#FBC531',
				orange: '#E1701A',
				red: '#C23616',
				green: '#44BD32',
				brown: '#8E5E3B',
				cream: '#FFF8E1',
				dark: '#1A1A1A'
			}
		},
  		boxShadow: {
  			smooth: '0 4px 10px rgba(0,0,0,0.08)'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
}
