// Rule-based triage (PRD FR-3.1). Deliberately not left to the model's own
// judgment — CLAUDE.md non-negotiable rule #2: "Triage uncertainty always
// resolves UPWARD (routine->urgent->emergency)". Keyword match is the ceiling
// here; a real classifier (weighted signals, no-water-duration, etc.) is
// Phase 6 QA-corpus-driven work once there's real call data to tune against.
import type { z } from "zod";
import type { ClassifyUrgencyOutput } from "./agent-tools.js";

const EMERGENCY_KEYWORDS = ["gas smell", "gas leak", "smell gas", "sewage", "flooding", "water everywhere", "burst pipe"];
const URGENT_KEYWORDS = ["leak", "no hot water", "no water", "overflow", "clogged", "backed up"];
const ROUTINE_KEYWORDS = ["maintenance", "quote", "estimate", "inspection", "install", "no rush", "whenever"];

export function classifyUrgency(features: string[]): z.infer<typeof ClassifyUrgencyOutput> {
  const text = features.join(" ").toLowerCase();

  for (const kw of EMERGENCY_KEYWORDS) {
    if (text.includes(kw)) return { triage_class: "EMERGENCY", reason: `matched "${kw}"` };
  }
  for (const kw of URGENT_KEYWORDS) {
    if (text.includes(kw)) return { triage_class: "URGENT_TODAY", reason: `matched "${kw}"` };
  }
  for (const kw of ROUTINE_KEYWORDS) {
    if (text.includes(kw)) return { triage_class: "ROUTINE", reason: `matched "${kw}"` };
  }
  if (features.length === 0) return { triage_class: "ROUTINE", reason: "no signals extracted yet" };
  // Upward bias (CLAUDE.md rule #2): genuinely ambiguous signals — no clear
  // routine or emergency keyword — resolve up to URGENT_TODAY, not down to ROUTINE.
  return { triage_class: "URGENT_TODAY", reason: "ambiguous signals, defaulting upward per triage policy" };
}
