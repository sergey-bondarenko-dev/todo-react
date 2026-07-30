import { test, expect } from "@playwright/test";

test('persists task changes across reloads', async ({ page }) => {
  await page.goto('/');

  const heading = page.getByRole('heading', { name: 'To Do List' });

  await expect(heading).toBeVisible();

  const newTaskTitleInput = page.getByRole('textbox', { name: 'New task title' });
  await newTaskTitleInput.fill('Learn Playwright');

  const addTaskButton = page.getByRole('button', { name: 'Add' });
  await addTaskButton.click();

  const taskCheckbox = page.getByRole('checkbox', {
    name: 'Learn Playwright',
  });

  await expect(taskCheckbox).toBeVisible();

  await taskCheckbox.click();

  await expect(taskCheckbox).toBeChecked();
  await expect(taskCheckbox).toBeDisabled();
  await expect(taskCheckbox).toBeEnabled();

  await page.reload();

  await expect(taskCheckbox).toBeChecked();

  const taskListitem = page.getByRole('listitem').filter({ has: taskCheckbox });
  const taskDeleteButton = taskListitem.getByRole('button', { name: 'Delete' });

  await taskDeleteButton.click();

  await expect(taskCheckbox).toBeHidden();

  await page.reload();

  await expect(taskCheckbox).toHaveCount(0);
});
