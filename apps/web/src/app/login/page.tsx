"use client";
import { useActionState, useState } from "react";
import { sendOtp, verifyOtp, sendMagicLink } from "./actions";

const COUNTRIES = [
  { name: "United States", code: "+1", flag: "🇺🇸", placeholder: "(555) 555-5555" },
  { name: "Canada", code: "+1", flag: "🇨🇦", placeholder: "(555) 555-5555" },
  { name: "United Kingdom", code: "+44", flag: "🇬🇧", placeholder: "7123 456789" },
  { name: "Australia", code: "+61", flag: "🇦🇺", placeholder: "412 345 678" },
  { name: "India", code: "+91", flag: "🇮🇳", placeholder: "98765 43210" },
];

export default function LoginPage() {
  const [sendState, sendAction, sending] = useActionState(sendOtp, {});
  const [verifyState, verifyAction, verifying] = useActionState(verifyOtp, {});
  const [magicState, magicAction, magicSending] = useActionState(sendMagicLink, {});
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]);
  const [useMagicLink, setUseMagicLink] = useState(false);

  const otpSent = sendState.sent;

  // Build clean international phone number
  let cleanPhone = phone.replace(/^\+/, "").replace(/\D/g, "");
  if (selectedCountry.code !== "+1" && cleanPhone.startsWith("0")) {
    cleanPhone = cleanPhone.substring(1);
  }
  const prefixWithoutPlus = selectedCountry.code.replace(/^\+/, "");
  const finalPhone = cleanPhone.startsWith(prefixWithoutPlus)
    ? `+${cleanPhone}`
    : `${selectedCountry.code}${cleanPhone}`;

  return (
    <main className="flex min-h-screen w-full flex-col bg-[#FBFBFA]">
      {/* Root Layout Columns (Matching Landing Page Grid) */}
      <div className="mx-auto w-full max-w-7xl flex-1 border-l border-r border-neutral-200/80 flex flex-col items-center justify-center px-6 py-16 bg-[#FBFBFA] relative">
        
        {/* Faint blueprint background accent */}
        <div className="absolute inset-0 bg-[radial-gradient(rgba(0,0,0,0.02)_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>

        {/* Blueprint Box Card Wrapper */}
        <div className="relative border border-dashed border-neutral-300 bg-white p-8 sm:p-10 max-w-md w-full rounded-none shadow-[0_1px_3px_rgba(0,0,0,0.02)] z-10">
          
          {/* Blueprint Corner Handles */}
          <div className="absolute -top-1 -left-1 w-2 h-2 border border-neutral-400 bg-white z-20"></div>
          <div className="absolute -top-1 -right-1 w-2 h-2 border border-neutral-400 bg-white z-20"></div>
          <div className="absolute -bottom-1 -left-1 w-2 h-2 border border-neutral-400 bg-white z-20"></div>
          <div className="absolute -bottom-1 -right-1 w-2 h-2 border border-neutral-400 bg-white z-20"></div>

          {/* Logo / Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-medium tracking-tight text-neutral-900">
              Pipe<span className="bg-[#FAFB86] px-1.5 py-0.5 rounded-sm">Line</span>
            </h1>
            <p className="text-sm text-neutral-500 mt-2">
              Sign in to manage dispatcher & routing settings.
            </p>
          </div>

          {/* Render Case: Magic Link (Email) */}
          {useMagicLink && (
            <div className="flex flex-col gap-6">
              {magicState.sent ? (
                <div className="bg-lime-50/50 border border-lime-100 p-4 text-center">
                  <p className="text-sm text-lime-800 font-medium leading-relaxed">
                    Check your email for a sign-in link.
                  </p>
                </div>
              ) : (
                <form action={magicAction} className="flex flex-col gap-4">
                  <div className="flex flex-col">
                    <label htmlFor="email" className="text-[10px] font-bold tracking-wider text-neutral-400 uppercase mb-1.5">
                      Email address
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="name@company.com"
                      required
                      className="w-full border border-neutral-300 bg-neutral-50/50 px-4 py-3 text-base text-neutral-900 rounded-none placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-neutral-900 focus:border-neutral-900"
                    />
                  </div>
                  
                  {magicState.error && (
                    <p className="text-xs font-medium text-red-600">{magicState.error}</p>
                  )}

                  <button
                    type="submit"
                    disabled={magicSending}
                    className="w-full bg-neutral-900 hover:bg-neutral-800 text-white font-medium py-3 px-4 rounded-none transition-colors border border-neutral-900 disabled:opacity-50 mt-1"
                  >
                    {magicSending ? "Sending…" : "Send sign-in link"}
                  </button>
                </form>
              )}

              <button
                onClick={() => setUseMagicLink(false)}
                className="text-sm text-neutral-500 hover:text-neutral-800 transition-colors underline underline-offset-4 decoration-neutral-300 font-medium text-center"
              >
                Use phone instead
              </button>
            </div>
          )}

          {/* Render Case: Phone OTP (Sign In) */}
          {!useMagicLink && (
            <div className="flex flex-col gap-6">
              {!otpSent ? (
                <form action={sendAction} className="flex flex-col gap-4">
                  <div className="flex flex-col">
                    <label htmlFor="phone-display" className="text-[10px] font-bold tracking-wider text-neutral-400 uppercase mb-1.5">
                      Phone number
                    </label>
                    <div className="relative flex">
                      {/* Custom dropdown trigger using hidden native select */}
                      <div className="relative flex items-center gap-1.5 border border-r-0 border-neutral-300 bg-neutral-50 px-3 text-sm text-neutral-600 select-none">
                        <span className="text-base leading-none">{selectedCountry.flag}</span>
                        <span className="font-semibold">{selectedCountry.code}</span>
                        <svg className="w-3 h-3 text-neutral-400 pointer-events-none ml-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                        <select
                          value={selectedCountry.code}
                          onChange={(e) => {
                            const match = COUNTRIES.find((c) => c.code === e.target.value);
                            if (match) setSelectedCountry(match);
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
                        id="phone-display"
                        type="tel"
                        placeholder={selectedCountry.placeholder}
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                        className="w-full border border-neutral-300 bg-neutral-50/50 px-4 py-3 text-base text-neutral-900 rounded-none placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-neutral-900 focus:border-neutral-900"
                      />
                      {/* Hidden field actually submitted to supabase auth */}
                      <input type="hidden" name="phone" value={finalPhone} />
                    </div>
                  </div>

                  {sendState.error && (
                    <p className="text-xs font-medium text-red-600">{sendState.error}</p>
                  )}

                  <button
                    type="submit"
                    disabled={sending}
                    className="w-full bg-neutral-900 hover:bg-neutral-800 text-white font-medium py-3 px-4 rounded-none transition-colors border border-neutral-900 disabled:opacity-50 mt-1"
                  >
                    {sending ? "Sending…" : "Send verification code"}
                  </button>

                  <button
                    type="button"
                    onClick={() => setUseMagicLink(true)}
                    className="text-sm text-neutral-500 hover:text-neutral-800 transition-colors underline underline-offset-4 decoration-neutral-300 font-medium text-center mt-2"
                  >
                    Use email instead
                  </button>
                </form>
              ) : (
                <form action={verifyAction} className="flex flex-col gap-4">
                  <input type="hidden" name="phone" value={sendState.phone} />
                  
                  <div className="flex flex-col">
                    <label htmlFor="token" className="text-[10px] font-bold tracking-wider text-neutral-400 uppercase mb-3 text-center">
                      Enter the texted code
                    </label>
                    
                    {/* Multi-box input container */}
                    <div className="relative flex justify-center w-full h-14">
                      {/* Invisible raw input overlaid on top */}
                      <input
                        id="token"
                        name="token"
                        type="text"
                        inputMode="numeric"
                        pattern="\d{6}"
                        maxLength={6}
                        value={otp}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, "").slice(0, 6);
                          setOtp(val);
                        }}
                        required
                        autoFocus
                        className="absolute inset-0 w-full h-full opacity-0 cursor-text z-20 text-center"
                      />
                      
                      {/* 6 Visual Box Elements */}
                      <div className="flex gap-2.5 justify-between w-full z-10 pointer-events-none">
                        {Array.from({ length: 6 }).map((_, i) => {
                          const char = otp[i] || "";
                          const isFocused = otp.length === i || (otp.length === 6 && i === 5);
                          return (
                            <div
                              key={i}
                              className={`w-11 h-14 border bg-neutral-50/50 flex items-center justify-center text-xl font-medium text-neutral-900 rounded-none transition-all ${
                                isFocused
                                  ? "border-neutral-900 bg-white ring-1 ring-neutral-900"
                                  : "border-neutral-300"
                              }`}
                            >
                              {char}
                              {isFocused && char === "" && (
                                <span className="w-[1.5px] h-5 bg-neutral-900 animate-pulse"></span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {verifyState.error && (
                    <p className="text-xs font-medium text-red-600">{verifyState.error}</p>
                  )}

                  <button
                    type="submit"
                    disabled={verifying}
                    className="w-full bg-neutral-900 hover:bg-neutral-800 text-white font-medium py-3 px-4 rounded-none transition-colors border border-neutral-900 disabled:opacity-50 mt-4"
                  >
                    {verifying ? "Verifying…" : "Verify code"}
                  </button>
                </form>
              )}
            </div>
          )}

        </div>
      </div>
    </main>
  );
}
