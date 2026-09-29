function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function getVisitorId() {
  let id = localStorage.getItem('visitor_id');
  if (!id) {
    id = uuid();
    localStorage.setItem('visitor_id', id);
  }
  return id;
}

const SESSION_TTL_MS = 30 * 60 * 1000;

export function getSessionId() {
  const stored = sessionStorage.getItem('session_id');
  const lastActive = Number(sessionStorage.getItem('session_last_active') || 0);
  const now = Date.now();

  if (stored && now - lastActive < SESSION_TTL_MS) {
    sessionStorage.setItem('session_last_active', String(now));
    return stored;
  }

  const id = uuid();
  sessionStorage.setItem('session_id', id);
  sessionStorage.setItem('session_last_active', String(now));
  return id;
}
