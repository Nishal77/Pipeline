import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://pipeline-ai.example.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/today", "/calls", "/calendar", "/settings", "/onboarding", "/auth"] }],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
