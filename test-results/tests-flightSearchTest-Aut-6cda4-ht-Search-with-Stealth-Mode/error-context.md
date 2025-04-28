# Test info

- Name: Automate Air India Flight Search with Stealth Mode
- Location: C:\Users\IAMOPS\Downloads\Air India Automation Task\tests\flightSearchTest.spec.ts:5:5

# Error details

```
TimeoutError: locator.waitFor: Timeout 5000ms exceeded.
Call log:
  - waiting for locator('//*[@id="mat-mdc-slide-toggle-1"]') to be visible

    at FlightResultsPage.applyNonStopCheckboxFilter (C:\Users\IAMOPS\Downloads\Air India Automation Task\pages\FlightResultsPage.ts:29:27)
    at C:\Users\IAMOPS\Downloads\Air India Automation Task\tests\flightSearchTest.spec.ts:81:27
```

# Test source

```ts
   1 | import { Page } from '@playwright/test';
   2 |
   3 | export class FlightResultsPage {
   4 |   readonly page: Page;
   5 |
   6 |   constructor(page: Page) {
   7 |     this.page = page;
   8 |   }
   9 |
  10 |   // Wait for either flight listing or "no results" message
  11 |   async waitForFlightListingOrNoResults() {
  12 |     const flightListing = this.page.locator('//*[@id="b376e00a-f3ea-40b2-88c8-1a31565febe4UpsellPremium"]');
  13 |     const noResultsMessage = this.page.locator('text=SORRY NO RESULTS WERE FOUND');
  14 |
  15 |     const result = await Promise.race([
  16 |       flightListing.waitFor({ state: 'visible', timeout: 10000 }).then(() => 'listing'),
  17 |       noResultsMessage.waitFor({ state: 'visible', timeout: 10000 }).then(() => 'noResults')
  18 |     ]);
  19 |
  20 |     if (result === 'listing') {
  21 |       console.log('✅ Flight listing is available');
  22 |     } else if (result === 'noResults') {
  23 |       console.log('⚠️ No flight results found for selected date and cities');
  24 |     }
  25 |   }
  26 |
  27 |   async applyNonStopCheckboxFilter() {
  28 |     const nonStopCheckbox = this.page.locator('//*[@id="mat-mdc-slide-toggle-1"]');
> 29 |     await nonStopCheckbox.waitFor({ state: 'visible', timeout: 5000 });
     |                           ^ TimeoutError: locator.waitFor: Timeout 5000ms exceeded.
  30 |     await nonStopCheckbox.click();
  31 |     console.log('✅ Non-stop checkbox filter applied');
  32 |   }
  33 |
  34 |   async applyNonStopFilterViaPopup() {
  35 |     const filterButton = this.page.locator('//*[@id="481d4382-05fa-41c1-bde3-6630a1b07646UpsellPremium"]/div[1]/refx-upsell-premium-filtering-pres/div[1]/div[2]/button');
  36 |     await filterButton.waitFor({ state: 'visible', timeout: 5000 });
  37 |     await filterButton.click();
  38 |     console.log('✅ Filter popup opened');
  39 |
  40 |     const stopsSection = this.page.locator('//*[@id="mat-expansion-panel-header-19"]');
  41 |     await stopsSection.waitFor({ state: 'visible', timeout: 5000 });
  42 |     await stopsSection.click();
  43 |     console.log('✅ "Number of Stops" section expanded');
  44 |
  45 |     const nonStopOption = this.page.locator('//*[@id="mat-radio-58"]');
  46 |     await nonStopOption.waitFor({ state: 'visible', timeout: 5000 });
  47 |     await nonStopOption.click();
  48 |     console.log('✅ Non-stop option selected in popup');
  49 |   }
  50 | }
  51 |
```