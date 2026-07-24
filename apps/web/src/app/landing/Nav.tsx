"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { DEMO_NUMBER, DEMO_NUMBER_DISPLAY } from "./data";

function PhoneIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2a1 1 0 011.02-.24c1.12.37 2.33.57 3.57.57a1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.45.57 3.57a1 1 0 01-.25 1.02l-2.2 2.2z" />
    </svg>
  );
}

function CallIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
  );
}

function ShieldIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  );
}

function CalendarIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );
}

function TagIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
    </svg>
  );
}

function MessageIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
  );
}

// The real, shipped feature set — no invented integrations, no fake AI agent
// suite. See CLAUDE.md / packages/shared for what's actually built.
const PRODUCT_FEATURES = [
  { title: "AI Receptionist", sub: "Answers every call, 24/7", icon: <CallIcon /> },
  { title: "Barge-In", sub: "Caller can interrupt mid-sentence", icon: <CallIcon /> },
  { title: "Honest AI Disclosure", sub: "Always says it's AI, every call", icon: <ShieldIcon /> },
  { title: "Emergency Triage", sub: "Gas leak, flooding, burst pipe", icon: <ShieldIcon /> },
  { title: "Gas-Safety Script", sub: "Hard-coded, non-editable", icon: <ShieldIcon /> },
  { title: "Escalation Backstop", sub: "Fires even if the AI misses it", icon: <ShieldIcon /> },
  { title: "Real-Time Booking", sub: "Checks your actual calendar", icon: <CalendarIcon /> },
  { title: "Atomic Slot Hold", sub: "No double-booked jobs", icon: <CalendarIcon /> },
  { title: "Service-Area Check", sub: "Out-of-area leads logged, not booked", icon: <CalendarIcon /> },
  { title: "Price Sheet Only", sub: "Never invents a number", icon: <TagIcon /> },
  { title: "Auto Reminders", sub: "24h and 1h before the job", icon: <MessageIcon /> },
  { title: "Reschedule by Text", sub: "Caller replies, it's done", icon: <MessageIcon /> },
  { title: "STOP Compliance", sub: "Instant, logged, honored", icon: <MessageIcon /> },
  { title: "Emergency Alerts", sub: "SMS or live transfer to you", icon: <PhoneIcon /> },
];

export default function Nav() {
  // Only the landing page ("/") gets the white-until-scrolled treatment —
  // pricing (and every other page reusing this component) keeps the
  // always-dark text it already had, since it sits on a light background
  // from the first frame with no dark hero behind it.
  const pathname = usePathname();
  const isLandingPage = pathname === "/";

  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [selectedLang, setSelectedLang] = useState<{ code: string; flag: string }>({
    code: "EN",
    flag: "🇺🇸",
  });

  const navRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const [isScrolled, setIsScrolled] = useState<boolean>(false);

  // Monitor scroll height
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleDropdown = (name: string) => {
    setActiveDropdown((prev) => (prev === name ? null : name));
  };

  const languages = [
    { code: "EN", name: "English", flag: "🇺🇸" },
    { code: "ES", name: "Español", flag: "🇪🇸" },
    { code: "FR", name: "Français", flag: "🇫🇷" },
    { code: "DE", name: "Deutsch", flag: "🇩🇪" },
  ];

  const showWhiteText = isLandingPage && !isScrolled && !mobileMenuOpen;

  return (
    <header
      ref={navRef}
      className={`w-full transition-all duration-300 ease-in-out ${showWhiteText ? "text-white" : "text-[#08090a]"} ${
        isScrolled || mobileMenuOpen
          ? "bg-white border-b border-neutral-200/80 shadow-xs"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3.5 sm:px-8">

        {/* Left Section: Logo & Links */}
        <div className="flex items-center gap-8">
          {/* Brand Logo */}
          <a href="#" className="flex items-center gap-2 group">
            <span className={`text-xl font-medium tracking-tight ${showWhiteText ? "text-white" : "text-[#000]"}`}>
           Pipeline
            </span>
          </a>

          {/* Desktop Nav Items */}
          <nav className={`hidden xl:flex items-center gap-1 text-sm font-semibold ${showWhiteText ? "text-white/90" : "text-neutral-700"}`}>
            {/* Product Dropdown */}
            <div className="relative">
              <button
                onClick={() => toggleDropdown("product")}
                onMouseEnter={() => setActiveDropdown("product")}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors hover:text-black ${
                  activeDropdown === "product" ? "text-black" : ""
                }`}
              >
                <span>Product</span>
                <svg
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    activeDropdown === "product" ? "rotate-180" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {activeDropdown === "product" && (
                <div
                  onMouseLeave={() => setActiveDropdown(null)}
                  className="absolute left-0 top-full z-50 mt-1.5 grid w-[900px] grid-cols-[1fr_280px] gap-8 rounded-2xl border border-neutral-200/80 bg-white p-6 text-neutral-800 shadow-xl animate-in fade-in slide-in-from-top-2 duration-150"
                >
                  <div>
                    {/* Featured */}
                    <a
                      href="#comparison"
                      onClick={() => setActiveDropdown(null)}
                      className="group/banner mb-4 flex items-center justify-between rounded-xl bg-[#08090a] px-5 py-4 text-white transition-colors hover:bg-neutral-900"
                    >
                      <div>
                        <div className="mb-1 flex items-center gap-2">
                          <span className="text-sm font-semibold">Emergency Triage</span>
                          <span className="rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-medium tracking-wide">FEATURED</span>
                        </div>
                        <p className="text-xs text-white/60">Tells a gas leak from a routine call, instantly</p>
                      </div>
                      <svg
                        className="h-4 w-4 shrink-0 text-white/60 transition-transform group-hover/banner:translate-x-0.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </a>

                    <p className="mb-2 px-1 text-[11px] font-semibold tracking-wide text-neutral-400">FEATURES</p>
                    <div className="grid grid-cols-2 gap-x-10 gap-y-1">
                      {PRODUCT_FEATURES.map((f) => (
                        <a
                          key={f.title}
                          href="#features"
                          onClick={() => setActiveDropdown(null)}
                          className="flex items-start gap-2.5 rounded-lg p-2 transition-colors hover:bg-neutral-50"
                        >
                          <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-neutral-100 text-neutral-500">
                            {f.icon}
                          </span>
                          <span>
                            <span className="block text-sm font-semibold text-neutral-900">{f.title}</span>
                            <span className="block text-xs text-neutral-500">{f.sub}</span>
                          </span>
                        </a>
                      ))}
                    </div>
                  </div>

                  {/* Try it live — real phone line, not a fake demo video */}
                  <div className="flex flex-col border-l border-neutral-100 pl-6">
                    <p className="mb-3 text-[11px] font-semibold tracking-wide text-neutral-400">TRY IT LIVE</p>
                    <div className="flex flex-1 flex-col justify-between rounded-xl border border-accent/20 bg-gradient-to-br from-accent/10 to-accent/[0.02] p-5">
                      <div>
                        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-accent/15 text-accent">
                          <PhoneIcon className="h-4 w-4" />
                        </div>
                        <p className="text-sm font-semibold text-neutral-900">Call the demo line</p>
                        <p className="mt-1 text-xs text-neutral-500">
                          No script. Try booking yourself a fake job right now — it&apos;s a real AI, not a mockup.
                        </p>
                      </div>
                      <a
                        href={`tel:${DEMO_NUMBER}`}
                        onClick={() => setActiveDropdown(null)}
                        className="mt-4 rounded-full bg-accent px-4 py-2.5 text-center text-sm font-medium text-accent-foreground transition-transform hover:scale-[1.02]"
                      >
                        {DEMO_NUMBER_DISPLAY}
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Solutions Dropdown */}
            <div className="relative">
              <button
                onClick={() => toggleDropdown("solutions")}
                onMouseEnter={() => setActiveDropdown("solutions")}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors hover:text-black ${
                  activeDropdown === "solutions" ? "text-black" : ""
                }`}
              >
                <span>Solutions</span>
                <svg
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    activeDropdown === "solutions" ? "rotate-180" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {activeDropdown === "solutions" && (
                <div 
                  onMouseLeave={() => setActiveDropdown(null)}
                  className="absolute left-0 top-full mt-1.5 w-64 rounded-2xl bg-white p-3 shadow-xl border border-neutral-200/80 animate-in fade-in slide-in-from-top-2 duration-150 z-50 text-neutral-800"
                >
                  <a
                    href="#how"
                    onClick={() => setActiveDropdown(null)}
                    className="flex items-center gap-2.5 rounded-xl p-2 hover:bg-neutral-50 text-sm font-semibold text-neutral-800"
                  >
                    <span className="text-base">🚰</span> Plumbing Contractors
                  </a>
                  <a
                    href="#how"
                    onClick={() => setActiveDropdown(null)}
                    className="flex items-center gap-2.5 rounded-xl p-2 hover:bg-neutral-50 text-sm font-semibold text-neutral-800"
                  >
                    <span className="text-base">❄️</span> HVAC & Climate Control
                  </a>
                  <a
                    href="#how"
                    onClick={() => setActiveDropdown(null)}
                    className="flex items-center gap-2.5 rounded-xl p-2 hover:bg-neutral-50 text-sm font-semibold text-neutral-800"
                  >
                    <span className="text-base">⚡</span> Electrical Services
                  </a>
                </div>
              )}
            </div>

            {/* Resources Dropdown */}
            <div className="relative">
              <button
                onClick={() => toggleDropdown("resources")}
                onMouseEnter={() => setActiveDropdown("resources")}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors hover:text-black ${
                  activeDropdown === "resources" ? "text-black" : ""
                }`}
              >
                <span>Resources</span>
                <svg
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    activeDropdown === "resources" ? "rotate-180" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {activeDropdown === "resources" && (
                <div 
                  onMouseLeave={() => setActiveDropdown(null)}
                  className="absolute left-0 top-full mt-1.5 w-64 rounded-2xl bg-white p-3 shadow-xl border border-neutral-200/80 animate-in fade-in slide-in-from-top-2 duration-150 z-50 text-neutral-800"
                >
                  <a
                    href="#calculator"
                    onClick={() => setActiveDropdown(null)}
                    className="flex items-center gap-2.5 rounded-xl p-2 hover:bg-neutral-50 text-sm font-semibold text-neutral-800"
                  >
                    <span className="text-base">🧮</span> Savings Calculator
                  </a>
                  <a
                    href="#faq"
                    onClick={() => setActiveDropdown(null)}
                    className="flex items-center gap-2.5 rounded-xl p-2 hover:bg-neutral-50 text-sm font-semibold text-neutral-800"
                  >
                    <span className="text-base">❓</span> FAQs & Help
                  </a>
                </div>
              )}
            </div>

            <a
              href="/pricing?market=us"
              className="px-3 py-2 rounded-lg hover:text-black transition-colors"
            >
              Pricing
            </a>
          </nav>
        </div>

        {/* Right Section Actions */}
        <div className="hidden xl:flex items-center gap-3">
          
          {/* Language Picker */}
          <div className="relative">
            <button
              onClick={() => toggleDropdown("lang")}
              className={`flex items-center gap-1 px-2.5 py-1.5 text-sm font-bold rounded-lg transition-colors hover:text-black ${
                showWhiteText ? "text-white" : "text-neutral-700"
              }`}
            >
              <span className="text-base mr-1">{selectedLang.flag}</span>
              <span>{selectedLang.code}</span>
              <svg
                className={`w-3 h-3 text-neutral-500 transition-transform ${
                  activeDropdown === "lang" ? "rotate-180" : ""
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {activeDropdown === "lang" && (
              <div className="absolute right-0 top-full mt-1.5 w-36 rounded-xl bg-white p-1.5 shadow-lg border border-neutral-200 z-50 text-neutral-800">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setSelectedLang(lang);
                      setActiveDropdown(null);
                    }}
                    className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-left transition-colors ${
                      selectedLang.code === lang.code ? "bg-neutral-100 font-bold text-black" : "hover:bg-neutral-50 text-neutral-700"
                    }`}
                  >
                    <span>{lang.flag}</span>
                    <span>{lang.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

         

          {/* Talk to Sales — white on transparent hero, flips to black once scrolled */}
          <a
            href={`tel:${DEMO_NUMBER}`}
            className={`rounded-full px-4.5 py-2 text-sm font-medium transition-all shadow-3xs cursor-pointer whitespace-nowrap ${
              showWhiteText ? "bg-white text-black hover:bg-neutral-100" : "bg-[#000] text-white hover:bg-[#0c261b]"
            }`}
          >
            Talk to Sales
          </a>

          {/* Try for Free Yellow Button */}
          <a
            href="#waitlist"
            className="rounded-full bg-[#ffee32] hover:bg-[#ffd600] px-5 py-2 text-sm font-medium text-[#08090a] transition-all transform hover:scale-[1.03] shadow-2xs active:scale-[0.98] cursor-pointer whitespace-nowrap"
          >
            Try for Free
          </a>
        </div>

        {/* Mobile menu trigger */}
        <div className="flex xl:hidden items-center gap-2">
          <a
            href="#waitlist"
            className="rounded-full bg-[#ffee32] px-3.5 py-1.5 text-xs font-extrabold text-[#08090a]"
          >
            Try Free
          </a>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-neutral-700 hover:bg-black/5"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-neutral-200/80 bg-[#f6f6f4] px-5 py-4 flex flex-col gap-4 shadow-xl animate-in slide-in-from-top-3">
          <div className="flex flex-col gap-1 text-sm font-semibold">
            <a
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 px-3 rounded-lg hover:bg-black/5 text-neutral-900"
            >
              Product Features
            </a>
            <a
              href="#how"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 px-3 rounded-lg hover:bg-black/5 text-neutral-900"
            >
              Solutions
            </a>
            <a
              href="#calculator"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 px-3 rounded-lg hover:bg-black/5 text-neutral-900"
            >
              Savings Calculator
            </a>
            <a
              href="/pricing?market=us"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 px-3 rounded-lg hover:bg-black/5 text-neutral-900"
            >
              Pricing
            </a>
          </div>

          {/* Mobile Language Picker */}
          <div className="pt-3 border-t border-neutral-200/60 flex items-center justify-between px-3">
            <span className="text-sm font-semibold text-neutral-600">Language</span>
            <div className="relative">
              <button
                onClick={() => toggleDropdown("lang_mobile")}
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-sm font-bold text-neutral-700 hover:text-black rounded-lg transition-colors border border-neutral-200"
              >
                <span className="text-base mr-1">{selectedLang.flag}</span>
                <span>{selectedLang.code}</span>
                <svg
                  className={`w-3 h-3 text-neutral-500 transition-transform ${
                    activeDropdown === "lang_mobile" ? "rotate-180" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {activeDropdown === "lang_mobile" && (
                <div className="absolute right-0 bottom-full mb-1.5 w-36 rounded-xl bg-white p-1.5 shadow-lg border border-neutral-200 z-50 text-neutral-800">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setSelectedLang(lang);
                        setActiveDropdown(null);
                      }}
                      className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-left transition-colors ${
                        selectedLang.code === lang.code ? "bg-neutral-100 font-bold text-black" : "hover:bg-neutral-50 text-neutral-700"
                      }`}
                    >
                      <span>{lang.flag}</span>
                      <span>{lang.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="pt-3 border-t border-neutral-200/60 flex flex-col gap-2.5">
            <a
              href={`tel:${DEMO_NUMBER}`}
              className="flex justify-center items-center rounded-full bg-[#FFFFFF] py-2.5 text-xs font-bold text-white"
            >
              Talk to Sales
            </a>
            <a
              href="#waitlist"
              className="flex justify-center items-center rounded-full bg-[#ffee32] py-2.5 text-xs font-bold text-[#08090a]"
            >
              Try for Free
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
