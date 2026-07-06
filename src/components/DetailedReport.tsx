"use client";

import React from "react";
import { 
  BarChart3, 
  Newspaper, 
  Users, 
  AlertTriangle, 
  LineChart,
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

  const hasEarnings = report.earnings && report.earnings.length > 0;
  const hasAnalyst = report.analystData && report.analystData.numberOfAnalystOpinions > 0;
  const earningsAnalystCount = (hasEarnings ? 1 : 0) + (hasAnalyst ? 1 : 0);

  return (
    <div className="report-section space-y-6">
      {/* Financial & Valuation */}
      <div className="report-grid items-stretch">
        <div className="report-card">
          <div className="report-card-header">
            <div className="report-card-title">
              <div className="p-2 bg-slate-50 rounded-lg border border-slate-200">
                <BarChart3 className="w-5 h-5 text-[var(--primary)]" />
              </div>
              Financial Health
            </div>
            <ScoreGauge score={fin.score} />
          </div>

          {fin.ticker === "N/A" ? (
            <div className="text-slate-500 text-sm py-6 text-center italic flex-1">Financial data unavailable.</div>
          ) : (
            <div className="grid grid-cols-2 gap-3 flex-1">
              {[
                { label: "Revenue Growth", value: fin.revenueGrowth },
                { label: "P/E Ratio", value: fin.peRatio },
                { label: "Market Cap", value: fin.marketCap },
                { label: "Profitability", value: fin.profitability },
                { label: "Cash Flow", value: fin.cashFlow },
                { label: "Debt", value: fin.debt }
              ].map((item, idx) => {
                const isMissing = !item.value || item.value === "" || item.value === "N/A" || item.value.toLowerCase().includes("not provided") || item.value.toLowerCase().includes("unavailable");
                return (
                  <div key={idx} className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                    <span className="report-subheading block">{item.label}</span>
                    {isMissing ? (
                      <div className="text-sm font-medium text-slate-400">—</div>
                    ) : (
                      <div className="text-sm font-semibold text-slate-800">{item.value}</div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          <div className="report-card-footer">
            <SourceTag sources={fin.sources} />
          </div>
        </div>

        <div className="report-card">
          <div className="report-card-header">
            <div className="report-card-title">
              <div className="p-2 bg-slate-50 rounded-lg border border-slate-200">
                <LineChart className="w-5 h-5 text-indigo-500" />
              </div>
              Valuation Assessment
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className={`px-2 py-0.5 rounded-md text-xs font-semibold border ${getValuationColor(val.valuation)}`}>
                {val.valuation}
              </span>
              <ScoreGauge score={val.score} />
            </div>
          </div>

          <div className="space-y-4 flex-1">
            <div>
              <h4 className="report-subheading">Valuation Positives</h4>
              {(val.positives ?? []).length === 0 ? (
                <div className="text-slate-500 text-xs italic">No positives listed.</div>
              ) : (
                <ul className="space-y-1.5">
                  {(val.positives ?? []).map((p, i) => (
                    <li key={i} className="text-sm text-slate-700 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div>
              <h4 className="report-subheading">Valuation Risks</h4>
              {(val.negatives ?? []).length === 0 ? (
                <div className="text-slate-500 text-xs italic">No negatives listed.</div>
              ) : (
                <ul className="space-y-1.5">
                  {(val.negatives ?? []).map((n, i) => (
                    <li key={i} className="text-sm text-slate-700 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 flex-shrink-0" />
                      <span>{n}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="report-card-footer">
            <SourceTag sources={val.sources} />
          </div>
        </div>
      </div>

      {/* Earnings & Analyst */}
      {earningsAnalystCount > 0 && (
        <div className={`report-grid items-stretch${earningsAnalystCount === 1 ? " report-grid-single" : ""}`}>
          {hasEarnings && <EarningsHistory earnings={report.earnings!} />}
          {hasAnalyst && <AnalystRecommendation analystData={report.analystData!} />}
        </div>
      )}

      {/* News & Competitors */}
      <div className="report-grid items-stretch">
        <div className="report-card">
          <div className="report-card-header">
            <div className="report-card-title">
              <div className="p-2 bg-slate-50 rounded-lg border border-slate-200">
                <Newspaper className="w-5 h-5 text-blue-500" />
              </div>
              News Sentiment
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className={`px-2 py-0.5 rounded-md text-xs font-semibold capitalize border ${getValuationColor(news.sentiment === "positive" ? "Undervalued" : news.sentiment === "negative" ? "Overvalued" : "Fairly Valued")}`}>
                {news.sentiment}
              </span>
              <ScoreGauge score={news.sentimentScore} />
            </div>
          </div>

          {(news.keyEvents ?? []).includes("No recent news found.") ? (
            <div className="text-slate-500 text-sm py-6 text-center italic flex-1">No recent news found.</div>
          ) : (
            <div className="space-y-4 flex-1">
              <div>
                <h4 className="report-subheading">Key Recent Events</h4>
                <ul className="space-y-1.5">
                  {(news.keyEvents ?? []).slice(0, 3).map((e, i) => (
                    <li key={i} className="text-sm text-slate-700 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 flex-shrink-0" />
                      <span>{e}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="report-subheading">Investment Impact</h4>
                <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-200">
                  {news.investmentImpact}
                </p>
              </div>
            </div>
          )}

          <div className="report-card-footer">
            <SourceTag sources={news.sources} />
          </div>
        </div>

        <div className="report-card">
          <div className="report-card-header">
            <div className="report-card-title">
              <div className="p-2 bg-slate-50 rounded-lg border border-slate-200">
                <Users className="w-5 h-5 text-purple-500" />
              </div>
              Competitor Analysis
            </div>
            <ScoreGauge score={comp.score} />
          </div>

          {(comp.competitors ?? []).length === 0 ? (
            <div className="text-slate-500 text-sm py-6 text-center italic flex-1">Competitor data unavailable.</div>
          ) : (
            <div className="space-y-4 flex-1">
              <div>
                <h4 className="report-subheading">Market Position</h4>
                <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-200">
                  {comp.marketPosition}
                </p>
              </div>

              <div>
                <h4 className="report-subheading">Key Peers</h4>
                <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
                  {(comp.competitors ?? []).map((c, i) => {
                    const hasGrowth = c.growth && c.growth !== "" && !c.growth.toLowerCase().includes("none mentioned") && !c.growth.toLowerCase().includes("n/a");
                    const hasAi = c.aiLeadership && c.aiLeadership !== "" && !c.aiLeadership.toLowerCase().includes("none mentioned") && !c.aiLeadership.toLowerCase().includes("n/a");
                    const hasPricing = c.pricing && c.pricing !== "" && !c.pricing.toLowerCase().includes("none mentioned") && !c.pricing.toLowerCase().includes("n/a");
                    const hasExtras = hasAi || hasPricing;

                    return (
                      <div key={i} className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-sm">
                        <div className="flex justify-between items-center gap-2 mb-1">
                          <span className="font-semibold text-slate-800">{c.name}</span>
                          {hasGrowth && (
                            <span className="text-xs font-medium text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200 whitespace-nowrap">
                              Growth: {c.growth}
                            </span>
                          )}
                        </div>
                        <p className="text-slate-600 leading-relaxed text-xs">{c.assessment}</p>
                        {hasExtras && (
                          <div className="flex flex-col gap-1 mt-2 pt-2 border-t border-slate-200 text-xs">
                            {hasAi && <span className="text-slate-600"><strong className="text-slate-500">AI:</strong> {c.aiLeadership}</span>}
                            {hasPricing && <span className="text-slate-600"><strong className="text-slate-500">Pricing:</strong> {c.pricing}</span>}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          <div className="report-card-footer">
            <SourceTag sources={comp.sources} />
          </div>
        </div>
      </div>

      {/* Risk Matrix — full width */}
      <div className="report-card w-full">
        <div className="report-card-header">
          <div className="report-card-title">
            <div className="p-2 bg-slate-50 rounded-lg border border-slate-200">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
            </div>
            Risk Matrix Summary
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className={`px-2 py-0.5 rounded-md text-xs font-semibold border ${getRiskLevelColor(risk.level)}`}>
              Risk: {risk.level}
            </span>
            <ScoreGauge score={risk.riskScore} />
          </div>
        </div>

        {(risk.risks ?? []).length === 0 ? (
          <div className="text-slate-500 text-sm py-6 text-center italic">Risk assessment unavailable.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
            {(risk.risks ?? []).map((r, i) => (
              <div key={i} className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                <div className="flex justify-between items-center gap-2 mb-2">
                  <span className="font-semibold text-slate-800 text-sm">{r.category}</span>
                  <span className={`px-2 py-0.5 rounded text-xs font-semibold whitespace-nowrap ${
                    r.severity === "High" ? "bg-rose-50 text-rose-600 border border-rose-200" :
                    r.severity === "Medium" ? "bg-amber-50 text-amber-600 border border-amber-200" :
                    "bg-emerald-50 text-emerald-600 border border-emerald-200"
                  }`}>
                    {r.severity}
                  </span>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed">{r.explanation}</p>
              </div>
            ))}
          </div>
        )}

        <div className="report-card-footer">
          <SourceTag sources={risk.sources} />
        </div>
      </div>
    </div>
  );
}
