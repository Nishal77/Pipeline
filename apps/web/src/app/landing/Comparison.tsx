const ROWS = [
  { label: "Built specifically for plumbing calls", pipeline: true, generic: false, voip: false },
  { label: "Tells a gas leak from a routine call", pipeline: true, generic: false, voip: false },
  { label: "Hard-coded emergency safety script", pipeline: true, generic: false, voip: false },
  { label: "Books directly into your calendar", pipeline: true, generic: "Some do", voip: "Add-on, extra cost" },
  { label: "Flat monthly price, no per-minute fees", pipeline: true, generic: "Varies by plan", voip: false },
  { label: "Always discloses it's an AI", pipeline: true, generic: "Not guaranteed", voip: "Not guaranteed" },
];

function Cell({ value }: { value: boolean | string }) {
  if (value === true) return <span className="text-accent">✓</span>;
  if (value === false) return <span className="text-muted">—</span>;
  return <span className="text-xs text-muted">{value}</span>;
}

export default function Comparison() {
  return (
    <section id="comparison" className="relative border-t border-border px-6 py-24">
      <div className="mx-auto mb-12 flex max-w-2xl flex-col items-center gap-3 text-center">
        <h2 className="text-3xl font-semibold tracking-tight">Taking a message isn&apos;t the hard part. Knowing what it means is.</h2>
        <p className="text-muted">
          Generic AI answering services and phone-system AI add-ons can pick up. Whether they understand
          what they&apos;re hearing — and act on it — is a different question entirely.
        </p>
      </div>
      <div className="mx-auto w-full max-w-3xl overflow-x-auto">
        <table className="w-full min-w-[560px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-border text-left text-muted">
              <th className="py-3 font-normal">Capability</th>
              <th className="py-3 text-center font-medium text-foreground">PipeLine</th>
              <th className="py-3 text-center font-normal">Generic AI answering</th>
              <th className="py-3 text-center font-normal">VoIP AI add-on</th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((r) => (
              <tr key={r.label} className="border-b border-border">
                <td className="py-3 pr-4">{r.label}</td>
                <td className="py-3 text-center">
                  <Cell value={r.pipeline} />
                </td>
                <td className="py-3 text-center">
                  <Cell value={r.generic} />
                </td>
                <td className="py-3 text-center">
                  <Cell value={r.voip} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mx-auto mt-6 max-w-2xl text-center text-xs text-muted">
        Based on publicly listed feature sets as of 2026 — we haven&apos;t run every competitor&apos;s demo line ourselves yet.
        Judge PipeLine on its own demo line above, not this table.
      </p>
    </section>
  );
}
