const {
  isScheduleActive,
} = require('../../../../assets/js/alerts/schedule.js')

describe("Recurrence Module (assets/js/recurrence.js)", () => {

  function date(str: string): Date {
    var date = new Date(str);
    var timezoneOffset = date.getTimezoneOffset();
    date.setMinutes(date.getMinutes() + timezoneOffset);
    return date;
  }

  describe("isScheduleActive", () => {

    test("actief tijdens duratie", () => {
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