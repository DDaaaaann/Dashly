import { expect, test } from '@playwright/test';
import BaseDashboardTest from './support/BaseDashboardTest';
import LiveSearchTest from './support/LiveSearchTest';

class BrightTangerineTest extends BaseDashboardTest {
  async testNavigationSection() {
    await this.page.goto(`file://${BrightTangerineTest.DASHBOARD_PATH}`);
    const sections = this.page.locator('section');
    await expect(sections.nth(0).locator('div').nth(0)).not.toHaveClass(/section-header/);
    await expect(sections.nth(1).locator('div').nth(0)).toHaveClass(/section-header/);
    await expect(sections.nth(1).locator('.section-header').nth(0).locator('h2')).toHaveText('Custom Title Section 2');
  }
}

test.describe('Bright Tangerine Dashboard', () => {
  let brightTangerine: BrightTangerineTest;
  let liveSearchTest: LiveSearchTest;

  test.beforeAll(async ({browser}) => {
    brightTangerine = new BrightTangerineTest('theme_bright_tangerine_full');
    await brightTangerine.setup(browser);
    liveSearchTest = new LiveSearchTest(brightTangerine.page);
  });

  test.afterAll(async () => {
    await brightTangerine.teardown();
  });

  test('Title is correct', async () => {
    await brightTangerine.testTitle('Full Bright Tangerine Dashboard');
  });

  test('Links are rendered correctly', async () => {
    await brightTangerine.testLinks(11);
  });

  test('Clock is visible', async () => {
    await brightTangerine.testClock();
  });

  test('Clock updates correctly', async () => {
    await brightTangerine.testClockUpdates();
  });

  test('Links have valid href attributes', async () => {
    await brightTangerine.testLinksHaveValidHrefs();
  });

  test('Footer is rendered correctly', async () => {
    await brightTangerine.testFooter();
  });

  test('Navigation section displays correctly, with default title', async () => {
    await brightTangerine.testNavigationSection();
  });

  // ##### Live Search #####
  test('Live search is visible', async () => {
    await liveSearchTest.testLiveSearchVisibility();
  });

  test('Live search links work correctly', async () => {
    await liveSearchTest.testLiveSearchFunctionality('title link 8', [
      {
        title: 'Title Link 8',
        context: 'Custom Title Section 2 > Title Block 3 > Title Group 1'
      }
    ]);
  });

  test('Live search searchfields work correctly', async () => {
    await liveSearchTest.testLiveSearchFunctionality('title search field', [
      {
        title: 'Title Search Field 1',
        context: 'Custom Title Section 2 > Title Block 3 > Search 2'
      },
      {
        title: 'Title Search Field 1',
        context: 'Search 1'
      },
      {
        title: 'Title Search Field 2',
        context: 'Search 1'
      }
    ]);
  });
});
