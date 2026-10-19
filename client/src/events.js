// Live events from the server (new messages, call signals). One connection per tab,
// reconnecting with back-off; components subscribe with onLiveEvent().
import { apiStream } from './api.js';

const listeners = new Set();
let stopCurrent = null;

export function onLiveEvent(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function startLiveEvents() {
  stopLiveEvents();
  let stopped = false, ctrl = null, delay = 1000;
  (async () => {
    while (!stopped) {
      try {
        ctrl = new AbortController();
        const res = await apiStream('/api/events', ctrl.signal);
        if (res.status === 401) { stopped = true; break; } // logged out / expired
        if (!res.ok || !res.body) throw new Error('events ' + res.status);
        delay = 1000;
        const reader = res.body.getReader(), dec = new TextDecoder();
        let buf = '';
        for (;;) {
          const { value, done } = await reader.read();
          if (done) break;
          buf += dec.decode(value, { stream: true });
          let i;
          while ((i = buf.indexOf('\n\n')) >= 0) {
            const chunk = buf.slice(0, i); buf = buf.slice(i + 2);
            if (!chunk.startsWith('data: ')) continue; // heartbeat
            let ev;
            try { ev = JSON.parse(chunk.slice(6)); } catch { continue; }
            listeners.forEach(fn => { try { fn(ev); } catch (e) { console.error(e); } });
          }
        }
      } catch { /* network drop or abort — retry below */ }
      if (stopped) break;
      await new Promise(r => setTimeout(r, delay));
      delay = Math.min(delay * 2, 30000);
    }
  })();
  stopCurrent = () => { stopped = true; ctrl?.abort(); };
}

export function stopLiveEvents() {
  stopCurrent?.();
  stopCurrent = null;
}
