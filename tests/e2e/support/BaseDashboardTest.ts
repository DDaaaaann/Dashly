import { Browser, BrowserContext, expect, Page } from '@playwright/test';
import { execSync } from 'child_process';
import path from 'path';
import fs from "fs-extra";
import { getThemeSlug } from './sharedThemeConfig';

const INDEX_PATH = path.join(__dirname, '../../../dist/src/index.js');
const OUTPUT_PATH = path.join(__dirname, '../output');
const FIXTURE_DIR = path.join(__dirname, '../../fixtures');

export type DashboardConfig = Record<string, unknown>;

class BaseDashboardTest {
  public page!: Page;
  public readonly dashboardPath: string;
  private readonly configPath: string;
  protected context!: BrowserContext;

  constructor(protected theme: string) {
    // this.configPath = path.join(OUTPUT_PATH, `${scenarioId}.yaml`);
    // this.dashboardPath = path.join(OUTPUT_PATH, `${scenarioId}.html`);

    const themeSlug = getThemeSlug(theme);

    this.configPath = path.join(OUTPUT_PATH, themeSlug + ".yaml");
    this.dashboardPath = path.join(OUTPUT_PATH, themeSlug + '.html');

    this.copyThemeConfigToOutput(theme).catch(error => {
      console.error('Failed to copy theme config:', error);
    });

    fs.ensureDirSync(OUTPUT_PATH);

    console.log('Running test scenario:', theme);
    console.log('INDEX_PATH:', INDEX_PATH);
    console.log('CONFIG_PATH:', this.configPath);
    console.log('DASHBOARD_PATH:', this.dashboardPath);
    try {
      execSync(`node ${INDEX_PATH} -i ${this.configPath} -o ${this.dashboardPath}`);
    } catch (error) {
      if (error instanceof Error) {
        console.error('Failed to generate dashboard:', error.message);
      } else {
        console.error('Failed to generate dashboard:', error);
      }
      throw error; // Re-throw to fail the test
    }
  }

  async copyThemeConfigToOutput(theme: string): Promise<void> {
    const templatePath = path.join(FIXTURE_DIR, 'theme_full_config.yaml');
    const templateContent = fs.readFileSync(templatePath, 'utf8');
    const themeContent = templateContent.replaceAll('__THEME__', theme);
    const outputFilename = `${getThemeSlug(theme)}.yaml`;
    const outputPath = path.join(OUTPUT_PATH, outputFilename);

    await fs.ensureDir(OUTPUT_PATH);
    fs.writeFileSync(outputPath, themeContent);
  }

  async setup(browser: Browser) {
    this.context = await browser.newContext();
    this.page = await this.context.newPage();
  }

  async teardown() {
    await this.context.close();

    if (fs.existsSync(this.dashboardPath)) {
      fs.unlinkSync(this.dashboardPath);
    }

    if (fs.existsSync(this.configPath)) {
      fs.unlinkSync(this.configPath);
    }
  }

  async testTitle(title: string) {
    await this.page.goto(`file://${this.dashboardPath}`);
    await expect(this.page).toHaveTitle(title);
  }

  async testLinks(count: number) {
    await this.page.goto(`file://${this.dashboardPath}`);
    const links = this.page.locator('.links a');
    await expect(links).toHaveCount(count);
  }

  async testClock() {
    await this.page.goto(`file://${this.dashboardPath}`);
    const clock = this.page.locator('#clock');
    await expect(clock).toBeVisible();
  }

  async testClockUpdates() {
    await this.page.goto(`file://${this.dashboardPath}`);
    const clock = this.page.locator('#clock');
    const initialTime = await clock.textContent();

    await this.page.waitForTimeout(2000); // Wait for 2 seconds
    const updatedTime = await clock.textContent();

    expect(initialTime).not.toBe(updatedTime);
  }

  async testLinksHaveValidHrefs() {
    await this.page.goto(`file://${this.dashboardPath}`);
    const links = this.page.locator('.links a');
    const linkCount = await links.count();

    for (let i = 0; i < linkCount; i++) {
      const href = await links.nth(i).getAttribute('href');
      expect(href).toBeTruthy();
      expect(href).toMatch(/^http/); // Ensure the href starts with "http"
    }
  }

  async testFooter() {
    await this.page.goto(`file://${this.dashboardPath}`);
    const footer = this.page.locator('footer');
    await expect(footer).toBeVisible();
    await expect(footer).toContainText('Copyright');
    await expect(footer.locator('a')).toHaveCount(2); // Check for the two links in the footer
  }
}

export default BaseDashboardTest;
