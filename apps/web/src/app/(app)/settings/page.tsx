import { createClient } from "@/lib/supabase/server";
import { updateBusinessProfile } from "./actions";
import RetestForwardingButton from "./RetestForwardingButton";
import BillingActions from "./BillingActions";

// FR-6.4 Settings hub.
export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: account } = await supabase.from("accounts").select("id, business_name, owner_cell, email, plan, status").maybeSingle();
  if (!account) {
    return (
      <main className="flex min-h-screen items-center justify-center px-6 text-center">
        <p className="text-zinc-500">No account set up yet.</p>
      </main>
    );
  }

  const [{ data: profile }, { data: phone }] = await Promise.all([
    supabase.from("business_profile").select("greeting_name, service_area, price_sheet").eq("account_id", account.id).maybeSingle(),
    supabase.from("phone_numbers").select("e164, forwarding_verified_at, last_synthetic_check_at").eq("account_id", account.id).maybeSingle(),
  ]);

  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-8 px-4 py-8">
      <h1 className="text-2xl font-semibold">Settings</h1>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-medium">Account</h2>
        <div className="rounded-xl border border-zinc-200 p-4 text-sm dark:border-zinc-800">
          <p>{account.business_name}</p>
          <p className="text-zinc-500">{account.owner_cell}</p>
          <p className="text-zinc-500">{account.email}</p>
          <p className="mt-2 text-xs uppercase text-zinc-400">
            {account.plan} plan · {account.status}
          </p>
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-medium">Business profile</h2>
        <form action={updateBusinessProfile} className="flex flex-col gap-3 rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">
          <label className="text-sm text-zinc-500">Greeting name (what the AI calls your business)</label>
          <input
            name="greeting_name"
            defaultValue={profile?.greeting_name ?? ""}
            className="rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          />
          <label className="text-sm text-zinc-500">Service area ZIPs (comma-separated)</label>
          <input
            name="zips"
            defaultValue={(profile?.service_area as { zips?: string[] })?.zips?.join(", ") ?? ""}
            className="rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          />
          <label className="text-sm text-zinc-500">Radius (miles)</label>
          <input
            name="radius_miles"
            type="number"
            defaultValue={(profile?.service_area as { radius_miles?: number })?.radius_miles ?? 15}
            className="rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          />
          <button type="submit" className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white dark:bg-white dark:text-black">
            Save
          </button>
        </form>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-medium">Price sheet</h2>
        <div className="rounded-xl border border-zinc-200 p-4 text-sm dark:border-zinc-800">
          {profile?.price_sheet && Object.keys(profile.price_sheet).length > 0 ? (
            <ul className="flex flex-col gap-1">
              {Object.entries(profile.price_sheet as Record<string, number>).map(([name, price]) => (
                <li key={name} className="flex justify-between">
                  <span>{name}</span>
                  <span>${price}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-zinc-500">No services configured yet.</p>
          )}
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-medium">Call forwarding</h2>
        <div className="rounded-xl border border-zinc-200 p-4 text-sm dark:border-zinc-800">
          {phone ? (
            <>
              <p>{phone.e164}</p>
              <p className="mt-1 text-zinc-500">
                Last verified: {phone.forwarding_verified_at ? new Date(phone.forwarding_verified_at).toLocaleString() : "never"}
              </p>
              <RetestForwardingButton />
            </>
          ) : (
            <p className="text-zinc-500">No number set up yet.</p>
          )}
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-medium">Billing</h2>
        <div className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">
          <BillingActions />
        </div>
      </section>
    </main>
  );
}
