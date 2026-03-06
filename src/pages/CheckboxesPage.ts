import { BasePage } from './BasePage';

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
}