"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BookOpen, Brain, Clock, Sparkles } from "lucide-react";
import CompanyInput from "@/components/CompanyInput";
import HelpChatWidget from "@/components/HelpChatWidget";
import MethodologyPanel from "@/components/MethodologyPanel";
import StockPageHeader from "@/components/StockPageHeader";
import StockShortlistCard from "@/components/StockShortlistCard";
import { TRENDING_STOCKS } from "@/lib/popularStocks";
import { stockPagePath } from "@/lib/stockSlug";
import { createClient } from "@/lib/supabase/client";

export default function DashboardPage() {
  const router = useRouter();
  const supabase = createClient();
  const [credits, setCredits] = useState<number | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [isMethodologyOpen, setIsMethodologyOpen] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const meta = user.user_metadata?.full_name ?? user.email?.split("@")[0];
        setUserName(meta ?? null);
        const { data } = await supabase
          .from("profiles")
          .select("credits")
          .eq("id", user.id)
          .single();
        if (data) setCredits(data.credits);
      }
    };
    fetchUser();
  }, [supabase]);

  const navigateToStock = (query: string) => {
    router.push(stockPagePath(query));
  };

  return (
    <main className="min-h-screen flex flex-col bg-white text-[#44475b]">
      <StockPageHeader
        onSearch={navigateToStock}
        credits={credits}
        onMethodologyOpen={() => setIsMethodologyOpen(true)}
        logoHref="/dashboard"
      />

      <div className="w-full max-w-6xl flex-1 mx-auto px-4 md:px-8 py-8 md:py-10 space-y-10">
        <section>
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-extrabold text-[#44475b] tracking-tight">
              {userName ? `Welcome back, ${userName}` : "Research Hub"}
            </h1>
            <p className="text-[#7c7e8c] mt-1.5 text-sm md:text-base">
              Search any stock to view charts, fundamentals, and run AI research.
            </p>
          </div>
          <CompanyInput onResearch={navigateToStock} submitLabel="Search" variant="dashboard" />
        </section>

        <section className="grid sm:grid-cols-2 gap-4">
          <button
            onClick={() => navigateToStock("NVIDIA")}
            className="flex items-start gap-4 p-5 bg-[#fafafa] rounded-2xl border border-[#e9e9eb] hover:border-[#00b386]/40 hover:shadow-md transition-all text-left group"
          >
            <div className="w-11 h-11 rounded-xl bg-[#00b386]/10 flex items-center justify-center shrink-0 group-hover:bg-[#00b386]/15 transition-colors">
              <Brain className="w-5 h-5 text-[#00b386]" />
            </div>
            <div>
              <h3 className="font-bold text-[#44475b] mb-1">Run AI Research</h3>
              <p className="text-sm text-[#7c7e8c]">Search a stock and generate a full AI analysis report.</p>
            </div>
          </button>
          <button
            onClick={() => setIsMethodologyOpen(true)}
            className="flex items-start gap-4 p-5 bg-[#fafafa] rounded-2xl border border-[#e9e9eb] hover:border-[#00b386]/40 hover:shadow-md transition-all text-left group"
          >
            <div className="w-11 h-11 rounded-xl bg-[#00b386]/10 flex items-center justify-center shrink-0 group-hover:bg-[#00b386]/15 transition-colors">
              <BookOpen className="w-5 h-5 text-[#00b386]" />
            </div>
            <div>
              <h3 className="font-bold text-[#44475b] mb-1">View Methodology</h3>
              <p className="text-sm text-[#7c7e8c]">Understand how our AI scoring and research engine works.</p>
            </div>
          </button>
        </section>

        <section>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-bold text-[#44475b]">Trending to research</h2>
            <Link href="/#stocks" className="text-sm font-semibold text-[#00b386] hover:text-[#00926d]">
              See all
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {TRENDING_STOCKS.map((stock) => (
              <StockShortlistCard key={stock.ticker} stock={stock} compact />
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[#44475b] mb-5">Recently viewed</h2>
          <div className="flex flex-col items-center justify-center py-12 bg-[#fafafa] rounded-2xl border border-dashed border-[#e9e9eb]">
            <Clock className="w-8 h-8 text-[#7c7e8c]/50 mb-3" />
            <p className="text-sm text-[#7c7e8c]">Stocks you research will appear here.</p>
            <button
              onClick={() => navigateToStock("Tesla")}
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[#00b386] hover:text-[#00926d]"
            >
              <Sparkles className="w-4 h-4" />
              Research Tesla to get started
            </button>
          </div>
        </section>
      </div>

      <HelpChatWidget />
      <MethodologyPanel isOpen={isMethodologyOpen} onClose={() => setIsMethodologyOpen(false)} />
    </main>
  );
}
