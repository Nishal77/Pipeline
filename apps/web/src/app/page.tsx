// Placeholder only — the owner app (Today/Calls/Calendar/Settings, PRD §12) is
// Phase 4 scope. This just proves the Next.js PWA shell is wired into the monorepo.
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-2 bg-white px-6 text-center dark:bg-black">
      <h1 className="text-2xl font-semibold text-black dark:text-white">PipeLine</h1>
      <p className="max-w-sm text-zinc-600 dark:text-zinc-400">
        AI phone-office for solo US plumbers. Owner app ships in Phase 4.
      </p>
    </main>
  );
}
