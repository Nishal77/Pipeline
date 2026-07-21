import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// No production domain registered yet — set NEXT_PUBLIC_SITE_URL before launch,
// this fallback keeps OG/canonical tags valid for local/staging in the meantime.
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://pipeline-ai.example.com";
// TODO: page title (shows in browser tab + Google search result link)
const TITLE = "TODO: page title";
// TODO: meta description (shows under the title in Google search results)
const DESCRIPTION = "TODO: meta description";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: TITLE, template: "%s | PipeLine" },
  description: DESCRIPTION,
  // TODO: search keywords
  keywords: ["TODO: keyword 1", "TODO: keyword 2", "TODO: keyword 3"],
  authors: [{ name: "PipeLine" }],
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "PipeLine",
    title: TITLE,
    description: DESCRIPTION,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
