/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#fbf9f5',
        surface: {
          DEFAULT: '#fbf9f5',
          dim: '#dbdad6',
          bright: '#fbf9f5',
          container: {
            lowest: '#ffffff',
            low: '#f5f3ef',
            DEFAULT: '#efeeea',
            high: '#eae8e4',
            highest: '#e4e2de',
          }
        },
        primary: {
          DEFAULT: '#8e4e14',
          on: '#ffffff',
          container: '#f4a261',
          onContainer: '#6f3800',
          fixed: '#ffdcc4',
          fixedDim: '#ffb780',
          onFixed: '#2f1400',
          onFixedVariant: '#6f3800',
        },
        secondary: {
          DEFAULT: '#2b6485',
          on: '#ffffff',
          container: '#a3d8fe',
          onContainer: '#255f80',
          fixed: '#c7e7ff',
          fixedDim: '#98cdf2',
          onFixed: '#001e2e',
          onFixedVariant: '#064c6b',
        },
        tertiary: {
          DEFAULT: '#a33d23',
          on: '#ffffff',
          container: '#ff9a81',
          onContainer: '#82250e',
          fixed: '#ffdad2',
          fixedDim: '#ffb4a2',
          onFixed: '#3c0700',
          onFixedVariant: '#83260e',
        },
        error: {
          DEFAULT: '#ba1a1a',
          on: '#ffffff',
          container: '#ffdad6',
          onContainer: '#93000a',
        },
        outline: {
          DEFAULT: '#867468',
          variant: '#d8c2b5',
        },
        onSurface: {
          DEFAULT: '#1b1c1a',
          variant: '#534439',
        },
        inverse: {
          surface: '#30312e',
          onSurface: '#f2f0ed',
          primary: '#ffb780',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        'sm': '0.25rem',
        DEFAULT: '0.5rem',
        'md': '0.75rem',
        'lg': '1rem',
        'xl': '1.5rem',
        'full': '9999px',
        'card': '16px',
        'button': '12px',
      },
      boxShadow: {
        'card': '0 2px 4px rgba(0,0,0,0.02), 0 10px 20px rgba(0,0,0,0.04)',
        'modal': '0 20px 40px rgba(0,0,0,0.08)',
      }
    },
  },
  plugins: [],
}
