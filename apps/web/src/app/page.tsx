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
    <main className="relative flex min-h-screen flex-col overflow-hidden">
      {/* Structured data — SoftwareApplication + FAQPage, read by search crawlers
          and AI answer engines (ChatGPT/Perplexity-style citations), not just Google. */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />

      <div className="fixed top-0 left-0 right-0 z-50 w-full flex flex-col">
        <AnnouncementBar />
        <Nav />
      </div>
      <div className="w-full bg-[url('https://i.pinimg.com/736x/c8/5f/b1/c85fb15543d110ff419b5a057049ffe4.jpg')] bg-cover bg-top bg-no-repeat">
        <div className="h-[108px] shrink-0" />
        <Hero />
      </div>
      <ProductVisual />
      <ProblemSection />
      <Features />
      <Comparison />
      <HowItWorks />

      <section id="calculator" className="relative flex flex-col items-center gap-6 border-t border-border px-6 py-20 text-center">
        <div className="flex flex-col items-center gap-3">
          <h2 className="text-3xl font-semibold tracking-tight">The math you&apos;ve never actually run.</h2>
          <p className="max-w-md text-muted">You know you miss calls. You&apos;ve probably never put a dollar figure on it.</p>
        </div>
        <CostCalculator />
      </section>

      <Pricing />
      <Faq />
      <FinalCta />
      <Footer />
    </main>
  );
}
