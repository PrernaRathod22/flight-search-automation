import { Page } from '@playwright/test';
import { FlightResultsPage } from './FlightResultsPage';
 
export class Homepage {
  readonly page: Page;
  waitRandomly: () => Promise<void>;
 
  constructor(page: Page) {
    this.page = page;
    this.waitRandomly = async () => {
      const delay = Math.floor(Math.random() * 1500) + 800;
      await this.page.waitForTimeout(delay);
    };
  }
 
  async preparePageStealth() {
    await this.page.setExtraHTTPHeaders({
      'Accept-Language': 'en-US,en;q=0.9',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36',
    });
 
    await this.page.context().setDefaultTimeout(10000);
    await this.page.context().grantPermissions(['geolocation'], {
      origin: 'https://www.airindia.com',
    });
 
    console.log('Stealth settings applied');
  }
 
  async acceptCookies() {
    const acceptButton = this.page.locator('#onetrust-accept-btn-handler');
    if (await acceptButton.isVisible({ timeout: 3000 }).catch(() => false)) {
      await acceptButton.click();
      console.log('Accepted cookies');
    }
  }
 
  async setupGeolocationPermissions() {
    this.page.on('dialog', async (dialog) => {
      if (dialog.type() === 'permission') {
        await dialog.accept();
        console.log('Geolocation permission granted automatically');
      } else {
        await dialog.dismiss();
        console.log(' Unknown dialog detected, dismissed.');
      }
    });
    await this.page.context().grantPermissions(['geolocation'], {
      origin: 'https://www.airindia.com',
    });
    console.log('Geolocation permission granted');
  }
 
  
  async selectTripType(type: 'One Way' | 'Round Trip' , monthValue: string , weekday: string , month: string , day: number, month2: string ,
    monthValue2: string , day2: number, weekday2: string) {
    if(type == 'One Way'){
    await this.page.getByLabel(type).click();
    console.log(`Selected Trip Type: ${type}`);
 
      const dateField = this.page.locator("//input[@id='dpFromDate' and @name='dpFrom' and @placeholder='Select Date']").first();
      await dateField.waitFor({ state: 'visible' });
      await dateField.click();
      console.log(' Calendar opened');
       
      const monthDropdown = this.page.locator('select[title="month-dropdown"]');
      await monthDropdown.waitFor({ state: 'visible' });
      await monthDropdown.selectOption(monthValue);
      console.log(`Selected month: ${monthValue}`);
 
      const labelPrefix = `${weekday}, ${month} ${day},`;
      const dateLocator = this.page.locator(`//div[@role="gridcell" and starts-with(@aria-label, "${labelPrefix}")]//div[contains(@class, "custom-day") and contains(@class, "locked")]`);
      await dateLocator.waitFor({ state: 'visible' });
      await dateLocator.click();
      console.log(`Selected date: ${weekday}, ${month} ${day}`);
     
    }
    else{
      await this.page.getByLabel('Round Trip').check();
      console.log('Round Trip Option is Seleceted ');
 
      const dateField = this.page.locator("//input[@id='dpFromDate' and @name='dpFrom' and @placeholder='Select Date']").first();
      await dateField.waitFor({ state: 'visible' });
      await dateField.click();
      console.log('Calendar opened');
 
      const monthDropdown = this.page.locator('select[title="month-dropdown"]');
      await monthDropdown.waitFor({ state: 'visible' });
      await monthDropdown.selectOption(monthValue);
      console.log(`Selected month: ${monthValue}`);
 
      const labelPrefix = `${weekday}, ${month} ${day},`;
      const dateLocator = this.page.locator(`//div[@role="gridcell" and starts-with(@aria-label, "${labelPrefix}")]//div[contains(@class, "custom-day") and contains(@class, "locked")]`);
      await dateLocator.waitFor({ state: 'visible' });
      await dateLocator.click();
 
      console.log(`Selected date: ${weekday}, ${month} ${day}`);
      const monthDropdown2 = this.page.locator('select[title="month-dropdown"]');
      await monthDropdown2.waitFor({ state: 'visible' });
      await monthDropdown2.selectOption(monthValue2);
      console.log(`Selected month: ${monthValue2}`);
 
      const labelPrefix2 = `${weekday2}, ${month2} ${day2},`;
      const dateLocator2 = this.page.locator(`//div[@role="gridcell" and starts-with(@aria-label, "${labelPrefix2}")]//div[contains(@class, "custom-day") and contains(@class, "locked")]`);
      await dateLocator2.waitFor({ state: 'visible' });
      await dateLocator2.click();
      console.log(`Selected date: ${weekday2}, ${month2} ${day2}`);
    }
  }
 
  async enterFromCity(city: string) {
    const fromInput = this.page.locator('div.ai-input-wrap >>> input[data-id="ai-autocomplete-input-FROM"]');
    await fromInput.waitFor({ state: 'visible' });
    await fromInput.click();
    console.log('Clicked on "From" input');
 
    for (const char of city) {
      await fromInput.type(char, { delay: 100 });
    }
    console.log(`Typed "From" city: ${city}`);
 
    await this.page.waitForTimeout(1500);
    await this.page.keyboard.press('ArrowDown');
    await this.page.keyboard.press('Enter');
    console.log(`"From" city selected: ${city}`);
  }
 
  async enterToCity(city: string) {
    const toInput = this.page.locator('input[data-id="ai-autocomplete-input-TO"]');
    await toInput.waitFor({ state: 'visible' });
    await toInput.click();
    console.log('Clicked on "To" input');
 
    for (const char of city) {
      await toInput.type(char, { delay: 100 });
    }
    console.log(`Typed "To" city: ${city}`);
 
    await this.page.waitForTimeout(1500);
    await this.page.keyboard.press('ArrowDown');
    await this.page.keyboard.press('Enter');
    console.log(`"To" city selected: ${city}`);
  }
 
  async clickSearch() {
    const searchButton = this.page.locator('button.ai-basic-button.ai-btn-full-width:has-text("Search")');
    await searchButton.waitFor({ state: 'visible' });
    await searchButton.click();
    console.log('Clicked "Search"');
  }
  async getFlightResults() {
    return new FlightResultsPage(this.page);
  }
}
 