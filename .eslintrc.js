module.exports = {
  "extends": "airbnb",
  "installedESLint": true,
  "plugins": [
    "react"
  ],
  rules: {
    'no-multi-spaces': ["error", {
      exceptions: {
        "VariableDeclarator": true,
      }
    }],
    'no-console': ["error", { allow: ["warn", "error"] }]
  },
};
