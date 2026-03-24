import { loadBrowserScripts } from "./helper";

interface BuiltFilter {
  apply: (date: Date) => boolean;
}

describe('Filters Module (assets/js/alerts/filters.js)', () => {
  describe('buildFilters', () => {
    test('returns no filters when the schedule has no day constraints', () => {
      const {buildFilters} = loadBrowserScripts([
        'assets/js/alerts/utils.js',
        'assets/js/alerts/filters.js',
      ]) as { buildFilters: (schedule: Record<string, unknown>) => BuiltFilter[] };

      const filters = buildFilters({
        frequency: 'daily',
      });

      expect(filters).toHaveLength(0);
    });

    test('builds a day-of-week filter that matches configured weekdays', () => {
      const {buildFilters} = loadBrowserScripts([
        'assets/js/alerts/utils.js',
        'assets/js/alerts/filters.js',
      ]) as { buildFilters: (schedule: Record<string, unknown>) => BuiltFilter[] };

      const filters = buildFilters({
        frequency: 'weekly',
        daysOfWeek: ['monday', 'wednesday'],
      });

      expect(filters).toHaveLength(1);
      expect(filters[0].apply(new Date(2026, 2, 9, 12, 0, 0, 0))).toBe(true); // Monday
      expect(filters[0].apply(new Date(2026, 2, 10, 12, 0, 0, 0))).toBe(false); // Tuesday
    });

    test('builds a day-of-month filter that matches configured month days', () => {
      const {buildFilters} = loadBrowserScripts([
        'assets/js/alerts/utils.js',
        'assets/js/alerts/filters.js',
      ]) as { buildFilters: (schedule: Record<string, unknown>) => BuiltFilter[] };

      const filters = buildFilters({
        frequency: 'monthly',
        daysOfMonth: [5, 15],
      });

      expect(filters).toHaveLength(1);
      expect(filters[0].apply(new Date(2026, 2, 5, 12, 0, 0, 0))).toBe(true);
      expect(filters[0].apply(new Date(2026, 2, 6, 12, 0, 0, 0))).toBe(false);
    });

    test('returns both filters when the schedule combines weekday and month-day rules', () => {
      const {buildFilters} = loadBrowserScripts([
        'assets/js/alerts/utils.js',
        'assets/js/alerts/filters.js',
      ]) as { buildFilters: (schedule: Record<string, unknown>) => BuiltFilter[] };

      const filters = buildFilters({
        frequency: 'monthly',
        daysOfWeek: ['monday'],
        daysOfMonth: [9],
      });

      expect(filters).toHaveLength(2);

      const matchingDate = new Date(2026, 2, 9, 12, 0, 0, 0); // Monday the 9th
      const wrongWeekday = new Date(2026, 2, 10, 12, 0, 0, 0); // Tuesday the 10th
      const wrongMonthDay = new Date(2026, 2, 16, 12, 0, 0, 0); // Monday the 16th

      expect(filters.every((filter) => filter.apply(matchingDate))).toBe(true);
      expect(filters.every((filter) => filter.apply(wrongWeekday))).toBe(false);
      expect(filters.every((filter) => filter.apply(wrongMonthDay))).toBe(false);
    });
  });
});
