/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        blue: {
          50: '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#60A5FA',
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4ED8',
          800: '#1E40AF',
          900: '#1E3A8A',
        },
      },
      borderRadius: {
        sm: '4px',
        md: '8px',
        lg: '12px',
        xl: '16px',
        pill: '20px',
      },
      boxShadow: {
        subtle: '0 1px 3px rgba(59,130,246,0.07)',
        soft: '0 4px 20px rgba(59,130,246,0.08), 0 1px 4px rgba(0,0,0,0.05)',
        card: '0 8px 32px rgba(59,130,246,0.11), 0 2px 8px rgba(0,0,0,0.06)',
        btn: '0 2px 12px rgba(37,99,235,0.28)',
      },
      fontSize: {
        '2xs': '11px',
        xs: '12px',
        // sm, base, lg, xl, 2xl은 Tailwind 기본값 사용
        // sm=14px, base=16px, lg=18px, xl=20px, 2xl=24px
      },
    },
  },
  plugins: [],
}
