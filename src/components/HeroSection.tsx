"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import Button from "@/components/ui/Button";

function DashboardPreview() {
  return (
    <div className="relative mx-auto max-w-[540px] animate-float">
      <div className="rounded-2xl border border-[var(--border)] bg-white shadow-2xl shadow-black/10 overflow-hidden">
        <div className="flex items-center gap-1.5 px-4 py-3 border-b border-[var(--border-subtle)] bg-[var(--surface-muted)]">
          <div className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
          <div className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
          <div className="w-2.5 h-2.5 rounded-full bg-[var(--primary)]/80" />
          <span className="ml-2 text-[11px] text-[var(--text-muted)] font-medium">
            MarketMind Dashboard
          </span>
        </div>

        <div className="p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-[var(--text-muted)]">Welcome back</div>
              <div className="text-sm font-semibold text-[var(--text-primary)]">
                Research Hub
              </div>
            </div>
            <div className="px-2.5 py-1 text-[10px] font-medium bg-amber-50 text-amber-700 border border-amber-200 rounded-full">
              5 credits
            </div>
          </div>

          <div className="h-9 rounded-lg bg-[var(--surface-muted)] border border-[var(--border)] flex items-center px-3">
            <span className="text-xs text-[var(--text-muted)]">Search any stock...</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { name: "NVIDIA", ticker: "NVDA", change: "+2.4%", up: true },
              { name: "Tesla", ticker: "TSLA", change: "+1.3%", up: true },
              { name: "Apple", ticker: "AAPL", change: "-0.8%", up: false },
              { name: "Zomato", ticker: "ZOMATO", change: "+1.8%", up: true },
            ].map((s) => (
              <div
                key={s.ticker}
                className="rounded-lg border border-[var(--border)] p-3 hover:border-[var(--primary)]/30 transition-colors"
              >
                <div className="text-xs font-semibold text-[var(--text-primary)]">
                  {s.name}
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-[10px] text-[var(--text-muted)]">{s.ticker}</span>
                  <span
                    className={`text-[10px] font-semibold ${s.up ? "text-[var(--buy)]" : "text-[var(--sell)]"}`}
                  >
                    {s.change}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-lg bg-[var(--primary-muted)] border border-[color-mix(in_srgb,var(--primary)_15%,transparent)] p-3">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-[var(--primary)]" />
              <span className="text-xs font-semibold text-[var(--primary)]">
                AI Research Complete
              </span>
            </div>
            <div className="text-[11px] text-[var(--text-secondary)]">
              NVIDIA — Strong Buy · 88/100 confidence
            </div>
          </div>
        </div>
      </div>

      <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-[var(--primary)]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -top-6 -left-6 w-32 h-32 bg-[var(--primary)]/8 rounded-full blur-2xl pointer-events-none" />
    </div>
  );
}

export default function HeroSection() {
  return (
    <section className="relative pt-[var(--topbar-height)] hero-gradient overflow-hidden">
      <div className="hero-glow hero-glow-1" aria-hidden />
      <div className="hero-glow hero-glow-2" aria-hidden />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20 md:py-28 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 mb-6 text-xs font-semibold text-[var(--primary)] bg-[var(--primary-muted)] border border-[color-mix(in_srgb,var(--primary)_20%,transparent)] rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] animate-pulse" />
              AI-powered investment research
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-[3.75rem] font-bold text-[var(--text-primary)] tracking-tight leading-[1.06] mb-6">
              Research stocks
              <br />
              <span className="bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] bg-clip-text text-transparent">
                with confidence
              </span>
            </h1>

            <p className="text-base md:text-lg text-[var(--text-secondary)] max-w-lg mx-auto lg:mx-0 leading-relaxed mb-9">
              MarketMind combines live market data, fundamentals, and deterministic AI to deliver institutional-grade research — in seconds, not hours.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-3 justify-center lg:justify-start mb-4">
              <Link href="/signup">
                <Button size="lg" className="w-full sm:w-auto shadow-md shadow-[var(--primary)]/20">
                  Start for free <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Open dashboard
                </Button>
              </Link>
            </div>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 justify-center lg:justify-start text-xs text-[var(--text-muted)]">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[var(--primary)]" />
                Free credits included
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[var(--primary)]" />
                No credit card
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[var(--primary)]" />
                Cancel anytime
              </span>
            </div>
          </div>

          <div className="relative lg:pl-4">
            <DashboardPreview />
          </div>
        </div>
      </div>
    </section>
  );
}
