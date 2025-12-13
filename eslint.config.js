import js from '@eslint/js';
import globals from 'globals';
import tsParser from '@typescript-eslint/parser';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig([
  globalIgnores([
    'node_modules',
    'dist',
    'frontend/node_modules',
    'backend/node_modules',
    'shared/node_modules',
    '.turbo',
    'pnpm-lock.yaml',
    'dist/**',
    '**/dist/**',
    'frontend/dist/**',
    'backend/dist/**',
    'shared/dist/**',
  ]),
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: 'module',
      globals: { ...globals.node, ...globals.browser },
    },
    extends: [js.configs.recommended],
    rules: {
      // Disallow general console usage but allow warn/error/info
      'no-console': ['error', { allow: ['warn', 'error', 'info'] }],
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    },
  },
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsParser,
    },
  },
]);
