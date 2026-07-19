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
    <>
      <PushAndInstallBanner />
      {children}
    </>
  );
}
