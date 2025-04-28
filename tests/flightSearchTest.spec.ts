import { test, chromium, expect } from '@playwright/test';
import { Homepage } from '../pages/HomePage';
import { FlightResultsPage } from '../pages/FlightResultsPage'; // Importing FlightResultsPage

test('Automate Air India Flight Search with Stealth Mode', async () => {
  // 1. Launch browser in stealth mode
  test.setTimeout(60000); 
  const browser = await chromium.launchPersistentContext('', {
    headless: false,
    viewport: null, // Fullscreen
    args: [
      '--start-maximized',
      '--no-sandbox',
      '--disable-blink-features=AutomationControlled',
    ],
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
  });

  const page = await browser.newPage();

  // 2. Patch navigator.webdriver
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'webdriver', {
      get: () => false,
    });
  });

   const homepage = new Homepage(page);
  // const { day, month, weekday } = getTravelDateInfo(15); // 15 days from today

  // 3. Go to Air India website
  await page.goto('https://www.airindia.com');
  console.log('🌍 Navigated to Air India homepage');

  // 4. Apply stealth settings and accept cookies
  await homepage.preparePageStealth();
  // Accept cookies
  await homepage.acceptCookies();
  console.log('✅ Accepted cookies');

  // Step 2: Select Trip Type (One Way)
  await homepage.selectTripType('One Way');
  console.log('✅ Selected Trip Type: One Way');

  // Step 3: Grant Geolocation Permissions
  await homepage.grantGeolocationPermission();
  console.log('✅ Geolocation permission granted');

  // Step 4: Choose Cities (From Delhi to Mumbai)
  await homepage.enterFromCity('Delhi');
  await homepage.enterToCity('Mumbai');

  // Step 5: Select Travel Date
  await homepage.clickTravelDateInput();
  console.log('📅 Calendar opened');

  // Select month (June 2025)
  await homepage.selectMonth('6-2025');
  console.log('📅 Selected June 2025');

  // Click on a specific date (June 8, Sunday)
  await homepage.clickCalendarDate(8, 'June', 'Sunday');
  console.log('📅 Selected Sunday, June 8');

  // Step 6: Apply Filters (Direct Flights only)
 // await homepage.applyDirectFlightFilter();

  // Step 7: Click Search and wait for new results page
  await Promise.all([
    page.waitForURL(/\/booking\/availability\/\d+/, { timeout: 20000 }), // Waiting for the URL change
    homepage.clickSearch(), // Triggering the search
  ]);

  expect(page.url()).toMatch(/\/booking\/availability\/\d+/); // Ensure we have navigated to the search results
  console.log('✅ Successfully navigated to search results page!');

  // Step 8: Interact with Flight Results Page
  const flightResultsPage = new FlightResultsPage(page);

  await flightResultsPage.waitForFlightListingOrNoResults();
  await flightResultsPage.applyNonStopCheckboxFilter();
  await flightResultsPage.applyNonStopFilterViaPopup();

  console.log('✅ Test finished successfully');

  // Extract flight list from the results
  // const flightDetails = await flightResultsPage.extractFlightList();
  // console.log('✅ Extracted flight details:', flightDetails);

  // // Step 9: Take Screenshot of results
  // await flightResultsPage.takeScreenshot();
  // console.log('✅ Screenshot of flight results taken');

  // // Step 10: Validate the flight results visibility
  // await flightResultsPage.validateResults();

  // Optional: wait before closing to see results
  await page.waitForTimeout(15000); // Wait for 15 seconds

  // Close the browser
  await browser.close();
});
