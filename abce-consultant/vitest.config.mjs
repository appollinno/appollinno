import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    // Only tests/unit. The Playwright specs live in tests/*.spec.js and must
    // not be collected here — they need a browser and a running server.
    include: ['tests/unit/**/*.test.js'],
  },
});
