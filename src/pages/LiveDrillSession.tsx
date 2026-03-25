/**
 * LiveDrillSession.tsx — Live webcam analysis for pushup, bicep, squat
 * Route: /fitness/drills/:drillKey/live
 * Mirrors PushupLive.tsx pattern exactly — react-webcam + WebSocket
 */

import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Webcam from "react-webcam";
import { v4 as uuidv4 } from "uuid";
import { ArrowLeft } from "lucide-react";
import { getDrillDisplayName } from "@/utils/drillReportTemplate";

const WS_URL          = import.meta.env.VITE_BACKEND_WS_URL  || "ws://localhost:8001";
const API_BASE_URL    = import.meta.env.VITE_BACKEND_API_URL  || "http://localhost:8000/api";
const FRAME_INTERVAL  = 200; // ms — 5 fps, better for slow servers

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

  const [connected,   setConnected]   = useState(false);
  const [active,      setActive]      = useState(false);
  // annotated frame removed — backend no longer sends frame_b64, raw webcam shown instead
  const [repCount,    setRepCount]    = useState(0);
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

  // ── WebSocket connect ─────────────────────────────────────────────────────
  const connect = useCallback(() => {
    const ws = new WebSocket(`${WS_URL}/ws/${wsEndpoint}/${sessionId.current}`);
    wsRef.current = ws;

    ws.onopen  = () => { setConnected(true); setError(""); };
    ws.onclose = () => { setConnected(false); setActive(false); };
    ws.onerror = () => setError("Backend not reachable — is it running on port 8001?");

    ws.onmessage = (evt) => {
      const msg = JSON.parse(evt.data);

      if (msg.type === "frame_result") {
        setRepCount(msg.rep_count ?? 0);
        setCue(msg.cue || "");
        setCueSeverity(msg.cue_severity || "");
        if (msg.last_score != null) setLastScore(msg.last_score);

        // Phase display: pushup → state, squat → phase, bicep → state_left
        if      (msg.phase)      setPhase(msg.phase);
        else if (msg.state)      setPhase(msg.state);
        else if (msg.state_left) setPhase(`L:${msg.state_left}  R:${msg.state_right}`);
      }

      if (msg.type === "session_summary") {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setActive(false);
        saveSummaryAndNavigate(msg);
      }

      if (msg.error) setError(msg.error);
    };
  }, [wsEndpoint, saveSummaryAndNavigate]);

  // ── Start session ─────────────────────────────────────────────────────────
  const startSession = () => {
    setRepCount(0);
    setPhase("IDLE");
    setCue("");
    setLastScore(null);
    setSummary(null);
    setActive(true);

    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      connect();
      setTimeout(beginStreaming, 800);
    } else {
      beginStreaming();
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
    connect();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
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

      {/* Error */}
      {error && (
        <p className="mt-4 text-red-400 text-sm text-center">{error}</p>
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