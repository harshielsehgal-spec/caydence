/**
 * LiveDrillSession.tsx — Live webcam analysis for pushup, bicep, squat
 * Route: /fitness/drills/:drillKey/live
 * Mirrors PushupLive.tsx pattern exactly — react-webcam + WebSocket
 */

import { useEffect, useRef, useState, useCallback } from "react";
import { flushSync } from "react-dom";
import { useNavigate, useParams } from "react-router-dom";
import Webcam from "react-webcam";
import { v4 as uuidv4 } from "uuid";
import { ArrowLeft } from "lucide-react";
import { getDrillDisplayName } from "@/utils/drillReportTemplate";

const WS_URL          = import.meta.env.VITE_BACKEND_WS_URL  || "ws://localhost:8001";
const API_BASE_URL    = import.meta.env.VITE_BACKEND_API_URL  || "http://localhost:8000/api";
const FRAME_INTERVAL  = 150; // ms — ~7 fps, balanced speed vs server load

const EL_API_KEY  = import.meta.env.VITE_ELEVENLABS_API_KEY || "";
const EL_VOICE_ID = "GyIXYY876myKNtA1j8NI"; // Tyler — Energetic Arena Announcer

// ── ElevenLabs Voice Coach ────────────────────────────────────────────────────
// Mirrors VoiceCoach from v8finalvoice.py — same lines, same priority logic.
// Runs entirely in the browser — no backend involvement.
const VOICE_LINES: Record<string, string> = {
  rep_1:         "First rep. Let's go.",
  rep_5:         "Five reps. Stay focused.",
  rep_10:        "Ten reps. Solid set.",
  rep_15:        "Fifteen. Keep the form tight.",
  rep_20:        "Twenty reps. You're locked in.",
  score_100:     "Perfect form. That's the standard.",
  score_high:    "Clean rep.",
  score_mid:     "Rep counts. Tighten the form.",
  score_low:     "Sloppy. Reset and go again.",
  fault_drift:   "Elbow drifting. Tuck it in.",
  fault_swing:   "Stop swinging. Let the bicep work.",
  fault_rom:     "Curl higher. Squeeze at the top.",
  fault_ecc:     "Lower slower. Control the descent.",
  fault_tempo:   "Too fast. Slow it down.",
  gate_press:    "Elbow down.",
  gate_cross:    "Stay on your side.",
  gate_wing:     "Tuck the elbow in.",
  gate_kickback: "Curl up, not back.",
  gate_hips:     "Fix your hips.",
  gate_depth:    "Go deeper.",
  gate_plank:    "Get into plank position.",
  session_start: "Caydence ready. Let's get it.",
  session_end:   "Set complete.",
};

function useVoiceCoach() {
  const lastCueRef   = useRef<string>("");
  const lastTimeRef  = useRef<number>(0);
  const playingRef   = useRef<boolean>(false);
  const queueRef     = useRef<Array<{ text: string; priority: number }>>([]);
  const GATE_CD      = 4000; // ms cooldown for repeated gate cues

  const speak = useCallback(async (text: string) => {
    if (!EL_API_KEY || !text) return;
    playingRef.current = true;
    try {
      const res = await fetch(
        `https://api.elevenlabs.io/v1/text-to-speech/${EL_VOICE_ID}/stream`,
        {
          method: "POST",
          headers: {
            "xi-api-key":   EL_API_KEY,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text,
            model_id: "eleven_turbo_v2",
            voice_settings: { stability: 0.4, similarity_boost: 0.8, style: 0.5, use_speaker_boost: true },
          }),
        }
      );
      if (!res.ok) { playingRef.current = false; processQueue(); return; }
      const blob = await res.blob();
      const url  = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audio.onended = () => {
        URL.revokeObjectURL(url);
        playingRef.current = false;
        processQueue();
      };
      audio.onerror = () => { playingRef.current = false; processQueue(); };
      audio.play();
    } catch {
      playingRef.current = false;
      processQueue();
    }
  }, []);

  const processQueue = useCallback(() => {
    if (playingRef.current || queueRef.current.length === 0) return;
    // Sort by priority (lower = more urgent), pick highest priority item
    queueRef.current.sort((a, b) => a.priority - b.priority);
    const next = queueRef.current.shift()!;
    speak(next.text);
  }, [speak]);

  const enqueue = useCallback((text: string, priority: number) => {
    // Drop duplicate lower-priority items already in queue
    queueRef.current = queueRef.current.filter(
      item => !(item.text === text && item.priority >= priority)
    );
    queueRef.current.push({ text, priority });
    processQueue();
  }, [processQueue]);

  const sayGate = useCallback((key: string) => {
    const now  = Date.now();
    const text = VOICE_LINES[key] || key;
    if (key === lastCueRef.current && (now - lastTimeRef.current) < GATE_CD) return;
    lastCueRef.current  = key;
    lastTimeRef.current = now;
    enqueue(text, 2);
  }, [enqueue]);

  const repFeedback = useCallback((repTotal: number, score: number, fault: string, sync: boolean) => {
    const milestones: Record<number, string> = { 1:"rep_1", 5:"rep_5", 10:"rep_10", 15:"rep_15", 20:"rep_20" };
    if (milestones[repTotal]) { enqueue(VOICE_LINES[milestones[repTotal]], 0); return; }
    if (sync)                 { enqueue(VOICE_LINES["score_100"] || "Synchronized. Clean.", 0); return; }

    const faultMap: Record<string, string> = {
      "Tuck your elbow": "fault_drift",
      "Stop swinging":   "fault_swing",
      "Curl higher":     "fault_rom",
      "Lower slower":    "fault_ecc",
      "Too fast":        "fault_tempo",
      "Fix Hips":        "gate_hips",
      "Go deeper":       "gate_depth",
    };
    const faultKey = Object.entries(faultMap).find(([k]) => fault.includes(k))?.[1];

    let scoreKey = score >= 80 ? "score_high" : score >= 60 ? "score_mid" : "score_low";
    if (score === 100) scoreKey = "score_100";

    if (faultKey && score < 80) enqueue(VOICE_LINES[faultKey], 1);
    else                        enqueue(VOICE_LINES[scoreKey],  1);
  }, [enqueue]);

  const sessionStart = useCallback(() => {
    enqueue(VOICE_LINES["session_start"], 0);
  }, [enqueue]);

  const sessionEnd = useCallback((totalReps: number, avgScore: number) => {
    enqueue(`Set complete. ${totalReps} reps, average score ${avgScore}.`, 0);
  }, [enqueue]);

  return { sayGate, repFeedback, sessionStart, sessionEnd };
}

const VALID_DRILLS = ["pushup", "bicep", "squat"];

interface RepData {
  rep_number: number;
  score:      number;
  faults:     string[];
  depth:      number;
  tempo:      number;
  voided:     boolean;
}

interface SessionSummary {
  total_reps: number;
  avg_score:  number;
  reps:       RepData[];
}

const phaseColors: Record<string, string> = {
  // Pushup states
  IDLE:       "#6EE7B7",
  DESCENDING: "#FCD34D",
  ASCENDING:  "#34D399",
  // Squat phases
  STANDING:   "#6EE7B7",
  BOTTOM:     "#FCD34D",
  // Bicep arm states
  WAIT:       "#6EE7B7",
  DOWN:       "#FCD34D",
  CURLING:    "#FB923C",
  LOWERING:   "#34D399",
};

export default function LiveDrillSession() {
  const { drillKey } = useParams<{ drillKey: string }>();
  const navigate     = useNavigate();

  const webcamRef   = useRef<Webcam>(null);
  const wsRef       = useRef<WebSocket | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const sessionId   = useRef<string>(uuidv4());

  const voice = useVoiceCoach();

  const [connected,     setConnected]     = useState(false);
  const [reconnecting,  setReconnecting]  = useState(false);
  const [active,        setActive]        = useState(false);
  // annotated frame removed — backend no longer sends frame_b64, raw webcam shown instead
  const [repCount,      setRepCount]      = useState(0);
  const [repFlash,      setRepFlash]      = useState(false);
  const prevRepRef      = useRef(0);
  const prevScoreRef    = useRef<number | null>(null);
  const prevFaultRef    = useRef<string>("");
  const reconnectRef    = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reconnectDelay  = useRef(3000);
  const reconnectCount  = useRef(0);
  const MAX_RETRIES     = 5;
  const unmountedRef    = useRef(false);
  const [phase,       setPhase]       = useState("IDLE");
  const [cue,         setCue]         = useState("");
  const [cueSeverity, setCueSeverity] = useState("");
  const [lastScore,   setLastScore]   = useState<number | null>(null);
  const [summary,     setSummary]     = useState<SessionSummary | null>(null);
  const [error,       setError]       = useState("");
  const [saving,      setSaving]      = useState(false);

  // Redirect if invalid drill
  if (!drillKey || !VALID_DRILLS.includes(drillKey)) {
    navigate("/sport-selection", { replace: true });
    return null;
  }

  const drillName    = getDrillDisplayName(drillKey);
  const wsEndpoint   = drillKey; // pushup | bicep | squat — matches /ws/{drillKey}/{id}

  // ── Save summary to backend then navigate to report ──────────────────────
  const saveSummaryAndNavigate = useCallback(async (data: SessionSummary) => {
    setSaving(true);
    try {
      const res = await fetch(`${API_BASE_URL}/workout/save-live`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          exercise_type: drillKey === "bicep" ? "bicep_curl" : drillKey,
          session_id:    sessionId.current,
          total_reps:    data.total_reps,
          avg_score:     data.avg_score,
          reps:          data.reps,
        }),
      });
      if (res.ok) {
        const { workout_id } = await res.json();
        navigate(`/fitness/drills/${drillKey}/report/${workout_id}`);
      } else {
        // Backend save failed — show summary inline as fallback
        setSummary(data);
        setSaving(false);
      }
    } catch {
      setSummary(data);
      setSaving(false);
    }
  }, [drillKey, navigate]);

  // ── WebSocket connect with auto-reconnect ────────────────────────────────
  const connect = useCallback(() => {
    if (unmountedRef.current) return;

    // Clear any pending reconnect timer
    if (reconnectRef.current) {
      clearTimeout(reconnectRef.current);
      reconnectRef.current = null;
    }

    const ws = new WebSocket(`${WS_URL}/ws/${wsEndpoint}/${sessionId.current}`);
    wsRef.current = ws;

    ws.onopen = () => {
      if (unmountedRef.current) return;
      setConnected(true);
      setReconnecting(false);
      setError("");
      reconnectDelay.current = 3000;
      reconnectCount.current = 0;
    };

    ws.onclose = () => {
      if (unmountedRef.current) return;
      setConnected(false);
      setActive(false);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }

      if (reconnectCount.current >= MAX_RETRIES) {
        setReconnecting(false);
        setError("Backend unreachable. Please refresh the page.");
        return;
      }

      reconnectCount.current += 1;
      setReconnecting(true);
      // Use longer fixed delay — give engine time to init
      reconnectRef.current = setTimeout(() => {
        if (!unmountedRef.current) {
          reconnectDelay.current = Math.min(reconnectDelay.current * 1.5, 15000);
          connect();
        }
      }, reconnectDelay.current);
    };

    ws.onerror = () => {
      // Let onclose handle the reconnect — don't show error immediately
    };

    ws.onmessage = (evt) => {
      const msg = JSON.parse(evt.data);

      if (msg.type === "frame_result") {
        const newReps = msg.rep_count ?? 0;

        // ── Rep count — flush immediately, no batching ──────────────────
        if (newReps !== prevRepRef.current) {
          const isSync = msg.state_left === msg.state_right && newReps > prevRepRef.current;
          prevRepRef.current = newReps;
          flushSync(() => {
            setRepCount(newReps);
            setRepFlash(true);
          });
          setTimeout(() => setRepFlash(false), 400);

          // Fire rep voice feedback
          const score = msg.last_score ?? prevScoreRef.current ?? 70;
          const fault = prevFaultRef.current || "";
          voice.repFeedback(newReps, Math.round(score), fault, isSync);
        } else {
          setRepCount(newReps);
        }

        // ── Score + fault tracking ──────────────────────────────────────
        if (msg.last_score != null) {
          prevScoreRef.current = msg.last_score;
          setLastScore(msg.last_score);
        }

        // ── Gate cues — fire voice for real-time form feedback ──────────
        const newCue = msg.cue || "";
        const newSev = msg.cue_severity || "";
        if (newCue) {
          prevFaultRef.current = newCue;
          const cueL = newCue.toLowerCase();
          if      (cueL.includes("elbow") && cueL.includes("lower")) voice.sayGate("gate_press");
          else if (cueL.includes("tuck") || cueL.includes("chicken")) voice.sayGate("gate_wing");
          else if (cueL.includes("side") || cueL.includes("cross"))   voice.sayGate("gate_cross");
          else if (cueL.includes("back"))                              voice.sayGate("gate_kickback");
          else if (cueL.includes("hip"))                               voice.sayGate("gate_hips");
          else if (cueL.includes("deeper"))                            voice.sayGate("gate_depth");
          else if (cueL.includes("plank"))                             voice.sayGate("gate_plank");
        }

        setCue(newCue);
        setCueSeverity(newSev);

        // Phase display: pushup → state, squat → phase, bicep → state_left
        if      (msg.phase)      setPhase(msg.phase);
        else if (msg.state)      setPhase(msg.state);
        else if (msg.state_left) setPhase(`L:${msg.state_left}  R:${msg.state_right}`);
      }

      if (msg.type === "session_summary") {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setActive(false);
        voice.sessionEnd(msg.total_reps ?? 0, msg.avg_score ?? 0);
        saveSummaryAndNavigate(msg);
      }

      if (msg.error) setError(msg.error);
    };
  }, [wsEndpoint, saveSummaryAndNavigate, voice]);

  // ── Start session ─────────────────────────────────────────────────────────
  const startSession = () => {
    setRepCount(0);
    setPhase("IDLE");
    setCue("");
    setLastScore(null);
    setSummary(null);
    setRepFlash(false);
    prevRepRef.current   = 0;
    prevScoreRef.current = null;
    prevFaultRef.current = "";
    reconnectCount.current = 0;
    reconnectDelay.current = 3000;
    setActive(true);
    voice.sessionStart();

    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      connect();
      setTimeout(beginStreaming, 1500);
    } else {
      wsRef.current.close();
      connect();
      setTimeout(beginStreaming, 1500);
    }
  };

  const beginStreaming = () => {
    intervalRef.current = setInterval(() => {
      const ws = wsRef.current;
      if (!ws || ws.readyState !== WebSocket.OPEN) return;
      const screenshot = webcamRef.current?.getScreenshot({ width: 320, height: 180 });
      if (!screenshot) return;
      ws.send(JSON.stringify({ type: "frame", frame: screenshot.split(",")[1] }));
    }, FRAME_INTERVAL);
  };

  // ── Stop session ──────────────────────────────────────────────────────────
  const stopSession = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setActive(false);
    const ws = wsRef.current;
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: "end_session" }));
      // saveSummaryAndNavigate fires when server responds with session_summary
    }
  };

  // ── Mount / unmount ───────────────────────────────────────────────────────
  useEffect(() => {
    unmountedRef.current = false;
    connect();
    return () => {
      unmountedRef.current = true;
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (reconnectRef.current) clearTimeout(reconnectRef.current);
      wsRef.current?.close();
    };
  }, [connect]);

  const borderColor = cueSeverity === "error" ? "#ef4444"
                    : cueSeverity === "warn"   ? "#f59e0b"
                    : "#1e3a5f";

  return (
    <div
      className="min-h-screen flex flex-col items-center pt-8 px-4"
      style={{
        background: "radial-gradient(ellipse at 50% 0%, #0f172a 0%, #020617 100%)",
        fontFamily: "'DM Mono', monospace",
      }}
    >
      {/* Header */}
      <div className="w-full max-w-2xl flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(`/fitness/drills/${drillKey}`)}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1
              className="text-3xl font-bold tracking-tight"
              style={{ color: "#E2FBD0", letterSpacing: "-0.03em" }}
            >
              CAYDENCE
            </h1>
            <p className="text-xs text-slate-500 mt-0.5 uppercase tracking-widest">
              Live {drillName} Analysis
            </p>
          </div>
        </div>
        <span className={`text-xs px-3 py-1 rounded-full font-medium ${
          connected
            ? "bg-emerald-900/60 text-emerald-300 ring-1 ring-emerald-700"
            : reconnecting
            ? "bg-yellow-900/60 text-yellow-300 ring-1 ring-yellow-700"
            : "bg-red-900/60 text-red-300 ring-1 ring-red-700"
        }`}>
          {connected ? "● CONNECTED" : reconnecting ? "◌ RECONNECTING..." : "○ OFFLINE"}
        </span>
      </div>

      {/* Video feed */}
      <div
        className="relative w-full max-w-2xl rounded-2xl overflow-hidden"
        style={{
          aspectRatio: "16/9",
          background:  "#0a0f1e",
          border:      `2px solid ${borderColor}`,
        }}
      >
        {/* Raw webcam — always visible, no skeleton overlay */}
        <Webcam
          ref={webcamRef}
          audio={false}
          screenshotFormat="image/jpeg"
          videoConstraints={{ facingMode: "user", width: 320, height: 180 }}
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Idle overlay */}
        {!active && !summary && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm">
            <p className="text-slate-400 text-sm uppercase tracking-widest">Camera ready</p>
            <p className="text-slate-600 text-xs mt-1">Press START to begin</p>
          </div>
        )}

        {/* Saving overlay */}
        {saving && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm z-20">
            <p className="text-emerald-400 text-sm uppercase tracking-widest">Saving session...</p>
          </div>
        )}

        {/* Cue banner */}
        {active && (
          <div className={`absolute bottom-0 left-0 right-0 py-3 px-5 transition-all duration-150 ${
            cueSeverity === "error" ? "bg-red-600/90"
            : cueSeverity === "warn"  ? "bg-amber-500/90"
            : "bg-black/40"
          }`}>
            <span className="text-sm font-bold uppercase tracking-widest text-white">
              {cue || "✓ Good form"}
            </span>
          </div>
        )}

        {/* Phase badge */}
        {active && (
          <div
            className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest"
            style={{
              background: `${phaseColors[phase] ?? "#fff"}22`,
              color:       phaseColors[phase] ?? "#fff",
              border:     `1px solid ${phaseColors[phase] ?? "#fff"}55`,
            }}
          >
            {phase}
          </div>
        )}
      </div>

      {/* Stats row */}
      <div className="w-full max-w-2xl grid grid-cols-3 gap-3 mt-4">
        {[
          { label: "REPS",       value: repCount                              },
          { label: "LAST SCORE", value: lastScore !== null ? `${Math.round(lastScore)}/100` : "—" },
          { label: "PHASE",      value: phase                                 },
        ].map(({ label, value }) => (
          <div
            key={label}
            className="rounded-xl px-4 py-4 flex flex-col items-center"
            style={{ background: "#0d1424", border: "1px solid #1e2d45" }}
          >
            <span className="text-slate-500 text-xs uppercase tracking-widest mb-1">{label}</span>
            <span className="text-2xl font-bold" style={{ color: "#E2FBD0" }}>{value}</span>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="w-full max-w-2xl mt-5">
        {!active ? (
          <button
            onClick={startSession}
            disabled={!connected || saving}
            className="w-full py-4 rounded-xl text-sm font-bold uppercase tracking-widest transition-all"
            style={{
              background: connected && !saving ? "#16a34a" : "#1e2d45",
              color:      connected && !saving ? "#fff"    : "#475569",
              cursor:     connected && !saving ? "pointer" : "not-allowed",
            }}
          >
            ▶ START SESSION
          </button>
        ) : (
          <button
            onClick={stopSession}
            className="w-full py-4 rounded-xl text-sm font-bold uppercase tracking-widest"
            style={{ background: "#7f1d1d", color: "#fca5a5" }}
          >
            ■ END SESSION
          </button>
        )}
      </div>

      {/* Status message */}
      {reconnecting && !connected && (
        <p className="mt-4 text-yellow-400 text-sm text-center animate-pulse">
          Connecting to backend... please wait
        </p>
      )}
      {error && !reconnecting && (
        <div className="mt-4 flex flex-col items-center gap-2">
          <p className="text-red-400 text-sm text-center">{error}</p>
          <button
            onClick={() => {
              reconnectCount.current = 0;
              reconnectDelay.current = 3000;
              setError("");
              connect();
            }}
            className="text-xs px-4 py-2 rounded-lg"
            style={{ background: "#1e3a5f", color: "#60a5fa" }}
          >
            ↺ Retry Connection
          </button>
        </div>
      )}

      {/* Inline summary fallback (shown only if backend save failed) */}
      {summary && (
        <div
          className="w-full max-w-2xl mt-6 rounded-2xl p-6 mb-10"
          style={{ background: "#0d1424", border: "1px solid #1e2d45" }}
        >
          <h2 className="text-lg font-bold mb-4" style={{ color: "#E2FBD0" }}>
            Session Complete
          </h2>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-widest">Total Reps</p>
              <p className="text-3xl font-bold text-emerald-400">{summary.total_reps}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-widest">Avg Score</p>
              <p className="text-3xl font-bold text-emerald-400">
                {summary.avg_score}
                <span className="text-sm text-slate-500 ml-1">/100</span>
              </p>
            </div>
          </div>

          <div className="space-y-2 mt-4">
            {summary.reps?.map((rep) => (
              <div
                key={rep.rep_number}
                className="flex items-center justify-between rounded-lg px-4 py-2 text-sm"
                style={{ background: rep.voided ? "#2d1515" : "#0a1628" }}
              >
                <span className="text-slate-400">Rep {rep.rep_number}</span>
                <span className="text-slate-500 text-xs">{rep.tempo}s</span>
                <span className="text-slate-500 text-xs">
                  {rep.faults.length > 0 ? rep.faults[0] : "Clean"}
                </span>
                <span className="font-bold" style={{ color: rep.voided ? "#f87171" : "#6ee7b7" }}>
                  {rep.voided ? "VOIDED" : `${rep.score}/100`}
                </span>
              </div>
            ))}
          </div>

          <button
            onClick={() => {
              setSummary(null);
              sessionId.current = uuidv4();
              connect();
            }}
            className="mt-5 w-full py-3 rounded-xl text-sm font-bold uppercase tracking-widest"
            style={{ background: "#164e3b", color: "#6ee7b7" }}
          >
            ↺ NEW SESSION
          </button>
        </div>
      )}
    </div>
  );
}