// Conditional import for Node.js (ignore in browser)
var daysInRange, startOfDay, startOfWeek, startOfMonth, daysInMonth,
  getWeekdayName;

if (typeof require !== 'undefined') {
  var utils = require('./utils.js');
  daysInRange = utils.daysInRange;
  startOfDay = utils.startOfDay;
  startOfWeek = utils.startOfWeek;
  startOfMonth = utils.startOfMonth;
  daysInMonth = utils.daysInMonth;
  getWeekdayName = utils.getWeekdayName;
}

function dailyGenerator() {
  return {
    generate(date) {
      return [startOfDay(date)];
    }
  }
}

function weeklyGenerator() {
  return {
    generate(date) {
      return daysInRange(startOfWeek(date), 7);
    }
  }
}

function monthlyGenerator() {
  return {
    generate(date) {
      var start = startOfMonth(date);
      return daysInRange(start, daysInMonth(start));
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

// Export voor Node.js/Jest (negeer in browser)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    dailyGenerator,
    weeklyGenerator,
    monthlyGenerator,
    buildGenerator,
  }
}