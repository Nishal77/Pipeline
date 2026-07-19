"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { trackStep, createAccount, provisionNumber, checkActivation } from "./actions";

const DEFAULT_SERVICES = [
  { name: "Drain Cleaning", price: 150, durationMin: 60 },
  { name: "Leak Repair", price: 200, durationMin: 90 },
  { name: "Water Heater Install", price: 800, durationMin: 180 },
  { name: "Toilet Repair", price: 175, durationMin: 60 },
];
const DEFAULT_HOURS = {
  mon: { open: "08:00", close: "18:00" },
  tue: { open: "08:00", close: "18:00" },
  wed: { open: "08:00", close: "18:00" },
  thu: { open: "08:00", close: "18:00" },
  fri: { open: "08:00", close: "18:00" },
  sat: null,
  sun: null,
};

const TOTAL_STEPS = 5;

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const [businessName, setBusinessName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [ownerCell, setOwnerCell] = useState("");
  const [email, setEmail] = useState("");
  const [zip, setZip] = useState("");
  const [radiusMiles, setRadiusMiles] = useState(15);
  const [selectedServices, setSelectedServices] = useState<Set<string>>(new Set(DEFAULT_SERVICES.map((s) => s.name)));

  const [accountId, setAccountId] = useState<string | null>(null);
  const [numberE164, setNumberE164] = useState<string | null>(null);
  const [activated, setActivated] = useState(false);

  async function goToStep(next: number, stepName: string) {
    await trackStep(next, stepName);
    setStep(next);
    setError("");
  }

  async function handleCreateAccount() {
    setBusy(true);
    setError("");
    const result = await createAccount({
      businessName,
      ownerName,
      ownerCell,
      email,
      zip,
      services: DEFAULT_SERVICES.filter((s) => selectedServices.has(s.name)),
      hours: DEFAULT_HOURS,
      radiusMiles,
    });
    setBusy(false);
    if (result.error || !result.accountId) return setError(result.error ?? "Something went wrong");
    setAccountId(result.accountId);
    await goToStep(5, "account_created");
  }

  async function handleProvisionNumber() {
    if (!accountId) return;
    setBusy(true);
    setError("");
    const result = await provisionNumber(accountId);
    setBusy(false);
    if (result.error || !result.e164) return setError(result.error ?? "Couldn't get a number");
    setNumberE164(result.e164);
  }

  async function handleCheckActivation() {
    if (!accountId) return;
    setBusy(true);
    const result = await checkActivation(accountId);
    setBusy(false);
    if (result.activated) {
      setActivated(true);
      setTimeout(() => router.push("/today"), 2000);
    } else {
      setError("No booking found yet — call your number and try booking a job first.");
    }
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col gap-6 px-4 py-8">
      <div className="flex gap-1">
        {Array.from({ length: TOTAL_STEPS }, (_, i) => (
          <div key={i} className={`h-1.5 flex-1 rounded-full ${i < step ? "bg-black dark:bg-white" : "bg-zinc-200 dark:bg-zinc-800"}`} />
        ))}
      </div>

      {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">{error}</p>}

      {step === 1 && (
        <div className="flex flex-col gap-4">
          <h1 className="text-xl font-semibold">Tell us about your business</h1>
          <input className="rounded-lg border border-zinc-300 px-4 py-3 text-base dark:border-zinc-700 dark:bg-zinc-900 dark:text-white" placeholder="Business name" value={businessName} onChange={(e) => setBusinessName(e.target.value)} />
          <input className="rounded-lg border border-zinc-300 px-4 py-3 text-base dark:border-zinc-700 dark:bg-zinc-900 dark:text-white" placeholder="Your name" value={ownerName} onChange={(e) => setOwnerName(e.target.value)} />
          <input className="rounded-lg border border-zinc-300 px-4 py-3 text-base dark:border-zinc-700 dark:bg-zinc-900 dark:text-white" placeholder="Your cell (+1...)" value={ownerCell} onChange={(e) => setOwnerCell(e.target.value)} />
          <input className="rounded-lg border border-zinc-300 px-4 py-3 text-base dark:border-zinc-700 dark:bg-zinc-900 dark:text-white" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <button
            className="rounded-lg bg-black px-4 py-3 text-base font-medium text-white disabled:opacity-50 dark:bg-white dark:text-black"
            disabled={!businessName || !ownerName || !ownerCell || !email}
            onClick={() => goToStep(2, "business_info")}
          >
            Continue
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="flex flex-col gap-4">
          <h1 className="text-xl font-semibold">What services do you offer?</h1>
          <div className="flex flex-col gap-2">
            {DEFAULT_SERVICES.map((s) => (
              <label key={s.name} className="flex items-center gap-3 rounded-lg border border-zinc-200 p-3 dark:border-zinc-800">
                <input
                  type="checkbox"
                  checked={selectedServices.has(s.name)}
                  onChange={(e) => {
                    const next = new Set(selectedServices);
                    e.target.checked ? next.add(s.name) : next.delete(s.name);
                    setSelectedServices(next);
                  }}
                />
                <span>
                  {s.name} — ${s.price}
                </span>
              </label>
            ))}
          </div>
          <button className="rounded-lg bg-black px-4 py-3 text-base font-medium text-white disabled:opacity-50 dark:bg-white dark:text-black" onClick={() => goToStep(3, "services_selected")}>
            Continue
          </button>
        </div>
      )}

      {step === 3 && (
        <div className="flex flex-col gap-4">
          <h1 className="text-xl font-semibold">Hours &amp; service area</h1>
          <p className="text-sm text-zinc-500">Default hours: 8am–6pm weekdays. Emergencies handled 24/7 regardless.</p>
          <input className="rounded-lg border border-zinc-300 px-4 py-3 text-base dark:border-zinc-700 dark:bg-zinc-900 dark:text-white" placeholder="Home ZIP code" value={zip} onChange={(e) => setZip(e.target.value)} />
          <label className="text-sm text-zinc-500">Service radius: {radiusMiles} miles</label>
          <input type="range" min={5} max={50} value={radiusMiles} onChange={(e) => setRadiusMiles(Number(e.target.value))} />
          <button className="rounded-lg bg-black px-4 py-3 text-base font-medium text-white disabled:opacity-50 dark:bg-white dark:text-black" disabled={!zip} onClick={handleCreateAccount}>
            {busy ? "Setting up…" : "Create my account"}
          </button>
        </div>
      )}

      {step === 5 && !numberE164 && (
        <div className="flex flex-col gap-4">
          <h1 className="text-xl font-semibold">Get your business line</h1>
          <p className="text-sm text-zinc-500">
            We&apos;ll set up a number for your AI assistant to answer. Forward your existing business number to it
            using your carrier&apos;s star-code (instructions after setup).
          </p>
          <button className="rounded-lg bg-black px-4 py-3 text-base font-medium text-white disabled:opacity-50 dark:bg-white dark:text-black" onClick={handleProvisionNumber}>
            {busy ? "Getting your number…" : "Get my number"}
          </button>
        </div>
      )}

      {step === 5 && numberE164 && !activated && (
        <div className="flex flex-col gap-4">
          <h1 className="text-xl font-semibold">Try it yourself</h1>
          <p className="text-sm text-zinc-500">Your number is ready:</p>
          <p className="rounded-lg border border-zinc-200 p-4 text-center text-2xl font-semibold dark:border-zinc-800">{numberE164}</p>
          <p className="text-sm text-zinc-500">
            Call it now and book yourself a fake job — that&apos;s how you&apos;ll know it works.
          </p>
          <button className="rounded-lg bg-black px-4 py-3 text-base font-medium text-white disabled:opacity-50 dark:bg-white dark:text-black" onClick={handleCheckActivation}>
            {busy ? "Checking…" : "I booked a job, check now"}
          </button>
        </div>
      )}

      {activated && (
        <div className="flex flex-col items-center gap-2 py-8 text-center">
          <p className="text-3xl">🎉</p>
          <p className="text-lg font-medium">It works! Taking you to your dashboard…</p>
        </div>
      )}
    </main>
  );
}
