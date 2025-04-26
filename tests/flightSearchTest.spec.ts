import { test, chromium } from '@playwright/test';
import { Homepage } from '../pages/HomePage';

test('Automate flight search on Air India', async () => {
  const browser = await chromium.launch({
    headless: false,
    args: ['--start-maximized'],
  });

  const context = await browser.newContext({
    viewport: null,
    permissions: ['geolocation'],
  });

  const page = await context.newPage();
  const homepage = new Homepage(page);

  // Step 1: Navigate to Air India
  await page.goto('https://www.airindia.com');
  console.log('✅ Page loaded');

  await homepage.acceptCookies();

  // Step 2: Select Trip Type
  await homepage.selectTripType('One Way');

  // Step 3: Grant Geolocation Permissions
  await homepage.setupGeolocationPermissions();

  // Step 4: Choose Cities (Delhi → Mumbai)
  await homepage.enterFromCity('Delhi');
  await homepage.enterToCity('Mumbai');

  // Step 5: Select Travel Date
  // await homepage.selectTravelDates();
  await homepage.clickTravelDateInput();
  
  await homepage.selectmonth('6-2025');

 await homepage.clickCalendarDate(8, 'June', 'Sunday')

 await homepage.clickSearch();

  await page.waitForTimeout(5000); 
});
