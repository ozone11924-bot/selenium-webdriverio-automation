import type { Options } from '@wdio/types';

export const config: Options.Testrunner = {
  runner: 'local',
  autoCompileOpts: {
    autoCompile: true,
    tsNodeOpts: { project: './tsconfig.json', transpileOnly: true },
  },
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
  afterTest: async function (_test, _ctx, { passed }) {
    if (!passed) await browser.takeScreenshot();
  },
};