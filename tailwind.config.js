/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: ['class', "class"],
  theme: {
  	extend: {
  		colors: {
  			primary: {
  				DEFAULT: '#3b82f6',
  				dark: '#1e40af',
  				light: '#bfdbfe'
  			},
  			accent: 'var(--accent-color)',
  			neutral: {
  				DEFAULT: '#e5e7eb',
  				light: '#f3f4f6',
  				dark: '#6b7280'
  			},
  			text: '#111827',
  			sidebar: {
  				DEFAULT: 'hsl(var(--sidebar-background))',
  				foreground: 'hsl(var(--sidebar-foreground))',
  				primary: 'hsl(var(--sidebar-primary))',
  				'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
  				accent: 'hsl(var(--sidebar-accent))',
  				'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
  				border: 'hsl(var(--sidebar-border))',
  				ring: 'hsl(var(--sidebar-ring))'
  			}
  		}
  	}
  },
  variants: {
    extend: {},
  },
  plugins: [],
}