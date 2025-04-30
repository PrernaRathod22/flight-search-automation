
# ✈️ Air India Flight Search Automation (Playwright + TypeScript)

This project automates a flight search on the [Air India](https://www.airindia.com/) website using **Playwright** with **TypeScript**. It simulates user interactions like selecting trip type, entering cities, picking a travel date, and scraping flight details such as flight number, departure time, and price.

---

## ✅ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/PrernaRathod22/flight-search-automation.git
cd airindia-flight-search-playwright
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Install Playwright Browsers

```bash
npx playwright install
```



## ▶️ How to Execute the Test

Run all tests:

```bash
npx playwright test
```
Run a specific test file:

```bash
npx playwright test tests/flightSearchTest.spec.ts
```
View the HTML test report (after running tests):

```bash
npx playwright show-report
```


## 🧠 Brief Explanation of the Approach Used

1. **Playwright Launch**  
   Launches a Chromium browser.

2. **Navigate to Air India Website**  
   Loads the homepage and waits for the DOM to fully load.

3. **Interact with the Search Form**  
   - Selects trip type (One Way or Round Trip)
   - Fills in origin and destination cities
   - Selects travel date 

4. **Trigger Search**  
   Clicks on the "Search Flights" button and waits for the results page to render.

5. **Apply Filters (if available)**  
   Applies "Non-Stop Flights Only" filter.

6. **Scrape Flight Data**  
   Extracts and prints flight number, departure time, and price.

7. **Capture Screenshot**  
   Takes a screenshot of the flight listings page and saves it locally.

8. **Validate Results**  
   Verifies that the page contains expected flight information elements.

---

