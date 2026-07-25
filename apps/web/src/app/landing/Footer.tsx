import React from "react";
import Link from "next/link";
import { DEMO_NUMBER } from "./data";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-[#FBFBFA] border-t border-neutral-200/80 text-neutral-600">

      {/* Top Band — Big CTA Restate */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 px-6 sm:px-12 py-12 border-b border-neutral-200/60 bg-white/40">
        <div>
          <h3 className="text-3xl sm:text-4xl font-normal tracking-tight text-neutral-900 leading-tight">
            Never miss another job.
          </h3>
          <p className="text-base text-neutral-500 mt-1 max-w-md">
            Forward your calls and watch PipeLine book jobs directly onto your calendar, 24/7.
          </p>
        </div>
        <div className="shrink-0">
          <Link
            href="/onboarding"
            className="inline-flex items-center gap-1.5 px-6 py-3 rounded-md bg-[#FAFB86] border border-neutral-300/40 text-base font-medium text-neutral-900 hover:bg-[#FAFB86]/85 transition-all"
          >
            <span>Start your free trial</span>
            <span className="text-base leading-none">&rarr;</span>
          </Link>
        </div>
      </div>

      {/* Main Grid Section */}
      <div className="px-6 sm:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 items-start">

          {/* Column 1 — Brand */}
          <div className="flex flex-col items-start gap-4 lg:col-span-4 lg:pr-12">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-xl font-medium tracking-tight text-neutral-900">
                Pipeline
              </span>
            </Link>
            <p className="text-base text-neutral-500 leading-relaxed max-w-[260px]">
              AI phone office for local service businesses.
            </p>


            {/* Social Icons */}
            <div className="flex items-center gap-4 mt-2">
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-400 hover:text-neutral-600 transition-colors"
                aria-label="X (formerly Twitter)"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-400 hover:text-neutral-600 transition-colors"
                aria-label="LinkedIn"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-400 hover:text-neutral-600 transition-colors"
                aria-label="Instagram"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zM17.5 6.5h.01" />
                </svg>
              </a>
            </div>


          </div>

          {/* Column 2 — Product */}
          <div className="flex flex-col items-start gap-3 lg:col-span-2">
            <h4 className="text-xs font-semibold tracking-wider text-neutral-900 uppercase">
              Product
            </h4>
            <a href="#how-it-works" className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors">
              How it works
            </a>
            <Link href="/pricing" className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors">
              Pricing
            </Link>
            <a href="#workflows" className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors">
              Trade workflows
            </a>
            <a href={`tel:${DEMO_NUMBER}`} className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors">
              Live demo line
            </a>
          </div>

          {/* Column 3 — Features */}
          <div className="flex flex-col items-start gap-3 lg:col-span-2">
            <h4 className="text-xs font-semibold tracking-wider text-neutral-900 uppercase">
              Features
            </h4>
            <div className="grid grid-cols-1 gap-2.5">
              <a href="#features" className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors">AI Receptionist</a>
              <a href="#features" className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors">Barge-In</a>
              <a href="#features" className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors">Honest AI Disclosure</a>
              <a href="#features" className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors">Emergency Triage</a>
              <a href="#features" className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors">Gas-Safety Script</a>
              <a href="#features" className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors">Escalation Backstop</a>
              <a href="#features" className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors">Real-Time Booking</a>
              <a href="#features" className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors">Atomic Slot Hold</a>
              <a href="#features" className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors">Service-Area Check</a>
              <a href="#features" className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors">Price Sheet Only</a>
              <a href="#features" className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors">Auto Reminders</a>
              <a href="#features" className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors">Reschedule by Text</a>
              <a href="#features" className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors">STOP Compliance</a>
              <a href="#features" className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors">Emergency Alerts</a>
            </div>
          </div>

          {/* Column 4 — Trades */}
          <div className="flex flex-col items-start gap-3 lg:col-span-2">
            <h4 className="text-xs font-semibold tracking-wider text-neutral-900 uppercase">
              Trades
            </h4>
            <div className="grid grid-cols-1 gap-2.5">
              <Link href="/#workflows" className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors">Plumbing</Link>
              <Link href="/#workflows" className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors">HVAC</Link>
              <Link href="/#workflows" className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors">Electrical</Link>
              <Link href="/#workflows" className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors">Locksmith</Link>
              <Link href="/#workflows" className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors">Garage Door</Link>
              <Link href="/#workflows" className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors">Roadside</Link>
              <Link href="/#workflows" className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors">Handyman</Link>
              <Link href="/#workflows" className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors">Landscaping</Link>
              <Link href="/#workflows" className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors">Clinics</Link>
            </div>
          </div>

          {/* Column 5 — Company & Legal */}
          <div className="flex flex-col items-start gap-10 lg:col-span-2">

            {/* Company */}
            <div className="flex flex-col items-start gap-3">
              <h4 className="text-xs font-semibold tracking-wider text-neutral-900 uppercase">
                Company
              </h4>
              <Link href="/" className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors">
                About
              </Link>
              <a href="mailto:team@pipeline.io" className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors">
                Contact
              </a>
            </div>

            {/* Legal */}
            <div className="flex flex-col items-start gap-3">
              <h4 className="text-xs font-semibold tracking-wider text-neutral-900 uppercase">
                Legal
              </h4>
              <Link href="/privacy" className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors">
                Terms of Service
              </Link>
              <Link href="/terms#sms" className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors">
                SMS/A2P Compliance
              </Link>
              <Link href="/status" className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors">
                Status Page
              </Link>
            </div>

          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-neutral-200/60 px-6 sm:px-12 py-8 bg-[#FAFAFA]">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-4 items-center justify-between">

          {/* Left copyright and trust marker */}
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-sm text-neutral-400 text-center sm:text-left">
            <span>&copy; {currentYear} Pipeline. All rights reserved.</span>
          </div>
          {/* Right small compliance disclaimer */}
          <div className="text-sm text-neutral-400 text-center lg:text-right leading-relaxed ">
            Made with ❤️ for owners too busy doing the job to answer the phone.
          </div>

        </div>
      </div>

    </footer>
  );
}
