import { Page, Locator, expect } from '@playwright/test';
import { genericsErrorMessagge } from '../data-test/messages-data';

export class ToDoPage {
  readonly page: Page;
  readonly entityCreateButton: Locator;
  readonly refreshList: Locator;
  
  readonly titleNewEntity: Locator;
  readonly descriptionNewEntity: Locator;
  readonly folderSelectable: Locator;
  readonly saveNewEntity: Locator;
  readonly alertMessage: Locator;


  constructor(page: Page) {
    this.page = page;
    this.entityCreateButton = page.locator('[data-cy="entityCreateButton"]');
    this.refreshList = page.locator('#to-do-item-heading > div > button');
    
    this.titleNewEntity = page.locator('[data-cy="title"]');
    this.descriptionNewEntity = page.locator('[data-cy="description"]');
    this.folderSelectable = page.locator('[data-cy="folder"]');
    this.saveNewEntity = page.locator('[data-cy="entityCreateSaveButton"]');
    this.alertMessage = page.locator('[role="alert"]');
  }

  async goto() {
    await this.page.goto('https://qa-challenge.ensolvers.com/to-do-item');
    await this.page.waitForNavigation({ timeout: 1000 });
  }

  async orderDescElements() {
    await this.page.goto('https://qa-challenge.ensolvers.com/to-do-item?page=1&sort=id,desc');
  }

  async create(title: string, description: string, folder: string = '') {
    await this.entityCreateButton.click()
    await this.folderSelectable.selectOption({label: folder})
    await Promise.all([
        this.folderSelectable.selectOption({ label: folder }),
        this.page.waitForLoadState('networkidle') 
    ]); 
    await this.titleNewEntity.fill(title)
    await this.descriptionNewEntity.fill(description)
    await this.saveNewEntity.click()
    await this.page.waitForNavigation({ timeout: 3000 });
  }

  async getToDoDetailsByName(taskName: string) {
    const row = this.page.locator(`table tr:has(td:text("${taskName}"))`).first();
    const id = await row.locator('td:nth-child(1) a').innerText();
    const title = await row.locator('td:nth-child(2)').innerText();
    const description = await row.locator('td:nth-child(3)').innerText();
    const folder = await row.locator('td:nth-child(4)').innerText();
    return { id, title, description, folder };
  }
  
  async errorExcpected(errorExpected: boolean, expectedMessage: string = '', notExpectedMessage: string = '') {
    if (errorExpected) {
        await expect(this.alertMessage).not.toContainText(notExpectedMessage);
        const actualErrorMessage = await this.alertMessage.textContent();
        expect(genericsErrorMessagge).not.toContain(actualErrorMessage);
        expect(actualErrorMessage?.trim().length).toBeGreaterThan(0);
        await this.alertMessage.click()
    } else {
        await expect(this.alertMessage).toContainText(expectedMessage);
        await this.alertMessage.click()
    }
  }
}
