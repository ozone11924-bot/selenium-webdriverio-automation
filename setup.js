const fs = require("fs");
const path = require("path");

const files = {
  "package.json": `{
  "name": "selenium-webdriverio-automation",
  "version": "1.0.0",
  "description": "End-to-end UI automation suite using WebdriverIO, TypeScript, and Allure Reports",
  "scripts": {
    "test": "wdio run wdio.conf.ts",
    "test:smoke": "wdio run wdio.conf.ts --suite smoke",
    "test:regression": "wdio run wdio.conf.ts --suite regression",
    "allure:generate": "allure generate allure-results --clean -o allure-report",
    "allure:open": "allure open allure-report",
    "allure:report": "npm run allure:generate && npm run allure:open"
  },
  "devDependencies": {
    "@wdio/allure-reporter": "^9.0.0",
    "@wdio/cli": "^9.0.0",
    "@wdio/local-runner": "^9.0.0",
    "@wdio/mocha-framework": "^9.0.0",
    "@wdio/spec-reporter": "^9.0.0",
    "@types/node": "^20.0.0",
    "ts-node": "^10.9.0",
    "typescript": "^5.0.0",
    "chromedriver": "latest"
  },
  "keywords": ["selenium", "webdriverio", "typescript", "automation", "testing", "allure"],
  "author": "",
  "license": "ISC"
}`,

  "tsconfig.json": `{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "moduleResolution": "node",
    "strict": false,
    "esModuleInterop": true,
    "outDir": "dist",
    "baseUrl": ".",
    "paths": {
      "@pages/*": ["src/pages/*"],
      "@utils/*": ["src/utils/*"],
      "@data/*": ["src/data/*"]
    },
    "types": ["node", "@wdio/globals/types"]
  },
  "include": ["**/*.ts"],
  "exclude": ["node_modules", "dist", "allure-report", "allure-results"]
}`,

  ".gitignore": `node_modules/
dist/
allure-results/
allure-report/
.wdio-results/
logs/
*.log
.DS_Store`,

  "wdio.conf.ts": `import type { Options } from '@wdio/types';

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
};`,

  "src/pages/BasePage.ts": `export class BasePage {
  protected baseUrl: string;
  constructor(path = '') { this.baseUrl = path; }

  async open() { await browser.url(this.baseUrl); }
  async getTitle() { return browser.getTitle(); }
  async getUrl() { return browser.getUrl(); }

  async waitAndClick(selector: string) {
    const el = await $(selector);
    await el.waitForClickable({ timeout: 8000 });
    await el.click();
  }

  async waitAndType(selector: string, text: string) {
    const el = await $(selector);
    await el.waitForDisplayed({ timeout: 8000 });
    await el.clearValue();
    await el.setValue(text);
  }

  async getText(selector: string) {
    const el = await $(selector);
    await el.waitForDisplayed({ timeout: 8000 });
    return el.getText();
  }

  async isDisplayed(selector: string) {
    try { return (await $(selector)).isDisplayed(); }
    catch { return false; }
  }
}`,

  "src/pages/LoginPage.ts": `import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  private usernameInput = '#username';
  private passwordInput = '#password';
  private loginButton = 'button[type="submit"]';
  private flashMessage = '#flash';
  private logoutButton = 'a[href="/logout"]';

  constructor() { super('/login'); }

  async login(username: string, password: string) {
    await this.waitAndType(this.usernameInput, username);
    await this.waitAndType(this.passwordInput, password);
    await this.waitAndClick(this.loginButton);
  }

  async getFlashMessage() {
    const el = await $(this.flashMessage);
    await el.waitForDisplayed({ timeout: 8000 });
    return el.getText();
  }

  async isLogoutVisible() { return this.isDisplayed(this.logoutButton); }

  async logout() { await this.waitAndClick(this.logoutButton); }
}`,

  "src/pages/CheckboxesPage.ts": `import { BasePage } from './BasePage';

export class CheckboxesPage extends BasePage {
  private checkboxes = 'form#checkboxes input[type="checkbox"]';
  constructor() { super('/checkboxes'); }

  async getAllCheckboxes() { return $$(this.checkboxes); }
  async getCheckboxCount() { return (await this.getAllCheckboxes()).length; }
  async isChecked(i: number) { return (await this.getAllCheckboxes())[i].isSelected(); }

  async check(i: number) {
    const boxes = await this.getAllCheckboxes();
    if (!(await boxes[i].isSelected())) await boxes[i].click();
  }

  async uncheck(i: number) {
    const boxes = await this.getAllCheckboxes();
    if (await boxes[i].isSelected()) await boxes[i].click();
  }

  async checkAll() { for (let i = 0; i < await this.getCheckboxCount(); i++) await this.check(i); }
  async uncheckAll() { for (let i = 0; i < await this.getCheckboxCount(); i++) await this.uncheck(i); }
}`,

  "src/pages/DropdownPage.ts": `import { BasePage } from './BasePage';

export class DropdownPage extends BasePage {
  private dropdown = '#dropdown';
  constructor() { super('/dropdown'); }

  async selectByValue(value: string) {
    const el = await $(this.dropdown);
    await el.waitForDisplayed({ timeout: 8000 });
    await el.selectByAttribute('value', value);
  }

  async selectByVisibleText(text: string) {
    const el = await $(this.dropdown);
    await el.waitForDisplayed({ timeout: 8000 });
    await el.selectByVisibleText(text);
  }

  async getSelectedOption() { return (await $(this.dropdown)).getValue(); }

  async getSelectedText() {
    const value = await this.getSelectedOption();
    return ($(\`\${this.dropdown} option[value="\${value}"]\`)).getText();
  }

  async getAllOptions() {
    const opts = await $$(\`\${this.dropdown} option\`);
    return Promise.all(opts.map(o => o.getText()));
  }
}`,

  "src/pages/DynamicLoadingPage.ts": `import { BasePage } from './BasePage';

export class DynamicLoadingPage extends BasePage {
  private startButton = '#start button';
  private finishText = '#finish h4';

  constructor(example: 1 | 2 = 1) { super(\`/dynamic_loading/\${example}\`); }

  async clickStart() { await this.waitAndClick(this.startButton); }

  async waitForFinishText() {
    const el = await $(this.finishText);
    await el.waitForDisplayed({ timeout: 15000 });
    return el.getText();
  }
}`,

  "src/pages/JavaScriptAlertsPage.ts": `import { BasePage } from './BasePage';

export class JavaScriptAlertsPage extends BasePage {
  private alertButton = 'button[onclick="jsAlert()"]';
  private confirmButton = 'button[onclick="jsConfirm()"]';
  private promptButton = 'button[onclick="jsPrompt()"]';
  private resultText = '#result';

  constructor() { super('/javascript_alerts'); }

  async triggerAlert() { await this.waitAndClick(this.alertButton); }
  async triggerConfirm() { await this.waitAndClick(this.confirmButton); }
  async triggerPrompt() { await this.waitAndClick(this.promptButton); }
  async acceptAlert() { await browser.acceptAlert(); }
  async dismissAlert() { await browser.dismissAlert(); }
  async getAlertText() { return browser.getAlertText(); }
  async sendToPrompt(text: string) { await browser.sendAlertText(text); await browser.acceptAlert(); }
  async getResultText() { return this.getText(this.resultText); }
}`,

  "src/pages/HoversPage.ts": `import { BasePage } from './BasePage';

export class HoversPage extends BasePage {
  private avatars = '.figure';
  constructor() { super('/hovers'); }

  async hoverOverAvatar(i: number) { await (await $$(this.avatars))[i].moveTo(); }
  async getAvatarCount() { return (await $$(this.avatars)).length; }

  async getCaptionText(i: number) {
    const caption = await (await $$(this.avatars))[i].$('.figcaption h5');
    await caption.waitForDisplayed({ timeout: 5000 });
    return caption.getText();
  }
}`,

  "src/data/loginData.ts": `export interface LoginCredentials {
  description: string;
  username: string;
  password: string;
  expectedOutcome: 'success' | 'failure';
  expectedMessageContains: string;
}

export const loginData: LoginCredentials[] = [
  { description: 'valid credentials', username: 'tomsmith', password: 'SuperSecretPassword!', expectedOutcome: 'success', expectedMessageContains: 'You logged into a secure area!' },
  { description: 'invalid username', username: 'wronguser', password: 'SuperSecretPassword!', expectedOutcome: 'failure', expectedMessageContains: 'Your username is invalid!' },
  { description: 'invalid password', username: 'tomsmith', password: 'wrongpassword', expectedOutcome: 'failure', expectedMessageContains: 'Your password is invalid!' },
  { description: 'empty username', username: '', password: 'SuperSecretPassword!', expectedOutcome: 'failure', expectedMessageContains: 'Your username is invalid!' },
  { description: 'empty password', username: 'tomsmith', password: '', expectedOutcome: 'failure', expectedMessageContains: 'Your password is invalid!' },
];

export const validUser = { username: 'tomsmith', password: 'SuperSecretPassword!' };`,

  "src/data/dropdownData.ts": `export interface DropdownOption {
  description: string;
  value: string;
  expectedText: string;
}

export const dropdownOptions: DropdownOption[] = [
  { description: 'Option 1', value: '1', expectedText: 'Option 1' },
  { description: 'Option 2', value: '2', expectedText: 'Option 2' },
];`,

  "src/tests/login.spec.ts": `import { expect } from 'expect-webdriverio';
import { LoginPage } from '../pages/LoginPage';
import { loginData, validUser } from '../data/loginData';
import allure from '@wdio/allure-reporter';

describe('Login', () => {
  let loginPage: LoginPage;
  beforeEach(async () => { loginPage = new LoginPage(); await loginPage.open(); });

  loginData.forEach(({ description, username, password, expectedOutcome, expectedMessageContains }) => {
    it(\`should handle login with \${description}\`, async () => {
      allure.addFeature('Authentication');
      allure.addSeverity('critical');
      await loginPage.login(username, password);
      const flash = await loginPage.getFlashMessage();
      if (expectedOutcome === 'success') {
        expect(flash).toContain(expectedMessageContains);
        expect(await loginPage.isLogoutVisible()).toBe(true);
      } else {
        expect(flash).toContain(expectedMessageContains);
      }
    });
  });

  it('should log out successfully after valid login', async () => {
    allure.addFeature('Authentication');
    await loginPage.login(validUser.username, validUser.password);
    expect(await loginPage.isLogoutVisible()).toBe(true);
    await loginPage.logout();
    expect(await loginPage.getFlashMessage()).toContain('You logged out of the secure area!');
  });
});`,

  "src/tests/checkboxes.spec.ts": `import { expect } from 'expect-webdriverio';
import { CheckboxesPage } from '../pages/CheckboxesPage';
import allure from '@wdio/allure-reporter';

describe('Checkboxes', () => {
  let page: CheckboxesPage;
  beforeEach(async () => { page = new CheckboxesPage(); await page.open(); });

  it('should display two checkboxes', async () => {
    allure.addFeature('Form Controls');
    expect(await page.getCheckboxCount()).toBe(2);
  });

  it('should check the first checkbox', async () => {
    allure.addFeature('Form Controls');
    await page.check(0);
    expect(await page.isChecked(0)).toBe(true);
  });

  it('should uncheck the second checkbox', async () => {
    allure.addFeature('Form Controls');
    await page.uncheck(1);
    expect(await page.isChecked(1)).toBe(false);
  });

  it('should check all checkboxes', async () => {
    allure.addFeature('Form Controls');
    await page.checkAll();
    for (let i = 0; i < await page.getCheckboxCount(); i++) expect(await page.isChecked(i)).toBe(true);
  });

  it('should uncheck all checkboxes', async () => {
    allure.addFeature('Form Controls');
    await page.uncheckAll();
    for (let i = 0; i < await page.getCheckboxCount(); i++) expect(await page.isChecked(i)).toBe(false);
  });
});`,

  "src/tests/dropdown.spec.ts": `import { expect } from 'expect-webdriverio';
import { DropdownPage } from '../pages/DropdownPage';
import { dropdownOptions } from '../data/dropdownData';
import allure from '@wdio/allure-reporter';

describe('Dropdown', () => {
  let page: DropdownPage;
  beforeEach(async () => { page = new DropdownPage(); await page.open(); });

  it('should display all expected options', async () => {
    allure.addFeature('Form Controls');
    const options = await page.getAllOptions();
    expect(options).toContain('Option 1');
    expect(options).toContain('Option 2');
  });

  dropdownOptions.forEach(({ description, value, expectedText }) => {
    it(\`should select "\${description}" by value\`, async () => {
      allure.addFeature('Form Controls');
      await page.selectByValue(value);
      expect(await page.getSelectedOption()).toBe(value);
    });

    it(\`should select "\${description}" by visible text\`, async () => {
      allure.addFeature('Form Controls');
      await page.selectByVisibleText(expectedText);
      expect(await page.getSelectedText()).toBe(expectedText);
    });
  });
});`,

  "src/tests/dynamicLoading.spec.ts": `import { expect } from 'expect-webdriverio';
import { DynamicLoadingPage } from '../pages/DynamicLoadingPage';
import allure from '@wdio/allure-reporter';

describe('Dynamic Loading', () => {
  it('should wait for hidden element to be revealed (Example 1)', async () => {
    allure.addFeature('Waiting Strategies');
    const page = new DynamicLoadingPage(1);
    await page.open();
    await page.clickStart();
    expect(await page.waitForFinishText()).toBe('Hello World!');
  });

  it('should wait for dynamically rendered element (Example 2)', async () => {
    allure.addFeature('Waiting Strategies');
    const page = new DynamicLoadingPage(2);
    await page.open();
    await page.clickStart();
    expect(await page.waitForFinishText()).toBe('Hello World!');
  });
});`,

  "src/tests/jsAlerts.spec.ts": `import { expect } from 'expect-webdriverio';
import { JavaScriptAlertsPage } from '../pages/JavaScriptAlertsPage';
import allure from '@wdio/allure-reporter';

describe('JavaScript Alerts', () => {
  let page: JavaScriptAlertsPage;
  beforeEach(async () => { page = new JavaScriptAlertsPage(); await page.open(); });

  it('should handle a JS alert and accept it', async () => {
    allure.addFeature('Dialog Handling');
    await page.triggerAlert();
    expect(await page.getAlertText()).toBe('I am a JS Alert');
    await page.acceptAlert();
    expect(await page.getResultText()).toBe('You successfully clicked an alert');
  });

  it('should handle a JS confirm and accept it', async () => {
    allure.addFeature('Dialog Handling');
    await page.triggerConfirm();
    await page.acceptAlert();
    expect(await page.getResultText()).toBe('You clicked: Ok');
  });

  it('should handle a JS confirm and dismiss it', async () => {
    allure.addFeature('Dialog Handling');
    await page.triggerConfirm();
    await page.dismissAlert();
    expect(await page.getResultText()).toBe('You clicked: Cancel');
  });

  it('should handle a JS prompt and submit text', async () => {
    allure.addFeature('Dialog Handling');
    await page.triggerPrompt();
    await page.sendToPrompt('Hello Selenium!');
    expect(await page.getResultText()).toBe('You entered: Hello Selenium!');
  });
});`,

  "src/tests/hovers.spec.ts": `import { expect } from 'expect-webdriverio';
import { HoversPage } from '../pages/HoversPage';
import allure from '@wdio/allure-reporter';

describe('Hovers', () => {
  let page: HoversPage;
  beforeEach(async () => { page = new HoversPage(); await page.open(); });

  it('should display 3 user avatars', async () => {
    allure.addFeature('Mouse Interactions');
    expect(await page.getAvatarCount()).toBe(3);
  });

  [0, 1, 2].forEach((i) => {
    it(\`should reveal caption on hover for avatar \${i + 1}\`, async () => {
      allure.addFeature('Mouse Interactions');
      await page.hoverOverAvatar(i);
      expect(await page.getCaptionText(i)).toBe(\`name: user\${i + 1}\`);
    });
  });
});`,

  ".github/workflows/wdio.yml": `name: WebdriverIO Tests

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    name: Run Selenium Tests
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 18
          cache: npm
      - name: Install dependencies
        run: npm ci
      - name: Install Chrome
        uses: browser-actions/setup-chrome@v1
      - name: Run tests
        run: npm test
      - name: Generate Allure Report
        if: always()
        run: npx allure generate allure-results --clean -o allure-report
      - name: Upload Allure Report
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: allure-report
          path: allure-report/
          retention-days: 30`,

  "README.md": `# ?? selenium-webdriverio-automation

![WebdriverIO Tests](https://github.com/ozone11924-bot/selenium-webdriverio-automation/actions/workflows/wdio.yml/badge.svg)
![Node.js](https://img.shields.io/badge/Node.js-18%2B-green)
![WebdriverIO](https://img.shields.io/badge/WebdriverIO-9.x-EA5906)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)
![Allure](https://img.shields.io/badge/Reports-Allure-orange)
![License](https://img.shields.io/badge/license-ISC-lightgrey)

End-to-end UI automation suite for [The Internet](https://the-internet.herokuapp.com) built with **WebdriverIO v9**, **TypeScript**, and **Allure Reports**.

## Test Coverage

| Suite | Tests | What it covers |
|---|---|---|
| login.spec.ts | 6 | Data-driven: valid, invalid user/password, empty fields, logout |
| checkboxes.spec.ts | 5 | Check, uncheck, check-all, uncheck-all |
| dropdown.spec.ts | 5 | Data-driven: select by value and by text |
| dynamicLoading.spec.ts | 2 | Explicit waits for hidden and DOM-rendered elements |
| jsAlerts.spec.ts | 4 | Accept alert, accept/dismiss confirm, submit prompt |
| hovers.spec.ts | 4 | Mouse hover reveals captions across all avatars |

## Getting Started

\`\`\`bash
npm install
npm test
npm run allure:report
\`\`\`

## Tech Stack
- WebdriverIO v9, TypeScript, Mocha, Allure Reports, GitHub Actions`
};

for (const [filePath, content] of Object.entries(files)) {
  const dir = path.dirname(filePath);
  if (dir !== ".") fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(filePath, content, "utf8");
  console.log("Created:", filePath);
}

console.log("\nAll files created! Now run: git add . && git commit -m \"feat: add WebdriverIO Selenium automation suite\" && git push origin main");
