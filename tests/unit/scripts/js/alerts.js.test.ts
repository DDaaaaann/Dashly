import { loadBrowserScripts } from "./helper";

interface AlertElement {
  dataset: { alertId: string };
  hidden: boolean;
}

interface AlertsRootElement {
  hidden: boolean;
  querySelectorAll: (selector: string) => AlertElement[];
}

interface AlertConfig {
  id: string;
  schedule: { id: string }
}

describe('Alerts Module (assets/js/alerts/alerts.js)', () => {
  function loadModule({
                        now,
                        alertsConfig,
                        activeById,
                      }: {
    now: Date;
    alertsConfig: AlertConfig[];
    activeById: Record<string, boolean>;
  }) {
    const alertElements: AlertElement[] = alertsConfig.map((alert) => ({
      dataset: {alertId: alert.id},
      hidden: false,
    }));

    const alertsElement: AlertsRootElement = {
      hidden: false,
      querySelectorAll: jest.fn((selector: string) => {
        expect(selector).toBe('.alert');
        return alertElements;
      }),
    };

    const isScheduleActiveMock = jest.fn<boolean, [{
      id: string
    }, Date]>((schedule, currentNow) => {
      expect(currentNow.getTime()).toBe(Date.now());
      return activeById[schedule.id];
    });

    jest.setSystemTime(now);

    loadBrowserScripts([
      'assets/js/alerts/alerts.js',
    ], {
      document: {
        getElementById: jest.fn((id: string) => {
          expect(id).toBe('alerts');
          return alertsElement;
        }),
      },
      alerts: alertsConfig,
      isScheduleActive: isScheduleActiveMock,
      Date,
      setTimeout,
      setInterval,
    });

    return {
      alertElements,
      alertsElement,
      isScheduleActiveMock,
    };
  }

  beforeEach(() => {
    jest.resetModules();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  test('renders active alerts immediately and keeps the container visible', () => {
    const now = new Date(2026, 2, 5, 10, 15, 20, 0);
    const {alertElements, alertsElement, isScheduleActiveMock} = loadModule({
      now,
      alertsConfig: [
        {id: 'alert-a', schedule: {id: 'schedule-a'}},
        {id: 'alert-b', schedule: {id: 'schedule-b'}},
      ],
      activeById: {
        'schedule-a': true,
        'schedule-b': false,
      },
    });

    expect(isScheduleActiveMock).toHaveBeenCalledTimes(2);
    expect(alertElements[0].hidden).toBe(false);
    expect(alertElements[1].hidden).toBe(true);
    expect(alertsElement.hidden).toBe(false);
  });

  test('hides the container when all alerts are inactive', () => {
    const now = new Date(2026, 2, 5, 10, 15, 20, 0);
    const {alertElements, alertsElement, isScheduleActiveMock} = loadModule({
      now,
      alertsConfig: [
        {id: 'alert-a', schedule: {id: 'schedule-a'}},
        {id: 'alert-b', schedule: {id: 'schedule-b'}},
      ],
      activeById: {
        'schedule-a': false,
        'schedule-b': false,
      },
    });

    expect(isScheduleActiveMock).toHaveBeenCalledTimes(2);
    expect(alertElements[0].hidden).toBe(true);
    expect(alertElements[1].hidden).toBe(true);
    expect(alertsElement.hidden).toBe(true);
  });

  test('schedules a refresh on the next minute and then repeats every minute', () => {
    const now = new Date(2026, 2, 5, 10, 15, 15, 0);
    const setTimeoutSpy = jest.spyOn(global, 'setTimeout');
    const setIntervalSpy = jest.spyOn(global, 'setInterval');
    const activeById = {'schedule-a': true};

    const {alertElements, isScheduleActiveMock} = loadModule({
      now,
      alertsConfig: [{id: 'alert-a', schedule: {id: 'schedule-a'}}],
      activeById,
    });

    expect(setTimeoutSpy).toHaveBeenCalledWith(expect.any(Function), 45000);

    activeById['schedule-a'] = false;
    jest.advanceTimersByTime(45000);

    expect(setIntervalSpy).toHaveBeenCalledWith(expect.any(Function), 60000);
    expect(isScheduleActiveMock).toHaveBeenCalledTimes(2);
    expect(alertElements[0].hidden).toBe(true);

    activeById['schedule-a'] = true;
    jest.advanceTimersByTime(60000);

    expect(isScheduleActiveMock).toHaveBeenCalledTimes(3);
    expect(alertElements[0].hidden).toBe(false);
  });
});
