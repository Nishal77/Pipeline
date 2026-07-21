import { JSON_LD } from "./landing/data";
import AnnouncementBar from "./landing/AnnouncementBar";
import Nav from "./landing/Nav";
import Hero from "./landing/Hero";
import ProductVisual from "./landing/ProductVisual";
import ProblemSection from "./landing/ProblemSection";
import Features from "./landing/Features";
import Comparison from "./landing/Comparison";
import HowItWorks from "./landing/HowItWorks";
import CostCalculator from "./landing/CostCalculator";
import Pricing from "./landing/Pricing";
import Faq from "./landing/Faq";
import FinalCta from "./landing/FinalCta";
import Footer from "./landing/Footer";

export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col overflow-hidden bg-background text-foreground">
      {/* Structured data — SoftwareApplication + FAQPage, read by search crawlers
          and AI answer engines (ChatGPT/Perplexity-style citations), not just Google. */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />

      <AnnouncementBar />
      <Nav />
      <Hero />
      <ProductVisual />
      <ProblemSection />
      <Features />
      <Comparison />
      <HowItWorks />

      <section id="calculator" className="relative flex flex-col items-center gap-4 border-t border-border px-6 py-20">
        <CostCalculator />
      </section>

      <Pricing />
      <Faq />
      <FinalCta />
      <Footer />
    </main>
  );
}
