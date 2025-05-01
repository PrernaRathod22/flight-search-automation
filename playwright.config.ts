import { defineConfig } from '@playwright/test';

export default defineConfig({
  timeout: 600000,
  use: {
    headless: false,
    video: 'on', // ✅ Enable video recording for all tests
    viewport: null, // ✅ Let browser open at full screen size
    launchOptions: {
      args: ['--start-maximized'], // ✅ Full window size (no padding)
    },
  },
});
