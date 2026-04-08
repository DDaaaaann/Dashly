import { Alert } from "./interface";
import log from "../logger/logger";

const DEFAULT_DURATION = 120;
const ALERT_PREFIX = "alert-";

export function setupAlerts(alerts: Alert[]): Alert[] {
  log.debug('Setting up alerts');
  return alerts.map((alert, index) => {
    return {
      id: alert.id || ALERT_PREFIX + index,
      durationMinutes: alert.schedule.durationMinutes ? Math.max(1,
          Math.round(alert.schedule.durationMinutes)) : DEFAULT_DURATION,
      ...alert
    };
  });
}