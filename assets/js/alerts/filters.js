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
      return daysOfWeek.includes(globalThis.getWeekdayName(date));
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

globalThis.buildFilters = buildFilters;
