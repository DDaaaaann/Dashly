import {expect, test} from '@playwright/test';
import BaseDashboardTest from './BaseDashboardTest';

class NightOwlTest extends BaseDashboardTest {
  async testNavigationSection() {
    const sections = this.page.locator('section');
    await expect(sections.nth(0).locator('.block').nth(0)).toHaveClass(/title-section/);
    await expect(sections.nth(0).locator('.block').nth(0).locator('h2')).toHaveText('Custom Title Section 1:');
    await expect(sections.nth(1).locator('.block').nth(0)).not.toHaveClass(/title-section/);
  }
}

test.describe('Night Owl Dashboard', () => {
  let nightOwl: NightOwlTest;

  test.beforeAll(async ({browser}) => {
    nightOwl = new NightOwlTest('theme_night_owl_full');
    await nightOwl.setup(browser);
  });

  test.afterAll(async () => {
    await nightOwl.teardown();
  });

  test('Title is correct', async () => {
    await nightOwl.testTitle('Full Night Owl Dashboard');
  });

  test('Links are rendered correctly', async () => {
    await nightOwl.testLinks(11);
  });

  test('Clock is visible', async () => {
    await nightOwl.testClock();
  });

  test('Clock updates correctly', async () => {
    await nightOwl.testClockUpdates();
  });

  test('Links have valid href attributes', async () => {
    await nightOwl.testLinksHaveValidHrefs();
  });

  test('Navigation section displays correctly if title exists', async () => {
    await nightOwl.testNavigationSection();
  });

  test('Footer is rendered correctly', async () => {
    await nightOwl.testFooter();
  });
});