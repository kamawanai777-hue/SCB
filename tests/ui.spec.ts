import { test, expect } from '@playwright/test';

test.describe('Skyrim Character Builder UI tests', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173/');
    await page.waitForLoadState('networkidle');
    await page.setViewportSize({ width: 1280, height: 1024 });
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

  test('should open menu, select items and toggle items window', async ({ page }) => {
    // Create character first
    const overlay = page.locator('.create-character');
    if (await overlay.isHidden()) {
       await page.locator('.main-buttons__character').click();
    }
    await page.fill('#character-name', 'Dovahkiin');
    await page.locator('#races').selectOption('Nord');
    await page.locator('.save-character').click({ force: true });

    // Open menu
    await page.locator('.main-buttons__menu').click();
    await expect(page.locator('.menu')).not.toHaveClass(/menu--hidden/);

    // Open an items category (e.g., Weapons)
    const categoryButton = page.locator('.menu-options > div > button').first();
    await categoryButton.click();

    // Wait for type buttons to appear and click one (e.g. "One-Handed")
    const typeButton = page.locator('.menu-options > div > div > button').first();
    await expect(typeButton).toBeVisible();
    await typeButton.click();

    // Items window should open
    await expect(page.locator('.items-window')).toBeVisible();
  });

  test('should interact with skills', async ({ page }) => {
    // Create character
    const overlay = page.locator('.create-character');
    if (await overlay.isHidden()) {
       await page.locator('.main-buttons__character').click();
    }
    await page.fill('#character-name', 'Mage');
    await page.locator('#races').selectOption('High Elf');
    await page.locator('.save-character').click({ force: true });

    // Open Skills
    const skillsBtn = page.locator('.category-button--skills');
    await skillsBtn.evaluate((node: HTMLElement) => node.click());

    // Click on skills icon (e.g. Destruction)
    const destructionIcon = page.locator('button[data-skill-icon="Destruction"]');
    await destructionIcon.evaluate((node: HTMLElement) => node.click());

    await expect(page.locator('.tree-header__skill-tree-name')).toHaveText('Destruction');

    // Add a perk (Novice Destruction)
    const novicePerk = page.locator('.skill-perks__perk[data-perk-name="Novice Destruction"]');
    await novicePerk.evaluate((node: HTMLElement) => {
        const ev = new MouseEvent('click', { bubbles: true, cancelable: true });
        node.dispatchEvent(ev);
    });

    // Check if the perk was added to the list
    await expect(page.locator('.info-win__character-skills-section section:has-text("Destruction") li')).toContainText('Novice Destruction');
  });

  test('should open boons and select a stone', async ({ page }) => {
    // Create character
    const overlay = page.locator('.create-character');
    if (await overlay.isHidden()) {
       await page.locator('.main-buttons__character').click();
    }
    await page.fill('#character-name', 'Hero');
    await page.locator('#races').selectOption('Imperial');
    await page.locator('.save-character').click({ force: true });

    // Open Boons
    const boonsBtn = page.locator('.category-button--boons');
    await boonsBtn.evaluate((node: HTMLElement) => node.click());
    await expect(page.locator('.boons')).toBeVisible();

    // Select The Warrior Stone
    const warriorStoneLabel = page.locator('.boons__fieldset:first-child label').filter({ hasText: 'The Warrior Stone' });
    await warriorStoneLabel.evaluate((node: HTMLElement) => node.click());

    // The other stones should become disabled (except with Aetherial Crown)
    const mageStoneInput = page.locator('.boons__fieldset:first-child label').filter({ hasText: 'The Mage Stone' }).locator('input');
    await expect(mageStoneInput).toBeDisabled();
  });
});
