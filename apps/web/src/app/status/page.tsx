// §17 status page — public, no auth. Pings each subsystem's own health
// endpoint live on every load (no caching) so it reflects real-time state.
async function checkHealth(url: string | undefined): Promise<boolean> {
  if (!url) return false;
  const res = await fetch(url, { cache: "no-store" }).catch(() => null);
  return Boolean(res?.ok);
}

export default async function StatusPage() {
  const [apiUp, voiceUp, dbUp] = await Promise.all([
    checkHealth(process.env.API_BASE_URL ? `${process.env.API_BASE_URL}/health` : undefined),
    checkHealth(process.env.VOICE_WEBHOOK_BASE_URL ? `${process.env.VOICE_WEBHOOK_BASE_URL}/health` : undefined),
    checkHealth(process.env.API_BASE_URL ? `${process.env.API_BASE_URL}/health/deps` : undefined),
  ]);

  const systems = [
    { name: "Owner app", up: true }, // this page rendered, so it's up
    { name: "Voice engine", up: voiceUp },
    { name: "API", up: apiUp },
    { name: "Database", up: dbUp },
  ];
  const allUp = systems.every((s) => s.up);

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 px-6 py-16">
      <h1 className="text-2xl font-semibold">PipeLine Status</h1>
      <p className={`text-lg font-medium ${allUp ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
        {allUp ? "All systems operational" : "Some systems degraded"}
      </p>
      <ul className="flex flex-col gap-2">
        {systems.map((s) => (
          <li key={s.name} className="flex items-center justify-between rounded-lg border border-zinc-200 p-3 text-sm dark:border-zinc-800">
            <span>{s.name}</span>
            <span className={s.up ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}>{s.up ? "● Operational" : "● Down"}</span>
          </li>
        ))}
      </ul>
    </main>
  );
}
