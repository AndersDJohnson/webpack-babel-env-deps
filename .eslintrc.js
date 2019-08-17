module.exports = {
  root: true,
  env: {
    node: true
  },
  globals: {
    __non_webpack_require__: 'readonly'
  },
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
    ecmaFeatures: {
      modules: true
    }
  },
  extends: ['eslint:recommended', 'plugin:prettier/recommended'],
  plugins: ['markdown'],
  rules: {
    'no-console': 0
  }
}
