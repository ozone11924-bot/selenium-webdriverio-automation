import { BasePage } from './BasePage';

export class HoversPage extends BasePage {
  private avatars = '.figure';
  constructor() { super('/hovers'); }

  async hoverOverAvatar(i: number) { await (await $$(this.avatars))[i].moveTo(); }
  async getAvatarCount() { return (await $$(this.avatars)).length; }

  async getCaptionText(i: number) {
    const caption = await (await $$(this.avatars))[i].$('.figcaption h5');
    await caption.waitForDisplayed({ timeout: 5000 });
    return caption.getText();
  }
}