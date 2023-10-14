// .eslintrc.js
module.exports = {
  env: {
    browser: true,
    node: true,
    es2021: true,
  },
  extends: ["eslint:recommended", "plugin:prettier/recommended"],
  rules: {
    // You can add custom rules here
    "prettier/prettier": ["error", { usePrettierrc: true }],
  },
};
