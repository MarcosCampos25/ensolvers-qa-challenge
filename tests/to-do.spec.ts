import { test, expect } from '@playwright/test';
import { ToDoPage } from '../pages/to-do';
import { LoginPage } from '../pages/login';
import { validLoginData, invalidLoginData } from '../data-test/login-data';
import { ColorRange, errorMessageColorRange, successMessageColorRange, errorMessageToIvalidLogin, succesMessageToValidLogin} from '../data-test/messages-data';
// @ts-check

test.beforeEach(async ({ page }) => {
    const login = new LoginPage(page)
    await login.goto()
    await login.login(validLoginData.username, validLoginData.password)
});

test('Positive create new to do element', async ({ page }) => {
    const toDo = new ToDoPage(page);
    await toDo.goto();
    await toDo.create('New Task', 'Example', '1');
    await toDo.orderDescElements();
    const firstToDo = await toDo.getFirstToDoDetails();
    
    expect(firstToDo.title).toBe('New Task');
    expect(firstToDo.description).toBe('Example');
    expect(firstToDo.folder).toBe('1');
});

/* test('Negative login case', async ({ page }) => {

}); */
