import { Page } from '@playwright/test';

export class Homepage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // Step 0: Accept Cookies
  async acceptCookies() {
    const acceptButton = this.page.locator('xpath=//*[@id="onetrust-accept-btn-handler"]');
    if (await acceptButton.isVisible({ timeout: 3000 }).catch(() => false)) {
      await acceptButton.click();
      console.log('✅ Accepted cookies using XPath');
    } else {
      console.log('ℹ️ No cookie banner found');
    }
  }

  // Step 1: Grant Geolocation Permission
  async grantGeolocationPermission() {
    await this.page.context().grantPermissions(['geolocation'], { origin: 'https://www.airindia.com' });
    console.log('✅ Geolocation permissions granted');
  }

  // Step 2: Select Trip Type
  async selectTripType(type: 'One Way' | 'Round Trip') {
    if (type === 'One Way') {
      await this.page.locator('label', { hasText: 'One Way' }).click();
    } else {
      await this.page.locator('label', { hasText: 'Round Trip' }).click();
    }
    console.log('✅ Selected Trip Type: ${type}');
  }

  // ✅ Step 3: Enter 'From' City (Shadow DOM)
  async enterFromCity(city: string) {
    // 1. Grab the locator (don't call click/fill yet!)
    const fromInput = this.page.locator(
      'div.ai-input-wrap >>> input[data-id="ai-autocomplete-input-FROM"]'
    );
  
    console.log('⏳ Waiting for "From" input inside shadow DOM...');
    // 2. Wait for the input to be visible
    await fromInput.waitFor({ state: 'visible', timeout: 10000 });
  
    // 3. Click into it
    await fromInput.click();
    console.log('✅ Clicked on "From" input inside shadow DOM');
  
    // 4. Type the city
    await fromInput.fill(city);
    console.log('⌨️ Typed city: ${city}');
  
    // 5. Select the first dropdown entry
    await this.page.waitForTimeout(2000);
    await this.page.keyboard.press('ArrowDown');
    await this.page.keyboard.press('Enter');
    console.log('✅ "From" city set to ${city}');
  }
  

  // ✅ Step 4: Enter 'To' City (standard input)
  async enterToCity(city: string) {
    const toInput = this.page.locator('input[data-id="ai-autocomplete-input-TO"]');
    await toInput.waitFor({ state: 'visible', timeout: 10000 });

    await toInput.click();
    console.log('✅ Clicked on To input');

    await toInput.fill(city);
    console.log('⌨️ Typed city: ${city}');

    await this.page.waitForTimeout(2000); // Wait for dropdown
    await this.page.keyboard.press('ArrowDown');
    await this.page.keyboard.press('Enter');
    console.log('✅ "To" city set to ${city}');
  }
}
