module.exports = {
	root: true,

	extends: "jquery",

	reportUnusedDisableDirectives: true,

	parserOptions: {
		ecmaVersion: 2018
	},

	env: {
		es6: true,
		node: true
	},

	rules: {
		strict: [ "error", "global" ]
	}
};
