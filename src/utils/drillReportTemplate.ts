export interface DrillReport {
  summary: { score: number; status: string; label: string };
  positives: string[];
  fixes: string[];
  formBreakdown: { metric: string; value: string; rating: string }[];
  safetyFlags: string[];
  nextGoals: string[];
  suggestedPlan: { sets: number; reps: number; rest: string };
  meta: { drill: string; uploadedAt: string; fileName?: string };
}

const DRILL_NAMES: Record<string, string> = {
  pushup: "Pushup",
  bicep: "Bicep Curl",
  squat: "Squat",
};

export function getDrillDisplayName(key: string): string {
  return DRILL_NAMES[key] || key;
}

export function generateDraftReport(
  drillKey: string,
  fileName?: string
): DrillReport {
  const drill = getDrillDisplayName(drillKey);

  const templates: Record<string, Omit<DrillReport, "meta">> = {
    pushup: {
      summary: { score: 7, status: "Good", label: "Draft Report (template) — CV analysis will populate final metrics" },
      positives: [
        "Core engagement maintained throughout the set",
        "Consistent hand placement at shoulder width",
        "Controlled eccentric (lowering) phase",
      ],
      fixes: [
        "Hips sagging slightly at the bottom of each rep — engage glutes",
        "Elbows flaring beyond 45° — tuck closer to body",
        "Head dropping forward — maintain neutral spine alignment",
      ],
      formBreakdown: [
        { metric: "Range of Motion", value: "85%", rating: "Good" },
        { metric: "Tempo / Cadence", value: "2-1-2 (eccentric-pause-concentric)", rating: "Good" },
        { metric: "Body Alignment", value: "Slight hip sag detected", rating: "Needs Work" },
        { metric: "Depth / Lockout", value: "Chest ~3 in from floor; full lockout at top", rating: "Good" },
      ],
      safetyFlags: ["Avoid locking elbows aggressively at the top to protect joints"],
      nextGoals: [
        "Maintain rigid plank throughout — no hip sag for 10 consecutive reps",
        "Achieve 45° elbow tuck consistently",
      ],
      suggestedPlan: { sets: 3, reps: 12, rest: "60s" },
    },
    bicep: {
      summary: { score: 6, status: "Average", label: "Draft Report (template) — CV analysis will populate final metrics" },
      positives: [
        "Full range of motion from extension to peak contraction",
        "Controlled tempo on the concentric phase",
        "Stable shoulder position throughout the curl",
      ],
      fixes: [
        "Excessive torso swing — keep upper body stationary",
        "Wrists bending backward under load — maintain neutral wrist",
        "Rushing the eccentric (lowering) phase — slow down to 2-3 seconds",
      ],
      formBreakdown: [
        { metric: "Range of Motion", value: "90%", rating: "Good" },
        { metric: "Tempo / Cadence", value: "1-0-2 (fast concentric, slow eccentric)", rating: "Needs Work" },
        { metric: "Body Alignment", value: "Torso swing detected", rating: "Needs Work" },
        { metric: "Depth / Lockout", value: "Full extension achieved; good peak squeeze", rating: "Good" },
      ],
      safetyFlags: ["Avoid using momentum — risk of lower-back strain"],
      nextGoals: [
        "Eliminate torso swing for an entire set of 10 reps",
        "Achieve a 2-1-3 tempo (concentric-pause-eccentric)",
      ],
      suggestedPlan: { sets: 3, reps: 10, rest: "45s" },
    },
    squat: {
      summary: { score: 7, status: "Good", label: "Draft Report (template) — CV analysis will populate final metrics" },
      positives: [
        "Hitting parallel depth consistently",
        "Knees tracking over toes without caving",
        "Upright torso maintained throughout the lift",
      ],
      fixes: [
        "Heels rising slightly at the bottom — work on ankle mobility",
        "Slight forward lean at the sticking point — strengthen upper back",
        "Breath-bracing timing inconsistent — inhale at top, brace before descent",
      ],
      formBreakdown: [
        { metric: "Range of Motion", value: "92%", rating: "Good" },
        { metric: "Tempo / Cadence", value: "2-1-2", rating: "Good" },
        { metric: "Body Alignment", value: "Minor forward lean at depth", rating: "Average" },
        { metric: "Depth / Lockout", value: "Parallel achieved; full lockout at top", rating: "Good" },
      ],
      safetyFlags: ["Heel lift under load increases knee shear — consider squat shoes or heel wedge"],
      nextGoals: [
        "Keep heels flat for every rep at current load",
        "Add a 2-second pause at the bottom to build control",
      ],
      suggestedPlan: { sets: 4, reps: 8, rest: "90s" },
    },
  };

  const t = templates[drillKey] || templates.pushup;

  return {
    ...t,
    meta: {
      drill,
      uploadedAt: new Date().toISOString(),
      fileName,
    },
  };
}
