import { expectDateParts } from "./helper";

const {
  daysInMonth,
  daysInRange,
  addDays,
  startOfDay,
  startOfWeek,
  startOfMonth,
} = require('../../../../assets/js/alerts/utils.js');

describe('Generators Module (assets/js/alerts/generators.js)', () => {

  describe('startOfDay', () => {
    test('resets time components to midnight', () => {
      const input = new Date(2026, 2, 5, 13, 45, 30, 123);
      const result = startOfDay(input);
      expectDateParts(result, 2026, 2, 5, 0, 0, 0, 0);
    });
  });

  describe('addDays', () => {
    test('adds days and normalizes to start of day', () => {
      const input = new Date(2026, 2, 5, 22, 10, 5, 900);
      const result = addDays(input, 3);

      expectDateParts(result, 2026, 2, 8, 0, 0, 0, 0);
    });
  });

  describe('startOfWeek', () => {
    test('returns Monday as the start of the week', () => {
      const input = new Date(2026, 2, 4, 9, 0, 0, 0); // Wednesday
      const result = startOfWeek(input);

      expectDateParts(result, 2026, 2, 2, 0, 0, 0, 0); // Monday
      expect(result.getDay()).toBe(1);
    });
  });

  describe('startOfMonth', () => {
    test('returns the first day of the month at midnight', () => {
      const input = new Date(2026, 5, 20, 18, 0, 0, 0);
      const result = startOfMonth(input);

      expectDateParts(result, 2026, 5, 1, 0, 0, 0, 0);
    });
  });

  describe('daysInMonth', () => {
    test('handles 30-day months', () => {
      expect(daysInMonth(new Date(2026, 3, 1))).toBe(30); // April
    });

    test('handles leap years', () => {
      expect(daysInMonth(new Date(2024, 1, 1))).toBe(29); // February 2024
    });
  });

  describe('daysInRange', () => {
    test('returns a contiguous range starting at midnight', () => {
      const start = new Date(2026, 2, 1, 10, 0, 0, 0);
      const result = daysInRange(start, 3);

      expect(result).toHaveLength(3);
      expectDateParts(result[0], 2026, 2, 1, 0, 0, 0, 0);
      expectDateParts(result[1], 2026, 2, 2, 0, 0, 0, 0);
      expectDateParts(result[2], 2026, 2, 3, 0, 0, 0, 0);
    });
  });
});
