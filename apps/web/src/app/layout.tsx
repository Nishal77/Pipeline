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
const TITLE = "PipeLine — AI Receptionist That Knows a Gas Leak From a Dripping Tap";
const DESCRIPTION =
  "Most AI answering services just take a message. PipeLine is built for plumbers specifically — it tells a real emergency from routine work, gets you on the phone immediately for the ones that can't wait, and books everything else straight into your calendar. $59/month.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: TITLE, template: "%s | PipeLine" },
  description: DESCRIPTION,
  keywords: [
    "AI answering service for plumbers",
    "AI receptionist for contractors",
    "plumbing emergency triage AI",
    "24/7 answering service for plumbers",
    "AI appointment booking for trades",
    "missed call answering service plumber",
  ],
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
