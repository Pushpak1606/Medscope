import { defineConfig, devices } from "@playwright/test";

/**
 * Medscope E2E Configuration — Chromium-only smoke testing.
 * Kept minimal for zero-budget CI: single browser, local dev server.
 */
export default defineConfig({
  testDir: "./src/test/e2e",
  fullyParallel: true,
  forbidOnly: true,
  timeout: 60_000,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? "github" : "list",

  use: {
    baseURL: "http://localhost:8080",
    trace: "on-first-retry",
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],

  webServer: {
    command: "npm run dev",
    url: "http://localhost:8080",
    reuseExistingServer: true,
    timeout: 120_000,
  },
});
