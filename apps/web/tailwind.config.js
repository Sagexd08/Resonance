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
