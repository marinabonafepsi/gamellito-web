/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // ---- Gamellito design system (roxo-fun + creme, ilustrações do Roger) ----
        // Primary
        sun: '#FFC400',
        orange: '#F26A00',
        lilac: '#9B8CF0',
        'lilac-soft': '#C7BEF7',
        'purple-soft': '#6F567E',
        'purple-deep': '#4D2E60',

        // Support
        purple: '#6E59C9',
        cream: '#FFF3C9',
        'cream-deep': '#FBE7A6',
        ink: '#2B2233',

        // Game accents (small doses only)
        'game-red': '#EE2B2B',
        'game-blue': '#37B6E6',
        'game-green': '#8DC63F',
        'game-pink': '#F25CA2',
        'game-magenta': '#C82FA0',

        // Tints / states
        'sun-deep': '#E5A800',
        'orange-deep': '#D25A00',

        // ---- Legacy aliases (mapped onto the new palette so existing
        // classNames across the app pick up the new look automatically) ----
        'purple-main': '#6E59C9',
        'purple-light': '#9B8CF0',
        'purple-dark': '#4D2E60',
        'dark-gray': '#2B2233',
        'medium-gray': 'rgba(43, 34, 51, 0.60)',
        'light-gray': '#FFF3C9',
        'orange-light': '#FFA766',
        'gamellito-health-green': '#8DC63F',
        'gamellito-space': '#2B1B52',
      },
      fontFamily: {
        display: ['Baloo 2', 'system-ui', 'sans-serif'],
        body: ['Nunito', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'fluid-base': 'clamp(0.875rem, 2vw, 1rem)',
        'fluid-lg': 'clamp(1rem, 2.5vw, 1.125rem)',
        'fluid-2xl': 'clamp(1.5rem, 4vw, 2rem)',
        'fluid-3xl': 'clamp(1.875rem, 5vw, 2.25rem)',
        'fluid-xl-hero': 'clamp(2.75rem, 6vw, 4.5rem)',
      },
      boxShadow: {
        pop: '4px 4px 0 #2B2233',
        'pop-lg': '6px 6px 0 #2B2233',
        'pop-sm': '2px 2px 0 #2B2233',
        'pop-press': '1px 1px 0 #2B2233',
        soft: '0 8px 24px rgba(43, 34, 51, 0.16)',
      },
      borderRadius: {
        sm: '10px',
        md: '16px',
        lg: '24px',
        xl: '32px',
        pill: '999px',
      },
      transitionTimingFunction: {
        bounce: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      keyframes: {
        twinkle: {
          '0%, 100%': { opacity: '0.25', transform: 'scale(0.7)' },
          '50%': { opacity: '1', transform: 'scale(1)' },
        },
        'dd-in': {
          from: { opacity: '0', transform: 'translateY(-8px) scale(0.96)' },
          to: { opacity: '1', transform: 'none' },
        },
      },
      animation: {
        twinkle: 'twinkle 2.6s ease-in-out infinite',
        'dd-in': 'dd-in 180ms cubic-bezier(0.34, 1.56, 0.64, 1) both',
      },
    },
  },
  plugins: [],
};
