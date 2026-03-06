import { expect } from 'expect-webdriverio';
import { LoginPage } from '../pages/LoginPage';
import { loginData, validUser } from '../data/loginData';
import allure from '@wdio/allure-reporter';

describe('Login', () => {
  let loginPage: LoginPage;
  beforeEach(async () => { loginPage = new LoginPage(); await loginPage.open(); });

  loginData.forEach(({ description, username, password, expectedOutcome, expectedMessageContains }) => {
    it(`should handle login with ${description}`, async () => {
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
});