import { Page, Locator, expect } from '@playwright/test';
import { genericsErrorMessagge } from '../data-test/messages-data';

export class FolderPage {
    readonly page: Page;
    readonly entityCreateButton: Locator;
    readonly refreshList: Locator;
    readonly firstFolderElement: Locator;

    readonly nameNewEntity: Locator;
    readonly saveNewEntity: Locator;
    readonly alertMessage: Locator;
    readonly deleteRow: Locator;
    readonly confirmDelete: Locator;
    readonly editRow: Locator;
    readonly viewDetails: Locator;
    readonly detailsId: Locator;
    readonly detailsName: Locator;


    constructor(page: Page) {
        this.page = page;
        this.entityCreateButton = page.locator('[data-cy="entityCreateButton"]');
        this.refreshList = page.locator('#folder-heading > div > button');
        this.firstFolderElement = page.locator('[data-cy="entityTable"]').first();

        this.nameNewEntity = page.locator('[data-cy="name"]');
        this.saveNewEntity = page.locator('[data-cy="entityCreateSaveButton"]');
        this.alertMessage = page.locator('[role="alert"]');
        this.deleteRow = page.locator('[data-cy="entityDeleteButton"]');
        this.confirmDelete = page.locator('[data-cy="entityConfirmDeleteButton"]');
        this.editRow = page.locator('[data-cy="entityEditButton"]');
        this.viewDetails = page.locator('[data-cy="entityDetailsButton"]')
        this.detailsId = page.locator('#app-view-container > div.jh-card.card > div > div > div > div > dl > dd:nth-child(2)')
        this.detailsName = page.locator('#app-view-container > div.jh-card.card > div > div > div > div > dl > dd:nth-child(4)')
    }

    async goto() {
        await this.page.goto('https://qa-challenge.ensolvers.com/folder');
    }

    async create(name: string) {
        await this.entityCreateButton.click();
        await this.nameNewEntity.fill(name);
        await this.saveNewEntity.click();
    }

    async getFolderDetailsByName(folderName: string) {
        await expect(this.refreshList).toBeEnabled();
        await this.refreshList.click();
        const row = this.page.locator(`table tr:has(td:text("${folderName}"))`)
        const id = await row.locator('td:nth-child(1) a').innerText({timeout: 2500});
        const name = await row.locator('td:nth-child(2)').innerText();
        return { id, name };
    }

    async deleteFolderByName(folderName: string) {
        await expect(this.refreshList).toBeEnabled();
        await this.refreshList.click();
        const row = this.page.locator(`table tr:has(td:text("${folderName}"))`).first();
        await row.locator(this.deleteRow).click();
        await this.confirmDelete.click();
    }
 
    async validateRemove(folderName: string) {
        const row = this.page.locator(`table tr:has(td:text("${folderName}"))`)
        await expect(row).toHaveCount(0);
    }

    async viewFolder(folderName: string) {
        const row = this.page.locator(`table tr:has(td:text("${folderName}"))`)
        await row.locator(this.viewDetails).click();
    }
    
    async validateView(folderDetails: { id: string; name: string }) {
        const id = await this.detailsId.innerText();
        const name = await this.detailsName.innerText();
        expect(id).toContain(folderDetails.id);
        expect(name).toContain(folderDetails.name);       
    }

    async editFolderByName(folderName: string, newFolderName: string) {
        await expect(this.refreshList).toBeEnabled();
        await this.refreshList.click();
        await expect(this.refreshList).toBeEnabled();
        const row = this.page.locator(`table tr:has(td:text("${folderName}"))`).first();
        await row.locator(this.editRow).click();

        await expect(this.nameNewEntity).toBeVisible();
        await this.nameNewEntity.clear();
        await Promise.all([this.page.waitForLoadState('networkidle')]); 
    
        await this.nameNewEntity.fill(newFolderName);
        await expect(this.nameNewEntity).toHaveValue(newFolderName);
        await Promise.all([this.page.waitForLoadState('networkidle')]); 
        await this.saveNewEntity.click();
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
