"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import MarketingNav from "@/components/MarketingNav";
import HeroSection from "@/components/HeroSection";
import LogoCloud from "@/components/LogoCloud";
import BentoGrid, { PricingSection } from "@/components/BentoGrid";
import StockShortlistCard from "@/components/StockShortlistCard";
import MarketingFooter from "@/components/MarketingFooter";
import { POPULAR_STOCKS } from "@/lib/popularStocks";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-[var(--text-primary)] overflow-x-hidden">
      <MarketingNav />

      <HeroSection />
      <LogoCloud />
      <BentoGrid />

      <section id="stocks" className="py-20 md:py-28 px-4 sm:px-6 bg-[var(--surface-muted)] scroll-mt-20">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
            <div>
              <h2 className="section-title mb-3">Trending stocks</h2>
              <p className="section-subtitle">
                Click any stock to view live charts, fundamentals, and AI analysis.
              </p>
            </div>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--primary)] hover:text-[var(--primary-hover)] shrink-0 transition-colors"
            >
              Open dashboard <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {POPULAR_STOCKS.map((stock) => (
              <StockShortlistCard key={stock.ticker} stock={stock} />
            ))}
          </div>
        </div>
      </section>

      <PricingSection />
      <MarketingFooter />
    </div>
  );
}
