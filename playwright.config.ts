import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  reporter: "list",
  use: {
    baseURL: "http://localhost:3000",
    trace: "off",
  },
  webServer: {
    command: "npm run build && npm run start",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        launchOptions: {
          executablePath: "/opt/pw-browsers/chromium",
          args: ["--headless", "--no-sandbox"],
        },
      },
    },
    {
      // A narrow-viewport Chrome profile rather than a full mobile device
      // descriptor: `isMobile`/`hasTouch` emulation is unstable under
      // Chromium's headless --no-sandbox mode in this sandboxed environment.
      name: "mobile-chrome",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 390, height: 844 },
        userAgent:
          "Mozilla/5.0 (Linux; Android 14; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Mobile Safari/537.36",
        launchOptions: {
          executablePath: "/opt/pw-browsers/chromium",
          args: ["--headless", "--no-sandbox"],
        },
      },
    },
  ],
});
