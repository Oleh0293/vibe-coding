import { test, expect } from '@playwright/test';

// API helper to reset database before tests
async function resetDatabase(request: any) {
  // Get all tasks and delete them
  const response = await request.get('http://localhost:3001/api/tasks');
  const tasks = await response.json();
  for (const task of tasks) {
    await request.delete(`http://localhost:3001/api/tasks/${task.id}`);
  }
}

test.describe('Task Manager E2E', () => {
  test.beforeEach(async ({ page, request }) => {
    // Reset database before each test
    await resetDatabase(request);
    await page.goto('/');
    // Wait for initial load
    await expect(page.getByTestId('task-input')).toBeVisible();
  });

  test('should create a new task', async ({ page }) => {
    // Type task title
    await page.getByTestId('task-input').fill('My first task');
    
    // Click add button
    await page.getByTestId('add-task-btn').click();
    
    // Verify task appears in the list
    await expect(page.getByText('My first task')).toBeVisible();
    
    // Verify stats updated
    await expect(page.getByTestId('stats')).toContainText('1 total');
    await expect(page.getByTestId('stats')).toContainText('1 open');
  });

  test('should mark a task as done', async ({ page }) => {
    // Create a task first
    await page.getByTestId('task-input').fill('Task to complete');
    await page.getByTestId('add-task-btn').click();
    await expect(page.getByText('Task to complete')).toBeVisible();
    
    // Find the task item and get its complete button
    const taskItem = page.locator('[data-testid^="task-item-"]').first();
    const completeBtn = taskItem.locator('[data-testid^="complete-btn-"]');
    
    // Click complete button
    await completeBtn.click();
    
    // Verify task is marked as done (has line-through style)
    const taskTitle = taskItem.locator('[data-testid^="task-title-"]');
    await expect(taskTitle).toHaveClass(/line-through/);
    
    // Verify stats updated
    await expect(page.getByTestId('stats')).toContainText('1 done');
    await expect(page.getByTestId('stats')).toContainText('0 open');
  });

  test('should filter to show only Done tasks', async ({ page }) => {
    // Create two tasks
    await page.getByTestId('task-input').fill('Open task');
    await page.getByTestId('add-task-btn').click();
    await expect(page.getByText('Open task')).toBeVisible();
    
    await page.getByTestId('task-input').fill('Done task');
    await page.getByTestId('add-task-btn').click();
    await expect(page.getByText('Done task')).toBeVisible();
    
    // Complete the second task
    const doneTaskItem = page.locator('[data-testid^="task-item-"]').filter({ hasText: 'Done task' });
    await doneTaskItem.locator('[data-testid^="complete-btn-"]').click();
    
    // Wait for the task to be marked as done
    await expect(doneTaskItem.locator('[data-testid^="task-title-"]')).toHaveClass(/line-through/);
    
    // Click Done filter
    await page.getByTestId('filter-done').click();
    
    // Verify only done task is visible
    await expect(page.getByText('Done task')).toBeVisible();
    await expect(page.getByText('Open task')).not.toBeVisible();
    
    // Click Open filter to verify the other task
    await page.getByTestId('filter-open').click();
    await expect(page.getByText('Open task')).toBeVisible();
    await expect(page.getByText('Done task')).not.toBeVisible();
    
    // Click All filter to see both
    await page.getByTestId('filter-all').click();
    await expect(page.getByText('Open task')).toBeVisible();
    await expect(page.getByText('Done task')).toBeVisible();
  });

  test('should delete a task', async ({ page }) => {
    // Create a task
    await page.getByTestId('task-input').fill('Task to delete');
    await page.getByTestId('add-task-btn').click();
    await expect(page.getByText('Task to delete')).toBeVisible();
    
    // Verify stats show 1 task
    await expect(page.getByTestId('stats')).toContainText('1 total');
    
    // Find and click delete button
    const taskItem = page.locator('[data-testid^="task-item-"]').first();
    const deleteBtn = taskItem.locator('[data-testid^="delete-btn-"]');
    await deleteBtn.click();
    
    // Verify task is removed
    await expect(page.getByText('Task to delete')).not.toBeVisible();
    
    // Verify empty state appears
    await expect(page.getByTestId('empty-state')).toBeVisible();
  });

  test('should show validation error for empty title', async ({ page }) => {
    // Try to add task with empty input (button should be disabled)
    const addButton = page.getByTestId('add-task-btn');
    await expect(addButton).toBeDisabled();
    
    // Type only whitespace
    await page.getByTestId('task-input').fill('   ');
    await expect(addButton).toBeDisabled();
  });

  test('should persist tasks after page reload', async ({ page }) => {
    // Create a task
    await page.getByTestId('task-input').fill('Persistent task');
    await page.getByTestId('add-task-btn').click();
    await expect(page.getByText('Persistent task')).toBeVisible();
    
    // Reload the page
    await page.reload();
    
    // Verify task is still there
    await expect(page.getByText('Persistent task')).toBeVisible();
  });
});
