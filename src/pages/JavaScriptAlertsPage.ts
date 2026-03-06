import { BasePage } from './BasePage';

export class JavaScriptAlertsPage extends BasePage {
  private alertButton = 'button[onclick="jsAlert()"]';
  private confirmButton = 'button[onclick="jsConfirm()"]';
  private promptButton = 'button[onclick="jsPrompt()"]';
  private resultText = '#result';

  constructor() { super('/javascript_alerts'); }

  async triggerAlert() { await this.waitAndClick(this.alertButton); }
  async triggerConfirm() { await this.waitAndClick(this.confirmButton); }
  async triggerPrompt() { await this.waitAndClick(this.promptButton); }
  async acceptAlert() { await browser.acceptAlert(); }
  async dismissAlert() { await browser.dismissAlert(); }
  async getAlertText() { return browser.getAlertText(); }
  async sendToPrompt(text: string) { await browser.sendAlertText(text); await browser.acceptAlert(); }
  async getResultText() { return this.getText(this.resultText); }
}