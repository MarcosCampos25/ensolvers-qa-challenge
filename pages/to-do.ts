import { Page, Locator, expect } from '@playwright/test';
import { ColorRange } from '../data-test/messages-data'

export class ToDoPage {
  readonly page: Page;
  readonly entityCreateButton: Locator;
  readonly refreshList: Locator;
  readonly firstToDoElement: Locator;
  
  readonly titleNewEntity: Locator;
  readonly descriptionNewEntity: Locator;
  readonly folderSelectable: Locator;
  readonly saveNewEntity: Locator;


  constructor(page: Page) {
    this.page = page;
    this.entityCreateButton = page.locator('[data-cy="entityCreateButton"]');
    this.refreshList = page.locator('#to-do-item-heading > div > button');
    this.firstToDoElement = page.locator('[data-cy="entityTable"]').first();
    
    this.titleNewEntity = page.locator('[data-cy="title"]');
    this.descriptionNewEntity = page.locator('[data-cy="description"]');
    this.folderSelectable = page.locator('[data-cy="folder"]');
    this.saveNewEntity = page.locator('[data-cy="entityCreateSaveButton"]');
  }

  async goto() {
    await this.page.goto('https://qa-challenge.ensolvers.com/to-do-item');
    await this.page.waitForNavigation({ timeout: 1000 });
  }

  async orderDescElements() {
    await this.page.goto('https://qa-challenge.ensolvers.com/to-do-item?page=1&sort=id,desc');
  }

  async getFirstToDoDetails() {
    const firstRow = this.page.locator('[data-cy="entityTable"]').first();
    const id = await firstRow.locator('td:nth-child(1) a').innerText();
    const title = await firstRow.locator('td:nth-child(2)').innerText();
    const description = await firstRow.locator('td:nth-child(3)').innerText();
    const folder = await firstRow.locator('td:nth-child(4) a').innerText();
    return { id, title, description, folder };
  }
  

  async create(title: string, description: string, folder: string) {
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

  async assertMessage(expectedMessage: string, colorRange: ColorRange) {
    
  }
}
