// tailwind.config.js for the frontend
module.exports = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
        "./src/**/*.{js,ts,jsx,tsx}"
    ],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                primary: "hsl(210, 100%, 55%)",
                accent: "hsl(340, 80%, 65%)",
                background: "hsl(220, 10%, 12%)",
                surface: "hsl(220, 10%, 18%)"
            },
            backdropBlur: {
                xs: "2px"
            }
        }
    },
    plugins: []
};
