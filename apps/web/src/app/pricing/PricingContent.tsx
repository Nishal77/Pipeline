"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Nav from "../landing/Nav";
import { MARKETS } from "./data";
import { GridTick } from "./icons";
import PricingHero from "./PricingHero";
import PricingCards from "./PricingCards";
import CompareFeatures from "./CompareFeatures";
import ConsultationBanner from "./ConsultationBanner";
import PricingFaq from "./PricingFaq";
import PricingFooter from "./PricingFooter";

export default function PricingContent() {
  const [isAnnual, setIsAnnual] = useState(true);
  const searchParams = useSearchParams();
  const marketParam = searchParams.get("market");
  const market = marketParam && MARKETS[marketParam] ? marketParam : "us";
  const marketLabel = MARKETS[market].label;

  return (
    <main className="relative min-h-screen bg-[#FBFBFA] text-[#09090b] font-sans overflow-hidden">
      {/* Background ambient glow */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] bg-gradient-to-tr from-amber-100/30 via-purple-100/30 to-sky-100/40 blur-3xl opacity-80 rounded-full" />
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-r from-yellow-100/40 via-pink-100/30 to-sky-200/40 blur-3xl opacity-70 rounded-full" />
      </div>

      <div className="fixed top-0 right-0 left-0 z-50">
        <Nav />
      </div>
      <div className="h-[68px] shrink-0" />

      <div className="relative mx-auto max-w-7xl border-x border-neutral-200/80 bg-white/20 backdrop-blur-[2px]">
        <PricingHero marketLabel={marketLabel} isAnnual={isAnnual} setIsAnnual={setIsAnnual} />
        <PricingCards isAnnual={isAnnual} />
        <CompareFeatures />
        <ConsultationBanner />
        <PricingFaq />

        <GridTick position="bottom-left" />
        <GridTick position="bottom-right" />
      </div>

      <PricingFooter />
    </main>
  );
}
