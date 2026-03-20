function daysInRange(start, count) {

  return Array.from(
    {length: count},
    (_, i) => addDays(start, i)
  );
}

function addDays(date, days) {

  const d = new Date(date);

  d.setDate(d.getDate() + days);

  return startOfDay(d);
}

function startOfDay(date) {

  const d = new Date(date);

  d.setHours(0, 0, 0, 0);

  return d;
}

function startOfWeek(date) {

  const d = startOfDay(date);

  const diff = (d.getDay() + 6) % 7; // Monday=0

  return addDays(d, -diff);
}

function startOfMonth(date) {

  const d = startOfDay(date);

  d.setDate(1);

  return d;
}

function daysInMonth(date) {

  return new Date(
    date.getFullYear(),
    date.getMonth() + 1,
    0
  ).getDate();
}

function getWeekdayName(date) {
  return [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday"
  ][date.getDay()]
}

// Export voor Node.js/Jest (negeer in browser)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    daysInRange,
    addDays,
    startOfDay,
    startOfWeek,
    startOfMonth,
    daysInMonth,
    getWeekdayName,
  }
}

