/**
 * schedule-engine.js
 *
 * RRULE-achtige recurrence engine voor Dashly DSL.
 *
 * Pipeline:
 *
 * 1. Generators → maken candidate dates
 * 2. Filters → verwijderen candidates
 * 3. Selectors → selecteren uit candidates (position)
 * 4. Resolver → past time + duration toe
 *
 * position werkt zoals RRULE BYSETPOS
 */

function isScheduleActive(schedule, now = new Date()) {

  return pipeline(schedule)
  .build()
  .generate(now)
  .filter()
  .isNow(now)
}

function pipeline(schedule) {
  let generator;
  let filters = [];
  let occurrences = [];
  return {

    build() {
      generator = globalThis.buildGenerator(schedule);
      filters = globalThis.buildFilters(schedule);
      return this;
    },
    generate(now) {
      occurrences = generator.generate(now);
      return this;
    },
    filter() {
      occurrences = filters.reduce(
        (list, filter) =>
          list.filter(filter.apply),

        occurrences
      )

      return this;
    },
    isNow(now) {
      return applyTime(schedule, occurrences)
      .some(d => isNow(schedule, d, now));
    },
    get() {
      return occurrences;
    }

  };
}

function isNow(schedule, occurrence, now = new Date()) {
  const duration = schedule.durationMinutes ?? 120
  const occurrenceEnd = new Date(occurrence.getTime() + duration * 60000)
  return now >= occurrence && now < occurrenceEnd
}

function applyTime(schedule, dates) {

  if (!schedule.time) {
    return dates;
  }

  const [hour, minute] =
    schedule.time.split(":").map(Number);

  return dates.map(date => {

    date.setHours(hour);
    date.setMinutes(minute);
    date.setSeconds(0);
    date.setMilliseconds(0);

    return date;
  });
}

globalThis.isScheduleActive = isScheduleActive;
