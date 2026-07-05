"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import MarketingNav from "@/components/MarketingNav";
import HeroSection from "@/components/HeroSection";
import StockResearchSection from "@/components/StockResearchSection";
import DarkFeatureSection from "@/components/DarkFeatureSection";
import MarketIndicesStrip from "@/components/MarketIndicesStrip";
import FeatureShowcase from "@/components/FeatureShowcase";
import StockShortlistCard from "@/components/StockShortlistCard";
import MarketingFooter from "@/components/MarketingFooter";
import { POPULAR_STOCKS } from "@/lib/popularStocks";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-[#44475b] font-sans overflow-x-hidden">
      <MarketingNav />

      {/* Section 1: Light hero */}
      <HeroSection />

      {/* Section 2: Dark — stock research made simple */}
      <StockResearchSection />

      {/* Section 3: Dark — AI-powered shortlisting */}
      <DarkFeatureSection />

      {/* Section 4: Light — trending stocks */}
      <section id="stocks" className="py-16 md:py-24 px-4 sm:px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-[#44475b] tracking-tight mb-3">
                Trending stocks to research
              </h2>
              <p className="text-[#7c7e8c] text-base">
                Click any stock to view live charts, fundamentals, and AI analysis.
              </p>
            </div>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#00b386] hover:text-[#00926d] shrink-0"
            >
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 md:gap-5">
            {POPULAR_STOCKS.map((stock) => (
              <StockShortlistCard key={stock.ticker} stock={stock} />
            ))}
          </div>
        </div>
      </section>

      {/* Section 5: Features + indices + footer */}
      <FeatureShowcase />
      <MarketIndicesStrip />
      <MarketingFooter />
    </div>
  );
}
