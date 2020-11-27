module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  parserOptions: {
    parser: 'babel-eslint'
  },
  extends: [
    'eslint:recommended',
    'plugin:jest/recommended',
    'plugin:vue/recommended',
    'plugin:prettier/recommended',
    'prettier/vue'
  ],
  plugins: ['vue', 'prettier', 'jest'],
  rules: {
    'no-console': [
      'error',
      {
        allow: ['warn', 'error']
      }
    ],
    'no-debugger': 'error',
    'prettier/prettier': 'error',
    'vue/no-parsing-error': [2, {'x-invalid-end-tag': false}]
  }
}
