import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
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
      if (remoteVideo.current) remoteVideo.current.srcObject = remoteRef.current;
      if (remoteAudio.current) remoteAudio.current.srcObject = remoteRef.current;
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
  // attach streams once the elements exist
  useEffect(() => {
    if (localVideo.current && localRef.current) localVideo.current.srcObject = localRef.current;
    if (remoteVideo.current) remoteVideo.current.srcObject = remoteRef.current;
    if (remoteAudio.current) remoteAudio.current.srcObject = remoteRef.current;
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

  const status = call && {
    ringing: `Calling ${call.peer.displayName}…`, incoming: `${call.peer.displayName} is calling`,
    connecting: 'Connecting…', active: fmt(seconds)
  }[call.status];
  const showVideo = call && call.video && call.status !== 'incoming';

  return (
    <CallContext.Provider value={{ startCall, inCall: !!call, meId: me?.user?.id }}>
      {children}
      {call && (
        <div className={'call-layer' + (call.status === 'incoming' ? ' incoming' : '') + (showVideo ? ' video' : '')} role="dialog" aria-modal="true" aria-label={status}>
          <div className="call-card">
            {showVideo ? (
              <div className="call-stage">
                <video ref={remoteVideo} className="call-remote" autoPlay playsInline />
                {!hasRemoteVideo && <div className="call-avatar big">{call.peer.displayName.slice(0, 1).toUpperCase()}</div>}
                <video ref={localVideo} className={'call-local' + (camOff ? ' off' : '')} autoPlay playsInline muted />
              </div>
            ) : (
              <div className="call-avatar big pulse">{call.peer.displayName.slice(0, 1).toUpperCase()}</div>
            )}
            {!showVideo && <audio ref={remoteAudio} autoPlay />}
            <div className="call-info">
              <strong>{call.video ? '🎥' : '📞'} {call.peer.displayName}</strong>
              <span className="muted">{status}</span>
            </div>
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
          </div>
        </div>
      )}
    </CallContext.Provider>
  );
}
