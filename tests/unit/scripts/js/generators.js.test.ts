import { expectDateParts, loadBrowserScripts } from "./helper";

interface Generator {
  generate: (date: Date) => Date[];
}

describe('Generators Module (assets/js/alerts/generators.js)', () => {
  describe('dailyGenerator', () => {
    test('returns a single start-of-day date', () => {
      const {dailyGenerator} = loadBrowserScripts([
        'assets/js/alerts/utils.js',
        'assets/js/alerts/generators.js',
      ]) as { dailyGenerator: () => Generator };

      const generator = dailyGenerator();
      const input = new Date(2026, 2, 5, 12, 0, 0, 0);
      const result = generator.generate(input);

      expect(result).toHaveLength(1);
      expectDateParts(result[0], 2026, 2, 5, 0, 0, 0, 0);
    });
  });

  describe('weeklyGenerator', () => {
    test('returns seven days starting on Monday', () => {
      const {weeklyGenerator} = loadBrowserScripts([
        'assets/js/alerts/utils.js',
        'assets/js/alerts/generators.js',
      ]) as { weeklyGenerator: () => Generator };

      const generator = weeklyGenerator();
      const input = new Date(2026, 2, 4, 12, 0, 0, 0); // Wednesday
      const result = generator.generate(input);

      expect(result).toHaveLength(7);
      expectDateParts(result[0], 2026, 2, 2, 0, 0, 0, 0); // Monday
      expectDateParts(result[6], 2026, 2, 8, 0, 0, 0, 0); // Sunday
    });
  });

  describe('monthlyGenerator', () => {
    test('returns all days in the month starting on the first', () => {
      const {monthlyGenerator} = loadBrowserScripts([
        'assets/js/alerts/utils.js',
        'assets/js/alerts/generators.js',
      ]) as { monthlyGenerator: () => Generator };

      const generator = monthlyGenerator();
      const input = new Date(2024, 1, 10, 12, 0, 0, 0); // February 2024
      const result = generator.generate(input);

      expect(result).toHaveLength(29);
      expectDateParts(result[0], 2024, 1, 1, 0, 0, 0, 0);
      expectDateParts(result[28], 2024, 1, 29, 0, 0, 0, 0);
    });
  });
});
