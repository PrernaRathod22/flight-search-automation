import { Locator, Page } from '@playwright/test';
import { getTravelDate } from '../utils/dateUtils'; 
import { format, addDays } from 'date-fns';

export class Homepage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }


  async acceptCookies() {
    const acceptButton = this.page.locator('#onetrust-accept-btn-handler');
    if (await acceptButton.isVisible({ timeout: 3000 }).catch(() => false)) {
      await acceptButton.click();
      console.log('✅ Accepted cookies');
    }
  }

  // Step 1: Grant Geolocation Permission
  async grantGeolocationPermission() {
    
    await this.page.context().grantPermissions(['geolocation'], {
      origin: 'https://www.airindia.com', 
    });
    console.log('✅ Geolocation permission granted for https://www.airindia.com');
  }

  // Automatically handle geolocation permission popup (if it appears)
  async handleGeolocationDialog() {
    this.page.on('dialog', async (dialog) => {
      if (dialog.type() === 'permission') {
        console.log('✅ Geolocation permission request detected');
        
        await dialog.accept();
        console.log('✅ Geolocation permission granted automatically');
      } else {
        await dialog.dismiss();
        console.log('❌ Unknown dialog detected, dismissed.');
      }
    });
  }

  async setupGeolocationPermissions() {
    
    await this.handleGeolocationDialog(); 
    await this.grantGeolocationPermission();
  }

  // Step 2: Select Trip Type
  async selectTripType(type: 'One Way' | 'Round Trip') {
    if (type === 'One Way') {
      await this.page.locator('label', { hasText: 'One Way' }).click();
    } else {
      await this.page.locator('label', { hasText: 'Round Trip' }).click();
    }
    console.log(`✅ Selected Trip Type: ${type}`);
  }

  // Step 3: Enter 'From' City
  async enterFromCity(city: string) {
    const fromInput = this.page.locator('div.ai-input-wrap >>> input[data-id="ai-autocomplete-input-FROM"]');
    await fromInput.waitFor({ state: 'visible', timeout: 10000 });
    await fromInput.click();
    console.log('✅ Clicked on "From" input');
  
    await fromInput.fill(city);
    console.log(`⌨️ Typed city: ${city}`);
  
    await this.page.waitForTimeout(2000);
    await this.page.keyboard.press('ArrowDown');
    await this.page.keyboard.press('Enter');
    console.log(`✅ "From" city set to ${city}`);
  }
  
  // Step 4: Enter 'To' City
  async enterToCity(city: string) {
    const toInput = this.page.locator('input[data-id="ai-autocomplete-input-TO"]');
    await toInput.waitFor({ state: 'visible', timeout: 10000 });
  
    await toInput.click();
    console.log('✅ Clicked on "To" input');
  
    await toInput.fill(city);
    console.log(`⌨️ Typed city: ${city}`);
  
    await this.page.waitForTimeout(2000); 
    await this.page.keyboard.press('ArrowDown');
    await this.page.keyboard.press('Enter');
    console.log(`✅ "To" city set to ${city}`);
  }
  
  async clickTravelDateInput() {
    const dateField = this.page.locator("//input[@id='dpFromDate' and @name='dpFrom' and @placeholder='Select Date']").first();
    await dateField.waitFor({ state: 'visible', timeout: 5000 });
    await dateField.click();
    console.log('📅 Calendar opened');
  }  

  async selectmonth(monthValue: string){
    const DataOfMonth = this.page.locator('select[title="month-dropdown"]');
    await DataOfMonth.waitFor({ state: 'visible', timeout: 5000 });
    await DataOfMonth.selectOption(monthValue);
    // await DataOfMonth.click();
    // await this.page.keyboard.press('ArrowDown');
    // await this.page.keyboard.press('ArrowDown');
    // await this.page.keyboard.press('Enter');
    console.log('ckicked on the month');
  }

  async clickCalendarDate(day: number, month: string, weekday: string) {
    // Build the prefix that matches the aria-label (without the year)
    const labelPrefix = `${weekday}, ${month} ${day},`;
    const dateLocator = this.page.locator(
      `//div[@role="gridcell" and starts-with(@aria-label, "${labelPrefix}")]` +
      `//div[contains(@class, "custom-day") and contains(@class, "locked")]`
    );
    await dateLocator.waitFor({ state: 'visible', timeout: 5000 });
    await dateLocator.click();
    console.log(`📅 Clicked on ${weekday}, ${month} ${day},`);
  }

  async clickSearch() {
    const SearchButton = this.page.locator('button.ai-basic-button.ai-btn-full-width:has-text("Search")');
    await SearchButton.waitFor({ state: 'visible', timeout: 5000 });
    await SearchButton.click();
    console.log('📅 Searched  Clicked');
  } 
}