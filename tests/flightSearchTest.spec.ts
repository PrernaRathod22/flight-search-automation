import { test, chromium } from '@playwright/test';
import { Homepage } from '../pages/HomePage';

test('Automate flight search on Air India', async () => {
  const browser = await chromium.launch({
    headless: false,
    args: ['--start-maximized'],
  });

  const context = await browser.newContext({
    viewport: null,
  });

  const page = await context.newPage();
  const homepage = new Homepage(page);

  // Step 1: Navigate to Air India
  await page.goto('https://www.airindia.com');
  console.log('✅ Page loaded');

  // Step 0: Accept Cookies
  await homepage.acceptCookies();

  // Step 2: Select Trip Type
  await homepage.selectTripType('One Way');

  // Grant geolocation permissions before interacting with the page
  // Step 2: Grant Geolocation Permissions
  await homepage.grantGeolocationPermission();  

  // Step 3: Choose Cities (Delhi → Mumbai)
  await homepage.enterFromCity('Delhi (DEL)');
  await homepage.enterToCity('Mumbai (BOM)');

  // 🔁 Do not close the browser yet
  await page.waitForTimeout(5000); // observe results
});
