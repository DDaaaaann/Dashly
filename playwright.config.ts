import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',  // Set test directory for Playwright
  use: {
    baseURL: `file://${process.cwd()}/dist/index.html`,
    headless: true,
  },
  reporter: [['html', { outputFolder: 'playwright-report', open: 'never' }]],

});
