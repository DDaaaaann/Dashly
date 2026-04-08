import { Locator, Page } from "@playwright/test";

export class DashboardPage {
  readonly page: Page;
  readonly links: Locator;
  readonly alerts: Locator;
  readonly clock: Locator;
  readonly searchInput: Locator;
  readonly searchResults: Locator;

  constructor(page: Page) {
    this.page = page;
    this.links = page.locator('.link');
    this.alerts = page.locator('.alert');
    this.clock = page.locator('#clock');
    this.searchInput = page.locator('.search-container input');
    this.searchResults = page.locator('.search-results .result-item');
  }

  async navigate() {
    await this.page.goto('/');
  }

  async search(term: string) {
    await this.searchInput.fill(term);
    await this.searchInput.press('Enter');
  }
}