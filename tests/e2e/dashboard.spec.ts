import {expect, test} from '@playwright/test';
import {execSync} from 'child_process';
import path from 'path';

const DASHBOARD_PATH = path.join(__dirname, '../output/index.html');
const INDEX_PATH = path.join(__dirname, '../../dist/src/index.js');
const CONFIG_PATH = path.join(__dirname, '../fixtures/config.yaml');

test.beforeAll(() => {
  console.log('INDEX_PATH:', INDEX_PATH);
  console.log('CONFIG_PATH:', CONFIG_PATH);
  console.log('DASHBOARD_PATH:', DASHBOARD_PATH);

  execSync(`node ${INDEX_PATH} -i ${CONFIG_PATH} -o ${DASHBOARD_PATH}`);
});

test('Dashboard loads correctly from file', async ({page}) => {
  await page.goto(`file://${DASHBOARD_PATH}`);
  await expect(page).toHaveTitle(/My StartPage/);
});

test('Navigation bar exists', async ({page}) => {
  await page.goto(`file://${DASHBOARD_PATH}`);
  const nav = page.locator('nav');
  await expect(nav).toBeVisible();
});

test('Sections render correctly', async ({page}) => {
  await page.goto(`file://${DASHBOARD_PATH}`);
  const sections = page.locator('section');
  await expect(sections).toHaveCount(2);
});
