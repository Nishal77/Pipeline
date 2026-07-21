import type { MetadataRoute } from "next";

// PRD §12: PWA, installable to home screen — no native app store review
// needed to ship updates. Icons are placeholder solid squares (public/icon-*.png,
// generated, not designed) — swap for real branding when available.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "PipeLine — AI Phone Office",
    short_name: "PipeLine",
    description: "24/7 AI voice agent for your business — answers calls, books jobs, sends reminders.",
    start_url: "/today",
    display: "standalone",
    background_color: "#08090a",
    theme_color: "#08090a",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
