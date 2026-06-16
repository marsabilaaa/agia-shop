import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          red: "#E8281A",
          orange: "#F5651D",
          light: "#FEF0EE",
          muted: "#FDDED9",
        },
      },
      backgroundImage: {
        "brand-gradient": "linear-gradient(135deg, #E8281A 0%, #F5651D 100%)",
        "brand-gradient-hover":
          "linear-gradient(135deg, #D42015 0%, #E55A18 100%)",
      },
      fontFamily: {
        heading: ["var(--font-heading)"],
        sans: ["var(--font-sans)"],
      },
    },
  },
  plugins: [],
};

export default config;
