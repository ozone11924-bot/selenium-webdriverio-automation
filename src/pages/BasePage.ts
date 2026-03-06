export class BasePage {
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
}