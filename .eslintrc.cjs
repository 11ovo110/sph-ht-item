/* eslint-env node */
require("@rushstack/eslint-patch/modern-module-resolution");

module.exports = {
  "root": true,
  "extends": [
    "plugin:vue/vue3-essential",
    "eslint:recommended",
    "@vue/eslint-config-typescript/recommended",
    "@vue/eslint-config-prettier"
  ],
  "env": {
    "vue/setup-compiler-macros": true
  },
  "rules": {
    "prettier/prettier": 0,
    "@typescript-eslint/no-explicit-any": 0,
    "prefer-const": 0,
    "@typescript-eslint/no-empty-function": 0,
    "@typescript-eslint/no-unused-vars": 0,
    "vue/multi-word-component-names": 0,
    "no-redeclare": 0
  }
}
