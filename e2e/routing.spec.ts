import { test, expect } from "@playwright/test";

test('opens the task detail page', async ({ page }) => {
  await page.goto('/');

  const newTaskTitleInput = page.getByRole('textbox', { name: 'New task title' });
  await newTaskTitleInput.fill('Learn Playwright');

  const addTaskButton = page.getByRole('button', { name: 'Add' });
  await addTaskButton.click();

  const taskCheckbox = page.getByRole('checkbox', {
    name: 'Learn Playwright',
  });
  
  await expect(taskCheckbox).toBeVisible();

  const taskListItem = page.getByRole('listitem').filter({ has: taskCheckbox });
  const taskLink = taskListItem.getByRole('link', { name: 'Task detail page' });

  await taskLink.click();

  await expect(page).toHaveURL(/\/tasks\/[^/]+$/);

  await expect(page.getByRole('heading', { name: 'Learn Playwright' })).toBeVisible();
  await expect(page.getByText('Task is not done', { exact: true })).toBeVisible();
});

test('shows the not-found page for an unknown route', async ({ page }) => {
  await page.goto('/missing-page');

  await expect(page.getByText('404 - Page Not Found', { exact: true })).toBeVisible();
});
