export default function Footer() {
  return (
    <footer className="relative flex flex-col items-center gap-4 border-t border-border px-6 py-10 text-xs text-muted">
      <div className="flex gap-4">
        <a href="#features" className="underline">
          Features
        </a>
        <a href="#pricing" className="underline">
          Pricing
        </a>
        <a href="/privacy" className="underline">
          Privacy
        </a>
        <a href="/terms" className="underline">
          Terms
        </a>
        <a href="/status" className="underline">
          Status
        </a>
      </div>
      <p>PipeLine — an AI phone assistant. It always says so. Every call is recorded.</p>
    </footer>
  );
}
