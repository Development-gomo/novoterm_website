module.exports = {
  content: [
    "./pages/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
module.exports = {
  theme: {
    extend: {
      fontFamily: {
        heading: ["var(--font-montserrat)"],
        btn: ["var(--font-montserrat)"],
        body: ["var(--font-cabin)"],
        serif: ["var(--font-merriweather)"], // Loaded but not applied
      },
      spacing: {
        15: "3.75rem", // 60px — used for py-15 / px-15 etc.
      },
    },
  },
};
