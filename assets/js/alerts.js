var alertsElement = document.getElementById("alerts");
var alertElements = alertsElement.querySelectorAll(".alert");

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

function isActive(alert, now) {
  return Math.random() < 0.5;
}

renderAlerts();

setInterval(function () {
  renderAlerts();
}, 60 * 1000);