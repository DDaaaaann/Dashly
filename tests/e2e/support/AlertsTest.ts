import { expect, Page } from '@playwright/test';

type AlertExpectations = {
  customDate: string;
  assertVisible: Alert[];
};

type Alert = {
  title: string;
  type: 'info' | 'warning';
  message: string;
};

export default class AlertsTest {
  protected page: Page;
  protected dashboardPath: string;

  constructor(page: Page, dashboardPath: string) {
    this.page = page;
    this.dashboardPath = dashboardPath;
  }

  async testAlerts(expectations: AlertExpectations) {
    await this.page.clock.setFixedTime(new Date(expectations.customDate).getTime());
    await this.page.goto(`file://${this.dashboardPath}`);

    var alertCount = expectations.assertVisible.length;

    const alertsRoot = this.page.locator('#alerts');

    if (alertCount === 0) {
      await expect(alertsRoot).toHaveAttribute("hidden");
      await expect(this.page.locator('.alert')).toHaveAttribute("hidden");

    } else {
      await expect(alertsRoot).not.toHaveAttribute("hidden");
      await expect(this.page.locator('.alert')).not.toHaveAttribute("hidden");
      await expect(this.page.locator('.alert:not([hidden])')).toHaveCount(alertCount);

      for (const alert of expectations.assertVisible) {
        await expect(this.page.locator('.alert', {hasText: alert.title})).toBeVisible();
        await expect(this.page.locator('.alert', {hasText: alert.message})).toBeVisible();
        await expect(this.page.locator('.alert')).toContainClass(alert.type);
      }
    }
  }
}
