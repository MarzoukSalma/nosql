export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        navy: { 900: '#0d1b35', 800: '#1a2744', 700: '#1e3055' },
        teal: { DEFAULT: '#00d4aa', dark: '#00b894', light: '#4dffd8' },
        slate: { card: '#f0f4f8', border: '#e2e8f0' }
      },
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        body: ['DM Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      }
    }
  }
}