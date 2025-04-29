import { defineConfig } from '@playwright/test';

export default defineConfig({
  timeout: 60000,
  retries: 0,
  use: {
    headless: true,
  },
  reporter: [['html', { open: 'never' }]],
});
