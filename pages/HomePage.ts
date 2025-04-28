import { Locator, Page } from '@playwright/test';
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
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
      'Referer': 'https://www.airindia.com/',
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache',
      'sec-ch-ua': '"Google Chrome";v="123", "Not:A-Brand";v="8", "Chromium";v="123"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"Windows"',
      'Connection': 'keep-alive',
      'Upgrade-Insecure-Requests': '1',
      'DNT': '1'
    });

    await this.page.addInitScript(() => {
      Object.defineProperty(navigator, 'webdriver', { get: () => undefined });

      const originalHasProperty = Object.prototype.hasOwnProperty;
      Object.prototype.hasOwnProperty = function (property: string) {
        if (property === 'webdriver') {
          return false;
        }
        return originalHasProperty.call(this, property);
      };

      Object.defineProperty(navigator, 'plugins', {
        get: () => [1, 2, 3, 4, 5].map(() => ({})),
      });

      Object.defineProperty(navigator, 'languages', {
        get: () => ['en-US', 'en'],
      });
    });

    await this.page.context().setDefaultTimeout(45000);

    console.log('✅ Enhanced stealth settings applied');
  }

  async navigateToHomepage() {
    await this.page.waitForTimeout(3000);

    await this.page.goto('https://www.airindia.com', {
      waitUntil: 'networkidle',
      timeout: 60000
    });

    await this.page.waitForTimeout(5000);

    await this.acceptCookies();

    console.log('✅ Homepage loaded successfully');
  }

  async acceptCookies() {
    const acceptButton = this.page.locator('#onetrust-accept-btn-handler');
    if (await acceptButton.isVisible({ timeout: 3000 }).catch(() => false)) {
      await acceptButton.click();
      console.log('✅ Accepted cookies');
    }
  }

  async grantGeolocationPermission() {
    await this.page.context().grantPermissions(['geolocation'], {
      origin: 'https://www.airindia.com',
    });
    console.log('✅ Geolocation permission granted');
  }

  async selectTripType(type: 'One Way' | 'Round Trip') {
    await this.page.getByLabel(type).click();
    console.log(`✅ Selected Trip Type: ${type}`);
  }

  async enterFromCity(city: string) {
    const fromInput = this.page.locator('div.ai-input-wrap >>> input[data-id="ai-autocomplete-input-FROM"]');
    await fromInput.waitFor({ state: 'visible' });
    await fromInput.click();
    console.log('✅ Clicked on "From" input');

    for (const char of city) {
      await fromInput.type(char, { delay: 100 });
    }
    console.log(`⌨️ Typed "From" city: ${city}`);

    await this.page.waitForTimeout(1500);
    await this.page.keyboard.press('ArrowDown');
    await this.page.keyboard.press('Enter');
    console.log(`✅ "From" city selected: ${city}`);
  }

  async enterToCity(city: string) {
    const toInput = this.page.locator('input[data-id="ai-autocomplete-input-TO"]');
    await toInput.waitFor({ state: 'visible' });
    await toInput.click();
    console.log('✅ Clicked on "To" input');

    for (const char of city) {
      await toInput.type(char, { delay: 100 });
    }
    console.log(`⌨️ Typed "To" city: ${city}`);

    await this.page.waitForTimeout(1500);
    await this.page.keyboard.press('ArrowDown');
    await this.page.keyboard.press('Enter');
    console.log(`✅ "To" city selected: ${city}`);
  }

  async clickTravelDateInput() {
    const dateField = this.page.locator("//input[@id='dpFromDate' and @name='dpFrom' and @placeholder='Select Date']").first();
    await dateField.waitFor({ state: 'visible' });
    await dateField.click();
    console.log('📅 Calendar opened');
  }

  async selectMonth(monthValue: string) {
    const monthDropdown = this.page.locator('select[title="month-dropdown"]');
    await monthDropdown.waitFor({ state: 'visible' });
    await monthDropdown.selectOption(monthValue);
    console.log(`✅ Selected month: ${monthValue}`);
  }

  async clickCalendarDate(day: number, month: string, weekday: string) {
    const labelPrefix = `${weekday}, ${month} ${day},`;
    const dateLocator = this.page.locator(
      `//div[@role="gridcell" and starts-with(@aria-label, "${labelPrefix}")]//div[contains(@class, "custom-day") and contains(@class, "locked")]`
    );
    await dateLocator.waitFor({ state: 'visible' });
    await dateLocator.click();
    console.log(`📅 Selected date: ${weekday}, ${month} ${day}`);
  }

  async clickSearch() {
    const searchButton = this.page.locator('button.ai-basic-button.ai-btn-full-width:has-text("Search")');
    await searchButton.waitFor({ state: 'visible' });
    await searchButton.click();
    console.log('🔍 Clicked "Search"');
  }

  async getFlightResults() {
    return new FlightResultsPage(this.page);
  }
}
