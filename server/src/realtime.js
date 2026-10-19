// Live server → browser events over Server-Sent Events (one process, in memory).
// Used for instant chat messages and for setting up calls (WebRTC signalling).
const clients = new Map(); // userId → Set of open responses

export function addClient(uid, res) {
  if (!clients.has(uid)) clients.set(uid, new Set());
  clients.get(uid).add(res);
  return () => {
    const set = clients.get(uid);
    if (!set) return;
    set.delete(res);
    if (!set.size) clients.delete(uid);
  };
}

/** Send an event to every open tab of a user. Returns how many tabs received it. */
export function emit(uid, event) {
  const set = clients.get(uid);
  if (!set) return 0;
  const line = `data: ${JSON.stringify(event)}\n\n`;
  for (const res of set) { try { res.write(line); } catch { /* closed */ } }
  return set.size;
}

export const isOnline = uid => (clients.get(uid)?.size || 0) > 0;
