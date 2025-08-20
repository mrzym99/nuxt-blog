import withNuxt from './.nuxt/eslint.config.mjs';

export default withNuxt({
  extends: ['eslint:recommended'],
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint'],
  rules: {
    '@typescript-eslint/no-explicit-any': 'off',
  },
});
