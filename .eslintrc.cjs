module.exports = {
	// https://eslint.org/docs/user-guide/configuring#configuration-cascading-and-hierarchy
	// This option interrupts the configuration hierarchy at this file
	// Remove this if you have an higher level ESLint config file (it usually happens into a monorepos)
	root: true,

	// https://eslint.vuejs.org/user-guide/#how-to-use-a-custom-parser
	// Must use parserOptions instead of "parser" to allow vue-eslint-parser to keep working
	// `parser: 'vue-eslint-parser'` is already included with any 'plugin:vue/**' config and should be omitted
	parserOptions: {
		parser: require.resolve('@typescript-eslint/parser'),
		extraFileExtensions: [ '.vue' ],
	},

	env: {
		browser: true,
		es2021: true,
		node: true,
		'vue/setup-compiler-macros': true,
	},

	// Rules order is important, please avoid shuffling them
	extends: [
		// Base ESLint recommended rules
		// 'eslint:recommended',

		// https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/eslint-plugin#usage
		// ESLint typescript rules
		'plugin:@typescript-eslint/recommended',

		// Uncomment any of the lines below to choose desired strictness,
		// but leave only one uncommented!
		// See https://eslint.vuejs.org/rules/#available-rules
		'plugin:vue/vue3-essential', // Priority A: Essential (Error Prevention)
		// 'plugin:vue/vue3-strongly-recommended', // Priority B: Strongly Recommended (Improving Readability)
		// 'plugin:vue/vue3-recommended', // Priority C: Recommended (Minimizing Arbitrary Choices and Cognitive Overhead)

		'airbnb-base',

		'plugin:cypress/recommended',

	],

	plugins: [
		// required to apply rules which need type information
		'@typescript-eslint',

		// https://eslint.vuejs.org/user-guide/#why-doesn-t-it-work-on-vue-files
		// required to lint *.vue files
		'vue',

	],

	globals: {
		ga: 'readonly', // Google Analytics
		cordova: 'readonly',
		__statics: 'readonly',
		__QUASAR_SSR__: 'readonly',
		__QUASAR_SSR_SERVER__: 'readonly',
		__QUASAR_SSR_CLIENT__: 'readonly',
		__QUASAR_SSR_PWA__: 'readonly',
		process: 'readonly',
		Capacitor: 'readonly',
		chrome: 'readonly',
		cy: 'readonly',
	},

	// add your custom rules here
	rules: {
		'no-tabs': 'off',

		// this rule, if on, would require explicit return type on the `render` function
		'@typescript-eslint/explicit-function-return-type': 'off',

		// in plain CommonJS modules, you can't use `import foo = require('foo')` to pass this rule, so it has to be disabled
		'@typescript-eslint/no-var-requires': 'off',

		indent: [
			'error',
			'tab',
		],
		'linebreak-style': [
			'error',
			'unix',
		],
		quotes: [
			'error',
			'single',
		],
		semi: [
			'error',
			'always',
		],
		'no-irregular-whitespace': [
			'error',
			{ skipStrings: true },
		],
		'no-regex-spaces': 'error',
		'spaced-comment': [ 'error', 'always', {
			line: {
				markers: [ '/' ],
				exceptions: [ '-', '+' ],
			},
			block: {
				markers: [ '!' ],
				exceptions: [ '*' ],
				balanced: true,
			},
		} ],
		'block-spacing': 'error',
		'no-mixed-spaces-and-tabs': 'error',
		'no-multi-spaces': [
			'error',
			{ ignoreEOLComments: true },
		],
		'no-trailing-spaces': 'error',
		'no-whitespace-before-property': 'error',
		'space-before-blocks': 'error',
		'space-before-function-paren': [ 'error', 'never' ],
		'space-in-parens': [ 'error', 'never' ],
		'space-unary-ops': 'error',
		'semi-spacing': [ 'error', {
			before: false, after: false,
		} ],
		'padded-blocks': [ 'error', 'never' ],
		'object-curly-newline': [
			'error',
			{
				multiline: true,
				minProperties: 2,
				consistent: true,
			},
		],
		'object-property-newline': [ 'error', { allowAllPropertiesOnSameLine: true } ],
		'key-spacing': [
			'error',
			{
				afterColon: true,
				beforeColon: false,
				mode: 'strict',
			},
		],
		'keyword-spacing': [ 'error', {
			before: true, after: true,
		} ],
		'comma-spacing': [ 'error', {
			before: false, after: true,
		} ],
		'arrow-spacing': 'error',
		'array-bracket-spacing': [ 'error', 'always' ],
		'no-multiple-empty-lines': 'error',
		'prefer-const': 'error',
		'prefer-destructuring': [ 'error', {
			object: true, array: false,
		} ],
		'prefer-template': 'error',
		'no-var': 'error',
		'no-useless-concat': 'error',
		'no-useless-computed-key': 'error',
		'max-len': [
			'warn',
			{
				code: 120,
				tabWidth: 2,
				ignoreComments: true,
				ignoreTrailingComments: true,
				ignoreUrls: true,
				ignoreStrings: true,
				ignoreTemplateLiterals: true,
				ignoreRegExpLiterals: true,
			},
		],
		'no-unused-vars': 'warn',
		'vue/no-unused-vars': 'warn',
		'vue/max-attributes-per-line': [ 'error', {
			singleline: {
				max: 1,
			},
		} ],
		'vue/script-indent': [ 'error', 2, { baseIndent: 1 } ],
		'vue/html-indent': [ 'error', 'tab', {
			attribute: 1,
			baseIndent: 1,
			closeBracket: 0,
			alignAttributesVertically: true,
			ignores: [],
		} ],
		'vue/html-self-closing': 'error',
		'vue/html-closing-bracket-spacing': 'error',
		'vue/html-closing-bracket-newline': 'error',
		'vue/html-end-tags': 'error',
		'vue/html-quotes': [ 'error', 'double', { avoidEscape: false } ],
		'vue/multiline-html-element-content-newline': [ 'error', {
			allowEmptyLines: true,
		} ],
		'vue/comment-directive': 0,

		'no-param-reassign': 'off',
		'no-void': 'off',
		'no-nested-ternary': 'off',
		'max-classes-per-file': 'off',

		'no-shadow': 'off',
		'@typescript-eslint/no-shadow': 'error',

		'import/first': 'off',
		'import/named': 'error',
		'import/namespace': 'error',
		'import/default': 'error',
		'import/export': 'error',
		'import/extensions': 'off',
		'import/no-unresolved': 'off',
		'import/no-extraneous-dependencies': 'off',
		'import/prefer-default-export': 'off',

		'prefer-promise-reject-errors': 'off',

		// allow debugger during development only
		'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
		'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
	},
	overrides: [
		{
			files: [ '*.vue' ],
			rules: {
				indent: 'off',
			},
		},
	],
};
