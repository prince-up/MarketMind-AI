import React, { useState, useEffect } from "react";
import { TrendingUp, Scale, TrendingDown, Info, ShieldAlert, ArrowUpRight, ArrowDownRight, BookOpen, AlertCircle } from "lucide-react";
import MethodologyPanel from "./MethodologyPanel";

interface VerdictCardProps {
  verdict: "BUY" | "HOLD" | "PASS";
  confidence: number;
  reasoning: string[];
  summary: string;
  positives: string[];
  negatives: string[];
}

export default function VerdictCard({
  verdict,
  confidence,
  reasoning,
  summary,
  positives,
  negatives,
}: VerdictCardProps) {
  const [timestamp, setTimestamp] = useState<string>("");
  const [isMethodologyOpen, setIsMethodologyOpen] = useState(false);

  useEffect(() => {
    setTimestamp(new Date().toLocaleString());
  }, []);

  const getBadgeStyle = () => {
    switch (verdict) {
      case "BUY":
        return {
          bg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
          glow: "bg-emerald-500",
          icon: <TrendingUp className="w-8 h-8" />,
        };
      case "HOLD":
        return {
          bg: "bg-amber-500/10 text-amber-400 border-amber-500/30",
          glow: "bg-amber-500",
          icon: <Scale className="w-8 h-8" />,
        };
      case "PASS":
        return {
          bg: "bg-rose-500/10 text-rose-400 border-rose-500/30",
          glow: "bg-rose-500",
          icon: <TrendingDown className="w-8 h-8" />,
        };
    }
  };

  const style = getBadgeStyle();

  return (
    <div className="w-full bg-neutral-900 border border-neutral-800 rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden flex flex-col gap-6 hover:-translate-y-1 hover:shadow-2xl hover:border-neutral-700 transition-all duration-300">
      
      {/* Background Accent */}
      <div 
        className={`absolute top-0 right-0 w-64 h-64 blur-3xl opacity-10 pointer-events-none rounded-full translate-x-1/2 -translate-y-1/2 ${style.glow}`} 
      />

      {/* Top Timestamp & Methodology Trigger Row */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-800/60 pb-4">
        {timestamp && (
          <span className="text-xs text-neutral-500 font-medium">
            Last updated: <span className="font-mono text-neutral-400">{timestamp}</span>
          </span>
        )}
        <button
          onClick={() => setIsMethodologyOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-emerald-400 hover:text-emerald-350 bg-emerald-500/5 hover:bg-emerald-500/10 border border-emerald-500/15 rounded-xl transition-all"
        >
          <BookOpen className="w-3.5 h-3.5" />
          Our Methodology
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Verdict Column */}
        <div className="flex flex-col gap-5 items-start border-b lg:border-b-0 lg:border-r border-neutral-800 pb-6 lg:pb-0 lg:pr-8">
          <div className="text-xs font-semibold text-neutral-500 uppercase tracking-widest">
            AI Verdict
          </div>
          
          <div 
            className={`inline-flex items-center gap-3 px-6 py-3.5 rounded-2xl font-black text-4xl tracking-tight border ${style.bg}`}
          >
            {style.icon}
            {verdict}
          </div>

          <div className="flex flex-col gap-1 mt-2">
            <div className="flex items-center gap-2 text-neutral-400">
              <span className="font-mono text-3xl font-bold text-white">{confidence}%</span>
              <span className="text-sm font-medium">Confidence Score</span>
              <div className="group relative ml-1 cursor-help">
                <Info className="w-4 h-4 text-neutral-500 hover:text-neutral-300" />
                <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-64 p-3 bg-neutral-950 border border-neutral-805 rounded-xl text-xs text-neutral-400 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none text-left leading-relaxed shadow-xl z-50">
                  Calculated deterministically:
                  <ul className="list-disc list-inside mt-1 space-y-0.5 font-mono text-[10px]">
                    <li>Financials: 30%</li>
                    <li>News Sentiment: 20%</li>
                    <li>Risk (Inverted): 20%</li>
                    <li>Valuation: 20%</li>
                    <li>Competitors: 10%</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="w-full bg-neutral-950 h-2 rounded-full overflow-hidden border border-neutral-800 mt-1">
              <div 
                className={`h-full rounded-full transition-all duration-1000 ${
                  verdict === "BUY" ? "bg-emerald-500" : verdict === "HOLD" ? "bg-amber-500" : "bg-rose-500"
                }`}
                style={{ width: `${confidence}%` }}
              />
            </div>
          </div>

          <div className="text-sm text-neutral-400 leading-relaxed mt-2 pt-4 border-t border-neutral-800/55 w-full">
            <span className="font-semibold text-neutral-300">Executive Summary:</span> {summary}
          </div>
        </div>

        {/* Reasoning Column */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div>
            <div className="text-xs font-semibold text-neutral-500 uppercase tracking-widest mb-4 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-neutral-400" />
              Key Reasoning Summary
            </div>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {(reasoning ?? []).map((point, i) => (
                <li key={i} className="flex items-start gap-2.5 text-neutral-300 bg-neutral-950/40 p-3 rounded-xl border border-neutral-800/40 text-sm">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-neutral-600 flex-shrink-0" />
                  <span className="leading-relaxed">{point}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Positives / Negatives tags */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-neutral-800">
            <div>
              <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                <ArrowUpRight className="w-4 h-4" /> Core Upsides
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {(positives ?? []).map((p, i) => (
                  <span key={i} className="text-xs px-2.5 py-1 bg-emerald-500/5 border border-emerald-500/10 text-neutral-300 rounded-lg">
                    {p}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-xs font-bold text-rose-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                <ArrowDownRight className="w-4 h-4" /> Core Downsides / Risks
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {(negatives ?? []).map((n, i) => (
                  <span key={i} className="text-xs px-2.5 py-1 bg-rose-500/5 border border-rose-500/10 text-neutral-300 rounded-lg">
                    {n}
                  </span>
                ))}
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Footer Disclaimer Bar */}
      <div className="mt-4 pt-4 border-t border-neutral-800/60 flex items-start gap-2 text-[10px] text-neutral-500 leading-relaxed">
        <AlertCircle className="w-4 h-4 text-neutral-600 flex-shrink-0 mt-0.5" />
        <span>
          <strong>Disclaimer:</strong> This tool provides AI-generated research for informational purposes only and is not licensed financial or investment advice. Always do your own due diligence before investing.
        </span>
      </div>

      {/* Methodology Overlay Modal */}
      <MethodologyPanel isOpen={isMethodologyOpen} onClose={() => setIsMethodologyOpen(false)} />
    </div>
  );
}
