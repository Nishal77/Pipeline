import { JSON_LD } from "./landing/data";
import AnnouncementBar from "./landing/AnnouncementBar";
import Nav from "./landing/Nav";
import Hero from "./landing/Hero";
import ProductVisual from "./landing/ProductVisual";
import ProblemSection from "./landing/ProblemSection";
import Workflows from "./landing/Workflows";
import Features from "./landing/Features";
import Comparison from "./landing/Comparison";
import HowItWorks from "./landing/HowItWorks";
import CostCalculator from "./landing/CostCalculator";
import Pricing from "./landing/Pricing";
import Faq from "./landing/Faq";
import FinalCta from "./landing/FinalCta";
import Footer from "./landing/Footer";
import SectionDivider from "./landing/SectionDivider";

export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col overflow-hidden">
      {/* Structured data — SoftwareApplication + FAQPage, read by search crawlers
          and AI answer engines (ChatGPT/Perplexity-style citations), not just Google. */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />

      {/* Fixed top-0 left-0 right-0 z-50 w-full flex flex-col */}
      <div className="fixed top-0 left-0 right-0 z-50 w-full flex flex-col">
        <AnnouncementBar />
        <Nav />
      </div>

      {/* Hero */}
      <div className="w-full bg-[#FBFBFA]">
        <div className="mx-auto max-w-7xl border-l border-r border-border bg-[#FBFBFA]">
          <div className="h-[108px] shrink-0" />
          <Hero />
        </div>
      </div>
      
      <SectionDivider />

      {/* Product Visual */}
      <div className="w-full bg-[#FBFBFA]">
        <div className="mx-auto max-w-7xl border-l border-r border-border bg-[#FBFBFA]">
          <ProductVisual />
        </div>
      </div>

      <SectionDivider />

      {/* Problem Section */}
      <div className="w-full bg-[#FBFBFA]">
        <div className="mx-auto max-w-7xl border-l border-r border-border bg-[#FBFBFA]">
          <ProblemSection />
        </div>
      </div>

      <SectionDivider />

      {/* Workflows Section */}
      <div className="w-full bg-[#FBFBFA]">
        <div className="mx-auto max-w-7xl border-l border-r border-border bg-[#FBFBFA]">
          <Workflows />
        </div>
      </div>

      <SectionDivider />

      {/* Features */}
      <div className="w-full bg-[#FBFBFA]">
        <div className="mx-auto max-w-7xl border-l border-r border-border bg-[#FBFBFA]">
          <Features />
        </div>
      </div>

      <SectionDivider />

      {/* Comparison */}
      <div className="w-full bg-[#FBFBFA]">
        <div className="mx-auto max-w-7xl border-l border-r border-border bg-[#FBFBFA]">
          <Comparison />
        </div>
      </div>

      <SectionDivider />

      {/* How It Works */}
      <div className="w-full bg-[#FBFBFA]">
        <div className="mx-auto max-w-7xl border-l border-r border-border bg-[#FBFBFA]">
          <HowItWorks />
        </div>
      </div>

      <SectionDivider />

      {/* Calculator */}
      <div className="w-full bg-[#FBFBFA]">
        <div className="mx-auto max-w-7xl border-l border-r border-border bg-[#FBFBFA]">
          <section id="calculator" className="relative flex flex-col items-center gap-6 px-6 py-20 text-center">
            <div className="flex flex-col items-center gap-3">
              <h2 className="text-3xl font-semibold tracking-tight text-neutral-900">The math you&apos;ve never actually run.</h2>
              <p className="max-w-md text-muted">You know you miss calls. You&apos;ve probably never put a dollar figure on it.</p>
            </div>
            <CostCalculator />
          </section>
        </div>
      </div>

      <SectionDivider />

      {/* Pricing */}
      <div className="w-full bg-[#FBFBFA]">
        <div className="mx-auto max-w-7xl border-l border-r border-border bg-[#FBFBFA]">
          <Pricing />
        </div>
      </div>

      <SectionDivider />

      {/* FAQ */}
      <div className="w-full bg-[#FBFBFA]">
        <div className="mx-auto max-w-7xl border-l border-r border-border bg-[#FBFBFA]">
          <Faq />
        </div>
      </div>

      <SectionDivider />

      {/* Final CTA */}
      <div className="w-full bg-[#FBFBFA]">
        <div className="mx-auto max-w-7xl border-l border-r border-border bg-[#FBFBFA]">
          <FinalCta />
        </div>
      </div>

      <SectionDivider />

      {/* Footer */}
      <div className="w-full bg-[#FBFBFA]">
        <div className="mx-auto max-w-7xl border-l border-r border-border bg-[#FBFBFA]">
          <Footer />
        </div>
      </div>
    </main>
  );
}
