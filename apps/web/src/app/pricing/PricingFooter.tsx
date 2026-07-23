export default function PricingFooter() {
  return (
    <footer className="border-t border-neutral-200/80 bg-[#FBFBFA] px-8 py-16 sm:px-14">
      <div className="mx-auto flex max-w-7xl flex-col gap-16 sm:flex-row sm:justify-between">
        <div>
          <span className="text-2xl font-semibold tracking-tight text-neutral-900">PipeLine</span>
          <p className="mt-2 max-w-xs text-sm text-neutral-500">
            An AI phone assistant for plumbers. It always says so. Every call is recorded.
          </p>
        </div>

        <div className="flex flex-wrap gap-16">
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold text-neutral-900">Product</h3>
            <a href="/#features" className="text-sm text-neutral-500 hover:text-neutral-900">
              Features
            </a>
            <a href="/pricing" className="text-sm text-neutral-500 hover:text-neutral-900">
              Pricing
            </a>
            <a href="/#how" className="text-sm text-neutral-500 hover:text-neutral-900">
              How it works
            </a>
          </div>

          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold text-neutral-900">Company</h3>
            <a href="/privacy" className="text-sm text-neutral-500 hover:text-neutral-900">
              Privacy
            </a>
            <a href="/terms" className="text-sm text-neutral-500 hover:text-neutral-900">
              Terms
            </a>
            <a href="/status" className="text-sm text-neutral-500 hover:text-neutral-900">
              Status
            </a>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-14 flex max-w-7xl flex-col-reverse items-center justify-between gap-4 border-t border-neutral-200/80 pt-6 sm:flex-row">
        <p className="text-xs text-neutral-400">© 2026 PipeLine.</p>
        <a href="/status" className="text-xs text-neutral-400 hover:text-neutral-600">
          Check system status →
        </a>
      </div>
    </footer>
  );
}
