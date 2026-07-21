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
    body: "A two-minute carrier star-code. Your business number stays yours — customers dial the exact same digits they always have.",
  },
  {
    n: "2",
    title: "It answers, triages, books",
    body: "Greets the caller, figures out how urgent it really is, and either books the job or gets you on the phone if it can't wait.",
  },
  {
    n: "3",
    title: "You get a text, you show up",
    body: "Job's on your calendar with the address already confirmed. No callback, no voicemail to dig through.",
  },
];

export const FAQS = [
  {
    q: "How is this different from a regular answering service?",
    a: "Most answering services — human or AI — just take a message and pass it along. PipeLine actually understands what's being described well enough to tell a real emergency from routine work, and it books the job itself instead of leaving you to call back.",
  },
  {
    q: "Does it actually sound like a person, or a robot reading a script?",
    a: "It's a real conversational AI, not a phone tree — it handles a rambling caller, a bad connection, someone who changes their mind mid-sentence. But it always tells the caller up front that it's an AI. That's not a setting you can turn off.",
  },
  {
    q: "What if it's a real emergency — gas leak, flooding, whatever?",
    a: "That's the part most answering services get wrong. PipeLine is built to catch those specifically: safety instructions first, then it gets you on the phone right away instead of quietly booking an appointment for Tuesday.",
  },
  {
    q: "What happens if it genuinely can't help the caller?",
    a: "After two failed attempts to understand what they need, it stops guessing, takes a message with whatever contact info it has, and texts you. It never loops a confused caller forever.",
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
