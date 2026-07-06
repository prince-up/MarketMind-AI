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
          bg: "bg-emerald-50 text-emerald-700 border-emerald-200",
          bar: "bg-[var(--primary)]",
          icon: <TrendingUp className="w-6 h-6" />,
        };
      case "HOLD":
        return {
          bg: "bg-amber-50 text-amber-700 border-amber-200",
          bar: "bg-amber-500",
          icon: <Scale className="w-6 h-6" />,
        };
      case "PASS":
        return {
          bg: "bg-rose-50 text-rose-700 border-rose-200",
          bar: "bg-rose-500",
          icon: <TrendingDown className="w-6 h-6" />,
        };
    }
  };

  const style = getBadgeStyle();

  return (
    <div className="report-card w-full relative overflow-hidden">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-200">
        {timestamp && (
          <span className="text-xs text-slate-500">
            Last updated: <span className="font-mono text-slate-600">{timestamp}</span>
          </span>
        )}
        <button
          onClick={() => setIsMethodologyOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-[var(--primary)] hover:bg-[var(--primary-muted)] border border-[var(--primary)]/20 rounded-lg transition-colors"
        >
          <BookOpen className="w-3.5 h-3.5" />
          Our Methodology
        </button>
      </div>

      {/* Verdict + Reasoning row */}
      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
        {/* Left: verdict & confidence */}
        <div className="flex flex-col gap-4">
          <span className="text-xs font-semibold text-slate-500">AI Verdict</span>

          <div className={`inline-flex items-center gap-2.5 px-5 py-3 rounded-xl font-bold text-3xl tracking-tight border w-fit ${style.bg}`}>
            {style.icon}
            {verdict}
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="font-mono text-2xl font-bold text-slate-900">{confidence}%</span>
              <span className="text-sm text-slate-600">Confidence</span>
              <div className="group relative cursor-help">
                <Info className="w-3.5 h-3.5 text-slate-400" />
                <div className="absolute left-0 bottom-full mb-2 w-56 p-2.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg z-50">
                  Weighted: Financials 30%, News 20%, Risk 20%, Valuation 20%, Competitors 10%
                </div>
              </div>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-1000 ease-out ${style.bar}`}
                style={{ width: timestamp ? `${confidence}%` : "0%" }}
              />
            </div>
          </div>

          <p className="text-sm text-slate-600 leading-relaxed pt-3 border-t border-slate-200">
            <span className="font-semibold text-slate-800">Summary:</span> {summary}
          </p>
        </div>

        {/* Right: reasoning */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <ShieldAlert className="w-4 h-4 text-slate-500" />
            <span className="text-xs font-semibold text-slate-500">Key Reasoning</span>
          </div>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {(reasoning ?? []).map((point, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-200">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] mt-1.5 flex-shrink-0" />
                <span className="leading-relaxed">{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Upsides / Downsides */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 pt-5 border-t border-slate-200">
        <div>
          <h4 className="text-xs font-semibold text-emerald-600 mb-2 flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5" /> Core Upsides
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {(!positives || positives.length === 0) ? (
              <span className="text-xs text-slate-500 italic">No positives listed.</span>
            ) : (
              positives.map((p, i) => (
                <span key={i} className="text-xs px-2 py-1 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-md">
                  {p}
                </span>
              ))
            )}
          </div>
        </div>
        <div>
          <h4 className="text-xs font-semibold text-rose-600 mb-2 flex items-center gap-1">
            <ArrowDownRight className="w-3.5 h-3.5" /> Core Downsides
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {(!negatives || negatives.length === 0) ? (
              <span className="text-xs text-slate-500 italic">No negatives listed.</span>
            ) : (
              negatives.map((n, i) => (
                <span key={i} className="text-xs px-2 py-1 bg-rose-50 border border-rose-200 text-rose-800 rounded-md">
                  {n}
                </span>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="mt-5 pt-4 border-t border-slate-200 flex items-start gap-2 text-xs text-slate-500 leading-relaxed">
        <AlertCircle className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 mt-0.5" />
        <span>
          <strong>Disclaimer:</strong> AI-generated research for informational purposes only — not licensed financial advice. Do your own due diligence.
        </span>
      </div>

      <MethodologyPanel isOpen={isMethodologyOpen} onClose={() => setIsMethodologyOpen(false)} />
    </div>
  );
}
