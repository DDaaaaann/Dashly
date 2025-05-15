import { expect, test } from '@playwright/test';
import BaseDashboardTest from './support/BaseDashboardTest';
import LiveSearchTest from './support/LiveSearchTest';

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
  let liveSearchTest: LiveSearchTest;

  test.beforeAll(async ({browser}) => {
    nightOwl = new NightOwlTest('theme_night_owl_full');
    await nightOwl.setup(browser);
    liveSearchTest = new LiveSearchTest(nightOwl.page);

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

  // ##### Live Search #####
  test('Live search is visible', async () => {
    await liveSearchTest.testLiveSearchVisibility();
  });

  test('Live search links work correctly', async () => {
    await liveSearchTest.testLiveSearchFunctionality('title link 8', [
      {
        title: 'Title Link 8',
        context: 'Title Block 3 > Title Group 1'
      }
    ]);
  });

  test('Live search searchfields work correctly', async () => {
    await liveSearchTest.testLiveSearchFunctionality('title search field', [
      {
        title: 'Title Search Field 1',
        context: 'Custom Title Section 1 > Search'
      },
      {
        title: 'Title Search Field 2',
        context: 'Custom Title Section 1 > Search'
      },
    ]);
  });

});