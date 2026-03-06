import { expect } from 'expect-webdriverio';
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
});