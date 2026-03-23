var timeout = (60 - new Date().getSeconds()) * 1000;
var alertsElement = document.getElementById("alerts");
var alertElements = alertsElement ? alertsElement.querySelectorAll(".alert")
  : [];

function renderAlerts() {
  var now = new Date();
  var allInactive = true;

  alertElements.forEach((alertElement) => {
    var active = isActive(alertElement, now);
    alertElement.hidden = !active;
    allInactive = allInactive && !active;
  });

  alertsElement.hidden = allInactive;
}

function isActive(alertElement, now) {
  var alert = findAlert(alertElement.dataset.alertId);
  return Boolean(alert) && globalThis.isScheduleActive(alert.schedule, now);
}

function findAlert(alertId) {
  return globalThis.alerts.find((alert) => (alert.id === alertId))
}

if (alertsElement) {
  renderAlerts();
  setTimeout(() => {
    renderAlerts();
    setInterval(() => renderAlerts(), 60 * 1000);
  }, timeout);
}
