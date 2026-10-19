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

const authHeader = () => (token ? { Authorization: `Bearer ${token}` } : {});
async function failOn(res) {
  if (res.ok) return res;
  const data = await res.json().catch(() => ({}));
  const err = new Error(data.error || `Request failed (${res.status})`);
  err.status = res.status;
  throw err;
}

/** Upload a file/blob as the raw request body (e.g. a picture). */
export async function apiUpload(path, blob) {
  const res = await fetch(BASE + path, { method: 'POST', headers: { 'Content-Type': blob.type || 'application/octet-stream', ...authHeader() }, body: blob });
  return (await failOn(res)).json();
}

/** Fetch a protected file (e.g. a chat picture) as a Blob. */
export async function apiBlob(path) {
  return (await failOn(await fetch(BASE + path, { headers: authHeader() }))).blob();
}

/** Open the live event stream (Server-Sent Events read with fetch, so the token stays in a header). */
export function apiStream(path, signal) {
  return fetch(BASE + path, { headers: { Accept: 'text/event-stream', ...authHeader() }, signal });
}

/** Fire-and-forget POST that survives the page closing (e.g. "call ended"). */
export function apiKeepalive(path, body) {
  try { fetch(BASE + path, { method: 'POST', keepalive: true, headers: { 'Content-Type': 'application/json', ...authHeader() }, body: JSON.stringify(body) }); } catch { /* ignore */ }
}
