var alertsElement = document.getElementById("alerts");
var dismissedKey = "alerts.dismissed";
var animatedIds = new Set();

const refreshInterval = 60 * 1000;

const normalizedAlerts = alerts
.map((alert, index) => normalizeAlert(alert, index))
.filter(Boolean);

function normalizeAlert(alert, index) {
  var cronParts = parseCron(alert.cron);
  return {
    id: alert.id || "alert-" + index,
    title: alert.title,
    message: alert.message || "",
    type: alert.type === "warning" ? "warning" : "info",
    durationMinutes: alert.durationMinutes ? Math.max(1,
      Math.round(alert.durationMinutes)) : 120,
    cronParts: cronParts
  };
}

function updateAlerts(normalizedAlerts) {
  var now = new Date();
  var dismissed = loadDismissed(now);
  var activeAlerts = findActiveAlerts(normalizedAlerts, now, dismissed);

  if (!activeAlerts.length) {
    alertsElement.hidden = true;
    alertsElement.innerHTML = "";
    return;
  }

  alertsElement.hidden = false;
  alertsElement.innerHTML = "";
  activeAlerts.forEach(function (alert) {
    alertsElement.appendChild(renderAlert(alert));
  });

  if (window.dashlyReplaceIcons) {
    window.dashlyReplaceIcons(alertsElement);
  }
}

function findActiveAlerts(alerts, now, dismissed) {
  return alerts.filter(function (alert) {
    if (dismissed[alert.id]) {
      return false;
    }
    return isWithinWindow(alert, now);
  });
}

function isWithinWindow(alert, now) {
  var maxScan = Math.min(alert.durationMinutes, 10080);
  for (var offset = 0; offset <= maxScan; offset += 1) {
    var candidate = new Date(now.getTime() - offset * 60 * 1000);
    if (cronMatches(alert.cronParts, candidate)) {
      return true;
    }
  }
  return false;
}

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

function renderAlert(alert) {
  var container = document.createElement("div");
  container.className = "alert " + alert.type;
  container.dataset.alertId = alert.id;
  if (alert.type === "warning" && !animatedIds.has(alert.id)) {
    container.classList.add("animate");
    animatedIds.add(alert.id);
  }

  var content = document.createElement("div");
  content.className = "alert-content";

  var title = document.createElement("span");
  title.className = "alert-title";
  title.textContent = alert.title;

  content.appendChild(title);

  if (alert.message) {
    var message = document.createElement("span");
    message.className = "alert-message";
    message.textContent = alert.message;
    content.appendChild(message);
  }

  var dismiss = document.createElement("button");
  dismiss.type = "button";
  dismiss.className = "alert-dismiss";
  dismiss.setAttribute("aria-label", "Dismiss alert");
  dismiss.innerHTML = "<icon name=\"clear\"></icon>";

  container.appendChild(content);
  container.appendChild(dismiss);

  return container;
}

function loadDismissed(now) {
  var dismissed = {};
  var raw = localStorage.getItem(dismissedKey);
  if (!raw) {
    return dismissed;
  }
  var parsed = JSON.parse(raw);
  Object.entries(parsed).forEach(function (entry) {
    var key = entry[0];
    var value = entry[1];
    var expiresAt = new Date(value);
    if (expiresAt > now) {
      dismissed[key] = expiresAt.toISOString();
    }
  });
  localStorage.setItem(dismissedKey, JSON.stringify(dismissed));
  return dismissed;
}

function storeDismissed(dismissed) {
  pruneDismissed(dismissed);
  localStorage.setItem(dismissedKey, JSON.stringify(dismissed));
}

function pruneDismissed(dismissed) {
  var entries = Object.entries(dismissed);
  if (entries.length <= 200) {
    return;
  }
  entries
  .sort(function (a, b) {
    return new Date(a[1]).getTime() - new Date(b[1]).getTime();
  })
  .slice(0, entries.length - 200)
  .forEach(function (entry) {
    delete dismissed[entry[0]];
  });
}

function handleDismiss(event, normalizedAlerts) {
  var button = event.target.closest(".alert-dismiss");
  if (!button) {
    return;
  }
  var container = button.closest(".alert");
  var alertId = container.dataset.alertId;
  var alert = normalizedAlerts.find(function (item) {
    return item.id === alertId;
  });
  if (!alert) {
    container.remove();
    return;
  }
  var dismissed = loadDismissed(new Date());
  var expiresAt = new Date(Date.now() + alert.durationMinutes * 60 * 1000);
  dismissed[alert.id] = expiresAt.toISOString();
  storeDismissed(dismissed);
  container.remove();
  if (!alertsElement.querySelector(".alert")) {
    alertsElement.hidden = true;
  }
}

alertsElement.addEventListener("click", function (event) {
  handleDismiss(event, normalizedAlerts);
});

updateAlerts(normalizedAlerts);

setInterval(() => {
  updateAlerts(normalizedAlerts);
}, refreshInterval);

