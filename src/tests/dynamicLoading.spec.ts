import { expect } from 'expect-webdriverio';
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
});