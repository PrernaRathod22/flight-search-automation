import { Page } from '@playwright/test';
import path from 'path';
import fs from 'fs';

export class FlightResultsPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async applyNonStopCheckboxFilter() {
    const nonStopCheckbox = this.page.locator('//*[@id="mat-mdc-slide-toggle-1"]');
    await nonStopCheckbox.click();
    console.log('Non-stop checkbox filter applied');
  }

  async applyNonStopFilterViaPopup() {
    const filterButton = this.page.locator("//button[contains(@class, 'filters-button')]//span[contains(text(), 'Filter')]");
    await filterButton.waitFor({ state: 'visible' });
    await filterButton.click();
    console.log('Filter popup opened');

    const nonStopRadio = this.page.getByLabel('Nonstop only');
    await nonStopRadio.waitFor({ state: 'visible' });
    await nonStopRadio.check();
    console.log('Non-stop option selected in popup');

    const applyButton = this.page.getByRole('button', { name: 'Apply' });
    await applyButton.waitFor({ state: 'visible' });
    await applyButton.click();
    console.log('Apply button clicked in popup');
  }

  async extractFlightDetails() {
    const leftSections = await this.page.locator('div.basic-flight-card-layout-left-top-section-container').elementHandles();
    const rightSections = await this.page.locator('div.right-section').elementHandles();
    const flightDetails = [];

    for (let i = 0; i < leftSections.length; i++) {
      const left = leftSections[i];
      const right = rightSections[i];

      const flightNumber = await left.$eval('.operating-airline-multiline span', el => el.textContent?.trim() || 'N/A').catch(() => 'N/A');
      const departureTime = await left.$eval('.bound-departure-datetime', el => el.textContent?.trim() || 'N/A').catch(() => 'N/A');
      const arrivalTime = await left.$eval('.bound-arrival-datetime', el => el.textContent?.trim() || 'N/A').catch(() => 'N/A');

      const getPrice = async (className: string): Promise<string> => {
        try {
          const priceElement = await right.$(`.${className} .price-amount`);
          if (priceElement) {
            const priceText = await priceElement.textContent();
            return priceText ? `INR ${priceText.trim()}` : 'N/A';
          }
          return 'N/A';
        } catch {
          return 'N/A';
        }
      };

      const economyPrice = await getPrice('eco');
      const premiumEconomyPrice = await getPrice('ecoPremium');
      const businessPrice = await getPrice('business');

      flightDetails.push({
        flightNumber,
        departureTime,
        arrivalTime,
        prices: {
          economy: economyPrice,
          premiumEconomy: premiumEconomyPrice,
          business: businessPrice
        }
      });
    }

    const jsonFilePath = path.resolve(__dirname, './Logs/FlightDetails.json');
    console.log(`Flight details will be saved at: ${jsonFilePath}`);
    try {
      fs.writeFileSync(jsonFilePath, JSON.stringify(flightDetails, null, 2));
      console.log(`Flight details saved to ${jsonFilePath}`);
    } catch (error) {
      console.error('Failed to save the file:', error);
    }

    
    const htmlContent = `
<html>
<head><title>Flight Report</title></head>
<body>
  <h1>Flight Search Report</h1>
  <pre>${JSON.stringify(flightDetails, null, 2)}</pre>
</body>
</html>
`;

    const htmlFilePath = path.resolve(__dirname, './Logs/FlightDetails.html');
    try {
      fs.writeFileSync(htmlFilePath, htmlContent);
      console.log(`HTML report saved to ${htmlFilePath}`);
    } catch (error) {
      console.error('Failed to save the HTML report:', error);
    }

    return flightDetails;
  }

  async captureFinalScreenshot(filename: string) {
    await this.page.evaluate(() => window.scrollBy(0, 300));
    await this.page.waitForTimeout(1000);
    await this.page.screenshot({ path: filename, fullPage: true });
    console.log(`Final screenshot taken: ${filename}`);
  }
}
