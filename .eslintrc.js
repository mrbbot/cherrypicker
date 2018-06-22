module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: ["plugin:prettier/recommended"],
  rules: {
    "prefer-const": "warn"
  },
  parserOptions: {
    ecmaVersion: 2017
  }
};