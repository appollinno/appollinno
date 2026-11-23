import { defineConfig, devices } from '@playwright/test';
import { chromiumLaunchOptions } from './scripts/chromium.mjs';

/**
 * Tests run against the real production build served by `vite preview`,
 * not the dev server — so what is tested is what would be deployed.
 */
export default defineConfig({
  testDir: './tests',
  // Unit tests live in tests/unit/*.test.js and belong to Vitest. Without
  // this, Playwright's default testMatch would collect them too.
  testMatch: '**/*.spec.js',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['list'],
  ],
  timeout: 30_000,
  expect: { timeout: 7_000 },

  use: {
    baseURL: 'http://127.0.0.1:4173',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    launchOptions: chromiumLaunchOptions(),
  },

  projects: [
    { name: 'desktop-1440', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } } },
    { name: 'laptop-1024',  use: { ...devices['Desktop Chrome'], viewport: { width: 1024, height: 768 } } },
    { name: 'tablet-768',   use: { ...devices['Desktop Chrome'], viewport: { width: 768,  height: 1024 } } },
    { name: 'mobile-390',   use: { ...devices['Desktop Chrome'], viewport: { width: 390,  height: 844 }, isMobile: false } },
    { name: 'mobile-375',   use: { ...devices['Desktop Chrome'], viewport: { width: 375,  height: 812 }, isMobile: false } },
  ],

  webServer: {
    command: 'npm run build && npx vite preview --port 4173 --strictPort',
    url: 'http://127.0.0.1:4173',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    stdout: 'ignore',
    stderr: 'pipe',
  },
});
