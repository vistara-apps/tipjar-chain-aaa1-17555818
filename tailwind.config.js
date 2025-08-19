module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        primary: 'hsl(240 80% 50%)',
        accent: 'hsl(170 70% 45%)',
        bg: 'hsl(230 20% 15%)',
        surface: 'hsl(230 20% 20%)',
        'text-primary': 'hsl(0 0% 95%)',
        'text-secondary': 'hsl(0 0% 75%)',
      },
      borderRadius: {
        sm: '6px',
        md: '10px',
        lg: '16px',
      },
      spacing: {
        sm: '8px',
        md: '12px',
        lg: '20px',
      },
      boxShadow: {
        card: '0 4px 12px hsla(0, 0%, 0%, 0.1)',
      },
      animation: {
        'fade-in': 'fadeIn 200ms ease-in-out',
        'scale-in': 'scaleIn 200ms ease-in-out',
        'slide-up': 'slideUp 200ms ease-in-out',
        'pulse': 'pulse 2s ease-in-out infinite',
        'shimmer': 'shimmer 2s infinite linear',
      },
    },
  },
  plugins: [],
}
