import { loadBrowserScripts } from "./helper";

interface Schedule {
  frequency: string;
  time?: string;
  durationMinutes?: number;
  daysOfWeek?: string[];
  daysOfMonth?: number[];
}

describe("Recurrence Module (assets/js/recurrence.js)", () => {

  function date(str: string): Date {
    const date = new Date(str);
    const timezoneOffset = date.getTimezoneOffset();
    date.setMinutes(date.getMinutes() + timezoneOffset);
    return date;
  }

  describe("isScheduleActive", () => {
    const getIsScheduleActive = () =>
        (loadBrowserScripts([
          'assets/js/alerts/utils.js',
          'assets/js/alerts/filters.js',
          'assets/js/alerts/generators.js',
          'assets/js/alerts/schedule.js',
        ]) as { isScheduleActive: (schedule: Schedule, now?: Date) => boolean }).isScheduleActive;

    test("actief tijdens duratie", () => {
      const isScheduleActive = getIsScheduleActive()
      const config = {
        schedule: {
          frequency: "daily",
          time: "10:00",
          durationMinutes: 120
        }
      }

      expect(isScheduleActive(config.schedule, date("2026-03-10T10:30:00Z"))).toBe(true)
    })

    test("inactief voor starttijd", () => {
      const isScheduleActive = getIsScheduleActive()
      const config = {
        schedule: {
          frequency: "daily",
          time: "10:00",
          durationMinutes: 120
        },

      }

      expect(isScheduleActive(config.schedule, date("2026-03-10T09:59:59Z"))).toBe(false)
    })

    test("inactief na duratie", () => {
      const isScheduleActive = getIsScheduleActive()
      const config = {
        schedule: {
          frequency: "daily",
          time: "10:00",
          durationMinutes: 120,
        }
      }

      expect(isScheduleActive(config.schedule, date("2026-03-10T12:01:00Z"))).toBe(false)
    })

    test("weekly actief op correcte weekdag", () => {
      const isScheduleActive = getIsScheduleActive()
      const config = {
        schedule: {
          frequency: "weekly",
          daysOfWeek: ["monday"],
          time: "10:00",
          durationMinutes: 120,
        }
      }

      expect(isScheduleActive(config.schedule, date("2026-03-09T11:00:00Z"))).toBe(true)
      expect(isScheduleActive(config.schedule, date("2026-03-10T11:00:00Z"))).toBe(false)
    })

    test("monthly dayOfMonth", () => {
      const isScheduleActive = getIsScheduleActive()
      const config = {
        schedule: {
          frequency: "monthly",
          daysOfMonth: [15],
          time: "10:00",
          durationMinutes: 180,
        }
      }

      expect(isScheduleActive(config.schedule, date("2026-03-15T11:00:00Z"))).toBe(true)
      expect(isScheduleActive(config.schedule, date("2026-03-14T11:00:00Z"))).toBe(false)
    })

    test("actief precies op starttijd", () => {
      const isScheduleActive = getIsScheduleActive()
      const config = {
        schedule: {
          frequency: "daily",
          time: "10:00",
          durationMinutes: 120,
        }
      }

      expect(isScheduleActive(config.schedule, date("2026-03-10T10:00:00Z"))).toBe(true)
    })

    test("inactief precies op eindtijd", () => {
      const isScheduleActive = getIsScheduleActive()
      const config = {
        schedule: {
          frequency: "daily",
          time: "10:00",
          durationMinutes: 120,
        }
      }

      expect(isScheduleActive(config.schedule, date("2026-03-10T12:00:00Z"))).toBe(false)
    })

  })

})
