;(function () {
  const rawAlerts = Array.isArray(window.__dashlyAlerts) ? window.__dashlyAlerts
    : [];
  if (!rawAlerts.length) {
    return;
  }

  const host = document.getElementById('dashly-alerts');
  if (!host) {
    return;
  }

  const dismissedKey = 'dashly.alerts.dismissed';
  const animatedIds = new Set();

  const normalizedAlerts = rawAlerts
  .map((alert, index) => normalizeAlert(alert, index))
  .filter(Boolean);

  if (!normalizedAlerts.length) {
    host.hidden = true;
    return;
  }

  function update() {
    const now = new Date();
    const dismissed = loadDismissed(now);
    const activeAlerts = findActiveAlerts(normalizedAlerts, now, dismissed);

    if (!activeAlerts.length) {
      host.hidden = true;
      host.innerHTML = '';
      return;
    }

    host.hidden = false;
    host.innerHTML = '';
    for (const alert of activeAlerts) {
      host.appendChild(renderAlert(alert));
    }
    if (window.dashlyReplaceIcons) {
      window.dashlyReplaceIcons(host);
    }
  }

  update();
  const intervalId = setInterval(update, 60 * 1000);

  window.addEventListener('beforeunload', () => {
    clearInterval(intervalId);
  });

  function normalizeAlert(alert, index) {
    if (!alert || typeof alert !== 'object') {
      return null;
    }

    const cron = typeof alert.cron === 'string' ? alert.cron.trim() : '';
    if (!cron) {
      return null;
    }

    const cronParts = parseCron(cron);
    if (!cronParts) {
      return null;
    }

    const title = typeof alert.title === 'string' && alert.title.trim()
      ? alert.title.trim()
      : null;
    const message = typeof alert.message === 'string' && alert.message.trim()
      ? alert.message.trim()
      : null;

    if (!title || !message) {
      return null;
    }

    const enabled = alert.enabled !== false;
    if (!enabled) {
      return null;
    }

    const durationMinutes = Number.isFinite(alert.durationMinutes)
      ? Math.max(1, Math.round(alert.durationMinutes))
      : 120;

    const type = alert.type === 'warning' ? 'warning' : 'info';

    return {
      id: typeof alert.id === 'string' ? alert.id : `alert-${index}`,
      title,
      message,
      type,
      durationMinutes,
      cronParts
    };
  }

  function findActiveAlerts(alerts, now, dismissed) {
    const active = [];
    for (const alert of alerts) {
      if (dismissed[alert.id]) {
        continue;
      }
      if (isWithinWindow(alert, now)) {
        active.push(alert);
      }
    }

    return active;
  }

  function isWithinWindow(alert, now) {
    const maxScan = Math.min(alert.durationMinutes, 10080);
    for (let offset = 0; offset <= maxScan; offset += 1) {
      const candidate = new Date(now.getTime() - offset * 60 * 1000);
      if (cronMatches(alert.cronParts, candidate)) {
        return true;
      }
    }

    return false;
  }

  function parseCron(cron) {
    const parts = cron.split(/\s+/).filter(Boolean);
    if (parts.length !== 5) {
      return null;
    }

    const minute = parseField(parts[0], 0, 59);
    const hour = parseField(parts[1], 0, 23);
    const dayOfMonth = parseField(parts[2], 1, 31);
    const month = parseField(parts[3], 1, 12);
    const dayOfWeek = parseField(parts[4], 0, 6, normalizeDayOfWeek);

    return {
      minute,
      hour,
      dayOfMonth,
      month,
      dayOfWeek
    };
  }

  function parseField(field, min, max, mapper) {
    if (field === '*') {
      return null;
    }

    const values = new Set();
    const segments = field.split(',');

    for (const segmentRaw of segments) {
      const segment = segmentRaw.trim();
      if (!segment) {
        continue;
      }

      const stepParts = segment.split('/');
      const rangePart = stepParts[0];
      const step = stepParts.length > 1 ? parseInt(stepParts[1], 10) : 1;
      if (!Number.isFinite(step) || step <= 0) {
        continue;
      }

      if (rangePart === '*') {
        addRange(min, max, step, mapper, values);
        continue;
      }

      if (rangePart.includes('-')) {
        const [startRaw, endRaw] = rangePart.split('-');
        const start = parseInt(startRaw, 10);
        const end = parseInt(endRaw, 10);
        if (!Number.isFinite(start) || !Number.isFinite(end)) {
          continue;
        }
        addRange(start, end, step, mapper, values, min, max);
        continue;
      }

      const value = parseInt(rangePart, 10);
      if (!Number.isFinite(value)) {
        continue;
      }
      addRange(value, value, step, mapper, values, min, max);
    }

    return values.size ? values : null;
  }

  function addRange(start, end, step, mapper, values, min, max) {
    const rangeMin = Number.isFinite(min) ? min : start;
    const rangeMax = Number.isFinite(max) ? max : end;
    const actualStart = Math.max(rangeMin, Math.min(start, end));
    const actualEnd = Math.min(rangeMax, Math.max(start, end));

    for (let value = actualStart; value <= actualEnd; value += step) {
      const mapped = mapper ? mapper(value) : value;
      values.add(mapped);
    }
  }

  function normalizeDayOfWeek(value) {
    return value === 7 ? 0 : value;
  }

  function cronMatches(cronParts, date) {
    if (!cronParts) {
      return false;
    }

    const minuteMatch = fieldMatches(cronParts.minute, date.getMinutes());
    const hourMatch = fieldMatches(cronParts.hour, date.getHours());
    const monthMatch = fieldMatches(cronParts.month, date.getMonth() + 1);
    const domMatch = fieldMatches(cronParts.dayOfMonth, date.getDate());
    const dowMatch = fieldMatches(cronParts.dayOfWeek, date.getDay());

    let dayMatch = domMatch && dowMatch;
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
    const container = document.createElement('div');
    container.className = `dashly-alert ${alert.type}`;
    container.dataset.alertId = alert.id;
    if (alert.type === 'warning' && !animatedIds.has(alert.id)) {
      container.classList.add('animate');
      animatedIds.add(alert.id);
    }

    const content = document.createElement('div');
    content.className = 'alert-content';

    const title = document.createElement('span');
    title.className = 'alert-title';
    title.textContent = alert.title;

    const message = document.createElement('span');
    message.className = 'alert-message';
    message.textContent = alert.message;

    content.appendChild(title);
    content.appendChild(message);

    const dismiss = document.createElement('button');
    dismiss.type = 'button';
    dismiss.className = 'alert-dismiss';
    dismiss.setAttribute('aria-label', 'Dismiss alert');
    dismiss.innerHTML = '<icon name="clear"></icon>';

    container.appendChild(content);
    container.appendChild(dismiss);

    return container;
  }

  function loadDismissed(now) {
    const dismissed = {};
    try {
      const raw = localStorage.getItem(dismissedKey);
      if (!raw) {
        return dismissed;
      }
      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== 'object') {
        return dismissed;
      }
      Object.entries(parsed).forEach(([key, value]) => {
        const expiresAt = new Date(value);
        if (Number.isNaN(expiresAt.getTime())) {
          return;
        }
        if (expiresAt > now) {
          dismissed[key] = expiresAt.toISOString();
        }
      });
      localStorage.setItem(dismissedKey, JSON.stringify(dismissed));
    } catch {
      return dismissed;
    }
    return dismissed;
  }

  function storeDismissed(dismissed) {
    try {
      pruneDismissed(dismissed);
      localStorage.setItem(dismissedKey, JSON.stringify(dismissed));
    } catch {
      // Ignore storage errors.
    }
  }

  function pruneDismissed(dismissed) {
    const entries = Object.entries(dismissed);
    if (entries.length <= 200) {
      return;
    }
    entries
    .sort((a, b) => new Date(a[1]).getTime() - new Date(b[1]).getTime())
    .slice(0, entries.length - 200)
    .forEach(([key]) => {
      delete dismissed[key];
    });
  }

  host.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof Element)) {
      return;
    }
    const button = target.closest('.alert-dismiss');
    if (!button) {
      return;
    }
    const container = button.closest('.dashly-alert');
    if (!container) {
      return;
    }
    const alertId = container.dataset.alertId;
    const alert = normalizedAlerts.find(item => item.id === alertId);
    if (!alert) {
      container.remove();
      return;
    }
    const dismissed = loadDismissed(new Date());
    const expiresAt = new Date(Date.now() + alert.durationMinutes * 60 * 1000);
    dismissed[alert.id] = expiresAt.toISOString();
    storeDismissed(dismissed);
    container.remove();
    if (!host.querySelector('.dashly-alert')) {
      host.hidden = true;
    }
  });
})();
