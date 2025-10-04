import js from "@eslint/js";

export default [
	js.configs.recommended,
	{
		files: ["src/**/*.js"],
		languageOptions: {
			ecmaVersion: 2022,
			sourceType: "module",
		},
		rules: {
			"no-unused-vars": "warn",
			"no-console": "off",
		},
	},
	{
		files: ["tests/**/*.js"],
		languageOptions: {
			ecmaVersion: 2022,
			sourceType: "module",
			globals: {
				global: "readonly",
				jest: "readonly",
				vi: "readonly",
				describe: "readonly",
				it: "readonly",
				expect: "readonly",
				beforeEach: "readonly",
				afterEach: "readonly",
			},
		},
		rules: {
			"no-unused-vars": "warn",
			"no-console": "off",
			"no-undef": "off",
		},
	},
];
