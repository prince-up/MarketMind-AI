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
    if (score >= 80) return "text-emerald-400 border-emerald-500/30 bg-emerald-500/10";
    if (score >= 60) return "text-amber-400 border-amber-500/30 bg-amber-500/10";
    return "text-rose-400 border-rose-500/30 bg-rose-500/10";
  };

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case "Low":
        return "text-emerald-400 border-emerald-500/30 bg-emerald-500/10";
      case "Medium":
        return "text-amber-400 border-amber-500/30 bg-amber-500/10";
      case "High":
        return "text-orange-400 border-orange-500/30 bg-orange-500/10";
      case "Very High":
        return "text-rose-400 border-rose-500/30 bg-rose-500/10";
      default:
        return "text-neutral-400 border-neutral-800 bg-neutral-900";
    }
  };

  const getValuationColor = (status: string) => {
    switch (status) {
      case "Undervalued":
        return "text-emerald-400 border-emerald-500/30 bg-emerald-500/10";
      case "Fairly Valued":
        return "text-amber-400 border-amber-500/30 bg-amber-500/10";
      case "Overvalued":
        return "text-rose-400 border-rose-500/30 bg-rose-500/10";
      default:
        return "text-neutral-400 border-neutral-800 bg-neutral-900";
    }
  };

  return (
    <div className="w-full space-y-8 mt-8">
      
      {/* ─── ROW 1: Financial & Valuation ─── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Financial Health Card */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 flex flex-col justify-between shadow-lg relative overflow-hidden group hover:-translate-y-1 hover:shadow-2xl hover:border-neutral-700 transition-all duration-300">
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-neutral-950 rounded-xl border border-neutral-800">
                  <BarChart3 className="w-5 h-5 text-emerald-400" />
                </div>
                <h3 className="font-bold text-neutral-100 text-lg">Financial Health</h3>
              </div>
              <div className="flex items-center gap-2">
                <ScoreGauge score={fin.score} />
              </div>
            </div>

            {fin.ticker === "N/A" ? (
              <div className="text-neutral-500 text-sm py-8 text-center italic">Financial data unavailable.</div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-neutral-950 p-3.5 rounded-2xl border border-neutral-800/40">
                  <span className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold">Revenue Growth</span>
                  <div className="text-sm font-semibold text-neutral-200 mt-1">{fin.revenueGrowth}</div>
                </div>
                <div className="bg-neutral-950 p-3.5 rounded-2xl border border-neutral-800/40">
                  <span className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold">P/E Ratio</span>
                  <div className="text-sm font-semibold text-neutral-200 mt-1">{fin.peRatio}</div>
                </div>
                <div className="bg-neutral-950 p-3.5 rounded-2xl border border-neutral-800/40">
                  <span className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold">Market Capitalization</span>
                  <div className="text-sm font-semibold text-neutral-200 mt-1">{fin.marketCap}</div>
                </div>
                <div className="bg-neutral-950 p-3.5 rounded-2xl border border-neutral-800/40">
                  <span className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold">Profitability Status</span>
                  <div className="text-sm font-semibold text-neutral-200 mt-1">{fin.profitability}</div>
                </div>
                <div className="bg-neutral-950 p-3.5 rounded-2xl border border-neutral-800/40">
                  <span className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold">Cash Flow</span>
                  <div className="text-sm font-semibold text-neutral-200 mt-1">{fin.cashFlow}</div>
                </div>
                <div className="bg-neutral-950 p-3.5 rounded-2xl border border-neutral-800/40">
                  <span className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold">Debt Assessment</span>
                  <div className="text-sm font-semibold text-neutral-200 mt-1">{fin.debt}</div>
                </div>
              </div>
            )}
          </div>
          
          <SourceTag sources={fin.sources} />
        </div>

        {/* Valuation Card */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 flex flex-col justify-between shadow-lg relative overflow-hidden group hover:-translate-y-1 hover:shadow-2xl hover:border-neutral-700 transition-all duration-300">
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-neutral-950 rounded-xl border border-neutral-800">
                  <LineChart className="w-5 h-5 text-indigo-400" />
                </div>
                <h3 className="font-bold text-neutral-100 text-lg">Valuation Assessment</h3>
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
                <h4 className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold mb-2">Valuation Positives</h4>
                {(val.positives ?? []).length === 0 ? (
                  <div className="text-neutral-500 text-xs italic">No positives listed.</div>
                ) : (
                  <ul className="space-y-1.5">
                    {(val.positives ?? []).map((p, i) => (
                      <li key={i} className="text-xs text-neutral-300 flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1 flex-shrink-0" />
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div>
                <h4 className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold mb-2">Valuation Risks & Negatives</h4>
                {(val.negatives ?? []).length === 0 ? (
                  <div className="text-neutral-500 text-xs italic">No negatives listed.</div>
                ) : (
                  <ul className="space-y-1.5">
                    {(val.negatives ?? []).map((n, i) => (
                      <li key={i} className="text-xs text-neutral-300 flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1 flex-shrink-0" />
                        <span>{n}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>

          <SourceTag sources={val.sources} />
        </div>

      </div>

      {/* ─── ROW 2: Earnings & Analyst Recommendation ─── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {report.earnings && report.earnings.length > 0 && (
          <EarningsHistory earnings={report.earnings} />
        )}
        {report.analystData && report.analystData.numberOfAnalystOpinions > 0 && (
          <AnalystRecommendation analystData={report.analystData} />
        )}
      </div>

      {/* ─── ROW 3: News Sentiment & Competitors ─── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        
        {/* News Sentiment Card */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 flex flex-col justify-between shadow-lg relative overflow-hidden group hover:-translate-y-1 hover:shadow-2xl hover:border-neutral-700 transition-all duration-300">
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-neutral-950 rounded-xl border border-neutral-800">
                  <Newspaper className="w-5 h-5 text-blue-400" />
                </div>
                <h3 className="font-bold text-neutral-100 text-lg">News Sentiment</h3>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-0.5 rounded-lg text-xs font-semibold capitalize border ${getValuationColor(news.sentiment === "positive" ? "Undervalued" : news.sentiment === "negative" ? "Overvalued" : "Fairly Valued")}`}>
                  {news.sentiment}
                </span>
                <ScoreGauge score={news.sentimentScore} />
              </div>
            </div>

            {(news.keyEvents ?? []).includes("No recent news found.") ? (
              <div className="text-neutral-500 text-sm py-8 text-center italic">No recent news found.</div>
            ) : (
              <div className="space-y-4">
                <div>
                  <h4 className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold mb-2">Key Recent Events</h4>
                  <ul className="space-y-1.5">
                    {(news.keyEvents ?? []).slice(0, 3).map((e, i) => (
                      <li key={i} className="text-xs text-neutral-300 flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1 flex-shrink-0" />
                        <span>{e}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold mb-1.5">Investment Impact</h4>
                  <p className="text-xs text-neutral-400 leading-relaxed bg-neutral-950 p-3 rounded-2xl border border-neutral-800/40">
                    {news.investmentImpact}
                  </p>
                </div>
              </div>
            )}
          </div>

          <SourceTag sources={news.sources} />
        </div>

        {/* Competitor Card */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 flex flex-col justify-between shadow-lg relative overflow-hidden group hover:-translate-y-1 hover:shadow-2xl hover:border-neutral-700 transition-all duration-300">
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-neutral-950 rounded-xl border border-neutral-800">
                  <Users className="w-5 h-5 text-purple-400" />
                </div>
                <h3 className="font-bold text-neutral-100 text-lg">Competitor Analysis</h3>
              </div>
              <div className="flex items-center gap-2">
                <ScoreGauge score={comp.score} />
              </div>
            </div>

            {(comp.competitors ?? []).length === 0 ? (
              <div className="text-neutral-500 text-sm py-8 text-center italic">Competitor data unavailable.</div>
            ) : (
              <div className="space-y-4">
                <div>
                  <h4 className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold mb-2">Market Position</h4>
                  <p className="text-xs text-neutral-300 leading-relaxed bg-neutral-950/40 p-2.5 rounded-xl border border-neutral-800/30">
                    {comp.marketPosition}
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h4 className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold">Key Peers Comparison</h4>
                  <div className="max-h-40 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                    {(comp.competitors ?? []).map((c, i) => (
                      <div key={i} className="bg-neutral-950 p-2.5 rounded-xl border border-neutral-800/40 text-xs">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-bold text-neutral-200">{c.name}</span>
                          {c.growth && <span className="text-[10px] text-neutral-500">Growth: {c.growth}</span>}
                        </div>
                        <p className="text-neutral-400 leading-relaxed">{c.assessment}</p>
                        {(c.aiLeadership || c.pricing) && (
                          <div className="flex gap-3 mt-1.5 text-[10px] text-neutral-500 pt-1 border-t border-neutral-900/50">
                            {c.aiLeadership && <span>AI Lead: {c.aiLeadership}</span>}
                            {c.pricing && <span>Pricing: {c.pricing}</span>}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <SourceTag sources={comp.sources} />
        </div>

      </div>

      {/* ─── ROW 4: Risk Analysis ─── */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 shadow-lg relative overflow-hidden group hover:-translate-y-1 hover:shadow-2xl hover:border-neutral-700 transition-all duration-300 mt-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-neutral-950 rounded-xl border border-neutral-800">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
            </div>
            <h3 className="font-bold text-neutral-100 text-lg">Risk Matrix Summary</h3>
          </div>
          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-0.5 rounded-lg text-xs font-semibold border ${getRiskLevelColor(risk.level)}`}>
              Risk: {risk.level}
            </span>
            <ScoreGauge score={risk.riskScore} />
          </div>
        </div>

        {(risk.risks ?? []).length === 0 ? (
          <div className="text-neutral-500 text-sm py-8 text-center italic">Risk assessment unavailable.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(risk.risks ?? []).map((r, i) => (
              <div key={i} className="bg-neutral-950 p-4 rounded-2xl border border-neutral-800/40 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-neutral-200 text-xs uppercase tracking-wider">{r.category}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      r.severity === "High" ? "bg-rose-500/10 text-rose-400 border border-rose-500/20" :
                      r.severity === "Medium" ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" :
                      "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                    }`}>
                      {r.severity}
                    </span>
                  </div>
                  <p className="text-neutral-400 text-xs leading-relaxed">{r.explanation}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        <SourceTag sources={risk.sources} />
      </div>

    </div>
  );
}
