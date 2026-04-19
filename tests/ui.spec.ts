import { test, expect } from '@playwright/test';

test.describe('Skyrim Character Builder UI tests', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173/');
    await page.waitForLoadState('networkidle');
  });

  test('should create a character and see main UI elements', async ({ page }) => {
    // Open create character menu (if hidden)
    const overlay = page.locator('.create-character');
    if (await overlay.isHidden()) {
       await page.locator('.main-buttons__character').click();
    }

    // Fill the character form
    await page.fill('#character-name', 'Dovahkiin');

    // Select race
    await page.locator('#races').selectOption('Nord');

    // Click save
    const saveBtn = page.locator('.save-character');
    await saveBtn.click({ force: true });

    // Check if the character is created
    await expect(page.locator('.current-character__name')).toHaveText('Dovahkiin');
    await expect(page.locator('.current-character__race')).toHaveText('Nord');
    await expect(page.locator('.current-character__level')).toHaveText('1');

    // Check main window elements
    await expect(page.locator('.menu-options')).not.toHaveClass(/menu--hidden/);
  });
});
