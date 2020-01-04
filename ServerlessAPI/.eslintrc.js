module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: 2019
  },
  env: {
    node: true,
    es6: true,
    "jest/globals": true
  },
  extends: ['eslint:recommended', 'prettier', 'plugin:prettier/recommended'],
  plugins: ['prettier', 'jest'],
  // add your custom rules here
  rules: {}
}
