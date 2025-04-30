Air India Flight Search Automation (Playwright + TypeScript)
This project automates flight search on the Air India website using Playwright with TypeScript.

📋 Features
Selects trip type: One Way or Round Trip (parameterized)

Chooses cities: From and To (e.g., Delhi to Mumbai)

Selects a travel date (e.g., 15 days from today)

Clicks the search button and waits for flight results

Applies filters (e.g., Direct Flights only, if available)

Extracts flight numbers, times, and prices

Takes a screenshot of the results page

Validates that flight results are displayed

🛠️ Setup Instructions
1. Clone the Repository

git clone https://github.com/yourusername/airindia-flight-search-playwright.git
cd airindia-flight-search-playwright
2. Install Dependencies

npm install
3. Install Playwright Browsers

npx playwright install
🚀 How to Execute the Test
Run with Default Parameters

npx ts-node tests/flightSearch.test.ts
