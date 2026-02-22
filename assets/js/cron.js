function parseCron(cron) {
  var parts = cron.split(/\s+/).filter(Boolean);
  var minute = parseField(parts[0], 0, 59);
  var hour = parseField(parts[1], 0, 23);
  var dayOfMonth = parseField(parts[2], 1, 31);
  var month = parseField(parts[3], 1, 12);
  var dayOfWeek = parseField(parts[4], 0, 6, normalizeDayOfWeek);

  return {
    minute: minute,
    hour: hour,
    dayOfMonth: dayOfMonth,
    month: month,
    dayOfWeek: dayOfWeek
  };
}

function parseField(field, min, max, mapper) {
  if (field === "*") {
    return null;
  }

  var values = new Set();
  var segments = field.split(",");

  segments.forEach(function (segmentRaw) {
    var segment = segmentRaw.trim();
    if (!segment) {
      return;
    }

    var stepParts = segment.split("/");
    var rangePart = stepParts[0];
    var step = stepParts.length > 1 ? parseInt(stepParts[1], 10) : 1;

    if (rangePart === "*") {
      addRange(min, max, step, mapper, values);
      return;
    }

    if (rangePart.includes("-")) {
      var bounds = rangePart.split("-");
      addRange(parseInt(bounds[0], 10), parseInt(bounds[1], 10), step, mapper,
        values, min, max);
      return;
    }

    addRange(parseInt(rangePart, 10), parseInt(rangePart, 10), step, mapper,
      values, min, max);
  });

  return values.size ? values : null;
}

function addRange(start, end, step, mapper, values, min, max) {
  var rangeMin = Number.isFinite(min) ? min : start;
  var rangeMax = Number.isFinite(max) ? max : end;
  var actualStart = Math.max(rangeMin, Math.min(start, end));
  var actualEnd = Math.min(rangeMax, Math.max(start, end));

  for (var value = actualStart; value <= actualEnd; value += step) {
    values.add(mapper ? mapper(value) : value);
  }
}

function normalizeDayOfWeek(value) {
  return value === 7 ? 0 : value;
}

function cronMatches(cronParts, date) {
  var minuteMatch = fieldMatches(cronParts.minute, date.getMinutes());
  var hourMatch = fieldMatches(cronParts.hour, date.getHours());
  var monthMatch = fieldMatches(cronParts.month, date.getMonth() + 1);
  var domMatch = fieldMatches(cronParts.dayOfMonth, date.getDate());
  var dowMatch = fieldMatches(cronParts.dayOfWeek, date.getDay());

  var dayMatch = domMatch && dowMatch;
  if (cronParts.dayOfMonth && cronParts.dayOfWeek) {
    dayMatch = domMatch || dowMatch;
  }

  return minuteMatch && hourMatch && monthMatch && dayMatch;
}

function fieldMatches(fieldSet, value) {
  if (!fieldSet) {
    return true;
  }
  return fieldSet.has(value);
}
