"use client";

import React from "react";
import { CheckCircle2, Loader2, Search, Activity } from "lucide-react";

interface ResearchProgressProps {
  companyName: string;
  activeNode: string | null;
  completedNodes: string[];
}

const STEPS = [
  { id: "fetch_financials", label: "Fetching financial data...", sub: "Yahoo Finance metrics & ratios" },
  { id: "fetch_news", label: "Reading latest news...", sub: "Extracting events & news sentiment" },
  { id: "analyze_competitors", label: "Comparing competitors...", sub: "Market share, pricing & AI leadership" },
  { id: "assess_risks", label: "Evaluating risks...", sub: "Categorized severity matrix synthesis" },
  { id: "evaluate_valuation", label: "Evaluating valuation...", sub: "Valuation attractiveness calculations" },
  { id: "final_decision", label: "Generating recommendation...", sub: "Deterministic confidence synthesis" },
];

export default function ResearchProgress({ companyName, activeNode, completedNodes }: ResearchProgressProps) {
  return (
    <div className="w-full max-w-xl mx-auto mt-12 p-8 rounded-3xl bg-white border border-slate-200 shadow-2xl relative overflow-hidden">
      {/* Background glow effect */}
      <div className="absolute -top-32 -left-32 w-64 h-64 bg-[var(--primary)]/10 rounded-full blur-3xl pointer-events-none" />
      
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center border border-blue-100 shadow-inner">
          <Activity className="w-6 h-6 text-[var(--primary)] animate-pulse" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Researching {companyName}</h2>
          <p className="text-sm text-slate-600">Live LangGraph execution pipeline</p>
        </div>
      </div>

      <div className="space-y-6">
        {STEPS.map((step) => {
          const isCompleted = completedNodes.includes(step.id);
          const isCurrent = activeNode === step.id;
          const isPending = !isCompleted && !isCurrent;

          return (
            <div
              key={step.id}
              className={`flex items-start gap-4 transition-all duration-300 ${
                isPending ? "opacity-30" : "opacity-100"
              }`}
            >
              <div className="relative flex items-center justify-center w-6 h-6 mt-1 flex-shrink-0">
                {isCompleted ? (
                  <CheckCircle2 className="w-6 h-6 text-[var(--primary)] fill-[var(--primary-muted)]" />
                ) : isCurrent ? (
                  <Loader2 className="w-5 h-5 text-[var(--primary)] animate-spin" />
                ) : (
                  <div className="w-2 h-2 rounded-full bg-neutral-600" />
                )}
              </div>
              
              <div className="flex flex-col">
                <span
                  className={`text-base font-semibold ${
                    isCompleted
                      ? "text-slate-700 line-through decoration-neutral-800 decoration-2"
                      : isCurrent
                      ? "text-slate-900 font-bold"
                      : "text-slate-500"
                  }`}
                >
                  {step.label}
                </span>
                <span className="text-xs text-slate-500 mt-0.5">{step.sub}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
