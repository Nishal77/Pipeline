// Postgres schema v1 (PRD §13). One zod schema per table — validated at API/voice
// boundaries, not re-derived per caller. Columns match the PRD field list exactly.
import { z } from "zod";

export const AccountStatus = z.enum(["trial", "active", "past_due", "paused", "canceled"]);
export const Plan = z.enum(["solo", "pro"]);

export const Account = z.object({
  id: z.string().uuid(),
  business_name: z.string().min(1),
  owner_name: z.string().min(1),
  owner_cell: z.string(), // E.164
  email: z.string().email(),
  tz: z.string(), // IANA tz name
  plan: Plan,
  stripe_customer_id: z.string().nullable(),
  status: AccountStatus,
  trial_ends_at: z.string().datetime().nullable(),
  created_at: z.string().datetime(),
});
export type Account = z.infer<typeof Account>;

export const PhoneNumber = z.object({
  id: z.string().uuid(),
  account_id: z.string().uuid(),
  e164: z.string(),
  type: z.enum(["platform", "forwarded_origin"]),
  carrier: z.string().nullable(),
  forwarding_verified_at: z.string().datetime().nullable(),
  last_synthetic_check_at: z.string().datetime().nullable(),
});
export type PhoneNumber = z.infer<typeof PhoneNumber>;

export const BusinessProfile = z.object({
  account_id: z.string().uuid(),
  greeting_name: z.string(),
  voice_preset: z.string(),
  hours: z.record(z.string(), z.unknown()), // jsonb
  emergency_policy: z.record(z.string(), z.unknown()), // jsonb
  service_area: z.object({ zips: z.array(z.string()), radius_miles: z.number().optional() }),
  price_sheet: z.record(z.string(), z.unknown()), // jsonb
  sms_templates: z.record(z.string(), z.unknown()), // jsonb
  digest_time: z.string(), // "HH:MM" local
});
export type BusinessProfile = z.infer<typeof BusinessProfile>;

export const JobType = z.object({
  id: z.string().uuid(),
  account_id: z.string().uuid(),
  name: z.string(),
  duration_min: z.number().int().positive(),
  buffer_min: z.number().int().nonnegative(),
  active: z.boolean(),
});
export type JobType = z.infer<typeof JobType>;

export const Customer = z.object({
  id: z.string().uuid(),
  account_id: z.string().uuid(),
  name: z.string().nullable(),
  phone_e164: z.string(),
  sms_opt_out: z.boolean(),
  created_at: z.string().datetime(),
});
export type Customer = z.infer<typeof Customer>;

export const Address = z.object({
  id: z.string().uuid(),
  customer_id: z.string().uuid(),
  line1: z.string(),
  line2: z.string().nullable(),
  city: z.string(),
  state: z.string(),
  zip: z.string(),
  access_notes: z.string().nullable(),
  lat: z.number().nullable(),
  lng: z.number().nullable(),
});
export type Address = z.infer<typeof Address>;

export const TriageClass = z.enum(["EMERGENCY", "URGENT_TODAY", "ROUTINE"]);
export const CallOutcome = z.enum([
  "booked",
  "callback",
  "message",
  "escalated_connected",
  "escalated_unreached",
  "spam",
  "abandoned",
]);

export const Call = z.object({
  id: z.string().uuid(),
  account_id: z.string().uuid(),
  customer_id: z.string().uuid().nullable(),
  direction: z.enum(["inbound", "outbound"]),
  from_e164: z.string(),
  started_at: z.string().datetime(),
  duration_s: z.number().int().nonnegative(),
  intent: z.string(),
  triage_class: TriageClass,
  outcome: CallOutcome,
  summary: z.string().max(280), // ~40 words
  transcript_url: z.string().url().nullable(),
  audio_url: z.string().url().nullable(),
  latency_p95_ms: z.number().int().nonnegative().nullable(),
  hang_up_within_10s: z.boolean(),
});
export type Call = z.infer<typeof Call>;

export const BookingStatus = z.enum(["held", "confirmed", "rescheduled", "canceled"]);
export const BookingSource = z.enum(["ai_call", "owner_manual", "sms_reschedule"]);

export const Booking = z.object({
  id: z.string().uuid(),
  account_id: z.string().uuid(),
  customer_id: z.string().uuid(),
  address_id: z.string().uuid(),
  job_type_id: z.string().uuid(),
  starts_at: z.string().datetime(),
  ends_at: z.string().datetime(),
  status: BookingStatus,
  source: BookingSource,
  est_value_cents: z.number().int().nullable(),
  gcal_event_id: z.string().nullable(),
});
export type Booking = z.infer<typeof Booking>;

export const SmsKind = z.enum(["confirm", "reminder24", "reminder1", "otw", "digest", "freeform"]);
export const SmsStatus = z.enum(["queued", "sent", "delivered", "failed"]);

export const SmsMessage = z.object({
  id: z.string().uuid(),
  account_id: z.string().uuid(),
  customer_id: z.string().uuid(),
  direction: z.enum(["outbound", "inbound"]),
  kind: SmsKind,
  body: z.string(),
  status: SmsStatus,
  sent_at: z.string().datetime().nullable(),
});
export type SmsMessage = z.infer<typeof SmsMessage>;

export const Escalation = z.object({
  id: z.string().uuid(),
  call_id: z.string().uuid(),
  chain_step: z.number().int().positive(),
  method: z.enum(["transfer", "sms", "retry_call"]),
  result: z.string(),
  occurred_at: z.string().datetime(),
});
export type Escalation = z.infer<typeof Escalation>;

export const EventAnalytics = z.object({
  id: z.string().uuid(),
  account_id: z.string().uuid(),
  name: z.string(),
  properties: z.record(z.string(), z.unknown()),
  occurred_at: z.string().datetime(),
});
export type EventAnalytics = z.infer<typeof EventAnalytics>;

export const AuditLog = z.object({
  id: z.string().uuid(),
  account_id: z.string().uuid(),
  actor: z.enum(["owner", "system", "ai"]),
  action: z.string(),
  detail: z.record(z.string(), z.unknown()),
  occurred_at: z.string().datetime(),
});
export type AuditLog = z.infer<typeof AuditLog>;
