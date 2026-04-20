import { test, expect } from '@playwright/test';

test.describe('Skyrim Character Builder E2E Tests', () => {

  test.beforeEach(async ({ page }) => {
    // We navigate to the base URL which Vite will serve
    await page.goto('/SCB/');
  });

  test('Character creation flow', async ({ page }) => {
    // Open character creation modal
    await page.click('button.main-buttons__character');

    // Check if the character creation section is visible
    const createCharacterSection = page.locator('section.create-character');
    await expect(createCharacterSection).toBeVisible();

    // Fill in the character name
    await page.fill('#character-name', 'Dovahkiin');

    // Select race
    await page.selectOption('#races', 'Nord');

    // Save character
    await page.click('button.save-character');

    // Check if modal is closed
    await expect(createCharacterSection).toBeHidden();

    // Verify character name and race are displayed
    await expect(page.locator('.current-character__name')).toHaveText('Dovahkiin');
    await expect(page.locator('.current-character__race')).toHaveText('Nord');

    // Visual regression test for the character block
    await expect(page.locator('.current-character')).toHaveScreenshot('character-creation.png');
  });

  test('Skill and perk selection flow', async ({ page }) => {
    // First we need to create a character
    await page.click('button.main-buttons__character');
    await page.fill('#character-name', 'Dovahkiin');
    await page.selectOption('#races', 'Nord');
    await page.click('button.save-character');

    // Open menu
    await page.click('button.main-buttons__menu');

    // Open skills
    await page.click('button.category-button--skills');

    // Wait for the skills modal to become visible
    const skillsModal = page.locator('section.skills');
    await expect(skillsModal).toBeVisible();

    // The default skill might be Illusion, click Illusion icon to ensure it's selected
    await page.click('button[data-skill-icon="Illusion"]');

    // Increase skill level by 10
    await page.click('button[data-change-skill="10"]');

    // Add 10 more
    await page.click('button[data-change-skill="10"]');

    // Verify skill level is updated in the UI
    await expect(page.locator('.tree-header__skill-level')).toHaveText('35'); // 15 base for Nord + 20

    // To select a perk we need to wait a moment or click directly on the perk in the SVG
    // The SVGs are rendered dynamically. Let's find the first perk "Novice Illusion"
    const noviceIllusionPerk = page.locator('circle[data-perk-name="Novice Illusion"]');
    // It's an SVG circle. Let's click it.
    await noviceIllusionPerk.click({ force: true });

    // Verify perk selected - tree-header__active-perks
    await expect(page.locator('.tree-header__active-perks')).toHaveText('1');

    // Screenshot the skills tree
    await expect(skillsModal).toHaveScreenshot('skills-tree-illusion.png');
  });

  test('Item search, equipment, and statistics flow', async ({ page }) => {
    // Create character
    await page.click('button.main-buttons__character');
    await page.fill('#character-name', 'Dovahkiin');
    await page.selectOption('#races', 'Nord');
    await page.click('button.save-character');

    // Open menu
    await page.click('button.main-buttons__menu');

    // Open Armor category
    // There are multiple .category-button--items, the first one is Armor.
    const armorButton = page.locator('button.category-button--items').nth(0);
    await armorButton.click();

    // Click Heavy Armor
    await page.locator('button[data-open-items]', { hasText: 'Heavy' }).nth(0).click();

    // Wait for the items window to open
    const itemsWindow = page.locator('section.items-window');
    await expect(itemsWindow).toBeVisible();

    // Search for "Iron"
    await page.fill('#items-search', 'Iron');

    // Wait for the list to filter. We'll find an item named "Iron Armor"
    const ironArmorCard = page.locator('.item-card', { hasText: 'Iron Armor' }).first();
    await expect(ironArmorCard).toBeVisible();

    // Click Equip
    await ironArmorCard.locator('button.item-card__equip-button').click();

    // Wait for the item replacement/equip dialog if it appears
    // The game might show a confirmation if equipping. But Iron Armor to empty body should be direct.

    // Close the items window
    await page.locator('button[data-close-modal="#overlay .items-window"]').click({ force: true });

    // Close the menu
    await page.locator('.menu .close-button').first().evaluate(node => node.click());

    // Open Statistics tab in build information
    await page.click('button[data-info-tab=".info-win__statistics-section"]');

    // Verify Armor and Weight statistics updated
    await expect(page.locator('[data-phys-values="totalArmor"]')).not.toHaveText('0');
    await expect(page.locator('[data-phys-values="totalWeight"]')).not.toHaveText('0');

    // Open Equipped Items tab
    await page.click('button[data-info-tab=".info-win__item-info-section"]');

    // Wait for the UI to update
    await page.waitForTimeout(500);

    // Take screenshot of the equipped items section
    const buildInfo = page.locator('section.build-information');
    await expect(buildInfo).toHaveScreenshot('build-info-equipped.png');
  });

  test('Boons selection flow', async ({ page }) => {
    // Create character
    await page.click('button.main-buttons__character');
    await page.fill('#character-name', 'Dovahkiin');
    await page.selectOption('#races', 'Nord');
    await page.click('button.save-character');

    // Open menu
    await page.click('button.main-buttons__menu');

    // Open Boons
    await page.click('button.category-button--boons');

    // Wait for the boons window to open
    const boonsWindow = page.locator('section.boons');
    await expect(boonsWindow).toBeVisible();

    // Select The Warrior Stone
    await page.locator('input[value="The Warrior Stone"]').check();

    // Close the boons window
    await page.locator('button[data-close-modal=".boons #overlay"]').click({ force: true });

    // Close the menu
    await page.locator('.menu .close-button').first().evaluate(node => node.click());

    // Open Passive Effects tab in build information
    await page.click('button[data-info-tab=".info-win__passive-effects-section"]');

    // Verify The Warrior Stone is in passive effects
    await expect(page.locator('dt.passive-effects__term', { hasText: 'The Warrior Stone' })).toBeVisible();

    // Take a screenshot of the build info to ensure passive effects look correct
    const buildInfo = page.locator('section.build-information');
    await expect(buildInfo).toHaveScreenshot('build-info-boons.png');
  });

  test('Multiple items, skills, perks, and boons selection flow', async ({ page }) => {
    await page.click('button.main-buttons__character');
    await page.fill('#character-name', 'Hero');
    await page.selectOption('#races', 'Imperial');
    await page.click('button.save-character');

    await page.click('button.main-buttons__menu');

    await page.locator('.category-button--items', { hasText: 'Weapons' }).evaluate(node => node.click());
    await page.locator('button[data-open-items]').filter({ hasText: /^Swords$/ }).evaluate(node => node.click());
    const itemsWindow = page.locator('section.items-window');
    await expect(itemsWindow).toBeVisible();

    await page.fill('#items-search', 'Iron Sword');
    await page.locator('.item-card', { hasText: 'Iron Sword' }).first().locator('button.item-card__equip-button').evaluate(node => node.click());

    const chooseHandContainer = page.locator('.choose-hand');
    await chooseHandContainer.waitFor({ state: 'visible', timeout: 3000 }).catch(() => {});
    if (await chooseHandContainer.isVisible()) {
      await chooseHandContainer.locator('button.choose-hand__button').last().evaluate(node => node.click()); // Right hand
    }

    await page.locator('button[data-close-modal="#overlay .items-window"]').evaluate(node => node.click());

    // Equip iron shield
    await page.locator('.category-button--items', { hasText: 'Shields' }).evaluate(node => node.click());
    await page.locator('button[data-open-items]').filter({ hasText: /^Heavy$/ }).nth(1).evaluate(node => node.click());
    await expect(itemsWindow).toBeVisible();
    await page.fill('#items-search', 'Iron Shield');
    await page.locator('.item-card', { hasText: 'Iron Shield' }).first().locator('button.item-card__equip-button').evaluate(node => node.click());

    await chooseHandContainer.waitFor({ state: 'visible', timeout: 3000 }).catch(() => {});
    if (await chooseHandContainer.isVisible()) {
      await chooseHandContainer.locator('button.choose-hand__button').first().evaluate(node => node.click()); // Left hand
    }
    await page.locator('button[data-close-modal="#overlay .items-window"]').evaluate(node => node.click());

    // Skills
    await page.locator('button.category-button--skills').evaluate(node => node.click());
    const skillsModal = page.locator('section.skills');
    await expect(skillsModal).toBeVisible();

    // Heavy Armor Skill
    await page.locator('button[data-skill-icon="Heavy Armor"]').evaluate(node => node.click());
    for(let i=0; i<3; i++) {
        await page.locator('button[data-change-skill="10"]').first().evaluate(node => node.click());
    }
    // Juggernaut
    await page.locator('circle[data-perk-name="Juggernaut"]').dispatchEvent('click');

    // One-Handed Skill
    await page.locator('button[data-skill-icon="One-Handed"]').evaluate(node => node.click());
    for(let i=0; i<3; i++) {
        await page.locator('button[data-change-skill="10"]').first().evaluate(node => node.click());
    }
    await page.locator('circle[data-perk-name="Armsman"]').dispatchEvent('click');

    await page.locator('button[data-close-modal=".skills #overlay"]').evaluate(node => node.click());

    // Boons
    await page.locator('button.category-button--boons').evaluate(node => node.click());
    const boonsWindow = page.locator('section.boons');
    await expect(boonsWindow).toBeVisible();
    await page.locator('input[value="The Lord Stone"]').evaluate(node => node.click()); // +50 Armor
    await page.locator('button[data-close-modal=".boons #overlay"]').evaluate(node => node.click());

    await page.locator('.menu .close-button').first().evaluate(node => node.click());

    await page.click('button[data-info-tab=".info-win__statistics-section"]');
    await page.waitForTimeout(500);

    const totalDamage = page.locator('[data-phys-values="totalDamage"]');
    const damageVal = await totalDamage.textContent();
    const totalArmor = page.locator('[data-phys-values="totalArmor"]');
    const armorVal = await totalArmor.textContent();

    expect(parseInt(damageVal)).toBe(10);
    expect(parseInt(armorVal)).toBe(76);
  });
});
