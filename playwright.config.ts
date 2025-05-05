import { defineConfig } from '@playwright/test';

export default defineConfig({
  timeout: 600000,
  use: {
    headless: false,
    video: 'on',
    viewport: null,
    launchOptions: {
      args: ['--start-maximized'], 
    },
  },
});
