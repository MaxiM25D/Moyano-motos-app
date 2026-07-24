export const SESSION_END_EVENT = "moyano:session-ended";

let sessionEndNotified = false;

export const notifySessionEnded = (reason = "expired") => {
  if (sessionEndNotified) return;
  sessionEndNotified = true;
  window.dispatchEvent(new CustomEvent(SESSION_END_EVENT, { detail: { reason } }));
};

export const resetSessionNotification = () => {
  sessionEndNotified = false;
};
