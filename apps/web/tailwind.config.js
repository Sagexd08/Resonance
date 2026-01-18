/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: ["class"],
	content: [
		'./app/**/*.{ts,tsx}',
		'./components/**/*.{ts,tsx}',
	],
	theme: {
		extend: {
			colors: {
				// Base tokens (match globals.css)
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				card: 'hsl(var(--card))',
				'card-foreground': 'hsl(var(--card-foreground))',
				popover: 'hsl(var(--popover))',
				'popover-foreground': 'hsl(var(--popover-foreground))',
				primary: 'hsl(var(--primary))',
				'primary-foreground': 'hsl(var(--primary-foreground))',
				secondary: 'hsl(var(--secondary))',
				'secondary-foreground': 'hsl(var(--secondary-foreground))',
				muted: 'hsl(var(--muted))',
				'muted-foreground': 'hsl(var(--muted-foreground))',
				accent: 'hsl(var(--accent))',
				'accent-foreground': 'hsl(var(--accent-foreground))',
				destructive: 'hsl(var(--destructive))',
				'destructive-foreground': 'hsl(var(--destructive-foreground))',
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				'chart-1': 'hsl(var(--chart-1))',
				'chart-2': 'hsl(var(--chart-2))',
				'chart-3': 'hsl(var(--chart-3))',
				'chart-4': 'hsl(var(--chart-4))',
				'chart-5': 'hsl(var(--chart-5))',
				// Core Backgrounds
				bg: {
					primary: 'var(--bg-primary)',
					secondary: 'var(--bg-secondary)',
					tertiary: 'var(--bg-tertiary)',
				},
				// Surfaces
				surface: {
					1: 'var(--surface-1)',
					2: 'var(--surface-2)',
					3: 'var(--surface-3)',
					4: 'var(--surface-4)',
					5: 'var(--surface-5)',
				},
				// Emotional Palette
				emo: {
					energized: {
						DEFAULT: 'var(--emo-energized-base)',
						glow: 'var(--emo-energized-glow)',
						muted: 'var(--emo-energized-muted)',
					},
					happy: {
						DEFAULT: 'var(--emo-happy-base)',
						glow: 'var(--emo-happy-glow)',
						muted: 'var(--emo-happy-muted)',
					},
					neutral: {
						DEFAULT: 'var(--emo-neutral-base)',
						glow: 'var(--emo-neutral-glow)',
						muted: 'var(--emo-neutral-muted)',
					},
					drained: {
						DEFAULT: 'var(--emo-drained-base)',
						glow: 'var(--emo-drained-glow)',
						muted: 'var(--emo-drained-muted)',
					},
					burnout: {
						DEFAULT: 'var(--emo-burnout-base)',
						glow: 'var(--emo-burnout-glow)',
						muted: 'var(--emo-burnout-muted)',
					},
					stability: {
						DEFAULT: 'var(--emo-stability-base)',
						glow: 'var(--emo-stability-glow)',
					},
				},
				// Text
				text: {
					primary: 'var(--text-primary)',
					secondary: 'var(--text-secondary)',
					tertiary: 'var(--text-tertiary)',
				},
			},
			fontFamily: {
				display: ['var(--font-display)', 'sans-serif'],
				body: ['var(--font-body)', 'sans-serif'],
			},
			borderRadius: {
				xs: 'var(--radius-xs)',
				sm: 'var(--radius-sm)',
				md: 'var(--radius-md)',
				lg: 'var(--radius-lg)',
				xl: 'var(--radius-xl)',
				full: 'var(--radius-full)',
			},
			transitionTimingFunction: {
				'calm-in': 'var(--ease-calm-in)',
				'calm-out': 'var(--ease-calm-out)',
				'breathe': 'var(--ease-breathe)',
				'spring': 'var(--ease-spring)',
			},
			transitionDuration: {
				fast: 'var(--duration-fast)',
				medium: 'var(--duration-medium)',
				slow: 'var(--duration-slow)',
			},
			spacing: {
				'4xs': '4px',
				'3xs': '8px',
				'2xs': '12px',
				'xs': '16px',
				'sm': '24px',
				'md': '32px',
				'lg': '48px',
				'xl': '64px',
				'2xl': '96px',
				'3xl': '128px',
			},
			boxShadow: {
				'glow-soft': 'var(--glow-soft)',
				'glow-medium': 'var(--glow-medium)',
				'glow-strong': 'var(--glow-strong)',
			},
		},
	},
	plugins: [require("tailwindcss-animate")],
}
