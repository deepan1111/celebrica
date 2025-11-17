/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        script: ['Dancing Script', 'cursive'],
        satisfy: ['Satisfy', 'cursive'],
      },
    },
  },
  plugins: [],
}
