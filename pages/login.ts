import { Page, Locator, expect } from '@playwright/test';
import { ColorRange } from '../data-test/messages-data'

export class LoginPage {
  readonly page: Page;
  readonly usernameField: Locator;
  readonly passwordField: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameField = page.locator('[data-cy="username"]');
    this.passwordField = page.locator('[data-cy="password"]');
    this.loginButton = page.locator('[data-cy="submit"]');
    this.errorMessage = page.locator('.alert').first();
  }

  async goto() {
    await this.page.goto('https://qa-challenge.ensolvers.com/login');
  }

  async login(username: string, password: string) {
    await this.usernameField.fill(username);
    await this.passwordField.fill(password);
    await this.loginButton.click();

    try {
      await this.page.waitForNavigation({ timeout: 1000 });
    } catch (error) {}
  }

  async assertMessage(expectedMessage: string, colorRange: ColorRange) {
    await expect(this.errorMessage).toBeVisible();
    await expect(this.errorMessage).toContainText(expectedMessage);
    
    const backgroundColor = await this.errorMessage.evaluate((el) => getComputedStyle(el).backgroundColor);
    const [r, g, b] = backgroundColor.match(/\d+/g)!.map(Number);
    const isColorInRange = 
    r >= colorRange.r[0] && r <= colorRange.r[1] &&
    g >= colorRange.g[0] && g <= colorRange.g[1] &&
    b >= colorRange.b[0] && b <= colorRange.b[1];

    expect(isColorInRange).toBeTruthy();

  }
}
