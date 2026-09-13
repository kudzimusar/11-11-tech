import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './mobile/tests-web',
  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: process.env.CI ? 'line' : 'list',
  use: {
    baseURL: 'http://127.0.0.1:4180/',
    browserName: 'chromium',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  webServer: {
    command: 'python3 -m http.server 4180 --bind 127.0.0.1 --directory mobile/dist-web',
    url: 'http://127.0.0.1:4180/',
    reuseExistingServer: !process.env.CI,
    timeout: 30_000,
  },
  projects: [
    { name: 'native-web-compact', use: { ...devices['Pixel 5'], viewport: { width: 320, height: 568 } } },
    { name: 'native-web-standard', use: { ...devices['Pixel 7'], viewport: { width: 390, height: 844 } } },
    { name: 'native-web-tablet', use: { ...devices['Pixel 7'], viewport: { width: 768, height: 1024 } } },
    { name: 'native-web-landscape', use: { ...devices['Pixel 7'], viewport: { width: 844, height: 390 } } },
  ],
})
