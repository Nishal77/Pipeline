import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function CallDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: call } = await supabase.from("calls").select("*").eq("id", id).maybeSingle();
  if (!call) notFound();

  let transcript: string | null = null;
  if (call.transcript_url) {
    const res = await fetch(call.transcript_url).catch(() => null);
    transcript = res?.ok ? await res.text() : null;
  }

  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-4 px-4 py-8">
      <Link href="/calls" className="text-sm text-blue-600 underline dark:text-blue-400">
        ← Back to calls
      </Link>
      <h1 className="text-2xl font-semibold">{call.from_e164}</h1>
      <p className="text-sm text-zinc-500">{new Date(call.started_at).toLocaleString()} · {call.duration_s}s</p>

      <div className="flex gap-2">
        {call.triage_class === "EMERGENCY" && (
          <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs text-red-700 dark:bg-red-950 dark:text-red-300">Emergency</span>
        )}
        <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs dark:bg-zinc-800">{call.outcome}</span>
      </div>

      <p className="rounded-lg border border-zinc-200 p-4 text-sm dark:border-zinc-800">{call.summary}</p>

      {call.audio_url ? (
        // eslint-disable-next-line jsx-a11y/media-has-caption
        <audio controls src={call.audio_url} className="w-full" />
      ) : (
        <p className="text-sm text-zinc-500">No recording available.</p>
      )}

      <div>
        <h2 className="mb-2 text-lg font-medium">Transcript</h2>
        {transcript ? (
          <pre className="whitespace-pre-wrap rounded-lg border border-zinc-200 p-4 text-sm dark:border-zinc-800">{transcript}</pre>
        ) : (
          <p className="text-sm text-zinc-500">Transcript couldn&apos;t be loaded.</p>
        )}
      </div>
    </main>
  );
}
