/**
 * PushupLive.tsx — Live push-up counter with real-time form feedback
 * Route: /fitness/drills/pushup/live
 */

import { useEffect, useRef, useState, useCallback } from "react";
import Webcam from "react-webcam";
import { v4 as uuidv4 } from "uuid";

const WS_URL = "ws://localhost:8001";
const FRAME_INTERVAL_MS = 80;

interface RepData {
  rep_number: number;
  score: number;
  faults: string[];
  depth: number;
  tempo: number;
  voided: boolean;
  s_rom: number;
  s_stab: number;
  s_ctrl: number;
}

interface SessionSummary {
  total_reps: number;
  avg_score: number;
  reps: RepData[];
}

export default function PushupLive() {
  const webcamRef   = useRef<Webcam>(null);
  const wsRef       = useRef<WebSocket | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const sessionId   = useRef<string>(uuidv4());

  const [connected,   setConnected]   = useState(false);
  const [active,      setActive]      = useState(false);
  const [annotated,   setAnnotated]   = useState<string | null>(null);
  const [repCount,    setRepCount]    = useState(0);
  const [state,       setState]       = useState("IDLE");
  const [cue,         setCue]         = useState("");
  const [cueSeverity, setCueSeverity] = useState("");
  const [lastScore,   setLastScore]   = useState<number | null>(null);
  const [summary,     setSummary]     = useState<SessionSummary | null>(null);
  const [error,       setError]       = useState("");

  const connect = useCallback(() => {
    const ws = new WebSocket(`${WS_URL}/ws/pushup/${sessionId.current}`);
    wsRef.current = ws;

    ws.onopen  = () => { setConnected(true); setError(""); };
    ws.onclose = () => { setConnected(false); setActive(false); };
    ws.onerror = () => setError("Backend not reachable — is it running on port 8001?");

    ws.onmessage = (evt) => {
      const data = JSON.parse(evt.data);

      if (data.type === "frame_result") {
        if (data.frame_b64) setAnnotated(data.frame_b64);
        setRepCount(data.rep_count);
        setState(data.state);
        setCue(data.cue || "");
        setCueSeverity(data.cue_severity || "");
        if (data.last_score !== null && data.last_score !== undefined) {
          setLastScore(data.last_score);
        }
      }

      if (data.type === "session_summary") {
        setSummary(data);
        setActive(false);
        if (intervalRef.current) clearInterval(intervalRef.current);
      }

      if (data.error) setError(data.error);
    };
  }, []);

  const startSession = () => {
    setRepCount(0);
    setState("IDLE");
    setCue("");
    setLastScore(null);
    setSummary(null);
    setAnnotated(null);
    setActive(true);

    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      connect();
      setTimeout(() => beginStreaming(), 800);
    } else {
      beginStreaming();
    }
  };

  const beginStreaming = () => {
    intervalRef.current = setInterval(() => {
      const ws = wsRef.current;
      if (!ws || ws.readyState !== WebSocket.OPEN) return;
      const screenshot = webcamRef.current?.getScreenshot();
      if (!screenshot) return;
      const base64 = screenshot.split(",")[1];
      ws.send(JSON.stringify({ type: "frame", frame: base64 }));
    }, FRAME_INTERVAL_MS);
  };

  const stopSession = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setActive(false);
    const ws = wsRef.current;
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: "end_session" }));
    }
  };

  useEffect(() => {
    connect();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      wsRef.current?.close();
    };
  }, [connect]);

  const phaseColor: Record<string, string> = {
    IDLE:       "#6EE7B7",
    DESCENDING: "#FCD34D",
    ASCENDING:  "#34D399",
  };

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
        <div>
          <h1 className="text-3xl font-bold tracking-tight" style={{ color: "#E2FBD0", letterSpacing: "-0.03em" }}>
            CAYDENCE
          </h1>
          <p className="text-xs text-slate-500 mt-0.5 uppercase tracking-widest">
            Live Push-up Analysis
          </p>
        </div>
        <span className={`text-xs px-3 py-1 rounded-full font-medium ${
          connected
            ? "bg-emerald-900/60 text-emerald-300 ring-1 ring-emerald-700"
            : "bg-red-900/60 text-red-300 ring-1 ring-red-700"
        }`}>
          {connected ? "● CONNECTED" : "○ OFFLINE"}
        </span>
      </div>

      {/* Video feed */}
      <div
        className="relative w-full max-w-2xl rounded-2xl overflow-hidden"
        style={{
          aspectRatio: "16/9",
          background: "#0a0f1e",
          border: `2px solid ${cueSeverity === "error" ? "#ef4444" : cueSeverity === "warn" ? "#f59e0b" : "#1e3a5f"}`,
        }}
      >
        {/* Raw webcam */}
        <Webcam
          ref={webcamRef}
          audio={false}
          screenshotFormat="image/jpeg"
          videoConstraints={{ facingMode: "user", width: 640, height: 360 }}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ opacity: 1 }}
        />

        {/* Annotated frame from backend */}
        {annotated && (
          <img
            src={`data:image/jpeg;base64,${annotated}`}
            alt="annotated"
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}

        {/* Idle overlay */}
        {!active && !summary && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm">
            <p className="text-slate-400 text-sm uppercase tracking-widest">Camera ready</p>
            <p className="text-slate-600 text-xs mt-1">Press START to begin</p>
          </div>
        )}

        {/* Form cue banner */}
        {active && (
          <div className={`absolute bottom-0 left-0 right-0 py-3 px-5 transition-all duration-150 ${
            cueSeverity === "error" ? "bg-red-600/90" :
            cueSeverity === "warn"  ? "bg-amber-500/90" :
            "bg-black/40"
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
              background: `${phaseColor[state] ?? "#fff"}22`,
              color:       phaseColor[state] ?? "#fff",
              border:     `1px solid ${phaseColor[state] ?? "#fff"}55`,
            }}
          >
            {state}
          </div>
        )}
      </div>

      {/* Stats row */}
      <div className="w-full max-w-2xl grid grid-cols-3 gap-3 mt-4">
        {[
          { label: "REPS",       value: repCount,                              unit: ""      },
          { label: "LAST SCORE", value: lastScore !== null ? lastScore : "—",  unit: lastScore !== null ? "/100" : "" },
          { label: "PHASE",      value: state,                                 unit: ""      },
        ].map(({ label, value, unit }) => (
          <div
            key={label}
            className="rounded-xl px-4 py-4 flex flex-col items-center"
            style={{ background: "#0d1424", border: "1px solid #1e2d45" }}
          >
            <span className="text-slate-500 text-xs uppercase tracking-widest mb-1">{label}</span>
            <span className="text-2xl font-bold" style={{ color: "#E2FBD0" }}>
              {value}
              {unit && <span className="text-sm text-slate-500 ml-1">{unit}</span>}
            </span>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="w-full max-w-2xl mt-5">
        {!active ? (
          <button
            onClick={startSession}
            disabled={!connected}
            className="w-full py-4 rounded-xl text-sm font-bold uppercase tracking-widest transition-all"
            style={{
              background: connected ? "#16a34a" : "#1e2d45",
              color:      connected ? "#fff"    : "#475569",
              cursor:     connected ? "pointer" : "not-allowed",
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

      {/* Error */}
      {error && (
        <p className="mt-4 text-red-400 text-sm text-center">{error}</p>
      )}

      {/* Session summary */}
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

          {/* Per-rep breakdown */}
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
              setAnnotated(null);
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