import { Page } from '@playwright/test';

export class FlightResultsPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // Wait for either flight listing or "no results" message
  async waitForFlightListingOrNoResults() {
    const flightListing = this.page.locator('//*[@id="b376e00a-f3ea-40b2-88c8-1a31565febe4UpsellPremium"]');
    const noResultsMessage = this.page.locator('text=SORRY NO RESULTS WERE FOUND');

    const result = await Promise.race([
      flightListing.waitFor({ state: 'visible', timeout: 10000 }).then(() => 'listing'),
      noResultsMessage.waitFor({ state: 'visible', timeout: 10000 }).then(() => 'noResults')
    ]);

    if (result === 'listing') {
      console.log('✅ Flight listing is available');
    } else if (result === 'noResults') {
      console.log('⚠️ No flight results found for selected date and cities');
    }
  }

  async applyNonStopCheckboxFilter() {
    const nonStopCheckbox = this.page.locator('//*[@id="mat-mdc-slide-toggle-1"]');
    await nonStopCheckbox.waitFor({ state: 'visible', timeout: 5000 });
    await nonStopCheckbox.click();
    console.log('✅ Non-stop checkbox filter applied');
  }

  async applyNonStopFilterViaPopup() {
    const filterButton = this.page.locator('//*[@id="481d4382-05fa-41c1-bde3-6630a1b07646UpsellPremium"]/div[1]/refx-upsell-premium-filtering-pres/div[1]/div[2]/button');
    await filterButton.waitFor({ state: 'visible', timeout: 5000 });
    await filterButton.click();
    console.log('✅ Filter popup opened');

    const stopsSection = this.page.locator('//*[@id="mat-expansion-panel-header-19"]');
    await stopsSection.waitFor({ state: 'visible', timeout: 5000 });
    await stopsSection.click();
    console.log('✅ "Number of Stops" section expanded');

    const nonStopOption = this.page.locator('//*[@id="mat-radio-58"]');
    await nonStopOption.waitFor({ state: 'visible', timeout: 5000 });
    await nonStopOption.click();
    console.log('✅ Non-stop option selected in popup');
  }
}
