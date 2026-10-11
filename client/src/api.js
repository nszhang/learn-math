// Tiny API client with JWT handling.
// BASE_URL lets the app live under a subpath (e.g. /learn-math/):
// built output calls /learn-math/api/..., dev output calls /api/...
// (which the Vite dev server proxies to :3001).
const BASE = (import.meta.env.BASE_URL || '/').replace(/\/$/, '');

let token = localStorage.getItem('mm_token') || null;

export function setToken(t) {
  token = t;
  if (t) localStorage.setItem('mm_token', t);
  else localStorage.removeItem('mm_token');
}

export async function api(method, path, body) {
  const res = await fetch(BASE + path, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: body ? JSON.stringify(body) : undefined
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.error || `Request failed (${res.status})`);
    err.status = res.status;
    throw err;
  }
  return data;
}
