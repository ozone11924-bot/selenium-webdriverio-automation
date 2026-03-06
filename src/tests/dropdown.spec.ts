import { expect } from 'expect-webdriverio';
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
    it(`should select "${description}" by value`, async () => {
      allure.addFeature('Form Controls');
      await page.selectByValue(value);
      expect(await page.getSelectedOption()).toBe(value);
    });

    it(`should select "${description}" by visible text`, async () => {
      allure.addFeature('Form Controls');
      await page.selectByVisibleText(expectedText);
      expect(await page.getSelectedText()).toBe(expectedText);
    });
  });
});