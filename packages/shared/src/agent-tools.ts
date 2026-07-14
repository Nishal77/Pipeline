// Agent tool contract (PRD §14.2) — identical whether Option A (realtime speech-to-
// speech) or Option B (STT->LLM->TTS) wins the Phase 1 benchmark. Both pipelines
// dispatch through this same tool set; only the transport differs.
// ponytail: no zod->JSON-schema codegen dep yet — add zod-to-json-schema in Phase 2
// once Option A/B is picked and the function-calling format is fixed.
import { z } from "zod";

export const CheckAvailabilityInput = z.object({
  date_range: z.object({ from: z.string().datetime(), to: z.string().datetime() }),
  job_type: z.string(),
});

export const HoldSlotInput = z.object({ slot_id: z.string() });

export const BookJobInput = z.object({
  slot_id: z.string(),
  customer_name: z.string(),
  customer_phone_e164: z.string(),
  address: z.object({
    line1: z.string(),
    line2: z.string().optional(),
    city: z.string(),
    state: z.string(),
    zip: z.string(),
    access_notes: z.string().optional(),
  }),
  job_type: z.string(),
  problem_notes: z.string().optional(),
});

export const RescheduleInput = z.object({
  booking_id: z.string().uuid(),
  new_slot_id: z.string(),
});

export const CancelInput = z.object({ booking_id: z.string().uuid() });

export const ClassifyUrgencyInput = z.object({
  features: z.array(z.string()), // extracted phrases/signals from the call so far
});
export const ClassifyUrgencyOutput = z.object({
  triage_class: z.enum(["EMERGENCY", "URGENT_TODAY", "ROUTINE"]),
  reason: z.string(),
});

export const EscalateToOwnerInput = z.object({
  reason: z.string(),
  call_id: z.string().uuid(),
});

export const TakeMessageInput = z.object({
  customer_name: z.string().optional(),
  customer_phone_e164: z.string(),
  message: z.string(),
});

export const SendSmsInput = z.object({
  kind: z.enum(["confirm", "reminder24", "reminder1", "otw", "digest", "freeform"]),
  to_e164: z.string(),
  booking_id: z.string().uuid().optional(),
  body_override: z.string().optional(), // freeform only
});

export const LookupCallerInput = z.object({ phone_e164: z.string() });

export const EndCallInput = z.object({
  disposition: z.enum([
    "booked",
    "callback",
    "message",
    "escalated_connected",
    "escalated_unreached",
    "spam",
    "abandoned",
  ]),
});

// Registry: tool name -> input schema. Drives dispatch in apps/voice (Phase 2) and
// keeps the function-calling surface identical across Option A/B.
export const agentTools = {
  check_availability: CheckAvailabilityInput,
  hold_slot: HoldSlotInput,
  book_job: BookJobInput,
  reschedule: RescheduleInput,
  cancel: CancelInput,
  classify_urgency: ClassifyUrgencyInput,
  escalate_to_owner: EscalateToOwnerInput,
  take_message: TakeMessageInput,
  send_sms: SendSmsInput,
  lookup_caller: LookupCallerInput,
  end_call: EndCallInput,
} as const;

export type AgentToolName = keyof typeof agentTools;
export type AgentToolInput<T extends AgentToolName> = z.infer<(typeof agentTools)[T]>;
