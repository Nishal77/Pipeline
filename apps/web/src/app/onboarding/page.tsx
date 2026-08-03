"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { trackStep, createAccount, provisionNumber, checkActivation } from "./actions";

interface TradeConfig {
  services: { name: string; durationMin: number }[];
  safetyPolicy: { key: string; label: string; text: string };
  defaultGreeting: string;
}

const TRADE_CONFIGS: Record<string, TradeConfig> = {
  Plumbing: {
    services: [
      { name: "Drain Cleaning", durationMin: 60 },
      { name: "Leak Repair", durationMin: 90 },
      { name: "Water Heater Install", durationMin: 180 },
      { name: "Toilet Repair", durationMin: 60 },
    ],
    safetyPolicy: { key: "gas_leak", label: "Gas Leak Emergency", text: "If the caller smells gas, instruct them to leave the building immediately, avoid touching electrical switches, and dial 911." },
    defaultGreeting: "Thanks for calling {businessName}. Need help under the sink or with a leak today?",
  },
  HVAC: {
    services: [
      { name: "AC Tune-up", durationMin: 60 },
      { name: "Furnace Repair", durationMin: 90 },
      { name: "AC Installation", durationMin: 240 },
      { name: "Heat Pump Service", durationMin: 90 },
    ],
    safetyPolicy: { key: "carbon_monoxide", label: "Carbon Monoxide Alert", text: "If the carbon monoxide alarm is active or caller feels dizzy, instruct them to evacuate the building immediately and dial emergency services." },
    defaultGreeting: "Thanks for calling {businessName}. Are you having trouble heating or cooling today?",
  },
  Electrical: {
    services: [
      { name: "Outlet Installation", durationMin: 45 },
      { name: "Panel Upgrade", durationMin: 180 },
      { name: "Light Fixture Install", durationMin: 60 },
      { name: "Fault Triage", durationMin: 90 },
    ],
    safetyPolicy: { key: "fire_hazard", label: "Electrical Fire Risk", text: "If you observe sparking or smell burning wires, shut off the main electrical breaker immediately if safe, and contact emergency services." },
    defaultGreeting: "Thanks for calling {businessName}. Having electrical issues or need a new installation?",
  },
  Locksmith: {
    services: [
      { name: "House Lockout", durationMin: 30 },
      { name: "Rekey Service", durationMin: 60 },
      { name: "Smart Lock Install", durationMin: 45 },
      { name: "Car Lockout", durationMin: 30 },
    ],
    safetyPolicy: { key: "proof_of_ownership", label: "Ownership Verification Policy", text: "Inform the caller that we require valid photo identification and proof of tenancy or ownership before opening any locks." },
    defaultGreeting: "Hello! Locked out or need a lock changed? Thanks for calling {businessName}.",
  },
  "Garage Door": {
    services: [
      { name: "Spring Replacement", durationMin: 60 },
      { name: "Opener Installation", durationMin: 120 },
      { name: "Roller Tune-up", durationMin: 45 },
      { name: "Door Realignment", durationMin: 60 },
    ],
    safetyPolicy: { key: "high_tension", label: "High-Tension Spring Hazard", text: "Advise the customer not to touch or adjust the garage door springs manually, as they are under high tension and highly dangerous." },
    defaultGreeting: "Thanks for calling {businessName}. Is your garage door stuck, or are you looking for an upgrade?",
  },
  Roadside: {
    services: [
      { name: "Jump Start", durationMin: 30 },
      { name: "Flat Tire Change", durationMin: 30 },
      { name: "Fuel Delivery", durationMin: 20 },
      { name: "Lockout Assist", durationMin: 30 },
    ],
    safetyPolicy: { key: "highway_safety", label: "Roadway Hazard Safety", text: "If the vehicle is stalled on a highway, instruct the driver and passengers to stand behind the guardrail or safely clear of the roadway." },
    defaultGreeting: "Thanks for calling {businessName} dispatch. Where are you stuck, and how can we assist you?",
  },
  Handyman: {
    services: [
      { name: "Drywall Patching", durationMin: 90 },
      { name: "TV Mounting", durationMin: 45 },
      { name: "Door Hanging", durationMin: 60 },
      { name: "Fixture Assembly", durationMin: 60 },
    ],
    safetyPolicy: { key: "utility_clearance", label: "Utility Hazard Check", text: "For structural hanging or drilling, confirm the caller is aware of any hidden wall utilities or pipes." },
    defaultGreeting: "Thanks for calling {businessName}. What handyman project can we help you complete today?",
  },
  Landscaping: {
    services: [
      { name: "Lawn Mowing & Edging", durationMin: 45 },
      { name: "Garden Mulching", durationMin: 120 },
      { name: "Sprinkler Repair", durationMin: 60 },
      { name: "Yard Clean-up", durationMin: 180 },
    ],
    safetyPolicy: { key: "property_markers", label: "Digging & Boundary Policy", text: "Confirm that property lines are marked and underground utility lines (dial 811) are cleared before any deep digging." },
    defaultGreeting: "Thanks for calling {businessName}. Looking for garden care, planting, or general landscaping?",
  },
  "Clinic/Office": {
    services: [
      { name: "Initial Consultation", durationMin: 45 },
      { name: "Follow-up Visit", durationMin: 30 },
      { name: "Urgent Check", durationMin: 60 },
    ],
    safetyPolicy: { key: "acute_medical", label: "Critical Care Emergency Policy", text: "If the caller is suffering from a life-threatening medical emergency, instruct them to hang up and call 911 immediately." },
    defaultGreeting: "Hello, thank you for calling {businessName}. How can we help schedule your consultation today?",
  },
  "Pest Control": {
    services: [
      { name: "General Treatment", durationMin: 60 },
      { name: "Termite Inspection", durationMin: 90 },
      { name: "Rodent Exclusion", durationMin: 120 },
      { name: "Wasp Nest Removal", durationMin: 45 },
    ],
    safetyPolicy: { key: "chemical_exposure", label: "Chemical Application Safety", text: "Instruct the caller that people and pets must remain indoors during pest treatments and for 2 hours post-application." },
    defaultGreeting: "Thanks for calling {businessName}. Are you dealing with an active pest issue, or looking for an inspection?",
  },
};

const COUNTRIES = [
  { name: "United States", code: "+1", flag: "🇺🇸", placeholder: "(555) 555-5555" },
  { name: "Canada", code: "+1", flag: "🇨🇦", placeholder: "(555) 555-5555" },
  { name: "United Kingdom", code: "+44", flag: "🇬🇧", placeholder: "7123 456789" },
  { name: "Australia", code: "+61", flag: "🇦🇺", placeholder: "412 345 678" },
  { name: "India", code: "+91", flag: "🇮🇳", placeholder: "98765 43210" },
];

const TOTAL_STEPS = 6;

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  // Step 1: Business Basics
  const [businessName, setBusinessName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [ownerCell, setOwnerCell] = useState("");
  const [selectedOwnerCountry, setSelectedOwnerCountry] = useState(COUNTRIES[0]);
  const [email, setEmail] = useState("");
  const [tradeType, setTradeType] = useState("");

  // Step 3: Number Setup
  const [numberSetupType, setNumberSetupType] = useState<"forward" | "rent">("forward");
  const [rentAreaCode, setRentAreaCode] = useState("");
  const [selectedTwilioNumber, setSelectedTwilioNumber] = useState<string | null>(null);

  // Step 4: Service Area
  const [zip, setZip] = useState("");
  const [radiusMiles, setRadiusMiles] = useState(15);

  // Step 2: Services & pricing (price is optional — PRD rule "AI never
  // invents numbers", so an unset price just means the AI keeps deferring
  // that job type to the owner instead of quoting it)
  const [services, setServices] = useState<{ name: string; durationMin: number; enabled: boolean; price: string }[]>([]);

  // Step 5: Hours
  const [hours, setHours] = useState<Record<string, { open: string; close: string } | null>>({
    Monday: { open: "08:00", close: "18:00" },
    Tuesday: { open: "08:00", close: "18:00" },
    Wednesday: { open: "08:00", close: "18:00" },
    Thursday: { open: "08:00", close: "18:00" },
    Friday: { open: "08:00", close: "18:00" },
    Saturday: null,
    Sunday: null,
  });
  const [maxJobsPerDay, setMaxJobsPerDay] = useState(6);

  // Greeting Script preview
  const [greetingScript, setGreetingScript] = useState("");

  const [accountId, setAccountId] = useState<string | null>(null);
  const [numberE164, setNumberE164] = useState<string | null>(null);
  const [activated, setActivated] = useState(false);

  async function goToStep(next: number, stepName: string) {
    await trackStep(next, stepName);
    setStep(next);
    setError("");
  }

  const getCountryCode = (countryName: string) => {
    switch (countryName) {
      case "Canada": return "ca";
      case "United Kingdom": return "gb";
      case "Australia": return "au";
      case "India": return "in";
      default: return "us";
    }
  };

  const handleZipFocus = () => {
    const commaIndex = zip.indexOf(",");
    if (commaIndex !== -1) {
      setZip(zip.substring(0, commaIndex).trim());
    }
  };

  const handleZipBlur = async () => {
    const cleaned = zip.split(",")[0].trim();
    if (!cleaned) return;
    try {
      const countryAbbr = getCountryCode(selectedOwnerCountry.name);
      const res = await fetch(`https://api.zippopotam.us/${countryAbbr}/${cleaned}`);
      if (res.ok) {
        const data = await res.json();
        const place = data.places?.[0];
        if (place) {
          const cityName = place["place name"];
          const stateAbbr = place["state abbreviation"] || place["state"] || "";
          const locationSuffix = stateAbbr ? `, ${cityName}, ${stateAbbr}` : `, ${cityName}`;
          setZip(`${cleaned}${locationSuffix}`);
        }
      }
    } catch {
      // ignore lookup errors
    }
  };

  async function handleCreateAccount() {
    setBusy(true);
    setError("");
    const selectedServices = services.filter((s) => s.enabled);
    const activeConfig = TRADE_CONFIGS[tradeType];

    // Format clean owner cell with prefix
    let cleanOwnerCell = ownerCell.replace(/^\+/, "").replace(/\D/g, "");
    if (selectedOwnerCountry.code !== "+1" && cleanOwnerCell.startsWith("0")) {
      cleanOwnerCell = cleanOwnerCell.substring(1);
    }
    const prefixWithoutPlus = selectedOwnerCountry.code.replace(/^\+/, "");
    const finalOwnerCell = cleanOwnerCell.startsWith(prefixWithoutPlus)
      ? `+${cleanOwnerCell}`
      : `${selectedOwnerCountry.code}${cleanOwnerCell}`;

    const cleanZip = zip.split(",")[0].trim();

    const result = await createAccount({
      businessName,
      ownerName,
      ownerCell: finalOwnerCell,
      email,
      zip: cleanZip,
      services: selectedServices.map((s) => ({ name: s.name, durationMin: s.durationMin, price: s.price ? Number(s.price) : undefined })),
      hours,
      radiusMiles,
      tradeType,
      numberSetupType,
      emergencyPolicy: activeConfig ? { [activeConfig.safetyPolicy.key]: activeConfig.safetyPolicy.text } : {},
      greetingScript,
      maxJobsPerDay,
    });
    setBusy(false);
    if (result.error || !result.accountId) return setError(result.error ?? "Something went wrong");
    setAccountId(result.accountId);

    // Proceed to Step 6 (provisioning backend Twilio endpoint number)
    await goToStep(6, "account_created");
  }

  async function handleProvisionNumber() {
    if (!accountId) return;
    setBusy(true);
    setError("");
    const result = await provisionNumber(accountId, selectedTwilioNumber || undefined);
    setBusy(false);
    if (result.error || !result.e164) return setError(result.error ?? "Couldn't provision backend number");
    setNumberE164(result.e164);
  }

  async function handleCheckActivation() {
    if (!accountId) return;
    setBusy(true);
    const result = await checkActivation(accountId);
    setBusy(false);
    if (result.activated) {
      setActivated(true);
      setTimeout(() => router.push("/today"), 2500);
    } else {
      setError("No test call found yet. Please dial your number and let the AI assistant guide you through a booking.");
    }
  }

  const toggleDay = (day: string) => {
    setHours((prev) => ({
      ...prev,
      [day]: prev[day] ? null : { open: "08:00", close: "18:00" },
    }));
  };

  const updateTime = (day: string, type: "open" | "close", val: string) => {
    setHours((prev) => {
      const slot = prev[day];
      if (!slot) return prev;
      return {
        ...prev,
        [day]: { ...slot, [type]: val },
      };
    });
  };

  return (
    <main className="flex min-h-screen w-full flex-col bg-white">
      {/* Clean centered layout */}
      <div className="mx-auto w-full max-w-2xl flex-1 flex flex-col items-center justify-start px-6 py-12 relative">
        {/* Form container */}
        <div className="w-full z-10">

          {/* Step progress bar with numbers */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <span className="text-base font-medium text-neutral-900 tracking-tight">Onboarding Wizard</span>
              <span className="text-base font-medium text-neutral-900">Step {step} of {TOTAL_STEPS}</span>
            </div>
            <div className="flex gap-1.5 w-full">
              {Array.from({ length: TOTAL_STEPS }, (_, i) => (
                <div key={i} className={`h-1.5 flex-1 transition-all ${i < step ? "bg-neutral-900" : "bg-neutral-100"}`} />
              ))}
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-xs font-medium text-red-700 p-4 mb-6 rounded-none leading-normal">
              {error}
            </div>
          )}

          {/* STEP 1: BUSINESS BASICS */}
          {step === 1 && (
            <div className="flex flex-col gap-5">
              <div>
                <h1 className="text-xl font-medium text-neutral-900">Tell us about your business</h1>
                <p className="text-sm text-neutral-500 mt-1">First, let&apos;s map your trade and key contact information.</p>
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex flex-col">
                  <label htmlFor="ownerName" className="text-[14px] font-medium tracking-tight text-neutral-600 mb-1.5">
                    Owner Name <span className="text-red-500 font-bold">*</span>
                  </label>
                  <input
                    id="ownerName"
                    placeholder="e.g. John Doe"
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    autoComplete="off"
                    className="w-full border border-neutral-300 bg-neutral-50/50 px-4 py-3 text-base text-neutral-900 rounded-md focus:outline-none focus:ring-1 focus:ring-neutral-900/20 focus:border-neutral-900"
                  />
                </div>

                <div className="flex flex-col">
                  <label htmlFor="bizName" className="text-[14px] font-medium tracking-tight text-neutral-600 mb-1.5">
                    Business Name <span className="text-red-500 font-bold">*</span>
                  </label>
                  <input
                    id="bizName"
                    placeholder="e.g. Metro Plumbers LLC"
                    value={businessName}
                    onChange={(e) => {
                      const val = e.target.value;
                      setBusinessName(val);
                      const config = TRADE_CONFIGS[tradeType];
                      if (config) {
                        setGreetingScript(config.defaultGreeting.replace("{businessName}", val || "your business"));
                      }
                    }}
                    autoComplete="off"
                    className="w-full border border-neutral-300 bg-neutral-50/50 px-4 py-3 text-base text-neutral-900 rounded-md focus:outline-none focus:ring-1 focus:ring-neutral-900/20 focus:border-neutral-900"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <label htmlFor="trade" className="text-[14px] font-medium tracking-tight text-neutral-600 mb-1.5">
                      Trade / Service Type <span className="text-red-500 font-bold">*</span>
                    </label>
                    <div className="relative">
                      <select
                        id="trade"
                        value={tradeType}
                        onChange={(e) => {
                          const val = e.target.value;
                          setTradeType(val);
                          const config = TRADE_CONFIGS[val];
                          if (config) {
                            setServices(config.services.map((s) => ({ ...s, enabled: true, price: "" })));
                            setGreetingScript(config.defaultGreeting.replace("{businessName}", businessName || "your business"));
                          }
                        }}
                        className="w-full appearance-none border border-neutral-300 bg-neutral-50/50 px-4 py-3 pr-10 text-base text-neutral-900 rounded-md focus:outline-none focus:ring-1 focus:ring-neutral-900/20 focus:border-neutral-900"
                      >
                        <option value="" disabled>Select your trade / service type...</option>
                        {Object.keys(TRADE_CONFIGS).map((trade) => (
                          <option key={trade} value={trade}>{trade}</option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-neutral-400">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col">
                    <label htmlFor="email" className="text-[14px] font-medium tracking-tight text-neutral-600 mb-1.5">
                      Business Email <span className="text-red-500 font-bold">*</span>
                    </label>
                    <input
                      id="email"
                      type="email"
                      placeholder="e.g. john@metroplumbing.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoComplete="off"
                      className="w-full border border-neutral-300 bg-neutral-50/50 px-4 py-3 text-base text-neutral-900 rounded-md focus:outline-none focus:ring-1 focus:ring-neutral-900/20 focus:border-neutral-900"
                    />
                  </div>
                </div>

                <div className="flex flex-col">
                  <label htmlFor="ownerCell" className="text-[14px] font-medium tracking-tight text-neutral-600 mb-1.5">
                    Owner Cell (SMS alerts) <span className="text-red-500 font-bold">*</span>
                  </label>
                  <div className="relative flex">
                    <div className="relative flex items-center gap-1.5 border border-r-0 border-neutral-300 bg-neutral-50 px-3 text-sm text-neutral-600 select-none rounded-l-md">
                      <span className="text-base leading-none">{selectedOwnerCountry.flag}</span>
                      <span className="font-semibold">{selectedOwnerCountry.code}</span>
                      <svg className="w-3 h-3 text-neutral-400 pointer-events-none ml-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                      <select
                        value={selectedOwnerCountry.code}
                        onChange={(e) => {
                          const match = COUNTRIES.find((c) => c.code === e.target.value);
                          if (match) setSelectedOwnerCountry(match);
                        }}
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                      >
                        {COUNTRIES.map((c) => (
                          <option key={c.name} value={c.code}>
                            {c.flag} {c.name} ({c.code})
                          </option>
                        ))}
                      </select>
                    </div>
                    <input
                      id="ownerCell"
                      type="tel"
                      placeholder={selectedOwnerCountry.placeholder}
                      value={ownerCell}
                      onChange={(e) => setOwnerCell(e.target.value)}
                      autoComplete="off"
                      className="w-full border border-neutral-300 bg-neutral-50/50 px-4 py-3 text-base text-neutral-900 rounded-r-md placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-neutral-900/20 focus:border-neutral-900"
                    />
                  </div>
                </div>
              </div>


              <button
                className="w-full bg-neutral-900 hover:bg-neutral-800 text-white font-medium py-3 px-4 rounded-md transition-colors border border-neutral-900 disabled:opacity-50 mt-2"
                disabled={!businessName || !ownerName || !ownerCell || !email || !tradeType}
                onClick={() => goToStep(2, "business_info")}
              >
                Continue
              </button>
            </div>
          )}

          {/* STEP 2: SERVICES & PRICING */}
          {step === 2 && (
            <div className="flex flex-col gap-6">
              <div>
                <h1 className="text-xl font-medium text-neutral-900">Confirm your services & pricing</h1>
                <p className="text-sm text-neutral-500 mt-1">
                  Toggle the services you offer. Prices are optional — leave any blank and the AI will always defer that
                  quote to you instead of guessing a number.
                </p>
              </div>

              {services.length === 0 ? (
                <p className="text-xs text-neutral-500">Pick a trade in the previous step to load its service catalog.</p>
              ) : (
                <div className="flex flex-col gap-2.5 max-h-[360px] overflow-y-auto pr-1">
                  {services.map((s, i) => (
                    <div key={s.name} className="flex items-center justify-between gap-3 border border-neutral-200 p-3 bg-neutral-50/30 rounded-lg">
                      <label className="flex items-center gap-3 min-w-0">
                        <input
                          type="checkbox"
                          checked={s.enabled}
                          onChange={() =>
                            setServices((prev) => prev.map((svc, idx) => (idx === i ? { ...svc, enabled: !svc.enabled } : svc)))
                          }
                          className="h-4 w-4 rounded-none text-neutral-900 focus:ring-neutral-900 border-neutral-300 shrink-0"
                        />
                        <span className="text-sm font-medium text-neutral-800 truncate">{s.name}</span>
                        <span className="text-xs text-neutral-400 shrink-0">{s.durationMin}min</span>
                      </label>
                      <div className="relative shrink-0">
                        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-neutral-400">$</span>
                        <input
                          type="number"
                          min={0}
                          placeholder="optional"
                          value={s.price}
                          disabled={!s.enabled}
                          onChange={(e) =>
                            setServices((prev) => prev.map((svc, idx) => (idx === i ? { ...svc, price: e.target.value } : svc)))
                          }
                          className="w-28 border border-neutral-300 bg-white pl-5 pr-2 py-1.5 text-sm text-neutral-900 rounded-md focus:outline-none focus:ring-1 focus:ring-neutral-900/20 focus:border-neutral-900 disabled:opacity-40"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <button
                className="w-full bg-neutral-900 hover:bg-neutral-800 text-white font-medium py-3 px-4 rounded-md transition-colors border border-neutral-900 disabled:opacity-50 mt-2"
                disabled={services.filter((s) => s.enabled).length === 0}
                onClick={() => goToStep(3, "services_pricing")}
              >
                Continue
              </button>
            </div>
          )}

          {/* STEP 3: NUMBER SETUP SELECTOR */}
          {step === 3 && (
            <div className="flex flex-col gap-6">
              <div>
                <h1 className="text-xl font-medium text-neutral-900">Choose phone routing setup</h1>
                <p className="text-xs text-neutral-500 mt-1">Select how the AI assistant will capture incoming service calls.</p>
              </div>

              <div className="flex flex-col gap-4">
                {/* Option 1: Forward existing */}
                <label
                  onClick={() => {
                    setNumberSetupType("forward");
                    setSelectedTwilioNumber(null);
                  }}
                  className={`flex flex-col p-5 border rounded-lg cursor-pointer select-none transition-all ${
                    numberSetupType === "forward"
                      ? "border-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900/20 focus:border-neutral-900"
                      : "border-neutral-200 hover:border-neutral-300 bg-neutral-50/20"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-base font-medium text-neutral-900">Forward my existing business number</span>
                    <input
                      type="radio"
                      name="numberSetup"
                      checked={numberSetupType === "forward"}
                      onChange={() => {}} // handled by click
                      className="text-neutral-900 focus:ring-neutral-900"
                    />
                  </div>
                  <p className="text-sm text-neutral-500 mt-2 leading-relaxed">
                    Keep your current phone number. We will provide a simple forwarding star-code (e.g. *72) to redirect calls to your AI only when you are busy or can&apos;t pick up.
                  </p>
                </label>

                {/* Option 2: Rent new */}
                <label
                  onClick={() => setNumberSetupType("rent")}
                  className={`flex flex-col p-5 border rounded-lg cursor-pointer select-none transition-all ${
                    numberSetupType === "rent"
                      ? "border-neutral-900 bg-white focus:outline-none focus:ring-1 focus:ring-neutral-900/20 focus:border-neutral-900"
                      : "border-neutral-200 hover:border-neutral-300 bg-neutral-50/20"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-base font-medium text-neutral-900">Rent a new dedicated number</span>
                    <input
                      type="radio"
                      name="numberSetup"
                      checked={numberSetupType === "rent"}
                      onChange={() => {}} // handled by click
                      className="text-neutral-900 focus:ring-neutral-900"
                    />
                  </div>
                  <p className="text-sm text-neutral-500 mt-2 leading-relaxed">
                    Provision a brand new local business number on Twilio instantly. Hand this out as your direct line, or advertise it directly on your website.
                  </p>
                </label>

                {/* Interactive Twilio Selector */}
                {numberSetupType === "rent" && (
                  <div className="mt-2 border border-neutral-200 bg-white p-6 rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col gap-5">
                    <div className="flex flex-col gap-1">
                      <h3 className="text-base font-medium text-neutral-950">Select a phone line</h3>
                      <p className="text-sm text-neutral-500 leading-relaxed">Filter by area code or select from the list of available numbers below.</p>
                    </div>
                    
                    {/* Filter Input */}
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="areaCode" className="text-[14px] font-medium tracking-tight text-neutral-600">Filter by Area Code</label>
                      <div className="relative">
                        <input
                          id="areaCode"
                          maxLength={3}
                          placeholder="e.g. 212"
                          value={rentAreaCode}
                          onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, "");
                            setRentAreaCode(val);
                            setSelectedTwilioNumber(null);
                          }}
                          autoComplete="off"
                          className="w-full border border-neutral-300 bg-neutral-50/20 px-3.5 py-2.5 text-sm text-neutral-900 rounded-md focus:outline-none focus:ring-1 focus:ring-neutral-900/20 focus:border-neutral-900"
                        />
                        {rentAreaCode && (
                          <button
                            onClick={() => {
                              setRentAreaCode("");
                              setSelectedTwilioNumber(null);
                            }}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-neutral-400 hover:text-neutral-600 transition-colors"
                          >
                            Clear
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Available list */}
                    <div className="flex flex-col gap-2.5">
                      <div className="flex justify-between items-center">
                        <span className="text-[14px] font-medium tracking-tight text-neutral-600">
                          Available Lines ({getSimulatedNumbers(rentAreaCode).length})
                        </span>
                        {selectedTwilioNumber && (
                          <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                            Selected
                          </span>
                        )}
                      </div>
                      
                      <div className="flex flex-col gap-2 max-h-[220px] overflow-y-auto pr-1">
                        {getSimulatedNumbers(rentAreaCode).map((num) => {
                          const isSelected = selectedTwilioNumber === num;
                          return (
                            <div
                              key={num}
                              onClick={() => setSelectedTwilioNumber(num)}
                              className={`flex items-center justify-between p-3.5 border rounded-lg cursor-pointer transition-all ${
                                isSelected
                                  ? "border-neutral-200 bg-emerald-50/50"
                                  : "border-neutral-200 bg-white hover:border-neutral-300 hover:bg-neutral-50/30"
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${
                                  isSelected ? "border-emerald-500 bg-emerald-500" : "border-neutral-300 bg-white"
                                }`}>
                                  {isSelected && (
                                    <div className="w-1.5 h-1.5 rounded-full bg-white" />
                                  )}
                                </div>
                                <span className="text-sm font-mono font-medium tracking-tight text-neutral-800">{num}</span>
                              </div>
                              
                              <div className="flex items-center gap-1.5">
                                <span className="text-[9px] font-bold px-1.5 py-0.5 bg-neutral-100 text-neutral-500 rounded uppercase tracking-wider">Voice</span>
                                <span className="text-[9px] font-bold px-1.5 py-0.5 bg-neutral-100 text-neutral-500 rounded uppercase tracking-wider">SMS</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <button
                className="w-full bg-neutral-900 hover:bg-neutral-800 text-white font-medium py-3 px-4 rounded-lg transition-colors border border-neutral-900 mt-2 disabled:opacity-50"
                disabled={numberSetupType === "rent" && !selectedTwilioNumber}
                onClick={() => goToStep(4, "number_setup_type")}
              >
                Continue
              </button>
            </div>
          )}

          {/* STEP 4: SERVICE AREA */}
          {step === 4 && (
            <div className="flex flex-col gap-6">
              <div>
                <h1 className="text-xl font-medium text-neutral-900">Define your service area</h1>
                <p className="text-sm text-neutral-500 mt-1">Specify where your business operates so the Agent handles dispatch zoning correctly.</p>
              </div>

              <div className="flex flex-col gap-5">
                <div className="flex flex-col">
                  <label htmlFor="zipCode" className="text-[14px] font-medium tracking-tight text-neutral-600 mb-1.5">Base ZIP / Postal Code</label>
                  <input
                    id="zipCode"
                    placeholder="e.g. 10001"
                    value={zip}
                    onChange={(e) => setZip(e.target.value)}
                    onFocus={handleZipFocus}
                    onBlur={handleZipBlur}
                    autoComplete="off"
                    className="w-full border border-neutral-300 bg-neutral-50/50 px-4 py-3 text-base text-neutral-900 rounded-md focus:outline-none focus:ring-1 focus:ring-neutral-900/20 focus:border-neutral-900"
                  />
                </div>

                <div className="flex flex-col">
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-[14px] font-medium tracking-tight text-neutral-600">Service Radius</label>
                    <span className="text-[14px] font-medium text-neutral-900">{radiusMiles} miles</span>
                  </div>
                  <input
                    type="range"
                    min={5}
                    max={100}
                    step={5}
                    value={radiusMiles}
                    onChange={(e) => setRadiusMiles(Number(e.target.value))}
                    className="w-full h-1 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-neutral-900"
                  />
                  <div className="flex justify-between text-[12px] text-neutral-400 mt-1">
                    <span>5 miles</span>
                    <span>100 miles</span>
                  </div>
                </div>
              </div>

              <button
                className="w-full bg-neutral-900 hover:bg-neutral-800 text-white font-medium py-3 px-4 rounded-lg transition-colors border border-neutral-900 disabled:opacity-50 mt-2"
                disabled={!zip}
                onClick={() => goToStep(5, "service_area")}
              >
                Continue
              </button>
            </div>
          )}

          {/* STEP 5: HOURS & DAILY CAP */}
          {step === 5 && (
            <div className="flex flex-col gap-6">
              <div>
                <h1 className="text-xl font-medium text-neutral-900">Set availability & workload caps</h1>
                <p className="text-xs text-neutral-500 mt-1">Configure normal business hours and caps. Emergency calls are handled 24/7.</p>
              </div>

              <div className="flex flex-col gap-4 max-h-[300px] overflow-y-auto md:max-h-none md:overflow-visible pr-1">
                {Object.keys(hours).map((day) => {
                  const val = hours[day];
                  return (
                    <div key={day} className="flex flex-col sm:flex-row sm:items-center justify-between border border-neutral-200 p-3 bg-neutral-50/30 gap-2 rounded-lg">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={!!val}
                          onChange={() => toggleDay(day)}
                          className="h-4 w-4 rounded-none text-neutral-900 focus:ring-neutral-900 border-neutral-300"
                        />
                        <span className="text-base font-medium text-neutral-800 tracking-tight w-12">{day}</span>
                      </div>

                      {val ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="time"
                            value={val.open}
                            onChange={(e) => updateTime(day, "open", e.target.value)}
                            className="border border-neutral-200 px-2.5 py-1 text-xs rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-neutral-900"
                          />
                          <span className="text-xs text-neutral-600">to</span>
                          <input
                            type="time"
                            value={val.close}
                            onChange={(e) => updateTime(day, "close", e.target.value)}
                            className="border border-neutral-200 px-2.5 py-1 text-xs rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-neutral-900"
                          />
                        </div>
                      ) : (
                        <span className="text-xs text-neutral-600 font-medium">Closed for booking</span>
                      )}
                    </div>
                  );
                })}

                {/* Workload cap slider */}
                <div className="flex flex-col border-t border-dashed border-neutral-200 pt-4 mt-2">
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-[10px] font-bold tracking-wider text-neutral-400 uppercase">Max Routine Jobs / Day</label>
                    <span className="text-xs font-semibold text-neutral-900">{maxJobsPerDay} jobs</span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={20}
                    value={maxJobsPerDay}
                    onChange={(e) => setMaxJobsPerDay(Number(e.target.value))}
                    className="w-full h-1 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-neutral-900"
                  />
                </div>
              </div>

              <button
                className="w-full bg-neutral-900 hover:bg-neutral-800 text-white font-medium py-3 px-4 rounded-none transition-colors border border-neutral-900 disabled:opacity-50 mt-2"
                disabled={busy}
                onClick={handleCreateAccount}
              >
                {busy ? "Configuring systems…" : "Create account & configure profile"}
              </button>
            </div>
          )}

          {/* STEP 6: ACTIVATION TEST CALL */}
          {step === 6 && !numberE164 && (
            <div className="flex flex-col gap-6">
              <div>
                <h1 className="text-xl font-medium text-neutral-900">Provision your AI line</h1>
                <p className="text-xs text-neutral-500 mt-1">We will purchase and hook up a secure Twilio backend endpoint for your account.</p>
              </div>

              <div className="bg-lime-50/50 border border-lime-100 p-4">
                <h2 className="text-xs font-bold text-lime-900 uppercase">Configuration Summary</h2>
                <ul className="text-xs text-lime-800 space-y-1.5 mt-2.5 leading-relaxed">
                  <li>• Account ready for <span className="font-semibold">{businessName}</span> ({tradeType})</li>
                  <li>• {services.length} active service templates configured</li>
                  <li>• Phone routing path: <span className="font-semibold">{numberSetupType === "forward" ? "Carrier Forwarding" : "Direct Twilio Line"}</span></li>
                </ul>
              </div>

              <button
                className="w-full bg-neutral-900 hover:bg-neutral-800 text-white font-medium py-3 px-4 rounded-none transition-colors border border-neutral-900 disabled:opacity-50 mt-2"
                onClick={handleProvisionNumber}
                disabled={busy}
              >
                {busy ? "Provisioning Twilio line…" : "Provision AI phone line"}
              </button>
            </div>
          )}

          {step === 6 && numberE164 && !activated && (
            <div className="flex flex-col gap-6">
              <div>
                <h1 className="text-xl font-medium text-neutral-900">Activate your assistant</h1>
                <p className="text-xs text-neutral-500 mt-1">Let&apos;s run a real test call to confirm that calls route and the AI schedules correctly.</p>
              </div>

              <div className="flex flex-col gap-4">
                <div className="border border-neutral-200 bg-neutral-50/40 p-5 text-center">
                  <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">Your routing line</span>
                  <span className="text-2xl font-semibold text-neutral-900 font-mono tracking-wider">{numberE164}</span>
                </div>

                {numberSetupType === "forward" ? (
                  <div className="border border-dashed border-neutral-200 p-4 text-xs text-neutral-600 leading-relaxed bg-white">
                    <span className="font-bold text-neutral-800 block mb-1.5">Carrier Forwarding Setup Instructions</span>
                    To route calls, dial the star-code below directly from your business cell phone:
                    <div className="bg-neutral-50 border border-neutral-200 p-2.5 font-mono text-sm text-neutral-800 text-center my-2 select-all">
                      *72 {numberE164.replace(/\s+/g, "")}
                    </div>
                    Dialing this code redirects callers to your AI assistant whenever your main line is busy or unanswered. Your number remains exactly the same.
                  </div>
                ) : (
                  <p className="text-xs text-neutral-500 leading-relaxed">
                    This is your new business number. Dial it directly to run a test call.
                  </p>
                )}

                <div className="bg-amber-50/60 border border-amber-200 p-4 text-xs text-amber-800 leading-relaxed">
                  <span className="font-bold text-amber-900 block mb-1">Test checklist</span>
                  1. Dial the number and play the role of a fake client.<br />
                  2. Book a service job (e.g. ask to book a leak repair for tomorrow).<br />
                  3. The AI will confirm it. Once confirmed, hit the verification check below.
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  className="w-full bg-neutral-900 hover:bg-neutral-800 text-white font-medium py-3 px-4 rounded-none transition-colors border border-neutral-900 disabled:opacity-50"
                  onClick={handleCheckActivation}
                  disabled={busy}
                >
                  {busy ? "Verifying logs…" : "Verify test call & activate"}
                </button>

                <a
                  href="/oauth/google/start"
                  target="_blank"
                  className="text-xs text-neutral-500 hover:text-neutral-900 transition-colors text-center underline underline-offset-2 mt-1.5"
                >
                  Optional: Connect Google Calendar first
                </a>
              </div>
            </div>
          )}

          {activated && (
            <div className="flex flex-col items-center gap-3 py-10 text-center">
              <span className="text-4xl animate-bounce">🎉</span>
              <h2 className="text-xl font-medium text-neutral-900">Assistant Live & Activated!</h2>
              <p className="text-xs text-neutral-500 max-w-xs leading-normal">
                Test booking detected. We are syncing configurations and routing you straight to your dispatch dashboard...
              </p>
            </div>
          )}

        </div>
      </div>
    </main>
  );
}

const TWILIO_SIMULATED_NUMBERS: Record<string, string[]> = {
  "212": ["+1 (212) 555-0144", "+1 (212) 555-0192", "+1 (212) 555-0183", "+1 (212) 555-0177"],
  "312": ["+1 (312) 555-0211", "+1 (312) 555-0234", "+1 (312) 555-0298", "+1 (312) 555-0245"],
  "604": ["+1 (604) 555-0322", "+1 (604) 555-0391", "+1 (604) 555-0388", "+1 (604) 555-0377"],
  "416": ["+1 (416) 555-0455", "+1 (416) 555-0412", "+1 (416) 555-0466", "+1 (416) 555-0433"],
  "917": ["+1 (917) 555-0599", "+1 (917) 555-0544", "+1 (917) 555-0588", "+1 (917) 555-0522"]
};

function getSimulatedNumbers(areaCode: string): string[] {
  if (TWILIO_SIMULATED_NUMBERS[areaCode]) {
    return TWILIO_SIMULATED_NUMBERS[areaCode];
  }
  const code = areaCode || "888";
  return [
    `+1 (${code}) 555-0601`,
    `+1 (${code}) 555-0602`,
    `+1 (${code}) 555-0603`,
    `+1 (${code}) 555-0604`,
  ];
}
