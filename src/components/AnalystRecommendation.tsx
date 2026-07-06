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
      case "strongbuy": return "text-emerald-600";
      case "buy": return "text-emerald-500";
      case "hold": return "text-amber-600";
      case "sell": return "text-orange-500";
      case "strong_sell":
      case "strongsell": return "text-rose-600";
      default: return "text-slate-600";
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
    <div className="report-card bg-slate-900 border-slate-700 text-white">
      <div className="text-center mb-4">
        <h3 className="text-sm font-semibold text-slate-300 mb-2">Analyst Recommendation</h3>
        <div className={`text-2xl font-bold tracking-tight ${colorClass}`}>{formattedKey}</div>
        <div className="text-xs text-slate-400 mt-1">Based on {numberOfAnalystOpinions} analysts</div>
      </div>

      <div className="relative w-full flex justify-center items-center my-2 flex-1">
        <div className="relative w-44 h-24">
          <svg viewBox="0 0 100 50" className="w-full h-full">
            <path d="M 10 50 A 40 40 0 0 1 21.7 21.7" fill="none" stroke="#f43f5e" strokeWidth="3" strokeLinecap="round" />
            <path d="M 23.5 19.5 A 40 40 0 0 1 45 10.5" fill="none" stroke="#f97316" strokeWidth="3" strokeLinecap="round" />
            <path d="M 47 10.2 A 40 40 0 0 1 53 10.2" fill="none" stroke="#fbbf24" strokeWidth="3" strokeLinecap="round" />
            <path d="M 55 10.5 A 40 40 0 0 1 76.5 19.5" fill="none" stroke="#fbbf24" strokeWidth="3" strokeLinecap="round" />
            <path d="M 78.3 21.7 A 40 40 0 0 1 90 50" fill="none" stroke="#34d399" strokeWidth="3" strokeLinecap="round" />
            <g style={{ transform: `rotate(${currentRotation}deg)`, transformOrigin: "50px 50px", transition: "transform 1s cubic-bezier(0.22, 1, 0.36, 1)" }}>
              <polygon points="48,50 52,50 50,15" fill="#f1f5f9" />
              <circle cx="50" cy="50" r="4" fill="#f1f5f9" />
            </g>
          </svg>
          <div className="absolute top-[80%] -left-6 text-[9px] text-slate-500 text-center w-12">Strong<br/>Sell</div>
          <div className="absolute top-[40%] -left-2 text-[9px] text-slate-500">Sell</div>
          <div className="absolute top-[10%] left-1/2 -translate-x-1/2 text-[9px] text-slate-500">Hold</div>
          <div className="absolute top-[40%] -right-2 text-[9px] text-slate-500">Buy</div>
          <div className="absolute top-[80%] -right-6 text-[9px] text-slate-500 text-center w-12">Strong<br/>Buy</div>
        </div>
      </div>

      <div className="space-y-2 mt-4">
        {[
          { label: "Strong Buy", count: strongBuy, color: "bg-emerald-400" },
          { label: "Buy", count: buy, color: "bg-emerald-500" },
          { label: "Hold", count: hold, color: "bg-amber-400" },
          { label: "Sell", count: sell, color: "bg-orange-500" },
          { label: "Strong Sell", count: strongSell, color: "bg-rose-500" },
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-3 text-xs">
            <div className="w-16 text-slate-400 shrink-0">{item.label}</div>
            <div className="flex-1 bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div
                className={`h-full ${item.color} rounded-full transition-all duration-1000 ease-out`}
                style={{ width: isLoaded ? `${item.count > 0 ? Math.max((item.count / maxBar) * 100, 2) : 0}%` : "0%" }}
              />
            </div>
            <div className="w-4 text-right text-slate-300 font-mono">{item.count}</div>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-700">
        <span className="text-xs text-slate-400">12 Month Price Target</span>
        <span className="text-sm font-bold text-white font-mono">USD {targetMeanPrice.toFixed(2)}</span>
      </div>

      <div className="report-card-footer [&_.source-tag-label]:text-slate-500 [&_.source-tag-pill]:bg-slate-800 [&_.source-tag-pill]:border-slate-600 [&_.source-tag-pill]:text-slate-300">
        <SourceTag sources={["Yahoo Finance (analyst consensus)"]} />
      </div>
    </div>
  );
}
