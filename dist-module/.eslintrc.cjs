module.exports = {
	root: true,

	parserOptions: {
		ecmaVersion: 2015,
		sourceType: "module"
	},

	globals: {
		define: false,
		Symbol: false
	},

	overrides: [
		{
			files: "jquery{,.slim}.module.min.js",

			parserOptions: {
				ecmaVersion: 2015,
				sourceType: "module"
			}
		},

		{
			files: "jquery{,.slim}.module.js",
			extends: "../.eslintrc-browser.cjs",

			parserOptions: {
				ecmaVersion: 2015,
				sourceType: "module"
			},

			rules: {

				// That is okay for the built version
				"no-multiple-empty-lines": "off",

				// When custom compilation is used, the version string
				// can get large. Accept that in the built version.
				"max-len": "off",
				"one-var": "off"
			}
		},

		{
			files: ".eslintrc.cjs",
			extends: "../.eslintrc-node.cjs"
		}
	]
}
