import { expect, test } from '@playwright/test';
import BaseDashboardTest from './support/BaseDashboardTest';
import LiveSearchTest from './support/LiveSearchTest';

class SilentAlpsTest extends BaseDashboardTest {

  async testNavigationSection() {
    const sectionLinks = this.page.locator('.section-link');
    await expect(sectionLinks.nth(0)).toHaveText('Section 1');
    await expect(sectionLinks.nth(1)).toHaveText('Custom Title Section 2');
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

test.describe('Silent Alps Dashboard', () => {
  let silentAlps: SilentAlpsTest;
  let liveSearchTest: LiveSearchTest;

  test.beforeAll(async ({browser}) => {
    silentAlps = new SilentAlpsTest('theme_silent_alps_full');
    await silentAlps.setup(browser);
    liveSearchTest = new LiveSearchTest(silentAlps.page);
  });

  test.afterAll(async () => {
    await silentAlps.teardown();
  });

  test('Title is correct', async () => {
    await silentAlps.testTitle('Full Silent Alps Dashboard');
  });

  test('Links are rendered correctly', async () => {
    await silentAlps.testLinks(11);
  });

  test('Clock is visible', async () => {
    await silentAlps.testClock();
  });

  test('Clock updates correctly', async () => {
    await silentAlps.testClockUpdates();
  });

  test('Links have valid href attributes', async () => {
    await silentAlps.testLinksHaveValidHrefs();
  });

  test('Footer is rendered correctly', async () => {
    await silentAlps.testFooter();
  });

  test('Navigation section displays correctly, with default title', async () => {
    await silentAlps.testNavigationSection();
  });

  test('Section navigation works correctly', async () => {
    await silentAlps.testSectionNavigation();
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
        context: 'Custom Title Section 2 > Title Block 3 > Search'
      },
      {
        title: 'Title Search Field 1',
        context: 'Search 1'
      },
      {
        title: 'Title Search Field 2',
        context: 'Search 1'
      },
    ]);
  });
});
