"use client";

import { useState, useRef, useEffect } from "react";
import { DEMO_NUMBER } from "./data";

export default function Nav() {
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

  return (
    <header
      ref={navRef}
      className={`w-full transition-all duration-300 ease-in-out text-[#08090a] ${
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
            <span className="text-xl font-medium tracking-tight text-[#FFFFFF]">
           Pipeline
            </span>
          </a>

          {/* Desktop Nav Items */}
          <nav className="hidden xl:flex items-center gap-1 text-sm font-semibold text-neutral-700">
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
                  className="absolute left-0 top-full mt-1.5 w-72 rounded-2xl bg-white p-3 shadow-xl border border-neutral-200/80 animate-in fade-in slide-in-from-top-2 duration-150 z-50 text-neutral-800"
                >
                  <a
                    href="#features"
                    onClick={() => setActiveDropdown(null)}
                    className="flex flex-col gap-0.5 rounded-xl p-2.5 hover:bg-neutral-50 transition-colors"
                  >
                    <span className="text-sm font-semibold text-neutral-900 flex items-center gap-2">
                      <span>⚡</span> AI Emergency Triage
                    </span>
                    <span className="text-xs text-neutral-500">
                      Recognizes active gas leaks & flooding instantly
                    </span>
                  </a>
                  <a
                    href="#features"
                    onClick={() => setActiveDropdown(null)}
                    className="flex flex-col gap-0.5 rounded-xl p-2.5 hover:bg-neutral-50 transition-colors"
                  >
                    <span className="text-sm font-semibold text-neutral-900 flex items-center gap-2">
                      <span>📅</span> Calendar Booking
                    </span>
                    <span className="text-xs text-neutral-500">
                      Syncs directly with Google, Outlook & ServiceTitan
                    </span>
                  </a>
                  <a
                    href="#features"
                    onClick={() => setActiveDropdown(null)}
                    className="flex flex-col gap-0.5 rounded-xl p-2.5 hover:bg-neutral-50 transition-colors"
                  >
                    <span className="text-sm font-semibold text-neutral-900 flex items-center gap-2">
                      <span>🏷️</span> Price Sheet Engine
                    </span>
                    <span className="text-xs text-neutral-500">
                      Quotes fixed rates without guessing or rounding
                    </span>
                  </a>
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
              href="#pricing"
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
              className="flex items-center gap-1 px-2.5 py-1.5 text-sm font-bold text-neutral-700 hover:text-black rounded-lg transition-colors"
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

         

          {/* Talk to Sales Dark Button */}
          <a
            href={`tel:${DEMO_NUMBER}`}
            className="rounded-full bg-[#FFFFFF] px-4.5 py-2 text-sm font-medium text-black hover:bg-[#0c261b] transition-all shadow-3xs cursor-pointer whitespace-nowrap"
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
              href="#pricing"
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
