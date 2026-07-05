"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BookOpen, Brain, Clock, FileSearch, Sparkles, TrendingUp } from "lucide-react";
import AppShell from "@/components/layout/AppShell";
import CompanyInput from "@/components/CompanyInput";
import HelpChatWidget from "@/components/HelpChatWidget";
import MethodologyPanel from "@/components/MethodologyPanel";
import StockShortlistCard from "@/components/StockShortlistCard";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
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
    <>
      <AppShell
        onSearch={navigateToStock}
        credits={credits}
        userName={userName}
        onMethodologyOpen={() => setIsMethodologyOpen(true)}
      >
        {/* Welcome card */}
        <div className="mb-6">
          <Card padding="lg" className="mb-4 bg-gradient-to-br from-white to-[var(--primary-muted)]/20">
            <Badge variant="primary" className="mb-3">
              <Sparkles className="w-3 h-3" />
              Research workspace
            </Badge>
            <h1 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)] tracking-tight">
              {userName ? `Welcome back, ${userName}` : "Research Hub"}
            </h1>
            <p className="text-[var(--text-secondary)] mt-1.5 text-sm md:text-base">
              Search any stock to view charts, fundamentals, and run AI research.
            </p>
          </Card>
          <CompanyInput onResearch={navigateToStock} submitLabel="Search" variant="dashboard" />
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Research credits", value: credits !== null ? String(credits) : "—", icon: Sparkles, color: "text-amber-600 bg-amber-50" },
            { label: "Stocks tracked", value: "10K+", icon: TrendingUp, color: "text-[var(--primary)] bg-[var(--primary-muted)]" },
            { label: "Reports run", value: "0", icon: FileSearch, color: "text-blue-600 bg-blue-50" },
            { label: "Avg. research time", value: "<30s", icon: Clock, color: "text-violet-600 bg-violet-50" },
          ].map((stat) => (
            <Card key={stat.label} padding="sm" className="flex items-start gap-3">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${stat.color}`}>
                <stat.icon className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xl font-bold text-[var(--text-primary)]">{stat.value}</div>
                <div className="text-xs text-[var(--text-muted)] mt-0.5">{stat.label}</div>
              </div>
            </Card>
          ))}
        </div>

        {/* Quick actions */}
        <div className="grid sm:grid-cols-2 gap-4 mb-8">
          <button
            onClick={() => navigateToStock("NVIDIA")}
            className="flex items-start gap-4 p-5 bg-white rounded-xl border border-[var(--border)] hover:border-[color-mix(in_srgb,var(--primary)_30%,var(--border))] hover:shadow-md transition-all text-left group"
          >
            <div className="w-10 h-10 rounded-lg bg-[var(--primary-muted)] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Brain className="w-5 h-5 text-[var(--primary)]" />
            </div>
            <div>
              <h3 className="font-semibold text-[var(--text-primary)] mb-1">Run AI Research</h3>
              <p className="text-sm text-[var(--text-secondary)]">Search a stock and generate a full AI analysis report.</p>
            </div>
          </button>
          <button
            onClick={() => setIsMethodologyOpen(true)}
            className="flex items-start gap-4 p-5 bg-white rounded-xl border border-[var(--border)] hover:border-[color-mix(in_srgb,var(--primary)_30%,var(--border))] hover:shadow-md transition-all text-left group"
          >
            <div className="w-10 h-10 rounded-lg bg-[var(--primary-muted)] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <BookOpen className="w-5 h-5 text-[var(--primary)]" />
            </div>
            <div>
              <h3 className="font-semibold text-[var(--text-primary)] mb-1">View Methodology</h3>
              <p className="text-sm text-[var(--text-secondary)]">Understand how our AI scoring and research engine works.</p>
            </div>
          </button>
        </div>

        {/* Trending stocks */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">Trending to research</h2>
            <Link href="/#stocks" className="text-sm font-medium text-[var(--primary)] hover:text-[var(--primary-hover)]">
              See all
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {TRENDING_STOCKS.map((stock) => (
              <StockShortlistCard key={stock.ticker} stock={stock} compact />
            ))}
          </div>
        </section>

        {/* Recent activity empty state */}
        <section>
          <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-5">Recent activity</h2>
          <div className="flex flex-col items-center justify-center py-14 bg-white rounded-xl border border-dashed border-[var(--border)]">
            <div className="w-12 h-12 rounded-xl bg-[var(--surface-muted)] flex items-center justify-center mb-4">
              <Clock className="w-6 h-6 text-[var(--text-muted)]" />
            </div>
            <p className="text-sm font-medium text-[var(--text-primary)] mb-1">No recent activity</p>
            <p className="text-sm text-[var(--text-muted)] mb-4">Stocks you research will appear here.</p>
            <button
              onClick={() => navigateToStock("Tesla")}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--primary)] hover:text-[var(--primary-hover)]"
            >
              <Sparkles className="w-4 h-4" />
              Research Tesla to get started
            </button>
          </div>
        </section>
      </AppShell>

      <HelpChatWidget />
      <MethodologyPanel isOpen={isMethodologyOpen} onClose={() => setIsMethodologyOpen(false)} />
    </>
  );
}
