const flowbite = require("flowbite/plugin");

/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		"./index.html",
		"./src/**/*.{js,ts,jsx,tsx}", // untuk React\
		"node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}",
		"node_modules/flowbite/**/*.{js,jsx,ts,tsx}",
	],
	darkMode: "class",
	theme: {
		extend: {
			colors: {
				primary: {
					DEFAULT: "#1E40AF",
					dark: "#1E3A8A",
					light: "#60A5FA",
				},
				secondary: {
					DEFAULT: "#F59E0B",
					dark: "#D97706",
					light: "#FBBF24",
				},
			},
		},
	},
	safelist: [
		{
			pattern: /(bg|border|text)-(yellow|green|purple|blue|red|orange|gray)-(300|500)/,
		},
	],
	plugins: [
		flowbite,
	],
}