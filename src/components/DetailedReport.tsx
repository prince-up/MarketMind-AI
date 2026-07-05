"use client";

import React from "react";
import { 
  BarChart3, 
  Newspaper, 
  Users, 
  AlertTriangle, 
  LineChart,
  Globe,
  TrendingUp,
  AlertCircle,
  Briefcase
} from "lucide-react";
import type { ResearchResult } from "@/types";
import SourceTag from "./SourceTag";
import ScoreGauge from "./ScoreGauge";
import EarningsHistory from "./EarningsHistory";
import AnalystRecommendation from "./AnalystRecommendation";

interface DetailedReportProps {
  report: ResearchResult;
}

export default function DetailedReport({ report }: DetailedReportProps) {
  const fin = report.financial ?? {
    ticker: "N/A",
    revenueGrowth: "N/A",
    peRatio: "N/A",
    marketCap: "N/A",
    cashFlow: "N/A",
    debt: "N/A",
    profitability: "N/A",
    score: 50,
    rawText: "Financial data could not be retrieved.",
    sources: ["Yahoo Finance"]
  };
  const news = report.news ?? {
    sentiment: "neutral",
    sentimentScore: 50,
    positives: [],
    negatives: [],
    keyEvents: ["No recent news found."],
    investmentImpact: "Insufficient news data.",
    sources: ["Tavily Search"]
  };
  const comp = report.competitors ?? {
    marketPosition: "Competitor data unavailable.",
    strengths: [],
    weaknesses: [],
    competitors: [],
    score: 50,
    sources: ["Tavily Search"]
  };
  const risk = report.risks ?? {
    riskScore: 50,
    level: "Medium",
    risks: [],
    sources: ["Yahoo Finance", "Tavily Search"]
  };
  const val = report.valuation ?? {
    valuation: "Fairly Valued",
    score: 50,
    positives: [],
    negatives: [],
    sources: ["Yahoo Finance"]
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-700 border-emerald-200 bg-emerald-50";
    if (score >= 60) return "text-amber-700 border-amber-200 bg-amber-50";
    return "text-rose-700 border-rose-200 bg-rose-50";
  };

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case "Low":
        return "text-emerald-700 border-emerald-200 bg-emerald-50";
      case "Medium":
        return "text-amber-700 border-amber-200 bg-amber-50";
      case "High":
        return "text-orange-700 border-orange-200 bg-orange-50";
      case "Very High":
        return "text-rose-700 border-rose-200 bg-rose-50";
      default:
        return "text-slate-500 border-slate-200 bg-slate-50";
    }
  };

  const getValuationColor = (status: string) => {
    switch (status) {
      case "Undervalued":
        return "text-emerald-700 border-emerald-200 bg-emerald-50";
      case "Fairly Valued":
        return "text-amber-700 border-amber-200 bg-amber-50";
      case "Overvalued":
        return "text-rose-700 border-rose-200 bg-rose-50";
      default:
        return "text-slate-500 border-slate-200 bg-slate-50";
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* ─── ROW 1: Financial & Valuation ─── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100 fill-mode-both">
        
        {/* Financial Health Card */}
        <div className="bg-white border border-slate-200 rounded-lg p-6 flex flex-col justify-between relative overflow-hidden group hover:border-slate-300 transition-colors">
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-50 rounded-xl border border-slate-200">
                  <BarChart3 className="w-5 h-5 text-emerald-400" />
                </div>
                <h3 className="font-bold text-slate-900 text-lg">Financial Health</h3>
              </div>
              <div className="flex items-center gap-2">
                <ScoreGauge score={fin.score} />
              </div>
            </div>

            {fin.ticker === "N/A" ? (
              <div className="text-slate-500 text-sm py-8 text-center italic">Financial data unavailable.</div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Revenue Growth", value: fin.revenueGrowth },
                  { label: "P/E Ratio", value: fin.peRatio },
                  { label: "Market Capitalization", value: fin.marketCap },
                  { label: "Profitability Status", value: fin.profitability },
                  { label: "Cash Flow", value: fin.cashFlow },
                  { label: "Debt Assessment", value: fin.debt }
                ].map((item, idx) => {
                  const isMissing = !item.value || item.value === "" || item.value === "N/A" || item.value.toLowerCase().includes("not provided") || item.value.toLowerCase().includes("unavailable");
                  return (
                    <div key={idx} className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                      <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold block mb-1">{item.label}</span>
                      {isMissing ? (
                        <div className="text-sm font-semibold text-slate-400 group/tt relative w-fit cursor-help">
                          —
                          <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-max bg-slate-100 text-slate-700 text-[10px] px-2 py-1 rounded opacity-0 group-hover/tt:opacity-100 transition-opacity pointer-events-none">
                            Not available for this company
                          </span>
                        </div>
                      ) : (
                        <div className="text-sm font-semibold text-slate-800">{item.value}</div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          
          <div className="mt-6">
            <SourceTag sources={fin.sources} />
          </div>
        </div>

        {/* Valuation Card */}
        <div className="bg-white border border-slate-200 rounded-lg p-6 flex flex-col justify-between relative overflow-hidden group hover:border-slate-300 transition-colors">
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-50 rounded-xl border border-slate-200">
                  <LineChart className="w-5 h-5 text-indigo-400" />
                </div>
                <h3 className="font-bold text-slate-900 text-lg">Valuation Assessment</h3>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-0.5 rounded-lg text-xs font-semibold border ${getValuationColor(val.valuation)}`}>
                  {val.valuation}
                </span>
                <ScoreGauge score={val.score} />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-2">Valuation Positives</h4>
                {(val.positives ?? []).length === 0 ? (
                  <div className="text-slate-500 text-xs italic">No positives listed.</div>
                ) : (
                  <ul className="space-y-1.5">
                    {(val.positives ?? []).map((p, i) => (
                      <li key={i} className="text-xs text-slate-700 flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1 flex-shrink-0" />
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div>
                <h4 className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-2">Valuation Risks & Negatives</h4>
                {(val.negatives ?? []).length === 0 ? (
                  <div className="text-slate-500 text-xs italic">No negatives listed.</div>
                ) : (
                  <ul className="space-y-1.5">
                    {(val.negatives ?? []).map((n, i) => (
                      <li key={i} className="text-xs text-slate-700 flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1 flex-shrink-0" />
                        <span>{n}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>

          <div className="mt-6">
            <SourceTag sources={val.sources} />
          </div>
        </div>

      </div>

      {/* ─── ROW 2: Earnings & Analyst Recommendation ─── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200 fill-mode-both">
        {report.earnings && report.earnings.length > 0 && (
          <EarningsHistory earnings={report.earnings} />
        )}
        {report.analystData && report.analystData.numberOfAnalystOpinions > 0 && (
          <AnalystRecommendation analystData={report.analystData} />
        )}
      </div>

      {/* ─── ROW 3: News Sentiment & Competitors ─── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300 fill-mode-both">
        
        {/* News Sentiment Card */}
        <div className="bg-white border border-slate-200 rounded-lg p-6 flex flex-col justify-between relative overflow-hidden group hover:border-slate-300 transition-colors">
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-50 rounded-xl border border-slate-200">
                  <Newspaper className="w-5 h-5 text-blue-400" />
                </div>
                <h3 className="font-bold text-slate-900 text-lg">News Sentiment</h3>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-0.5 rounded-lg text-xs font-semibold capitalize border ${getValuationColor(news.sentiment === "positive" ? "Undervalued" : news.sentiment === "negative" ? "Overvalued" : "Fairly Valued")}`}>
                  {news.sentiment}
                </span>
                <ScoreGauge score={news.sentimentScore} />
              </div>
            </div>

            {(news.keyEvents ?? []).includes("No recent news found.") ? (
              <div className="text-slate-500 text-sm py-8 text-center italic">No recent news found.</div>
            ) : (
              <div className="space-y-4">
                <div>
                  <h4 className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-2">Key Recent Events</h4>
                  <ul className="space-y-1.5">
                    {(news.keyEvents ?? []).slice(0, 3).map((e, i) => (
                      <li key={i} className="text-xs text-slate-700 flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1 flex-shrink-0" />
                        <span>{e}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1.5">Investment Impact</h4>
                  <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-2xl border border-slate-200">
                    {news.investmentImpact}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="mt-6">
            <SourceTag sources={news.sources} />
          </div>
        </div>

        {/* Competitor Card */}
        <div className="bg-white border border-slate-200 rounded-lg p-6 flex flex-col justify-between relative overflow-hidden group hover:border-slate-300 transition-colors">
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-50 rounded-xl border border-slate-200">
                  <Users className="w-5 h-5 text-purple-400" />
                </div>
                <h3 className="font-bold text-slate-900 text-lg">Competitor Analysis</h3>
              </div>
              <div className="flex items-center gap-2">
                <ScoreGauge score={comp.score} />
              </div>
            </div>

            {(comp.competitors ?? []).length === 0 ? (
              <div className="text-slate-500 text-sm py-8 text-center italic">Competitor data unavailable.</div>
            ) : (
              <div className="space-y-4">
                <div>
                  <h4 className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-2">Market Position</h4>
                  <p className="text-xs text-slate-700 leading-relaxed bg-slate-50/40 p-2.5 rounded-xl border border-slate-200">
                    {comp.marketPosition}
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h4 className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Key Peers Comparison</h4>
                  <div className="max-h-48 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                    {(comp.competitors ?? []).map((c, i) => {
                      const hasGrowth = c.growth && c.growth !== "" && !c.growth.toLowerCase().includes("none mentioned") && !c.growth.toLowerCase().includes("n/a");
                      const hasAi = c.aiLeadership && c.aiLeadership !== "" && !c.aiLeadership.toLowerCase().includes("none mentioned") && !c.aiLeadership.toLowerCase().includes("n/a");
                      const hasPricing = c.pricing && c.pricing !== "" && !c.pricing.toLowerCase().includes("none mentioned") && !c.pricing.toLowerCase().includes("n/a");
                      const hasExtras = hasAi || hasPricing;

                      return (
                        <div key={i} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs transition-all duration-300">
                          <div className="flex justify-between items-center mb-1.5">
                            <span className="font-bold text-slate-800">{c.name}</span>
                            {hasGrowth && <span className="text-[10px] font-semibold text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200">Growth: {c.growth}</span>}
                          </div>
                          <p className="text-slate-600 leading-relaxed text-[11px]">{c.assessment}</p>
                          {hasExtras && (
                            <div className="flex flex-col gap-1 mt-3 pt-2 border-t border-neutral-900/50">
                              {hasAi && <span className="text-slate-600"><strong className="text-slate-500 mr-1">AI Lead:</strong> {c.aiLeadership}</span>}
                              {hasPricing && <span className="text-slate-600"><strong className="text-slate-500 mr-1">Pricing:</strong> {c.pricing}</span>}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="mt-6">
            <SourceTag sources={comp.sources} />
          </div>
        </div>

      </div>

      {/* ─── ROW 4: Risk Analysis ─── */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 relative overflow-hidden group hover:border-slate-300 transition-colors mt-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500 fill-mode-both">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-50 rounded-xl border border-slate-200">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
            </div>
            <h3 className="font-bold text-slate-900 text-lg">Risk Matrix Summary</h3>
          </div>
          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-0.5 rounded-lg text-xs font-semibold border ${getRiskLevelColor(risk.level)}`}>
              Risk: {risk.level}
            </span>
            <ScoreGauge score={risk.riskScore} />
          </div>
        </div>

        {(risk.risks ?? []).length === 0 ? (
          <div className="text-slate-500 text-sm py-8 text-center italic">Risk assessment unavailable.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(risk.risks ?? []).map((r, i) => (
              <div key={i} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-slate-800 text-xs uppercase tracking-wider">{r.category}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      r.severity === "High" ? "bg-rose-500/10 text-rose-400 border border-rose-500/20" :
                      r.severity === "Medium" ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" :
                      "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                    }`}>
                      {r.severity}
                    </span>
                  </div>
                  <p className="text-slate-600 text-xs leading-relaxed">{r.explanation}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6">
          <SourceTag sources={risk.sources} />
        </div>
      </div>

    </div>
  );
}
