import { BasePage } from './BasePage';

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
}