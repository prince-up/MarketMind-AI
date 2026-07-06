import React, { useEffect, useState } from "react";
import type { AnalystData } from "@/types";
import SourceTag from "./SourceTag";

interface AnalystRecommendationProps {
  analystData: AnalystData;
}

export default function AnalystRecommendation({ analystData }: AnalystRecommendationProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  if (!analystData || analystData.numberOfAnalystOpinions === 0) {
    return (
      <div className="report-card">
        <h3 className="report-card-title mb-4">Analyst Recommendation</h3>
        <div className="text-slate-500 text-sm py-4 text-center italic">
          Analyst data unavailable.
        </div>
      </div>
    );
  }

  const { strongBuy, buy, hold, sell, strongSell, recommendationKey, targetMeanPrice, numberOfAnalystOpinions } = analystData;

  const maxBar = Math.max(strongBuy, buy, hold, sell, strongSell, 1);

  const getLabelColor = (key: string) => {
    switch (key.toLowerCase()) {
      case "strong_buy":
      case "strongbuy": return "text-blue-400";
      case "buy": return "text-blue-300";
      case "hold": return "text-slate-400";
      case "sell": return "text-red-400";
      case "strong_sell":
      case "strongsell": return "text-red-500";
      default: return "text-slate-400";
    }
  };

  const getFormatKey = (key: string) => {
    switch (key.toLowerCase()) {
      case "strong_buy":
      case "strongbuy": return "Strong Buy";
      case "buy": return "Buy";
      case "hold": return "Hold";
      case "sell": return "Sell";
      case "strong_sell":
      case "strongsell": return "Strong Sell";
      default: return "Hold";
    }
  };

  const getRotation = (key: string) => {
    switch (key.toLowerCase()) {
      case "strong_sell":
      case "strongsell": return -72;
      case "sell": return -36;
      case "hold": return 0;
      case "buy": return 36;
      case "strong_buy":
      case "strongbuy": return 72;
      default: return 0;
    }
  };

  const formattedKey = getFormatKey(recommendationKey);
  const colorClass = getLabelColor(recommendationKey);
  const rotation = getRotation(recommendationKey);
  const currentRotation = isLoaded ? rotation : -90;

  return (
    <div className="report-card bg-gradient-to-br from-slate-900 via-[#0f172a] to-blue-950 border-blue-900/50 text-white">
      <div className="text-center mb-4">
        <h3 className="text-sm font-semibold text-blue-200/80 mb-2">Analyst Recommendation</h3>
        <div className={`text-2xl font-bold tracking-tight ${colorClass}`}>{formattedKey}</div>
        <div className="text-xs text-slate-400 mt-1">Based on {numberOfAnalystOpinions} analysts</div>
      </div>

      <div className="relative w-full flex justify-center items-center my-2 flex-1">
        <div className="relative w-48 h-28">
          <svg viewBox="0 0 200 110" className="w-full h-full">
            <path d="M 20 100 A 80 80 0 0 1 48 36" fill="none" stroke="#991b1b" strokeWidth="4" strokeLinecap="round" />
            <path d="M 50 34 A 80 80 0 0 1 78 22" fill="none" stroke="#dc2626" strokeWidth="4" strokeLinecap="round" />
            <path d="M 80 21 A 80 80 0 0 1 120 21" fill="none" stroke="#64748b" strokeWidth="4" strokeLinecap="round" />
            <path d="M 122 22 A 80 80 0 0 1 150 34" fill="none" stroke="#3b82f6" strokeWidth="4" strokeLinecap="round" />
            <path d="M 152 36 A 80 80 0 0 1 180 100" fill="none" stroke="#2563eb" strokeWidth="4" strokeLinecap="round" />
            <g style={{ transform: `rotate(${currentRotation}deg)`, transformOrigin: "100px 100px", transition: "transform 1s cubic-bezier(0.22, 1, 0.36, 1)" }}>
              <line x1="100" y1="100" x2="100" y2="32" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
              <circle cx="100" cy="100" r="5" fill="#e2e8f0" />
            </g>
          </svg>
          <div className="absolute bottom-0 left-0 text-[9px] text-red-400 font-semibold uppercase">Sell</div>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-[9px] text-slate-500 uppercase">Hold</div>
          <div className="absolute bottom-0 right-0 text-[9px] text-blue-400 font-semibold uppercase">Buy</div>
        </div>
      </div>

      <div className="space-y-2 mt-4">
        {[
          { label: "Strong Buy", count: strongBuy, color: "bg-blue-600" },
          { label: "Buy", count: buy, color: "bg-blue-400" },
          { label: "Hold", count: hold, color: "bg-slate-500" },
          { label: "Sell", count: sell, color: "bg-red-400" },
          { label: "Strong Sell", count: strongSell, color: "bg-red-600" },
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-3 text-xs">
            <div className="w-16 text-slate-400 shrink-0">{item.label}</div>
            <div className="flex-1 bg-slate-800/80 h-1.5 rounded-full overflow-hidden">
              <div
                className={`h-full ${item.color} rounded-full transition-all duration-1000 ease-out`}
                style={{ width: isLoaded ? `${item.count > 0 ? Math.max((item.count / maxBar) * 100, 2) : 0}%` : "0%" }}
              />
            </div>
            <div className="w-4 text-right text-slate-300 font-mono">{item.count}</div>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center mt-4 pt-4 border-t border-blue-900/40">
        <span className="text-xs text-slate-400">12 Month Price Target</span>
        <span className="text-sm font-bold text-white font-mono">USD {targetMeanPrice.toFixed(2)}</span>
      </div>

      <div className="report-card-footer [&_.source-tag-label]:text-slate-500 [&_.source-tag-pill]:bg-slate-800 [&_.source-tag-pill]:border-slate-600 [&_.source-tag-pill]:text-slate-300">
        <SourceTag sources={["Yahoo Finance (analyst consensus)"]} />
      </div>
    </div>
  );
}
