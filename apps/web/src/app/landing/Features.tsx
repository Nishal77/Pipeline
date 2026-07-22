import { FEATURES } from "./data";

export default function Features() {
  return (
    <section id="features" className="relative border-t border-border px-6 py-24">
      <div className="mx-auto mb-14 flex max-w-2xl flex-col items-center gap-3 text-center">
        <h2 className="text-3xl font-semibold tracking-tight">Not a chatbot with a phone number bolted on.</h2>
        <p className="text-muted">Generic AI answering services stop at &quot;take a message.&quot; This is built around what a plumbing call actually needs.</p>
      </div>
      <div className="mx-auto grid w-full max-w-4xl grid-cols-1 gap-x-12 gap-y-10 sm:grid-cols-2">
        {FEATURES.map((f) => (
          <div key={f.title} className="flex flex-col gap-2">
            <h3 className="text-lg font-medium">{f.title}</h3>
            <p className="text-sm text-muted">{f.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
