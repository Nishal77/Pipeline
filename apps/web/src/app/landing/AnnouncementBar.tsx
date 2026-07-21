export default function AnnouncementBar() {
  return (
    <div className="relative flex items-center justify-center gap-2 bg-accent px-4 py-2 text-center text-xs font-medium text-accent-foreground sm:text-sm">
      <span>🚧 Not live yet — join the waitlist now, lock in $39/mo for life as one of the first 25 accounts.</span>
      <a href="#waitlist" className="underline underline-offset-2 hover:no-underline">
        Get on it →
      </a>
    </div>
  );
}
