import { DEMO_NUMBER } from "./data";

export default function Nav() {
  return (
    <nav className="sticky top-0 z-20 flex items-center justify-between border-b border-border bg-background/80 px-6 py-4 backdrop-blur">
      <span className="text-lg font-semibold tracking-tight">PipeLine</span>
      <div className="hidden items-center gap-6 sm:flex">
        <a href="#features" className="text-sm text-muted hover:text-foreground">
          Features
        </a>
        <a href="#comparison" className="text-sm text-muted hover:text-foreground">
          Compare
        </a>
        <a href="#how" className="text-sm text-muted hover:text-foreground">
          How it works
        </a>
        <a href="#pricing" className="text-sm text-muted hover:text-foreground">
          Pricing
        </a>
        <a href="#faq" className="text-sm text-muted hover:text-foreground">
          FAQ
        </a>
      </div>
      <a href={`tel:${DEMO_NUMBER}`} className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground">
        Call the demo line
      </a>
    </nav>
  );
}
