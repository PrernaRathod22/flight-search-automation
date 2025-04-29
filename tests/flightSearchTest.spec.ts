import { test, chromium, expect } from '@playwright/test';
import { Homepage } from '../pages/HomePage';
import { FlightResultsPage } from '../pages/FlightResultsPage';
import { allure } from 'allure-playwright';

const testCases: { tripType: "One Way" | "Round Trip"; screenshotName: string }[] = [
  { tripType: "One Way", screenshotName: "final_oneway.png" },
  { tripType: "Round Trip", screenshotName: "final_roundtrip.png" }
];

for (const testCase of testCases) {
  test(`${testCase.tripType} Flight Search: Delhi → Mumbai`, async () => {
    test.setTimeout(600000);
    const context = await chromium.launchPersistentContext('', { headless: false });
    const page = context.pages()[0] || await context.newPage();

    await page.addInitScript(() => {
      Object.defineProperty(navigator, 'webdriver', { get: () => false });
    });

    const homepage = new Homepage(page);
    await page.goto('https://www.airindia.com');
    await homepage.preparePageStealth();
    await homepage.acceptCookies();

    await homepage.selectTripType(
      testCase.tripType,
      '6-2025', 'Sunday', 'June', 8,
      'June', '6-2025', 18, 'Wednesday'
    );

    await homepage.setupGeolocationPermissions();
    await homepage.enterFromCity('Delhi');
    await homepage.enterToCity('Mumbai');

    await Promise.all([
      page.waitForURL(/\/booking\/availability\/\d+/, { timeout: 20000 }),
      homepage.clickSearch(),
    ]);

    expect(page.url()).toMatch(/\/booking\/availability\/\d+/);

    const flightResultsPage = new FlightResultsPage(page);
    await flightResultsPage.applyNonStopCheckboxFilter();
    await flightResultsPage.applyNonStopFilterViaPopup();
    const flightDetails = await flightResultsPage.extractFlightDetails();
    await flightResultsPage.captureFinalScreenshot(`screenshots/${testCase.screenshotName}`);

    // Attach flight details to Allure report
    await allure.attachment('Flight Details', JSON.stringify(flightDetails, null, 2), 'application/json');

    await context.close();
  });
}
