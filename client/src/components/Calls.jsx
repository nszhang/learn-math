import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { api, apiKeepalive } from '../api.js';
import { onLiveEvent } from '../events.js';

/* Voice and video calls between people who may message each other.
   Browser-to-browser (WebRTC); the server only relays the set-up messages
   (invite / answer / ICE / decline / busy / end) over the live event stream.
   The caller writes the call into the conversation when it ends. */

// Public STUN servers let browsers discover their public address. Without a TURN relay,
// calls between some strict networks (e.g. some mobile carriers) may not connect.
const ICE_SERVERS = [{ urls: ['stun:stun.l.google.com:19302', 'stun:stun1.l.google.com:19302'] }];
const RING_MS = 35000;

const CallContext = createContext({ startCall: () => {}, inCall: false });
export const useCalls = () => useContext(CallContext);

// Floating call window: position/size are remembered per browser.
const RECT_KEY = 'mm_call_window';
const SIZES = [260, 400, 640];            // small / medium / large video widths
const MIN_W = 220, AUDIO_W = 280, EDGE = 8;
const loadRect = () => { try { return JSON.parse(localStorage.getItem(RECT_KEY)) || null; } catch { return null; } };
const saveRect = r => { try { localStorage.setItem(RECT_KEY, JSON.stringify(r)); } catch { /* storage unavailable */ } };
// set a media element's stream only when it changes — re-setting it (even to the same stream) restarts playback and flashes
const attach = (el, stream) => { if (el && stream && el.srcObject !== stream) el.srcObject = stream; };

const newCallId = () => 'call-' + Math.random().toString(36).slice(2, 12);
const fmt = s => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

// a soft two-tone ring, repeated while a call is ringing
function useRingtone(on) {
  useEffect(() => {
    if (!on) return;
    let ctx;
    try { ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch { return; }
    const ring = () => {
      [0, 0.45].forEach((t, i) => {
        const o = ctx.createOscillator(), g = ctx.createGain();
        o.frequency.value = i ? 660 : 880; o.type = 'sine';
        g.gain.setValueAtTime(0.0001, ctx.currentTime + t);
        g.gain.exponentialRampToValueAtTime(0.12, ctx.currentTime + t + 0.03);
        g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + t + 0.4);
        o.connect(g).connect(ctx.destination); o.start(ctx.currentTime + t); o.stop(ctx.currentTime + t + 0.42);
      });
    };
    ring();
    const t = setInterval(ring, 2000);
    return () => { clearInterval(t); ctx.close(); };
  }, [on]);
}

export function CallProvider({ me, toast, children }) {
  // call: { id, peer: { id, displayName }, video, role: 'caller' | 'callee', status: 'ringing' | 'incoming' | 'connecting' | 'active' }
  const [call, setCall] = useState(null);
  const [muted, setMuted] = useState(false);
  const [camOff, setCamOff] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [hasRemoteVideo, setHasRemoteVideo] = useState(false);
  const callRef = useRef(null); callRef.current = call;
  const pcRef = useRef(null), localRef = useRef(null), remoteRef = useRef(new MediaStream());
  const offerRef = useRef(null), pendingIce = useRef([]), ringTimer = useRef(null), connectedAt = useRef(null);
  const localVideo = useRef(null), remoteVideo = useRef(null), remoteAudio = useRef(null);

  const signal = (to, callId, type, data = null) => api('POST', '/api/calls/signal', { to, callId, type, data });

  const cleanup = useCallback((outcome = null) => {
    const c = callRef.current;
    clearTimeout(ringTimer.current);
    try { pcRef.current?.close(); } catch { /* already closed */ }
    pcRef.current = null;
    localRef.current?.getTracks().forEach(t => t.stop());
    localRef.current = null;
    remoteRef.current = new MediaStream();
    offerRef.current = null; pendingIce.current = [];
    // the caller records the call in the conversation
    if (c && c.role === 'caller' && outcome) {
      const secs = connectedAt.current ? Math.round((Date.now() - connectedAt.current) / 1000) : 0;
      api('POST', '/api/calls/log', { to: c.peer.id, video: c.video, outcome: connectedAt.current ? 'completed' : outcome, seconds: secs }).catch(() => {});
    }
    connectedAt.current = null;
    setCall(null); setMuted(false); setCamOff(false); setSeconds(0); setHasRemoteVideo(false);
  }, []);

  function makePeer(c) {
    const pc = new RTCPeerConnection({ iceServers: ICE_SERVERS });
    pc.onicecandidate = e => { if (e.candidate) signal(c.peer.id, c.id, 'ice', e.candidate.toJSON()).catch(() => {}); };
    pc.ontrack = e => {
      e.streams[0]?.getTracks().forEach(t => { if (!remoteRef.current.getTracks().includes(t)) remoteRef.current.addTrack(t); });
      if (e.track.kind === 'video') setHasRemoteVideo(true);
      attach(remoteVideo.current, remoteRef.current);
      attach(remoteAudio.current, remoteRef.current);
    };
    pc.onconnectionstatechange = () => {
      if (pc.connectionState === 'connected' && !connectedAt.current) {
        connectedAt.current = Date.now();
        setCall(x => (x ? { ...x, status: 'active' } : x));
      }
      if (pc.connectionState === 'failed') { toast('⚠️', "The call couldn't connect — your networks may be blocking it."); signal(c.peer.id, c.id, 'end').catch(() => {}); cleanup('missed'); }
    };
    pcRef.current = pc;
    return pc;
  }

  async function getMedia(video) {
    try { return await navigator.mediaDevices.getUserMedia({ audio: true, video: video ? { width: { ideal: 640 }, height: { ideal: 480 } } : false }); }
    catch (e) {
      if (video) { // no camera? fall back to voice
        try { const s = await navigator.mediaDevices.getUserMedia({ audio: true }); toast('📷', 'Camera not available — joining with voice only.'); return s; } catch { /* fall through */ }
      }
      toast('🎙️', e.name === 'NotAllowedError' ? 'Allow the microphone (and camera) in the browser to make calls.' : 'No microphone found for calling.');
      return null;
    }
  }

  const startCall = useCallback(async (peer, video) => {
    if (callRef.current) return toast('📞', 'You are already in a call.');
    if (!navigator.mediaDevices?.getUserMedia || typeof RTCPeerConnection === 'undefined') return toast('⚠️', "This browser can't make calls.");
    const c = { id: newCallId(), peer, video, role: 'caller', status: 'ringing' };
    setCall(c); callRef.current = c;
    const stream = await getMedia(video);
    if (!stream) return cleanup();
    localRef.current = stream;
    const pc = makePeer(c);
    stream.getTracks().forEach(t => pc.addTrack(t, stream));
    const offer = await pc.createOffer({ offerToReceiveAudio: true, offerToReceiveVideo: video });
    await pc.setLocalDescription(offer);
    try {
      const r = await signal(peer.id, c.id, 'invite', { video, sdp: pc.localDescription.toJSON() });
      if (!r.delivered) { toast('📵', `${peer.displayName} isn't online right now — try again later.`); return cleanup('unavailable'); }
    } catch (e) { toast('⚠️', e.message); return cleanup(); }
    ringTimer.current = setTimeout(() => {
      if (callRef.current?.id === c.id && callRef.current.status === 'ringing') {
        signal(peer.id, c.id, 'end').catch(() => {});
        toast('📵', `${peer.displayName} didn't answer.`);
        cleanup('missed');
      }
    }, RING_MS);
  }, [cleanup, toast]); // eslint-disable-line react-hooks/exhaustive-deps

  async function accept() {
    const c = callRef.current;
    if (!c || c.status !== 'incoming') return;
    setCall({ ...c, status: 'connecting' });
    const stream = await getMedia(c.video);
    if (!stream) { signal(c.peer.id, c.id, 'decline').catch(() => {}); return cleanup(); }
    localRef.current = stream;
    const pc = makePeer(c);
    stream.getTracks().forEach(t => pc.addTrack(t, stream));
    await pc.setRemoteDescription(offerRef.current);
    for (const cand of pendingIce.current) { try { await pc.addIceCandidate(cand); } catch { /* stale */ } }
    pendingIce.current = [];
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);
    signal(c.peer.id, c.id, 'answer', { sdp: pc.localDescription.toJSON() }).catch(() => {});
  }
  function decline() {
    const c = callRef.current;
    if (c) signal(c.peer.id, c.id, 'decline').catch(() => {});
    cleanup();
  }
  function hangUp() {
    const c = callRef.current;
    if (c) signal(c.peer.id, c.id, 'end').catch(() => {});
    cleanup(c?.status === 'ringing' ? 'missed' : 'completed');
  }

  // incoming call signals
  useEffect(() => onLiveEvent(async ev => {
    if (ev.type !== 'call') return;
    const c = callRef.current;
    if (ev.signal === 'invite') {
      if (c) { signal(ev.from, ev.callId, 'busy').catch(() => {}); return; }
      offerRef.current = ev.data?.sdp; pendingIce.current = [];
      const nc = { id: ev.callId, peer: { id: ev.from, displayName: ev.fromName }, video: !!ev.data?.video, role: 'callee', status: 'incoming' };
      setCall(nc); callRef.current = nc;
      ringTimer.current = setTimeout(() => { if (callRef.current?.id === nc.id && callRef.current.status === 'incoming') cleanup(); }, RING_MS + 2000);
      return;
    }
    if (!c || c.id !== ev.callId) return; // not about this call
    if (ev.signal === 'answer' && pcRef.current) {
      clearTimeout(ringTimer.current);
      setCall(x => ({ ...x, status: 'connecting' }));
      await pcRef.current.setRemoteDescription(ev.data.sdp);
      for (const cand of pendingIce.current) { try { await pcRef.current.addIceCandidate(cand); } catch { /* stale */ } }
      pendingIce.current = [];
    } else if (ev.signal === 'ice' && ev.data) {
      if (pcRef.current?.remoteDescription) { try { await pcRef.current.addIceCandidate(ev.data); } catch { /* stale */ } }
      else pendingIce.current.push(ev.data);
    } else if (ev.signal === 'decline') { toast('📵', `${c.peer.displayName} can't talk right now.`); cleanup('declined'); }
    else if (ev.signal === 'busy') { toast('📵', `${c.peer.displayName} is on another call.`); cleanup('missed'); }
    else if (ev.signal === 'end') { if (c.status === 'incoming') toast('📵', `Missed call from ${c.peer.displayName}`); cleanup('completed'); }
  }), [cleanup, toast]); // eslint-disable-line react-hooks/exhaustive-deps

  // call timer
  useEffect(() => {
    if (call?.status !== 'active') return;
    const t = setInterval(() => setSeconds(Math.round((Date.now() - connectedAt.current) / 1000)), 1000);
    return () => clearInterval(t);
  }, [call?.status]);
  // attach streams once the elements exist (and again after the window is restored from minimised)
  useEffect(() => {
    attach(localVideo.current, localRef.current);
    attach(remoteVideo.current, remoteRef.current);
    attach(remoteAudio.current, remoteRef.current);
  });
  // hang up if the tab closes mid-call
  useEffect(() => {
    const bye = () => { const c = callRef.current; if (c) apiKeepalive('/api/calls/signal', { to: c.peer.id, callId: c.id, type: 'end' }); };
    window.addEventListener('pagehide', bye);
    return () => window.removeEventListener('pagehide', bye);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  // logging out ends any call
  useEffect(() => () => { if (callRef.current) hangUp(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useRingtone(call?.status === 'incoming' || call?.status === 'ringing');

  function toggleMute() {
    const on = !muted;
    localRef.current?.getAudioTracks().forEach(t => { t.enabled = !on; });
    setMuted(on);
  }
  function toggleCam() {
    const off = !camOff;
    localRef.current?.getVideoTracks().forEach(t => { t.enabled = !off; });
    setCamOff(off);
  }

  /* ---------- floating window: drag, resize, minimise ---------- */
  const [rect, setRect] = useState(null);     // { x, y, w } in px (top-left corner)
  const [minimized, setMinimized] = useState(false);
  const winRef = useRef(null), gesture = useRef(null);
  const isVideoWin = !!(call && call.video && call.status !== 'incoming');
  const clampRect = useCallback(r => {
    const vw = window.innerWidth, vh = window.innerHeight;
    const w = isVideoWin && !minimized ? Math.max(MIN_W, Math.min(r.w, vw - 2 * EDGE)) : Math.min(AUDIO_W, vw - 2 * EDGE);
    const h = winRef.current?.offsetHeight || 200;
    return { w: isVideoWin ? Math.max(MIN_W, Math.min(r.w, vw - 2 * EDGE)) : r.w, drawW: w,
      x: Math.max(EDGE, Math.min(r.x, vw - w - EDGE)), y: Math.max(EDGE, Math.min(r.y, vh - h - EDGE)) };
  }, [isVideoWin, minimized]);
  // place the window when a call starts: where it was last time, else bottom-right
  useEffect(() => {
    if (!call) { setRect(null); setMinimized(false); return; }
    setRect(r => r || (() => {
      const saved = loadRect(), vw = window.innerWidth, vh = window.innerHeight;
      const w = saved?.w || Math.min(SIZES[1], vw - 32);
      return saved ? { x: saved.x, y: saved.y, w } : { x: vw - Math.min(w, AUDIO_W) - 20, y: vh - 260, w };
    })());
  }, [call?.id]); // eslint-disable-line react-hooks/exhaustive-deps
  // keep it fully on screen whenever its size changes (video starts, minimise, browser resize)
  useLayoutEffect(() => {
    if (!rect) return;
    const c = clampRect(rect);
    if (c.x !== rect.x || c.y !== rect.y || c.w !== rect.w) setRect({ x: c.x, y: c.y, w: c.w });
  });
  useEffect(() => {
    const onResize = () => setRect(r => (r ? { ...r } : r));
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  function startDrag(e, kind) {
    if (kind === 'move' && e.target.closest('button')) return;
    e.preventDefault();
    e.currentTarget.setPointerCapture?.(e.pointerId);
    gesture.current = { kind, px: e.clientX, py: e.clientY, start: rect };
  }
  function onDrag(e) {
    const g = gesture.current;
    if (!g) return;
    const dx = e.clientX - g.px, dy = e.clientY - g.py;
    if (g.kind === 'move') setRect(clampRect({ ...g.start, x: g.start.x + dx, y: g.start.y + dy }));
    else setRect(clampRect({ ...g.start, w: g.start.w + dx }));
  }
  function endDrag() {
    if (!gesture.current) return;
    gesture.current = null;
    setRect(r => { if (r) saveRect({ x: r.x, y: r.y, w: r.w }); return r; });
  }
  // keyboard: arrows move the window, +/- resize it
  function onHeaderKey(e) {
    const step = e.shiftKey ? 60 : 20, moves = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] };
    if (moves[e.key]) { e.preventDefault(); const [dx, dy] = moves[e.key]; setRect(r => { const n = clampRect({ ...r, x: r.x + dx, y: r.y + dy }); saveRect({ x: n.x, y: n.y, w: n.w }); return { x: n.x, y: n.y, w: n.w }; }); }
    else if ((e.key === '+' || e.key === '=' || e.key === '-') && isVideoWin) { e.preventDefault(); setRect(r => { const n = clampRect({ ...r, w: r.w + (e.key === '-' ? -60 : 60) }); saveRect({ x: n.x, y: n.y, w: n.w }); return { x: n.x, y: n.y, w: n.w }; }); }
  }
  function cycleSize() {
    setRect(r => {
      const next = SIZES.find(sz => sz > r.w + 10) || SIZES[0];
      const n = clampRect({ ...r, w: Math.min(next, window.innerWidth - 2 * EDGE) });
      saveRect({ x: n.x, y: n.y, w: n.w });
      return { x: n.x, y: n.y, w: n.w };
    });
  }

  const status = call && {
    ringing: `Calling ${call.peer.displayName}…`, incoming: `${call.peer.displayName} is calling`,
    connecting: 'Connecting…', active: fmt(seconds)
  }[call.status];
  const showVideo = isVideoWin;
  const drawn = rect && clampRect(rect);
  const initial = call?.peer.displayName.slice(0, 1).toUpperCase();

  return (
    <CallContext.Provider value={{ startCall, inCall: !!call, meId: me?.user?.id }}>
      {children}
      {call && rect && (
        <div ref={winRef} className={'call-float' + (call.status === 'incoming' ? ' incoming' : '') + (showVideo && !minimized ? ' video' : '') + (minimized ? ' min' : '')}
          style={{ left: drawn.x, top: drawn.y, width: drawn.drawW }}
          role="dialog" aria-label={`Call with ${call.peer.displayName}: ${status}`}
          onPointerMove={onDrag} onPointerUp={endDrag} onPointerCancel={endDrag}>
          {/* remote sound always plays through this element, so minimising never cuts the audio */}
          <audio ref={remoteAudio} autoPlay />
          <div className="call-bar" tabIndex={0} onPointerDown={e => startDrag(e, 'move')} onKeyDown={onHeaderKey}
            title="Drag to move (or use the arrow keys)" aria-label="Call window — drag or use arrow keys to move">
            <span className="call-grip" aria-hidden="true">⠿</span>
            <span className="call-title"><strong>{call.video ? '🎥' : '📞'} {call.peer.displayName}</strong> <span className="call-status">{status}</span></span>
            {minimized && call.status !== 'incoming' && <button type="button" className="call-mini hang" onClick={hangUp} aria-label="Hang up">✕</button>}
            {showVideo && !minimized && <button type="button" className="call-mini" onClick={cycleSize} aria-label="Change window size" title="Change size">⤢</button>}
            {call.status !== 'incoming' && (
              <button type="button" className="call-mini" onClick={() => setMinimized(m => !m)} aria-label={minimized ? 'Restore call window' : 'Minimise call window'} title={minimized ? 'Restore' : 'Minimise'}>{minimized ? '▢' : '–'}</button>
            )}
          </div>
          {!minimized && (<>
            {showVideo ? (
              <div className="call-stage">
                <video ref={remoteVideo} className="call-remote" autoPlay playsInline muted />
                {!hasRemoteVideo && <div className="call-avatar big">{initial}</div>}
                <video ref={localVideo} className={'call-local' + (camOff ? ' off' : '')} autoPlay playsInline muted />
              </div>
            ) : (
              <div className="call-voice"><div className={'call-avatar big' + (call.status === 'active' ? '' : ' pulse')}>{initial}</div></div>
            )}
            <div className="call-controls">
              {call.status === 'incoming' ? (<>
                <button type="button" className="call-btn accept" onClick={accept} aria-label="Accept call">{call.video ? '🎥' : '📞'}</button>
                <button type="button" className="call-btn hang" onClick={decline} aria-label="Decline call">✕</button>
              </>) : (<>
                <button type="button" className={'call-btn' + (muted ? ' off' : '')} onClick={toggleMute} aria-pressed={muted} aria-label={muted ? 'Unmute' : 'Mute'}>{muted ? '🔇' : '🎙️'}</button>
                {call.video && <button type="button" className={'call-btn' + (camOff ? ' off' : '')} onClick={toggleCam} aria-pressed={camOff} aria-label={camOff ? 'Turn camera on' : 'Turn camera off'}>{camOff ? '🚫' : '📷'}</button>}
                <button type="button" className="call-btn hang" onClick={hangUp} aria-label="Hang up">✕</button>
              </>)}
            </div>
            {showVideo && <div className="call-resize" onPointerDown={e => startDrag(e, 'resize')} title="Drag to resize" aria-hidden="true" />}
          </>)}
        </div>
      )}
    </CallContext.Provider>
  );
}
