import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests-hardening',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: process.env.CI ? 'line' : 'list',
  use: {
    baseURL: 'http://127.0.0.1:4173/11-11-tech/',
    browserName: 'chromium',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  webServer: {
    command: 'npm run preview -- --host 127.0.0.1 --port 4173',
    url: 'http://127.0.0.1:4173/11-11-tech/',
    reuseExistingServer: !process.env.CI,
    timeout: 30_000,
  },
  projects: [
    { name: 'desktop-1440', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } } },
    { name: 'compact-320', use: { ...devices['Pixel 5'], viewport: { width: 320, height: 568 } } },
    { name: 'mobile-390', use: { ...devices['Pixel 7'], viewport: { width: 390, height: 844 } } },
    { name: 'tablet-768', use: { ...devices['Pixel 7'], viewport: { width: 768, height: 1024 } } },
    { name: 'landscape-844', use: { ...devices['Pixel 7'], viewport: { width: 844, height: 390 } } },
  ],
})
