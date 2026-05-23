import { test, expect } from '@playwright/test';

test.describe('Tabs', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/iframe.html?id=primitives-tabs--default');
  });

  test('renders tabs with correct roles', async ({ page }) => {
    await expect(page.locator('[role="tablist"]')).toBeVisible();
    const tabs = page.locator('[role="tab"]');
    expect(await tabs.count()).toBeGreaterThanOrEqual(2);
  });

  test('switches tab on click', async ({ page }) => {
    const tabs = page.locator('[role="tab"]');
    await tabs.nth(1).click();
    await expect(tabs.nth(1)).toHaveAttribute('aria-selected', 'true');
  });

  test('navigates with ArrowRight', async ({ page }) => {
    const tabs = page.locator('[role="tab"]');
    await tabs.first().focus();
    await page.keyboard.press('ArrowRight');
    await expect(tabs.nth(1)).toBeFocused();
  });

  test('navigates with ArrowLeft', async ({ page }) => {
    const tabs = page.locator('[role="tab"]');
    await tabs.first().focus();
    await page.keyboard.press('ArrowLeft');
    await expect(tabs.last()).toBeFocused();
  });

  test('Home and End keys', async ({ page }) => {
    const tabs = page.locator('[role="tab"]');
    await tabs.nth(1).focus();

    await page.keyboard.press('Home');
    await expect(tabs.first()).toBeFocused();

    await page.keyboard.press('End');
    await expect(tabs.last()).toBeFocused();
  });

  test('uses roving tabindex', async ({ page }) => {
    const tabs = page.locator('[role="tab"]');
    await expect(tabs.first()).toHaveAttribute('tabindex', '0');
    await expect(tabs.nth(1)).toHaveAttribute('tabindex', '-1');
  });

  test('tab panel has aria-labelledby', async ({ page }) => {
    const panel = page.locator('[role="tabpanel"]');
    await expect(panel).toHaveAttribute('aria-labelledby');
  });

  test('active tab has aria-selected=true', async ({ page }) => {
    const tabs = page.locator('[role="tab"]');
    await expect(tabs.first()).toHaveAttribute('aria-selected', 'true');
  });
});
