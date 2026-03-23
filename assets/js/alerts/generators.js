function dailyGenerator() {
  return {
    generate(date) {
      return [globalThis.startOfDay(date)];
    }
  }
}

function weeklyGenerator() {
  return {
    generate(date) {
      return globalThis.daysInRange(globalThis.startOfWeek(date), 7);
    }
  }
}

function monthlyGenerator() {
  return {
    generate(date) {
      var start = globalThis.startOfMonth(date);
      return globalThis.daysInRange(start, globalThis.daysInMonth(start));
    }
  }
}

function buildGenerator(schedule) {
  switch (schedule.frequency) {
    case "daily":
      return dailyGenerator();
    case "weekly":
      return weeklyGenerator();
    case "monthly":
      return monthlyGenerator();
  }
}

Object.assign(globalThis, {
  dailyGenerator,
  weeklyGenerator,
  monthlyGenerator,
  buildGenerator,
});
