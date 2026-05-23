import { test, expect } from '@playwright/test';

test.describe('Menu', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/iframe.html?id=primitives-menu--default');
  });

  test('opens on trigger click', async ({ page }) => {
    await page.click('button:has-text("Actions")');
    await expect(page.locator('[role="menu"]')).toBeVisible();
  });

  test('focuses first item on open', async ({ page }) => {
    await page.click('button:has-text("Actions")');
    const firstItem = page.locator('[role="menuitem"]').first();
    await expect(firstItem).toBeFocused();
  });

  test('navigates with ArrowDown', async ({ page }) => {
    await page.click('button:has-text("Actions")');
    const items = page.locator('[role="menuitem"]');
    await expect(items.first()).toBeFocused(); // Wait for initial focus
    await page.keyboard.press('ArrowDown');
    await expect(items.nth(1)).toBeFocused();
  });

  test('navigates with ArrowUp', async ({ page }) => {
    await page.click('button:has-text("Actions")');
    const items = page.locator('[role="menuitem"]');
    await expect(items.first()).toBeFocused(); // Wait for initial focus
    await page.keyboard.press('ArrowUp');
    await expect(items.last()).toBeFocused();
  });

  test('wraps from last to first with ArrowDown', async ({ page }) => {
    await page.click('button:has-text("Actions")');
    const items = page.locator('[role="menuitem"]');
    await expect(items.first()).toBeFocused(); // Wait for initial focus
    const count = await items.count();

    for (let i = 0; i < count; i++) {
      await page.keyboard.press('ArrowDown');
    }
    await expect(items.first()).toBeFocused();
  });

  test('closes on Escape and focuses trigger', async ({ page }) => {
    const trigger = page.locator('button:has-text("Actions")');
    await trigger.click();
    await expect(page.locator('[role="menu"]')).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(page.locator('[role="menu"]')).not.toBeVisible();
    await expect(trigger).toBeFocused();
  });

  test('selects item on Enter', async ({ page }) => {
    await page.click('button:has-text("Actions")');
    await page.keyboard.press('Enter');
    await expect(page.locator('[role="menu"]')).not.toBeVisible();
  });

  test('Home and End navigation', async ({ page }) => {
    await page.click('button:has-text("Actions")');
    const items = page.locator('[role="menuitem"]');

    await page.keyboard.press('End');
    await expect(items.last()).toBeFocused();

    await page.keyboard.press('Home');
    await expect(items.first()).toBeFocused();
  });
});
