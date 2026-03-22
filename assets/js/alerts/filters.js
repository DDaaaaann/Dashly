// Conditional import for Node.js (ignore in browser)
var startOfDay, daysInRange, startOfWeek, startOfMonth, daysInMonth,
  getWeekdayName;

if (typeof require !== 'undefined') {
  var utils = require('./utils.js');
  startOfDay = utils.startOfDay;
  daysInRange = utils.daysInRange;
  startOfWeek = utils.startOfWeek;
  startOfMonth = utils.startOfMonth;
  daysInMonth = utils.daysInMonth;
  getWeekdayName = utils.getWeekdayName;
}

const dayOfMonthFilter = ({dayOfMonth}) => ({
  apply: date => date.getDate() === dayOfMonth
});

const dayOfWeekFilter = ({dayOfWeek}) => ({
  appliesTo: dayOfWeek => dayOfWeek !== undefined,
  apply: date => date.getDay() === dayOfWeek
});

function daysOfMonthFilter(schedule) {
  const daysOfMonth = schedule.daysOfMonth;
  return {
    applies() {
      return Array.isArray(schedule.daysOfMonth) && schedule.daysOfMonth.length
        > 0;
    },
    apply(date) {
      return daysOfMonth.includes(date.getDate());
    }
  };
}

function daysOfWeekFilter(schedule) {
  const daysOfWeek = schedule.daysOfWeek;
  return {
    applies() {
      return daysOfWeek && daysOfWeek.length > 0;
    },
    apply(date) {
      return daysOfWeek.includes(getWeekdayName(date));
    }
  };
}

function buildFilters(schedule) {
  const filters = []

  if (daysOfWeekFilter(schedule).applies()) {
    filters.push(daysOfWeekFilter(schedule))
  }

  if (daysOfMonthFilter(schedule).applies()) {
    filters.push(daysOfMonthFilter(schedule))
  }
  return filters
}

// Export voor Node.js/Jest (negeer in browser)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    buildFilters,
  }
}
