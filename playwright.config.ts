import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests', // Specify the test directory
  timeout: 30000,     // Set test timeout
  use: {
    headless: false,  // Set to true if you want headless mode
    screenshot: 'on',
    video: 'retain-on-failure',
  },
});