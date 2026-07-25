// Landing page copy — kept as plain data so section components stay pure layout.
export const DEMO_NUMBER = "+16895882988";
export const DEMO_NUMBER_DISPLAY = "(689) 588-2988";

export const FEATURES = [
  {
    title: "It tells a gas leak from a running toilet.",
    body: "Generic answering services just take a message either way. PipeLine recognizes real emergencies — gas smell, active flooding, a burst pipe — and gets you on the phone immediately. Everything else gets booked without pulling you off the job you're on.",
  },
  {
    title: "It answers on the second ring. Every time.",
    body: "Not a queue, not a callback promise. The second your line forwards, it picks up — nights, weekends, mid-job, doesn't matter.",
  },
  {
    title: "It books straight into your real calendar.",
    body: "Checks what's actually open, holds the slot so two callers can't grab the same window, confirms the address back to the caller before it locks it in.",
  },
  {
    title: "It only quotes prices you've set.",
    body: "You set the price sheet once. It quotes exactly that — never rounds up to close a booking, never invents a number to sound helpful.",
  },
  {
    title: "It runs the whole text thread, not just the call.",
    body: "Booking confirmation, a reminder the day before, one an hour before, reschedule by replying — all automatic. Reply STOP and it stops, immediately, everywhere.",
  },
  {
    title: "It never pretends to be human.",
    body: "Every call opens with 'this is an AI assistant, and this call is recorded.' No exceptions, no setting to turn it off. Your customers always know who they're talking to.",
  },
];

export const STEPS = [
  {
    n: "1",
    title: "Forward your number",
    body: "Dial one code from your phone. Takes 10 seconds. Your number stays yours — customers dial the same number they always have, they just reach us when you can't pick up.",
  },
  {
    n: "2",
    title: " Agent answers and sorts the call",
    body: "Every call gets answered, day or night. The AI figures out fast: is this a burst pipe (drop everything) or a slow drain (book for next week)? Nothing falls through the cracks, nothing waits on hold.",
  },
  {
    n: "3",
    title: " Job lands on your calendar/SMS/CRM",
    body: "Emergency or routine, it gets booked straight into your schedule and synced to Google Calendar or SMS or CRM. You get a text with the address and job details before you even open the app.",
  },
];

export const FAQS = [
  {
    q: "Does it sound robotic?",
    a: "No. Sounds like a real person on your line — calm, clear, no dead air, no \"press 1 for...\" Try the demo number yourself before deciding. That said, it always discloses up front it's an AI and the call's recorded — never fakes being human.",
  },
  {
    q: "What if it messes up a booking?",
    a: "Every call gets a transcript, recording, and short summary you can review. Triage looks off or a job's wrong — fix it in seconds from the app, nothing's locked in without you seeing it. Unsure calls always err toward \"more urgent,\" never \"less.\"",
  },
  {
    q: "What if it can't handle the call?",
    a: "Two failed attempts and it stops guessing — takes a structured message, pings you instead of pretending it understood. Urgent calls always get an escalation attempt to reach you live first.",
  },
  {
    q: "Is my number safe? Do I lose it?",
    a: "Yours, always. We just forward it — one code, ten seconds to set up, same code to undo it anytime.",
  },
  {
    q: "What about contracts?",
    a: "None. Month to month, cancel anytime from the app. Trial first, no surprise renewal.",
  },
  {
    q: "Will it quote a price it shouldn't?",
    a: "No. Only quotes from your price sheet — the one you set. Never invents a number.",
  },
  {
    q: "Does it work for my trade?",
    a: "Plumbing, HVAC, electrical, locksmith, garage door, roadside, clinics, handyman, pest, landscaping — the AI adapts triage and booking rules to whatever service you run.",
  },
  {
    q: "Can customers text STOP?",
    a: "Yes, honored instantly and globally — standard SMS compliance, no exceptions.",
  },
];

export const JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      name: "PipeLine",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      description:
        "AI phone receptionist built specifically for plumbers. Tells a real emergency from routine work, answers 24/7, and books jobs straight into the calendar.",
      offers: [
        { "@type": "Offer", name: "Solo", price: "59", priceCurrency: "USD", priceValidUntil: "2027-01-01" },
        { "@type": "Offer", name: "Pro", price: "99", priceCurrency: "USD", priceValidUntil: "2027-01-01" },
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: FAQS.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ],
};
