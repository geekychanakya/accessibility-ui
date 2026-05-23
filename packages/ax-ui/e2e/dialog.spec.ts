import { test, expect } from '@playwright/test';

test.describe('Dialog', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/iframe.html?id=primitives-dialog--default');
  });

  test('opens on trigger click', async ({ page }) => {
    await page.click('button:has-text("Open Dialog")');
    await expect(page.locator('[role="dialog"]')).toBeVisible();
  });

  test('closes on Escape key', async ({ page }) => {
    await page.click('button:has-text("Open Dialog")');
    await expect(page.locator('[role="dialog"]')).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(page.locator('[role="dialog"]')).not.toBeVisible();
  });

  test('traps focus inside dialog', async ({ page }) => {
    await page.click('button:has-text("Open Dialog")');
    await expect(page.locator('[role="dialog"]')).toBeVisible();

    const focusableElements = page.locator('[role="dialog"] button, [role="dialog"] input, [role="dialog"] a');
    const count = await focusableElements.count();

    if (count > 0) {
      for (let i = 0; i < count + 1; i++) {
        await page.keyboard.press('Tab');
      }
      const focused = page.locator(':focus');
      const dialog = page.locator('[role="dialog"]');
      await expect(dialog).toContainText(await focused.textContent() ?? '');
    }
  });

  test('returns focus to trigger on close', async ({ page }) => {
    const trigger = page.locator('button:has-text("Open Dialog")');
    await trigger.click();
    await expect(page.locator('[role="dialog"]')).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(trigger).toBeFocused();
  });

  test('has correct ARIA attributes', async ({ page }) => {
    await page.click('button:has-text("Open Dialog")');
    const dialog = page.locator('[role="dialog"]');

    await expect(dialog).toHaveAttribute('aria-modal', 'true');
    await expect(dialog).toHaveAttribute('aria-labelledby');
  });
});
