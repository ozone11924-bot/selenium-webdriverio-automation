import fs from 'fs';

export const config = {
  runner: 'local',
  baseUrl: 'https://the-internet.herokuapp.com',
  specs: ['./src/tests/**/*.spec.ts'],
  suites: {
    smoke: ['./src/tests/login.spec.ts', './src/tests/checkboxes.spec.ts'],
    regression: ['./src/tests/**/*.spec.ts'],
  },
  maxInstances: 3,
  capabilities: [{
    browserName: 'chrome',
    'goog:chromeOptions': {
      args: ['--headless', '--no-sandbox', '--disable-dev-shm-usage', '--disable-gpu', '--window-size=1280,720'],
    },
  }],
  logLevel: 'warn',
  bail: 0,
  waitforTimeout: 10000,
  connectionRetryTimeout: 120000,
  connectionRetryCount: 3,
  framework: 'mocha',
  mochaOpts: { ui: 'bdd', timeout: 60000 },
  reporters: [
    'spec',
    ['@wdio/allure-reporter', {
      outputDir: 'allure-results',
      disableWebdriverStepsReporting: false,
      disableWebdriverScreenshotsReporting: false,
      useCucumberStepReporter: false,
    }],
  ],
  onPrepare() {
    if (!fs.existsSync('allure-results')) {
      fs.mkdirSync('allure-results');
    }
  },
  afterTest: async function (_test: any, _ctx: any, { passed }: { passed: boolean }) {
    if (!passed) await browser.takeScreenshot();
  },
};