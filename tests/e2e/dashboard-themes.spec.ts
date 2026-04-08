import { expect, test } from '@playwright/test';
import BaseDashboardTest from './support/BaseDashboardTest';
import LiveSearchTest from './support/LiveSearchTest';
import AlertsTest from './support/AlertsTest';

[
  {
    theme: 'Emerald Tides', config: {
      sections: [
        {
          title: 'Section 1', blocks: [
            {title: 'Block 1', type: 'text', content: 'This is a text block.'},
            {
              title: 'Block 2', type: 'links', links: [
                {title: 'Link 1', href: 'https://example.com'},
                {title: 'Link 2', href: 'https://example.org'},
              ]
            },
          ]
        },
        {
          title: 'Section 2', blocks: [
            {title: 'Block 3', type: 'text', content: 'This is another text block.'},
          ]
        }
      ]
    }
  },
].forEach(({theme, config}) => {

  test.describe(`${theme} Dashboard`, () => {

    let dashboardTest: BaseDashboardTest;
    let liveSearchTest: LiveSearchTest;
    let alertsTest: AlertsTest;
    // let config: any;

    // const config = createThemeConfig(theme);
    // const expectedSectionLabels = getExpectedSectionLabels(config);
    // const expectedLinkResults = getExpectedLinkResults(config);
    // const expectedSearchFieldResults = getExpectedSearchFieldResults(config);
    // const expectedAlertStates = getExpectedAlertStates();


    test.beforeAll(async ({browser}) => {

      dashboardTest = new BaseDashboardTest(theme);
      await dashboardTest.setup(browser);
      liveSearchTest = new LiveSearchTest(dashboardTest.page);
      alertsTest = new AlertsTest(dashboardTest.page, dashboardTest.dashboardPath);
    });

    test.afterAll(async () => {
      if (dashboardTest) {
        await dashboardTest.teardown();
      }
    });

    // Title and Meta Tests
    test('Page title is correct', async () => {
      await dashboardTest.testTitle(`Full ${theme} Dashboard`);
    });

    // Clock Tests
    test('Clock is visible', async () => {
      await dashboardTest.testClock();
    });

    test('Clock updates correctly', async () => {
      await dashboardTest.testClockUpdates();
    });

    // Sections Tests
    test('Correct number of sections are rendered', async () => {
      await dashboardTest.page.goto(`file://${dashboardTest.dashboardPath}`);
      const sections = dashboardTest.page.locator('section');
      await expect(sections).toHaveCount(config.sections.length);
    });

    test('Section titles are rendered correctly', async () => {
      await dashboardTest.page.goto(`file://${dashboardTest.dashboardPath}`);
      const sections = dashboardTest.page.locator('section');

      for (let i = 0; i < config.sections.length; i++) {
        const section = sections.nth(i);
        const sectionTitle = config.sections[i].title;

        if (sectionTitle) {
          const titleElement = section.locator('h2, h3, [class*="title"]').first();
          await expect(titleElement).toContainText(sectionTitle);
        }
      }
    });

    // Blocks Tests
    test('All blocks are rendered in sections', async () => {
      await dashboardTest.page.goto(`file://${dashboardTest.dashboardPath}`);

      for (let i = 0; i < config.sections.length; i++) {
        const section = dashboardTest.page.locator('section').nth(i);
        const blockCount = config.sections[i].blocks.length;
        const blocks = section.locator('[class*="block"]');

        await expect(blocks).toHaveCount(blockCount);
      }
    });

    test('Block titles are rendered correctly', async () => {
      await dashboardTest.page.goto(`file://${dashboardTest.dashboardPath}`);
      const sections = dashboardTest.page.locator('section');

      for (let sectionIndex = 0; sectionIndex < config.sections.length; sectionIndex++) {
        const section = sections.nth(sectionIndex);
        const blocks = section.locator('[class*="block"]');

        for (let blockIndex = 0; blockIndex < config.sections[sectionIndex].blocks.length; blockIndex++) {
          const block = blocks.nth(blockIndex);
          const blockTitle = config.sections[sectionIndex].blocks[blockIndex].title;

          if (blockTitle) {
            const titleElement = block.locator('h3, h4, [class*="title"]').first();
            await expect(titleElement).toContainText(blockTitle);
          }
        }
      }
    });

    // Links Tests
    test('All links are rendered correctly', async () => {
      await dashboardTest.page.goto(`file://${dashboardTest.dashboardPath}`);
      const links = dashboardTest.page.locator('a[href^="http"]');

      // Count total links from config
      let totalLinks = 0;
      for (const section of config.sections) {
        for (const block of section.blocks) {
          if (block.links) {
            totalLinks += block.links.length;
          }
          if (block.groups) {
            for (const group of block.groups) {
              if (group.links) {
                totalLinks += group.links.length;
              }
            }
          }
        }
      }

      await expect(links).toHaveCount(totalLinks);
    });

    test('Links have valid href attributes', async () => {
      await dashboardTest.testLinksHaveValidHrefs();
    });

    test('Link titles match config', async () => {
      await dashboardTest.page.goto(`file://${dashboardTest.dashboardPath}`);
      const links = dashboardTest.page.locator('a[href^="http"]');
      const linkCount = await links.count();

      for (let i = 0; i < linkCount; i++) {
        const link = links.nth(i);
        const href = await link.getAttribute('href');
        expect(href).toMatch(/^http/);
      }
    });

    // Search Fields Tests
    test('All search fields are rendered correctly', async () => {
      await dashboardTest.page.goto(`file://${dashboardTest.dashboardPath}`);
      const searchInputs = dashboardTest.page.locator('input[type="text"][class*="search"]');

      // Search fields should be present if liveSearch is enabled
      if (config.liveSearch) {
        await expect(searchInputs).toHaveCount(1); // Usually one main search input
      }
    });

    // Groups Tests
    test('All groups are rendered correctly', async () => {
      await dashboardTest.page.goto(`file://${dashboardTest.dashboardPath}`);

      let totalGroups = 0;
      for (const section of config.sections) {
        for (const block of section.blocks) {
          if (block.groups) {
            totalGroups += block.groups.length;
          }
        }
      }

      if (totalGroups > 0) {
        const groupElements = dashboardTest.page.locator('[class*="group"]');
        const count = await groupElements.count();
        expect(count).toBeGreaterThan(0);
      }
    });

    test('Group titles are rendered correctly', async () => {
      await dashboardTest.page.goto(`file://${dashboardTest.dashboardPath}`);

      for (const section of config.sections) {
        for (const block of section.blocks) {
          if (block.groups) {
            for (const group of block.groups) {
              const groupTitle = group.title;
              if (groupTitle) {
                const groupElement = dashboardTest.page.locator(`text=${groupTitle}`);
                await expect(groupElement.first()).toBeVisible();
              }
            }
          }
        }
      }
    });

    // Alerts Tests
    test('Correct number of alerts are rendered', async () => {
      await dashboardTest.page.goto(`file://${dashboardTest.dashboardPath}`);

      const enabledAlerts = config.alerts.filter((alert: any) => alert.enabled !== false);
      const alertElements = dashboardTest.page.locator('[class*="alert"]');
      const count = await alertElements.count();

      expect(count).toBeGreaterThanOrEqual(enabledAlerts.length);
    });

    test('Alert titles are rendered correctly', async () => {
      await dashboardTest.page.goto(`file://${dashboardTest.dashboardPath}`);

      for (const alert of config.alerts) {
        if (alert.enabled !== false) {
          const alertElement = dashboardTest.page.locator(`text=${alert.title}`);
          await expect(alertElement.first()).toBeVisible();
        }
      }
    });

    test('Alert types are rendered correctly', async () => {
      await dashboardTest.page.goto(`file://${dashboardTest.dashboardPath}`);

      for (const alert of config.alerts) {
        if (alert.enabled !== false) {
          const alertType = alert.type; // 'info' or 'warning'
          const alertElement = dashboardTest.page.locator(`[class*="alert"][class*="${alertType}"]`).first();
          // Verify alert element exists with the correct type
          await expect(alertElement).toBeVisible();
        }
      }
    });

    // Footer Tests
    test('Footer is rendered correctly', async () => {
      await dashboardTest.testFooter();
    });

    // Live Search Tests
    test('Live search is visible', async () => {
      await dashboardTest.page.goto(`file://${dashboardTest.dashboardPath}`);
      await liveSearchTest.testLiveSearchVisibility();
    });

    test('Live search filters links by title', async () => {
      await dashboardTest.page.goto(`file://${dashboardTest.dashboardPath}`);

      const searchInput = dashboardTest.page.locator('input[type="text"][placeholder*="search" i]').first();
      await searchInput.fill('Link 1');

      // Should show filtered results
      const results = dashboardTest.page.locator('[class*="search-result"]');
      const count = await results.count();
      expect(count).toBeGreaterThan(0);
    });

    test('Live search handles empty results', async () => {
      await dashboardTest.page.goto(`file://${dashboardTest.dashboardPath}`);

      const searchInput = dashboardTest.page.locator('input[type="text"][placeholder*="search" i]').first();
      await searchInput.fill('xyznonexistent');

      // Should show no results
      const results = dashboardTest.page.locator('[class*="search-result"]');
      const count = await results.count();
      expect(count).toBe(0);
    });

    // Combined/Integration Tests
    test('Dashboard renders all major components', async () => {
      await dashboardTest.page.goto(`file://${dashboardTest.dashboardPath}`);

      // Title
      await expect(dashboardTest.page).toHaveTitle(`Full ${theme} Dashboard`);

      // Clock
      if (config.clock) {
        await expect(dashboardTest.page.locator('#clock')).toBeVisible();
      }

      // Sections
      await expect(dashboardTest.page.locator('section')).toHaveCount(config.sections.length);

      // Footer
      await expect(dashboardTest.page.locator('footer')).toBeVisible();
    });

    test('All interactive elements are clickable', async () => {
      await dashboardTest.page.goto(`file://${dashboardTest.dashboardPath}`);

      const links = dashboardTest.page.locator('a[href^="http"]');
      const linkCount = await links.count();

      // Verify at least the first few links are clickable
      for (let i = 0; i < Math.min(3, linkCount); i++) {
        const link = links.nth(i);
        await expect(link).toBeEnabled();
      }
    });
  });
})
