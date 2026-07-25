const OLD_WAY = [
  "Phone rings while you're under a sink — goes to voicemail",
  "Caller doesn't leave a message, calls the next plumber",
  "You find out about the emergency 3 hours later",
  "You call back, they've already booked someone else",
  "New number, new app, customers have to relearn how to reach you",
  "You guess what you quoted last time",
  "Reminders, confirmations, reschedules — all manual texting",
  "Set up takes a rep call, a contract, a rollout",
];

const PIPELINE_WAY = [
  "AI answers on the second ring, every time",
  "Caller's greeted, understood, and handled — no one calls the next name",
  "Gas leak or flooding gets you a call/SMS the moment it happens",
  "Job's already booked into your calendar before you even see the notification",
  "Same business number — forward it, nothing changes for them",
  "AI only quotes the price sheet you set — every time, no memory needed",
  "Confirmation, 24h + 1h reminders, reschedule-by-reply — automatic",
  "Forward your number, live same afternoon",
];

export default function ProblemSection() {
  return (
    <section className="relative flex w-full flex-col items-center bg-[#FBFBFA] px-6 pt-0 pb-20 sm:px-12 sm:pt-0 sm:pb-24">
      {/* Diagonal blueprint lines (constrained to main column border) */}
      <div className="relative w-full h-12 overflow-visible">
        {/* Diagonal lines overlay */}
        <div className="absolute inset-0 mx-auto max-w-7xl pointer-events-none">
          <svg className="w-full h-full text-neutral-200/80" fill="none">
            <defs>
              <pattern id="problem-diagonal-hatch" width="12" height="48" patternUnits="userSpaceOnUse">
                <line x1="0" y1="0" x2="12" y2="48" stroke="currentColor" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#problem-diagonal-hatch)" />
          </svg>
        </div>
      </div>

      {/* Dashed Grid Title Box */}
      <div className="relative border border-dashed border-neutral-300 bg-white px-8 py-8 max-w-3xl text-center rounded-none shadow-[0_1px_3px_rgba(0,0,0,0.02)] mt-0">
        {/* Corner blueprint handles */}
        <div className="absolute -top-1 -left-1 w-2 h-2 border border-neutral-400 bg-white z-20"></div>
        <div className="absolute -top-1 -right-1 w-2 h-2 border border-neutral-400 bg-white z-20"></div>
        <div className="absolute -bottom-1 -left-1 w-2 h-2 border border-neutral-400 bg-white z-20"></div>
        <div className="absolute -bottom-1 -right-1 w-2 h-2 border border-neutral-400 bg-white z-20"></div>
        
        {/* Solid horizontal line extensions to viewport edges */}
        <div className="absolute right-full top-0 w-[100vw] border-t border-neutral-300/80"></div>
        <div className="absolute left-full top-0 w-[100vw] border-t border-neutral-300/80"></div>
        <div className="absolute right-full bottom-0 w-[100vw] border-b border-neutral-300/80"></div>
        <div className="absolute left-full bottom-0 w-[100vw] border-b border-neutral-300/80"></div>
        
        <h2 className="text-3xl font-normal tracking-tight text-neutral-900 sm:text-4xl leading-tight">
          One column <span className="bg-[#FAFB86] px-3.5 py-0.5 rounded-sm inline-block">costs you jobs</span>. The other books them.
        </h2>
      </div>

      

      {/* Comparison Grid */}
      <div className="mt-16 grid w-full max-w-5xl grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Without PipeLine — clean gray card */}
        <div className="rounded-none border border-neutral-200/60 bg-neutral-50/50 p-6 sm:p-8">
          <div className="flex flex-col gap-1">
            <h3 className="text-xl font-medium text-neutral-900">Without PipeLine</h3>
            <p className="text-xs text-neutral-500">Missed calls. Guesswork. Lost jobs.</p>
          </div>
          <div className="mt-8 flex flex-col gap-3">
            {OLD_WAY.map((item) => (
              <div key={item} className="flex items-start gap-3 rounded-none border border-neutral-200/40 bg-white px-4 py-3 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
                <svg className="w-4 h-4 text-red-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span className="text-sm text-neutral-600 leading-snug">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* With PipeLine — light card with green/accent highlight */}
        <div className="relative overflow-hidden rounded-none border border-neutral-200/80 bg-white p-6 sm:p-8 shadow-[0_12px_30px_rgba(0,0,0,0.02)]">
          <div className="flex flex-col gap-1">
            <h3 className="text-xl font-medium text-neutral-900">
              With <span className="text-lime-600 font-semibold">PipeLine</span>
            </h3>
            <p className="text-xs text-neutral-500">Answered. Booked. Handled.</p>
          </div>
          <div className="mt-8 flex flex-col gap-3">
            {PIPELINE_WAY.map((item) => (
              <div key={item} className="flex items-start gap-3 rounded-none border border-lime-100 bg-lime-50/20 px-4 py-3 shadow-[0_1px_2px_rgba(0,0,0,0.01)]">
                <svg className="w-4 h-4 text-lime-600 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm text-neutral-800 leading-snug">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
