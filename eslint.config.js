import js from '@eslint/js';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import vueParser from 'vue-eslint-parser';
import vuePlugin from 'eslint-plugin-vue';
import prettierConfig from 'eslint-config-prettier';

export default [
  js.configs.recommended,
  prettierConfig,
  {
    linterOptions: {
      reportUnusedDisableDirectives: true,
      noInlineConfig: false,
    },
    files: ['**/*.js', '**/*.ts', '**/*.vue'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2022,
      },
      globals: {
        // Nuxt 全局变量
        definePageMeta: 'readonly',
        useRoute: 'readonly',
        useRouter: 'readonly',
        ref: 'readonly',
        computed: 'readonly',
        watch: 'readonly',
        onMounted: 'readonly',
        nextTick: 'readonly',
        toRefs: 'readonly',
        // 浏览器全局变量
        window: 'readonly',
        document: 'readonly',
        localStorage: 'readonly',
        fetch: 'readonly',
        console: 'readonly',
        // DOM 相关类型
        HTMLElement: 'readonly',
        HTMLInputElement: 'readonly',
        HTMLTextAreaElement: 'readonly',
        Node: 'readonly',
        Event: 'readonly',
        MouseEvent: 'readonly',
        URL: 'readonly',
        // 自定义全局类型
        IArticle: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
    },
    rules: {
      // 基本规则
      'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      'no-undef': 'error',
      'no-unused-vars': 'off', // 使用 TypeScript 的规则

      // TypeScript 规则
      '@typescript-eslint/no-explicit-any': 'off', // 警告使用 any 类型
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ], // 未使用的变量警告，但忽略以_开头的
      '@typescript-eslint/ban-ts-comment': 'off', // 允许 ts-ignore 等注释

      // 其他规则
      'prefer-const': 'warn', // 建议使用 const
      'no-var': 'warn', // 不使用 var
    },
  },
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        ecmaVersion: 2022,
        parser: tsParser,
      },
    },
    plugins: {
      vue: vuePlugin,
    },
    rules: {
      // Vue 特定规则
      'vue/multi-word-component-names': 'off', // 允许单词组件名
      'vue/no-v-html': 'off', // 允许使用 v-html
      'vue/require-default-prop': 'off', // 不要求 props 有默认值
    },
  },
  {
    ignores: [
      'dist/**',
      '.output/**',
      '.nuxt/**',
      'node_modules/**',
      'commitlint.config.js',
      'eslint.config.js',
      '*.config.js',
      'public/**',
      'static/**',
      '*.d.ts',
    ],
  },
];
