var alertsHost = document.getElementById("alerts");
var dismissedKey = "alerts.dismissed";
var animatedIds = new Set();

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
    alertsHost.hidden = true;
    alertsHost.innerHTML = "";
    return;
  }

  alertsHost.hidden = false;
  alertsHost.innerHTML = "";
  activeAlerts.forEach(function (alert) {
    alertsHost.appendChild(renderAlert(alert));
  });

  if (window.dashlyReplaceIcons) {
    window.dashlyReplaceIcons(alertsHost);
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
  if (!alertsHost.querySelector(".alert")) {
    alertsHost.hidden = true;
  }
}

if (alertsHost) {
  var normalizedAlerts = alerts.map(normalizeAlert);

  updateAlerts(normalizedAlerts);

  setInterval(function () {
    updateAlerts(normalizedAlerts);
  }, 60 * 1000);

  alertsHost.addEventListener("click", function (event) {
    handleDismiss(event, normalizedAlerts);
  });
}
