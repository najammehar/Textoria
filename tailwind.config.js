/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Inter', 'sans-serif'],
      },
      colors:{
        "purple-100": "#8680ff",
        "purple-60": "#5047eb",
        "purple-80": "#a7a3f5",
        "purple-95": "#7c76f2",
        "light-purple": "#d8d6fa",
        "neon-purple-1": "#ac72f8",
        "neon-purple-2": "#8f42f6",
        "grey-75": "#c1c1be",
        "grey-90": "#e5e5e6",
        "grey-25": "#3e3e41",
        "grey-60": "#959599",
        "blue": "#3228e0",
        "grey-5": "#0f0f0f",
        "grey-45": "#6e6e73",
        "pink-2": "#e07bc7",
        "grey-10": "#18181a",
        "black-2": "#171717",
        "pink": "#ec91d8",
        "khaki-stroke": "rgba(231, 243, 104, .25)",
        "tag": "rgba(231, 243, 104, .15)",
        "honeydew": "#ceeed8",
        "pink-3": "#ffc2c2",
        "lavender": "#e2e2e2",
        "overlay": "transparent",
        "ffc2c2": "#ceeed8",
      },
    },
  },
  plugins: [],
}