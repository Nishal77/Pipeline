export default function ProblemSection() {
  return (
    <section className="relative mx-auto flex w-full max-w-6xl flex-col px-6 py-16">
      <h2 className="text-center text-3xl font-semibold">One column costs you jobs. The other books them.</h2>
      <div className="mt-12 overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="border-b-2 border-border px-6 py-4 text-left text-xl font-semibold">Without PipeLine</th>
              <th className="border-b-2 border-border px-6 py-4 text-left text-xl font-semibold">With PipeLine</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-border">
              <td className="px-6 py-4">Phone rings while you're under a sink — goes to voicemail</td>
              <td className="px-6 py-4">AI answers on the second ring, every time</td>
            </tr>
            <tr className="border-b border-border">
              <td className="px-6 py-4">Caller doesn't leave a message, calls the next plumber</td>
              <td className="px-6 py-4">Caller's greeted, understood, and handled — no one calls the next name</td>
            </tr>
            <tr className="border-b border-border">
              <td className="px-6 py-4">You find out about the emergency 3 hours later</td>
              <td className="px-6 py-4">Gas leak or flooding gets you a call/SMS the moment it happens</td>
            </tr>
            <tr className="border-b border-border">
              <td className="px-6 py-4">You call back, they've already booked someone else</td>
              <td className="px-6 py-4">Job's already booked into your calendar before you even see the notification</td>
            </tr>
            <tr className="border-b border-border">
              <td className="px-6 py-4">New number, new app, customers have to relearn how to reach you</td>
              <td className="px-6 py-4">Same business number — forward it, nothing changes for them</td>
            </tr>
            <tr className="border-b border-border">
              <td className="px-6 py-4">You guess what you quoted last time</td>
              <td className="px-6 py-4">AI only quotes the price sheet you set — every time, no memory needed</td>
            </tr>
            <tr className="border-b border-border">
              <td className="px-6 py-4">Reminders, confirmations, reschedules — all manual texting</td>
              <td className="px-6 py-4">Confirmation, 24h + 1h reminders, reschedule-by-reply — automatic</td>
            </tr>
            <tr className="border-b border-border">
              <td className="px-6 py-4">Answering service just takes a message, still your job to sort urgent from routine</td>
              <td className="px-6 py-4">AI tells a real emergency from a routine call before you're even involved</td>
            </tr>
            <tr>
              <td className="px-6 py-4">Set up takes a rep call, a contract, a rollout</td>
              <td className="px-6 py-4">Forward your number, live same afternoon</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}
