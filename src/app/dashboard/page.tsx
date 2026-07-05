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

function EmptyStateIllustration() {
  return (
    <svg
      viewBox="0 0 120 80"
      className="w-28 h-20 mb-5 text-[var(--text-muted)]"
      fill="none"
      aria-hidden
    >
      <rect x="10" y="20" width="100" height="50" rx="8" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
      <rect x="20" y="32" width="40" height="4" rx="2" fill="currentColor" opacity="0.2" />
      <rect x="20" y="42" width="60" height="4" rx="2" fill="currentColor" opacity="0.15" />
      <rect x="20" y="52" width="30" height="4" rx="2" fill="currentColor" opacity="0.1" />
      <circle cx="85" cy="45" r="12" stroke="var(--primary)" strokeWidth="1.5" opacity="0.4" />
      <path d="M81 45 L84 48 L89 42" stroke="var(--primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.6" />
    </svg>
  );
}

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
        <div className="mb-8">
          <Card
            padding="lg"
            className="mb-5 bg-gradient-to-br from-white via-white to-[var(--primary-muted)]/30 border-[color-mix(in_srgb,var(--primary)_10%,var(--border))]"
          >
            <Badge variant="primary" className="mb-4">
              <Sparkles className="w-3 h-3" />
              Research workspace
            </Badge>
            <h1 className="page-title md:text-3xl">
              {userName ? `Welcome back, ${userName}` : "Research Hub"}
            </h1>
            <p className="page-subtitle md:text-base">
              Search any stock to view charts, fundamentals, and run AI research.
            </p>
          </Card>
          <CompanyInput onResearch={navigateToStock} submitLabel="Search" variant="dashboard" />
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            {
              label: "Research credits",
              value: credits !== null ? String(credits) : "—",
              icon: Sparkles,
              color: "text-amber-600 bg-amber-50 border-amber-100",
            },
            {
              label: "Stocks tracked",
              value: "10K+",
              icon: TrendingUp,
              color: "text-[var(--primary)] bg-[var(--primary-muted)] border-[color-mix(in_srgb,var(--primary)_15%,transparent)]",
            },
            {
              label: "Reports run",
              value: "0",
              icon: FileSearch,
              color: "text-blue-600 bg-blue-50 border-blue-100",
            },
            {
              label: "Avg. research time",
              value: "<30s",
              icon: Clock,
              color: "text-violet-600 bg-violet-50 border-violet-100",
            },
          ].map((stat) => (
            <div key={stat.label} className="stat-card p-4 md:p-5 flex items-start gap-3.5">
              <div
                className={`stat-icon w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${stat.color}`}
              >
                <stat.icon className="w-4.5 h-4.5" />
              </div>
              <div>
                <div className="text-xl md:text-2xl font-bold text-[var(--text-primary)] tracking-tight">
                  {stat.value}
                </div>
                <div className="text-xs text-[var(--text-muted)] mt-0.5">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick actions */}
        <div className="grid sm:grid-cols-2 gap-4 mb-10">
          <button
            onClick={() => navigateToStock("NVIDIA")}
            className="saas-card saas-card-interactive flex items-start gap-4 p-5 md:p-6 text-left group"
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[var(--primary-muted)] to-[color-mix(in_srgb,var(--primary)_15%,white)] border border-[color-mix(in_srgb,var(--primary)_15%,transparent)] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Brain className="w-5 h-5 text-[var(--primary)]" />
            </div>
            <div>
              <h3 className="font-semibold text-[var(--text-primary)] mb-1">Run AI Research</h3>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                Search a stock and generate a full AI analysis report.
              </p>
            </div>
          </button>
          <button
            onClick={() => setIsMethodologyOpen(true)}
            className="saas-card saas-card-interactive flex items-start gap-4 p-5 md:p-6 text-left group"
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[var(--primary-muted)] to-[color-mix(in_srgb,var(--primary)_15%,white)] border border-[color-mix(in_srgb,var(--primary)_15%,transparent)] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <BookOpen className="w-5 h-5 text-[var(--primary)]" />
            </div>
            <div>
              <h3 className="font-semibold text-[var(--text-primary)] mb-1">View Methodology</h3>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                Understand how our AI scoring and research engine works.
              </p>
            </div>
          </button>
        </div>

        {/* Trending stocks */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold text-[var(--text-primary)] tracking-tight">
              Trending to research
            </h2>
            <Link
              href="/#stocks"
              className="text-sm font-medium text-[var(--primary)] hover:text-[var(--primary-hover)] transition-colors"
            >
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
          <h2 className="text-lg font-semibold text-[var(--text-primary)] tracking-tight mb-5">
            Recent activity
          </h2>
          <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-dashed border-[var(--border)]">
            <EmptyStateIllustration />
            <p className="text-sm font-semibold text-[var(--text-primary)] mb-1">
              No recent activity
            </p>
            <p className="text-sm text-[var(--text-muted)] mb-5 text-center max-w-xs">
              Stocks you research will appear here for quick access.
            </p>
            <button
              onClick={() => navigateToStock("Tesla")}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-[var(--primary)] hover:bg-[var(--primary-hover)] rounded-xl transition-colors shadow-sm"
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
