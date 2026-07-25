import { JSON_LD } from "./landing/data";
import AnnouncementBar from "./landing/AnnouncementBar";
import Nav from "./landing/Nav";
import Hero from "./landing/Hero";
import ProductVisual from "./landing/ProductVisual";
import ProblemSection from "./landing/ProblemSection";
import Workflows from "./landing/Workflows";
import HowItWorks from "./landing/HowItWorks";
import TriageTiers from "./landing/TriageTiers";
import Features from "./landing/Features";
import Comparison from "./landing/Comparison";
import Testimonials from "./landing/Testimonials";
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

      {/* How It Works */}
      <div className="w-full bg-[#FBFBFA]">
        <div className="mx-auto max-w-7xl border-l border-r border-border bg-[#FBFBFA]">
          <HowItWorks />
        </div>
      </div>

      <SectionDivider />

      {/* Triage Tiers */}
      <div className="w-full bg-[#FBFBFA]">
        <div className="mx-auto max-w-7xl border-l border-r border-border bg-[#FBFBFA]">
          <TriageTiers />
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

      {/* Features */}
      <div className="w-full bg-[#FBFBFA]">
        <div className="mx-auto max-w-7xl border-l border-r border-border bg-[#FBFBFA]">
          <Features />
        </div>
      </div>

      <SectionDivider />

      {/* Testimonials */}
      <div className="w-full bg-[#FBFBFA]">
        <div className="mx-auto max-w-7xl border-l border-r border-border bg-[#FBFBFA]">
          <Testimonials />
        </div>
      </div>

      <SectionDivider />

      {/* Pricing */}
      <div className="w-full bg-[#171717]">
        <div className="mx-auto max-w-7xl border-l border-r border-white/10">
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
