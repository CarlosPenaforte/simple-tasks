module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true,
    "vue/setup-compiler-macros": true,
  },
  extends: [
    "eslint:recommended",
    "plugin:vue/vue3-essential",
    "plugin:@typescript-eslint/recommended",
  ],
  overrides: [],
  parser: 'vue-eslint-parser',
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    parser: require.resolve("@typescript-eslint/parser"),
    extraFileExtensions: [".vue"],
  },
  plugins: ["vue", "@typescript-eslint"],
  globals: {
    ga: "readonly", // Google Analytics
    cordova: "readonly",
    __statics: "readonly",
    __QUASAR_SSR__: "readonly",
    __QUASAR_SSR_SERVER__: "readonly",
    __QUASAR_SSR_CLIENT__: "readonly",
    __QUASAR_SSR_PWA__: "readonly",
    process: "readonly",
    Capacitor: "readonly",
    chrome: "readonly",
  },
  rules: {
    "prefer-promise-reject-errors": "off",

    // this rule, if on, would require explicit return type on the `render` function
    "@typescript-eslint/explicit-function-return-type": "off",

    // in plain CommonJS modules, you can't use `import foo = require('foo')` to pass this rule, so it has to be disabled
    "@typescript-eslint/no-var-requires": "off",

    // The core 'no-unused-vars' rules (in the eslint:recommended ruleset)
    // does not work with type definitions
    "no-unused-vars": "off",

    // allow debugger during development only
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
    indent: ["error", 2],
    quotes: ["error", "single"],
    semi: [2, "always"],
    "array-bracket-newline": ["error", { minItems: 1 }],
    "array-bracket-spacing": ["error", "always", { singleValue: false }],
    "arrow-spacing": "error",
    "block-spacing": "error",
    "brace-style": "error",
    "comma-dangle": ["error", "always-multiline"],
    "comma-spacing": [
      "error",
      {
        before: false,
        after: true,
      },
    ],
    "comma-style": ["error", "last"],
    "computed-property-spacing": ["error", "never"],
    "key-spacing": ["error", { beforeColon: false }],
    "keyword-spacing": ["error", { before: true }],
    "max-statements-per-line": ["error", { max: 1 }],
    "no-extra-parens": "error",
    "no-multi-spaces": "error",
    "no-multiple-empty-lines": [
      "error",
      {
        max: 2,
        maxEOF: 0,
      },
    ],
    "no-trailing-spaces": "error",
    "object-curly-newline": [
      "error",
      {
        multiline: true,
        minProperties: 2,
        consistent: true,
      },
    ],
    "object-curly-spacing": ["error", "always"],
    "padded-blocks": ["error", "never"],
    "rest-spread-spacing": ["error", "never"],
    "space-before-blocks": "error",
    "space-in-parens": ["error", "never"],
    "prefer-const": "error",
    "prefer-destructuring": [
      "error",
      {
        array: false,
        object: true,
      },
      { enforceForRenamedProperties: false },
    ],
    curly: "error",
    "arrow-body-style": ["error", "as-needed"],
    "vue/script-indent": [
      "error",
      2,
      {
        baseIndent: 1,
        switchCase: 0,
        ignores: [],
      },
    ],
  },
  overrides: [
    {
      files: ["*.vue"],
      rules: {
        indent: "off",
      },
    },
  ],
};
