import {Browser, BrowserContext, expect, Page} from '@playwright/test';
import {execSync} from 'child_process';
import path from 'path';
import fs from "fs-extra";

const INDEX_PATH = path.join(__dirname, '../../../dist/src/index.js');
const FIXTURES_PATH = path.join(__dirname, '../../fixtures');
const OUTPUT_PATH = path.join(__dirname, '../output');

class BaseDashboardTest {
  protected static DASHBOARD_PATH: string;
  protected context: BrowserContext;
  public page: Page;

  constructor(protected theme: string) {
    const CONFIG_PATH = path.join(FIXTURES_PATH, theme + ".yaml");
    BaseDashboardTest.DASHBOARD_PATH = path.join(OUTPUT_PATH, theme + '.html');

    console.log('Running test for theme:', theme);
    console.log('INDEX_PATH:', INDEX_PATH);
    console.log('CONFIG_PATH:', CONFIG_PATH);
    console.log('DASHBOARD_PATH:', BaseDashboardTest.DASHBOARD_PATH);
    execSync(`node ${INDEX_PATH} -i ${CONFIG_PATH} -o ${BaseDashboardTest.DASHBOARD_PATH}`);
  }

  async setup(browser: Browser) {
    this.context = await browser.newContext();
    this.page = await this.context.newPage();
  }

  async teardown() {
    await this.context.close();

    // Clear the output folder
    if (fs.existsSync(OUTPUT_PATH)) {
      fs.readdirSync(OUTPUT_PATH).forEach((file) => {
        fs.unlinkSync(path.join(OUTPUT_PATH, file));
      });
    }
  }

  async testTitle(title: string) {
    await this.page.goto(`file://${BaseDashboardTest.DASHBOARD_PATH}`);
    await expect(this.page).toHaveTitle(title);
  }

  async testLinks(count: number) {
    await this.page.goto(`file://${BaseDashboardTest.DASHBOARD_PATH}`);
    const links = this.page.locator('.links a');
    await expect(links).toHaveCount(count);
  }

  async testClock() {
    await this.page.goto(`file://${BaseDashboardTest.DASHBOARD_PATH}`);
    const clock = this.page.locator('#clock');
    await expect(clock).toBeVisible();
  }

  async testClockUpdates() {
    await this.page.goto(`file://${BaseDashboardTest.DASHBOARD_PATH}`);
    const clock = this.page.locator('#clock');
    const initialTime = await clock.textContent();

    await this.page.waitForTimeout(2000); // Wait for 2 seconds
    const updatedTime = await clock.textContent();

    expect(initialTime).not.toBe(updatedTime);
  }

  async testLinksHaveValidHrefs() {
    await this.page.goto(`file://${BaseDashboardTest.DASHBOARD_PATH}`);
    const links = this.page.locator('.links a');
    const linkCount = await links.count();

    for (let i = 0; i < linkCount; i++) {
      const href = await links.nth(i).getAttribute('href');
      expect(href).toBeTruthy();
      expect(href).toMatch(/^http/); // Ensure the href starts with "http"
    }
  }

  async testFooter() {
    await this.page.goto(`file://${BaseDashboardTest.DASHBOARD_PATH}`);
    const footer = this.page.locator('footer');
    await expect(footer).toBeVisible();
    await expect(footer).toContainText('Copyright');
    await expect(footer.locator('a')).toHaveCount(2); // Check for the two links in the footer
  }
}

export default BaseDashboardTest;