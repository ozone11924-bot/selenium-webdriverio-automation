import { expect } from 'expect-webdriverio';
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
    it(`should reveal caption on hover for avatar ${i + 1}`, async () => {
      allure.addFeature('Mouse Interactions');
      await page.hoverOverAvatar(i);
      expect(await page.getCaptionText(i)).toBe(`name: user${i + 1}`);
    });
  });
});