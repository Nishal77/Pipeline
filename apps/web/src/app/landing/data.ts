// Landing page copy — kept as plain data so section components stay pure layout.
export const DEMO_NUMBER = "+16895882988";
export const DEMO_NUMBER_DISPLAY = "(689) 588-2988";

export const FEATURES = [
  {
    title: "It answers on the second ring. Every time.",
    body: "Not a queue, not a callback promise. The second your line forwards, the AI picks up — nights, weekends, mid-job, doesn't matter.",
  },
  {
    title: "It can tell a drip from a disaster.",
    body: "Gas smell, active flooding, a burst pipe — it recognizes the real emergencies and gets you on the phone immediately. Everything else gets booked without pulling you off the job you're already on.",
  },
  {
    title: "It books straight into your real calendar.",
    body: "Checks what's actually open, holds the slot so two callers can't grab the same window, confirms the address back to the caller before it locks it in.",
  },
  {
    title: "It only says numbers you've told it to say.",
    body: "You set the price sheet once. It quotes exactly that — never rounds up to close a booking, never invents a number to sound helpful.",
  },
  {
    title: "It handles the whole text thread, not just the call.",
    body: "Booking confirmation, a reminder the day before, one an hour before, reschedule by replying — all of it automatic. Reply STOP and it stops, immediately, everywhere.",
  },
  {
    title: "It never pretends to be you.",
    body: "Every single call opens with 'this is an AI assistant, and this call is recorded.' No exceptions, no configuration to turn it off. Your customers know exactly who they're talking to.",
  },
];

export const STEPS = [
  {
    n: "1",
    title: "Forward your number",
    body: "A two-minute carrier star-code. Your business number stays yours — customers dial the exact same digits they always have.",
  },
  {
    n: "2",
    title: "It answers, triages, books",
    body: "The AI greets the caller, figures out how urgent it is, and either books the job or gets you on the phone if it can't wait.",
  },
  {
    n: "3",
    title: "You get a text, you show up",
    body: "Job's on your calendar with the address already confirmed. No callback, no voicemail to dig through.",
  },
];

export const FAQS = [
  {
    q: "Does it actually sound like a person, or a robot reading a script?",
    a: "It's a real conversational AI, not a phone tree — it can handle a rambling caller, a bad connection, someone who changes their mind mid-sentence. But it always tells the caller up front that it's an AI. That's not a setting you can turn off, and we're not going to pretend otherwise.",
  },
  {
    q: "What happens if it genuinely can't help the caller?",
    a: "After two failed attempts to understand what they need, it stops guessing, takes a message with whatever contact info it has, and texts you. It never loops a confused caller forever.",
  },
  {
    q: "What if it's a real emergency — gas leak, flooding, whatever?",
    a: "It's built to catch those specifically and treat them differently from a routine call: safety instructions first, then it gets you on the phone right away instead of quietly booking an appointment for Tuesday.",
  },
  {
    q: "Do I have to give up my business number?",
    a: "No. You forward your existing number to it. Customers dial what they've always dialed — they never see a new number, never know anything changed on your end.",
  },
  {
    q: "What's the contract length?",
    a: "Month to month. Cancel whenever — you keep every job it already booked, and your number just forwards to voicemail again.",
  },
  {
    q: "Is call data actually private?",
    a: "Recordings and transcripts are encrypted and only visible to you, behind a signed link that expires. Nothing about your calls trains a model that anyone else's business touches.",
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
        "24/7 AI phone receptionist for solo plumbers. Answers every call, triages emergencies, and books jobs straight into the calendar.",
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
