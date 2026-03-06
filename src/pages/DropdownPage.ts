import { BasePage } from './BasePage';

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
    return ($(`${this.dropdown} option[value="${value}"]`)).getText();
  }

  async getAllOptions() {
    const opts = await $$(`${this.dropdown} option`);
    return Promise.all(opts.map(o => o.getText()));
  }
}