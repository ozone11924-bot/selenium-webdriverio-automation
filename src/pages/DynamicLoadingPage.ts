import { BasePage } from './BasePage';

export class DynamicLoadingPage extends BasePage {
  private startButton = '#start button';
  private finishText = '#finish h4';

  constructor(example: 1 | 2 = 1) { super(`/dynamic_loading/${example}`); }

  async clickStart() { await this.waitAndClick(this.startButton); }

  async waitForFinishText() {
    const el = await $(this.finishText);
    await el.waitForDisplayed({ timeout: 15000 });
    return el.getText();
  }
}