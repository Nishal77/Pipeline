"use client";

import Link from "next/link";

export default function AnnouncementBar() {
  return (
    <div className="relative z-30 flex min-h-[38px] w-full items-center bg-[#06150e] text-xs text-neutral-300 border-b border-[#0f291e]">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 sm:px-8">
        {/* Left side: Announcement details */}
        <div className="flex flex-wrap items-center gap-2 text-center sm:text-left mx-auto sm:mx-0 py-2">
          <span>Allo MCP is live. Connect your business phone to any AI, today.</span>
          <a
            href="#docs"
            className="inline-flex items-center gap-1 font-semibold text-white underline underline-offset-2 hover:text-amber-300 transition-colors"
          >
            <span>See documentation</span>
            <svg className="w-3 h-3 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7M17 7V17" />
            </svg>
          </a>
        </div>

        {/* Right side: Actions */}
        <div className="hidden sm:flex items-center gap-5 text-neutral-300 py-2">
          <a
            href="#download"
            className="inline-flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
          >
            <span>Download</span>
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </a>
          <Link
            href="/login"
            className="hover:text-white transition-colors font-semibold"
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
