import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: ["class"],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      backgroundImage: {
				gradientMesh: ` radial-gradient(at 1% 2%, hsla(var(--gradient-color-1),0.5) 0px, transparent 50%),
								radial-gradient(at 52% 61%, hsla(var(--gradient-color-2),0.5) 0px, transparent 50%),
								radial-gradient(at 89% 85%, hsla(var(--gradient-color-3),0.5) 0px, transparent 50%);
							`,
			},
      colors: {
				primary: "rgb(var(--primary) / <alpha-value>)",
				secondary: "rgb(var(--secondary) / <alpha-value>)",
				background: "rgb(var(--background) / <alpha-value>)",
				foreground: "rgb(var(--foreground) / <alpha-value>)",
				accent: "rgb(var(--accent) / <alpha-value>)",
				mute: "rgb(var(--mute) / <alpha-value>)",
				warning: "rgb(var(--warning) / <alpha-value>)",
				warningForeground: "rgb(var(--warning-foreground) / <alpha-value>)",
				danger: "rgb(var(--danger) / <alpha-value>)",
				dangerForeground: "rgb(var(--danger-foreground) / <alpha-value>)",
				success: "rgb(var(--success) / <alpha-value>)",
				successForeground: "rgb(var(--success-foreground) / <alpha-value>)",
				action: "rgb(var(--action) / <alpha-value>)",
				actionForeground: "rgb(var(--action-foreground) / <alpha-value>)",
				gradientColor1: "hsla(var(--gradient-color-1),1)",
				gradientColor2: "hsla(var(--gradient-color-2),1)",
				gradientColor3: "hsla(var(--gradient-color-3),1)",
			},
      animation: {
        orbit: "orbit calc(var(--duration)*1s) linear infinite",
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      keyframes: {
        orbit: {
          "0%": {
            transform:
              "rotate(0deg) translateY(calc(var(--radius) * 1px)) rotate(0deg)",
          },
          "100%": {
            transform:
              "rotate(360deg) translateY(calc(var(--radius) * 1px)) rotate(-360deg)",
          },
        },
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate"),require("tailwindcss-react-aria-components"),require("tailwind-scrollbar")({ nocompatible: true })], 
};
export default config;
