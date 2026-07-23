export const MARKETS: Record<string, { currency: string; label: string }> = {
  us: { currency: "USD", label: "United States" },
};

export const PLANS = [
  {
    tag: "Solo",
    name: "Solo",
    price: 49,
    tagline: "Best for an independent solo operator",
    featuresHeader: "What's included:",
    features: [
      "24/7 AI answers every call",
      "Emergency triage & gas-safety script",
      "Real-time booking into your calendar",
      "SMS confirmations, reminders & reschedule",
      "Emergency escalation by SMS to your cell",
      "1 calendar, 1 number, unlimited calls",
    ],
    highlight: false,
  },
  {
    tag: "Small crew",
    name: "Crew",
    price: 89,
    tagline: "Best for a growing team with multiple technicians.",
    featuresHeader: "Everything in Solo, plus:",
    features: [
      "Live-transfer to your cell on emergencies, not just SMS",
      "2 calendars — split jobs across two techs",
      "Cloned-voice greeting — sounds like you, not a default AI",
      "Priority support",
    ],
    highlight: true,
  },
];

export interface FeatureRow {
  label: string;
  solo: boolean | string;
  crew: boolean | string;
}

export interface FeatureCategory {
  icon: string;
  name: string;
  rows: FeatureRow[];
}

export const FEATURE_CATEGORIES: FeatureCategory[] = [
  {
    icon: "phone",
    name: "Phone numbers",
    rows: [
      { label: "Business number", solo: "1 included", crew: "1 included" },
      { label: "Number porting", solo: "Forward your existing number instead", crew: "Forward your existing number instead" },
    ],
  },
  {
    icon: "call",
    name: "Calling",
    rows: [
      { label: "AI answers every call, 24/7", solo: true, crew: true },
      { label: "Call recording", solo: true, crew: true },
      { label: "Barge-in (caller can interrupt)", solo: true, crew: true },
      { label: "Live transfer on emergencies", solo: "SMS alert only", crew: true },
      { label: "Custom voice greeting", solo: "Default AI voice", crew: "Cloned to sound like you" },
      { label: "Desktop / mobile companion app", solo: false, crew: false },
    ],
  },
  {
    icon: "message",
    name: "Messaging",
    rows: [
      { label: "Booking confirmation SMS", solo: true, crew: true },
      { label: "24h + 1h reminders", solo: true, crew: true },
      { label: "Reschedule by text reply", solo: true, crew: true },
      { label: "STOP compliance", solo: true, crew: true },
      { label: "Owner morning digest SMS", solo: true, crew: true },
    ],
  },
  {
    icon: "calendar",
    name: "Booking & calendar",
    rows: [
      { label: "Real-time availability check", solo: true, crew: true },
      { label: "Atomic slot hold (no double-booking)", solo: true, crew: true },
      { label: "Calendars", solo: "1", crew: "2" },
      { label: "Google Calendar sync", solo: "Partial — OAuth built, not fully live", crew: "Partial — OAuth built, not fully live" },
      { label: "Vacation mode", solo: true, crew: true },
    ],
  },
  {
    icon: "alert",
    name: "Emergency handling",
    rows: [
      { label: "Emergency triage (gas / flooding / burst pipe)", solo: true, crew: true },
      { label: "Hard-coded gas-safety script", solo: true, crew: true },
      { label: "Escalation", solo: "SMS to your cell", crew: "Live transfer + SMS" },
    ],
  },
  {
    icon: "doc",
    name: "AI transcripts",
    rows: [
      { label: "Call summary + transcript", solo: true, crew: true },
      { label: "Signed audio playback", solo: true, crew: true },
      { label: "History retention", solo: "30 days", crew: "30 days" },
    ],
  },
  {
    icon: "tag",
    name: "Pricing",
    rows: [
      { label: "Minutes / month", solo: "300", crew: "600" },
      { label: "Per-seat fees", solo: "None — flat rate", crew: "None — flat rate" },
      { label: "Setup fee", solo: "$0", crew: "$0" },
      { label: "Contract", solo: "Month to month", crew: "Month to month" },
    ],
  },
  {
    icon: "support",
    name: "Support",
    rows: [{ label: "Response time", solo: "Async, <24h", crew: "Priority, <4h" }],
  },
  {
    icon: "shield",
    name: "Security",
    rows: [
      { label: "Row-level data isolation (RLS)", solo: true, crew: true },
      { label: "Signed URLs on recordings (expiring)", solo: true, crew: true },
    ],
  },
];

export const PRICING_FAQS = [
  {
    q: "What actually happens if I go over my minutes?",
    a: "Nothing gets cut off mid-call. You get an alert once you cross 80% of your monthly minutes, with the option to upgrade if you're consistently running close to the limit. No surprise overage charge on the bill.",
  },
  {
    q: "Am I locked into a plan once I pick one?",
    a: "No. Solo and Crew are both month to month. If your team grows and you outgrow Solo, or you want to scale back down, message us and we'll switch it for you — there's no self-serve toggle yet, but it's a same-day change either way.",
  },
  {
    q: "Do I get charged the second I sign up?",
    a: "Your card is required upfront to start the 14-day trial, but you're not charged the plan price until the trial ends. Cancel before then and you're not billed at all.",
  },
  {
    q: "What happens to my bookings if I cancel?",
    a: "You keep every job it already booked — cancellation doesn't unwind past bookings. Your number just goes back to ringing straight through to voicemail once your billing period ends.",
  },
  {
    q: "Do unused minutes roll over to next month?",
    a: "No — the minute allowance resets each billing cycle. Most solo operators don't come close to 300/month; if you're consistently near the cap, that's usually a sign Crew's 600 minutes is the better fit.",
  },
  {
    q: "Is there a fee to set up, or to cancel?",
    a: "Zero either way. No setup fee to start, no cancellation fee to stop. You cancel directly, no retention call required.",
  },
];
