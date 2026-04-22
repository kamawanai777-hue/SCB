import { test, expect } from '@playwright/test';

test.describe('Info Tabs functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should switch tabs and show correct sections', async ({ page }) => {
    const tabs = page.locator('.info-win-tabs__tab');
    const sections = page.locator('.info-win__wrapper > section');

    // Click on the second tab (Skills & Perks)
    await tabs.nth(1).click();
    // After click, the JS should add the selected class
    await expect(tabs.nth(1)).toHaveClass(/info-win-tabs__tab--selected/);
    await expect(sections.nth(1)).toBeVisible();
    await expect(sections.nth(0)).toBeHidden();

    // Click on the third tab (Passive Effects)
    await tabs.nth(2).click();
    await expect(tabs.nth(1)).not.toHaveClass(/info-win-tabs__tab--selected/);
    await expect(tabs.nth(2)).toHaveClass(/info-win-tabs__tab--selected/);
    await expect(sections.nth(1)).toBeHidden();
    await expect(sections.nth(2)).toBeVisible();

    // Click back to first tab
    await tabs.nth(0).click();
    await expect(tabs.nth(0)).toHaveClass(/info-win-tabs__tab--selected/);
    await expect(sections.nth(0)).toBeVisible();
  });

  test('should use data-info-tab attribute to find the target section', async ({ page }) => {
    const secondTab = page.locator('.info-win-tabs__tab').nth(1);
    const targetSelector = await secondTab.getAttribute('data-info-tab');

    expect(targetSelector).toBe('.info-win__character-skills-section');

    await secondTab.click();
    await expect(page.locator(targetSelector)).toBeVisible();
  });
});
