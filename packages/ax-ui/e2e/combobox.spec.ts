import { test, expect } from '@playwright/test';

test.describe('Combobox', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/iframe.html?id=primitives-combobox--default');
  });

  test('opens listbox on focus', async ({ page }) => {
    await page.click('[role="combobox"]');
    await expect(page.locator('[role="listbox"]')).toBeVisible();
  });

  test('navigates options with ArrowDown', async ({ page }) => {
    await page.click('[role="combobox"]');
    await page.keyboard.press('ArrowDown');

    const options = page.locator('[role="option"]');
    await expect(options.first()).toHaveAttribute('data-active', 'true');
  });

  test('navigates options with ArrowUp', async ({ page }) => {
    await page.click('[role="combobox"]');
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('ArrowUp');

    const options = page.locator('[role="option"]');
    await expect(options.first()).toHaveAttribute('data-active', 'true');
  });

  test('selects option on Enter', async ({ page }) => {
    const input = page.locator('[role="combobox"]');
    await input.click();
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');

    await expect(input).toHaveValue(/.+/);
    await expect(page.locator('[role="listbox"]')).not.toBeVisible();
  });

  test('closes on Escape', async ({ page }) => {
    await page.click('[role="combobox"]');
    await expect(page.locator('[role="listbox"]')).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(page.locator('[role="listbox"]')).not.toBeVisible();
  });

  test('filters on typing', async ({ page }) => {
    const input = page.locator('[role="combobox"]');
    await input.fill('App');

    await expect(page.locator('[role="listbox"]')).toBeVisible();
  });

  test('has correct ARIA attributes', async ({ page }) => {
    const input = page.locator('[role="combobox"]');
    await expect(input).toHaveAttribute('aria-expanded', 'false');
    await expect(input).toHaveAttribute('aria-autocomplete', 'list');

    await input.click();
    await expect(input).toHaveAttribute('aria-expanded', 'true');
    await expect(input).toHaveAttribute('aria-controls');
  });

  test('sets aria-activedescendant on navigation', async ({ page }) => {
    const input = page.locator('[role="combobox"]');
    await input.click();
    await page.keyboard.press('ArrowDown');

    await expect(input).toHaveAttribute('aria-activedescendant', /.+/);
  });
});
