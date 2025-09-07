# playwright-core

This package contains the no-browser flavor of [Playwright](http://github.com/microsoft/playwright).

# WebDemo E-Commerce Test Automation Suite

## Setup Instructions

`Make sure you just have to run the 'webdemo.spec.js' file for the whole automated part to be executed. This file is under the tests folder, and the other spec files are for individual validation.`

`Under pages folder all the Page Object Model files are located.`

1. Make sure Node.js is installed.
2. Navigate to the project folder:

   ```bash
   cd path/to/webdemo
   ```
3. Install dependencies:

   ```bash
   npm install
   ```
4. Run the test suite (example for a single test file):

   ```bash
   npx playwright test tests/filename.spec.js
   ```
5. Run all tests:

   ```bash
   npx playwright test
   ```
6. Run test on specific browser:

   ```bash
   npx playwright test tests/filename.spec.js --project=chromium --headed
   ```

## Environment

* **Testing Tool:** Playwright
* **Operating System:** Windows
* **Browser Support:** Chromium, Firefox, WebKit (as configured in Playwright)
* **Node.js Version:** (specify installed version, e.g., 18.x)

## Test Scenarios

### Automated Test Coverage

* User registration and login
* Product selection and adding to cart
* Checkout with billing, shipping, and payment flows
* Order confirmation and thank you page
* Address and order number confirmation

### Manual Test Coverage

* Exploratory testing for new features
* UI/UX validation and accessibility checks
* Cross-browser compatibility

## Artifacts

* **Videos and Screenshots:**

  * All test execution videos and screenshots are stored in the project folder `webdemo/test-results`.
  * Screenshot files are named according to steps, e.g., `thankyou-<FirstName>.png`, `billing-continue.png`, etc.
  * Video files are saved per test in `webdemo/test-results/<test-name>/video.webm`.
  * You can view the recorded videos directly or through the HTML report.

* **Logs:** Test execution logs are available in the `test-results` folder after each run.

## Video Recording Steps

1. **Automatic Recording:** Playwright automatically starts recording videos at the beginning of each test when `video: 'on'` or `video: 'retain-on-failure'` is set in `playwright.config.js`.

2. **Saving Videos:** Videos are saved automatically after the test ends in `webdemo/test-results/<test-name>/video.webm`.

3. **Viewing Videos:** You can view the videos directly from the folder or open them through the HTML report:

   ```bash
   npx playwright show-report
   ```

   Click on any test to watch its recorded video.

4. **Configuration:** To enable video recording, ensure your `playwright.config.js` has the following setting:

   ```javascript
   use: {
       headless: false,
       video: 'on', // or 'retain-on-failure'
       screenshot: 'only-on-failure',
   }
   ```
