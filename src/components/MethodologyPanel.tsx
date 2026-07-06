import React from "react";
import { X, Scale, Database, AlertCircle, ShieldAlert } from "lucide-react";

interface MethodologyPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MethodologyPanel({ isOpen, onClose }: MethodologyPanelProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-300">
      <div 
        className="w-full max-w-2xl bg-white border border-neutral-850 rounded-3xl p-6 md:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
          <span>Console Research Methodology</span>
        </h2>

        <div className="space-y-6 text-sm text-slate-700 leading-relaxed">
          {/* Section 1 */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
              <Scale className="w-4 h-4 text-[var(--primary)]" /> Weighted Confidence Formula
            </h3>
            <p className="text-slate-600 mb-3">
              The aggregate confidence score is not an AI guess. It is calculated deterministically by combining multi-agent scores using weighted ratings:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
              <div className="bg-white/60 p-2.5 rounded-xl border border-neutral-850">
                <div className="text-xs text-slate-500 font-medium">Financials</div>
                <div className="font-mono font-bold text-slate-900 text-base mt-1">30%</div>
              </div>
              <div className="bg-white/60 p-2.5 rounded-xl border border-neutral-850">
                <div className="text-xs text-slate-500 font-medium">News</div>
                <div className="font-mono font-bold text-slate-900 text-base mt-1">20%</div>
              </div>
              <div className="bg-white/60 p-2.5 rounded-xl border border-neutral-850">
                <div className="text-xs text-slate-500 font-medium">Valuation</div>
                <div className="font-mono font-bold text-slate-900 text-base mt-1">20%</div>
              </div>
              <div className="bg-white/60 p-2.5 rounded-xl border border-neutral-850">
                <div className="text-xs text-slate-500 font-medium">Risk (Inv.)</div>
                <div className="font-mono font-bold text-slate-900 text-base mt-1">20%</div>
              </div>
              <div className="bg-white/60 p-2.5 rounded-xl border border-neutral-850">
                <div className="text-xs text-slate-500 font-medium">Competitors</div>
                <div className="font-mono font-bold text-slate-900 text-base mt-1">10%</div>
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-3 italic">
              * Note: News Sentiment maps to scores (positive=80, neutral=50, negative=20) and Risk Score is inverted (100 - riskScore) before weighting since higher risk is negative.
            </p>
          </div>

          {/* Section 2 */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
              <Database className="w-4 h-4 text-blue-400" /> Integrated Data Sources
            </h3>
            <p className="text-slate-600">
              Our pipeline integrates live APIs to feed fresh metrics to specialized sub-agents:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-slate-600">
              <li><strong className="text-slate-700">Financial Ratios & Valuations:</strong> Yahoo Finance API</li>
              <li><strong className="text-slate-700">Latest News & Competitor Profiling:</strong> Tavily Search Engine api</li>
              <li><strong className="text-slate-700">AI Synthesized Recommendations:</strong> Llama 3.3 70B via Groq</li>
            </ul>
          </div>

          {/* Section 3 */}
          <div className="p-4 bg-rose-500/5 border border-rose-500/10 rounded-2xl flex gap-3">
            <ShieldAlert className="w-6 h-6 text-rose-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-slate-900 mb-1">Financial Advisory Disclaimer</h3>
              <p className="text-slate-600 text-xs leading-relaxed">
                This console is an artificial intelligence-driven research assistant designed for informational and educational use only. It is not licensed financial or investment advice. Stock analyses are based on historical data and current news sentiment which may change. Always perform your own due diligence or consult a registered advisor before making investment decisions.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-2.5 bg-neutral-100 hover:bg-white text-neutral-950 font-bold rounded-xl transition-all"
          >
            Acknowledge
          </button>
        </div>
      </div>
    </div>
  );
}
