import { expect, Page } from '@playwright/test';

export default class LiveSearchTest {
  protected page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async testLiveSearchVisibility() {
    const liveSearch = this.page.locator('.search-container');
    await expect(liveSearch).toBeVisible();
  }

  async testLiveSearchFunctionality(
    searchTerm: string,
    expectedResults: { title: string; context: string }[]
  ) {
    const searchInput = this.page.locator('.search-container input');

    await searchInput.fill(searchTerm);

    const resultItems = this.page.locator('.search-results .result-item');
    await expect(resultItems).toHaveCount(expectedResults.length);

    for (let i = 0; i < expectedResults.length; i++) {
      await expect(resultItems.nth(i).locator('.result-title')).toHaveText(expectedResults[i].title);
      await expect(resultItems.nth(i).locator('.result-context')).toContainText(expectedResults[i].context);
    }
  }
}