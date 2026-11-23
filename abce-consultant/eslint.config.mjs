import js from '@eslint/js';
import globals from 'globals';

/**
 * Three environments live in this repo and they do not share globals:
 *   src/**      runs in the browser
 *   scripts/**  and config files run in Node
 *   tests/**    run under Playwright or Vitest
 * Linting them all as one environment either misses real errors or invents
 * false ones, so each gets its own block.
 */
export default [
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      'playwright-report/**',
      'test-results/**',
      'docs/**',
      // Ruflo's own generated tooling — not project source, and gitignored.
      '.claude/**',
      '.claude-flow/**',
      '.swarm/**',
      '.agents/**',
    ],
  },

  js.configs.recommended,

  // Browser code.
  {
    files: ['src/js/**/*.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: globals.browser,
    },
    rules: {
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      eqeqeq: ['error', 'always', { null: 'ignore' }],
      'prefer-const': 'error',
      'no-var': 'error',
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },

  // Build tooling and config. The audit scripts drive a browser, so bodies
  // passed to page.evaluate() are browser code living inside a Node file —
  // both sets of globals are legitimately in play here.
  {
    files: ['scripts/**/*.mjs', '*.config.js', '*.config.mjs', 'site.config.js', 'src/content/**/*.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: { ...globals.node, ...globals.browser },
    },
    rules: {
      eqeqeq: ['error', 'always', { null: 'ignore' }],
      'prefer-const': 'error',
      'no-var': 'error',
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },

  // Tests: Playwright specs and Vitest units.
  {
    files: ['tests/**/*.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: { ...globals.node, ...globals.browser },
    },
    rules: {
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },
];
