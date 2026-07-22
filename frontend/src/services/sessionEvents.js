export const SESSION_END_EVENT = "moyano:session-ended";
export const SESSION_WARNING_MS = 5 * 60 * 1000;

let sessionEndNotified = false;

export const getTokenExpiration = (token) => {
  try {
    const payload = token.split(".")[1];
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const normalized = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");
    const decoded = JSON.parse(atob(normalized));
    return Number(decoded.exp) * 1000;
  } catch {
    return 0;
  }
};

export const getSessionEndReason = (expiresAt, now = Date.now()) => {
  const remaining = Number(expiresAt) - Number(now);
  if (remaining <= 0) return "expired";
  if (remaining <= SESSION_WARNING_MS) return "expiring";
  return null;
};

export const notifySessionEnded = (reason = "expired") => {
  if (sessionEndNotified) return;
  sessionEndNotified = true;
  window.dispatchEvent(new CustomEvent(SESSION_END_EVENT, { detail: { reason } }));
};

export const resetSessionNotification = () => {
  sessionEndNotified = false;
};
