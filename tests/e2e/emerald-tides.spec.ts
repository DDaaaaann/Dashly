import {expect, test} from '@playwright/test';
import BaseDashboardTest from './BaseDashboardTest';

class EmeraldTidesTest extends BaseDashboardTest {

  async testNavigationSection() {
    const sectionLinks = this.page.locator('.section-link');
    await expect(sectionLinks.nth(0)).toHaveText('Custom Title Section 1');
    await expect(sectionLinks.nth(1)).toHaveText('Section 2');
  }

  async testSectionNavigation() {
    await this.page.goto(`file://${BaseDashboardTest.DASHBOARD_PATH}`);
    const sectionLinks = this.page.locator('.section-link');
    const sections = this.page.locator('section');

    // Verify initial state
    await expect(sectionLinks.nth(0)).toHaveClass(/active/);
    await expect(sections.nth(0)).toHaveClass(/active/);
    await expect(sectionLinks.nth(1)).not.toHaveClass(/active/);

    // Navigate to the second section
    await sectionLinks.nth(1).click();
    await expect(sectionLinks.nth(1)).toHaveClass(/active/);
    await expect(sections.nth(1)).toHaveClass(/active/);
    await expect(sectionLinks.nth(0)).not.toHaveClass(/active/);

    // Navigate back to the first section
    await sectionLinks.nth(0).click();
    await expect(sectionLinks.nth(0)).toHaveClass(/active/);
    await expect(sections.nth(0)).toHaveClass(/active/);
    await expect(sectionLinks.nth(1)).not.toHaveClass(/active/);
  }
}

test.describe('Emerald Tides Dashboard', () => {
  let emeraldTest: EmeraldTidesTest;

  test.beforeAll(async ({browser}) => {
    emeraldTest = new EmeraldTidesTest('theme_emerald_tides_full');
    await emeraldTest.setup(browser);
  });

  test.afterAll(async () => {
    await emeraldTest.teardown();
  });

  test('Title is correct', async () => {
    await emeraldTest.testTitle('Full Emerald Tides Dashboard');
  });

  test('Links are rendered correctly', async () => {
    await emeraldTest.testLinks(11);
  });

  test('Clock is visible', async () => {
    await emeraldTest.testClock();
  });

  test('Clock updates correctly', async () => {
    await emeraldTest.testClockUpdates();
  });

  test('Links have valid href attributes', async () => {
    await emeraldTest.testLinksHaveValidHrefs();
  });

  test('Footer is rendered correctly', async () => {
    await emeraldTest.testFooter();
  });

  test('Navigation section displays correctly, with default title', async () => {
    await emeraldTest.testNavigationSection();
  });

  test('Section navigation works correctly', async () => {
    await emeraldTest.testSectionNavigation();
  });
});