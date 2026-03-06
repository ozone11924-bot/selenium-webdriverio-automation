import { expect } from 'expect-webdriverio';
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
});