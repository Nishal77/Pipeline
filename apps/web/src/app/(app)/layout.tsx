import PushAndInstallBanner from "./PushAndInstallBanner";
import { createClient } from "@/lib/supabase/server";

// PRD §15 — app_opened, fired on every protected-shell render (best-effort,
// never blocks rendering if it fails).
async function trackAppOpened() {
  const supabase = await createClient();
  const { data: account } = await supabase.from("accounts").select("id").maybeSingle();
  if (account) await supabase.from("events_analytics").insert({ account_id: account.id, name: "app_opened", properties: {} });
}

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  await trackAppOpened().catch(() => {});
  
  return (
    <main className="flex min-h-screen w-full flex-col bg-[#FBFBFA]">
      <div className="mx-auto w-full max-w-5xl flex-1 border-l border-r border-neutral-200/80 flex flex-col px-6 py-12 bg-[#FBFBFA] relative">
        {/* Faint blueprint background grid */}
        <div className="absolute inset-0 bg-[radial-gradient(rgba(0,0,0,0.015)_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>
        
        <PushAndInstallBanner />
        {children}
      </div>
    </main>
  );
}
