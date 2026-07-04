import React from "react";
import type { AnalystData } from "@/types";

interface AnalystRecommendationProps {
  analystData: AnalystData;
}

export default function AnalystRecommendation({ analystData }: AnalystRecommendationProps) {
  if (!analystData || analystData.numberOfAnalystOpinions === 0) {
    return (
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 shadow-lg relative overflow-hidden group hover:-translate-y-1 hover:shadow-2xl hover:border-neutral-700 transition-all duration-300">
        <h3 className="text-white font-bold mb-4 uppercase tracking-wider text-sm">Analyst Recommendation</h3>
        <div className="text-neutral-500 text-sm py-4 text-center italic">
          Analyst data unavailable.
        </div>
      </div>
    );
  }

  const { strongBuy, buy, hold, sell, strongSell, recommendationKey, targetMeanPrice, numberOfAnalystOpinions } = analystData;

  const total = strongBuy + buy + hold + sell + strongSell;
  const maxBar = Math.max(strongBuy, buy, hold, sell, strongSell, 1);

  const getLabelColor = (key: string) => {
    switch (key.toLowerCase()) {
      case "strong_buy":
      case "strongbuy": return "text-emerald-400";
      case "buy": return "text-emerald-500";
      case "hold": return "text-amber-400";
      case "sell": return "text-orange-500";
      case "strong_sell":
      case "strongsell": return "text-rose-500";
      default: return "text-neutral-400";
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

  return (
    <div className="bg-[#131722] border border-neutral-800 rounded-3xl p-6 shadow-lg relative overflow-hidden group hover:-translate-y-1 hover:shadow-2xl hover:border-neutral-700 transition-all duration-300 h-full flex flex-col justify-between">
      
      <div className="text-center mb-6">
        <h3 className="text-white font-bold uppercase tracking-wider text-sm mb-4">Analyst Recommendation</h3>
        <div className={`text-3xl font-black tracking-tight ${colorClass}`}>{formattedKey}</div>
        <div className="text-[10px] text-neutral-500 mt-1">Based on {numberOfAnalystOpinions} analysts</div>
      </div>

      {/* SVG Arc Gauge */}
      <div className="relative w-full flex justify-center items-center my-4">
        <div className="relative w-48 h-24">
          <svg viewBox="0 0 100 50" className="w-full h-full drop-shadow-md">
            {/* Arc background segments */}
            {/* Strong Sell */}
            <path d="M 10 50 A 40 40 0 0 1 21.7 21.7" fill="none" stroke="#f43f5e" strokeWidth="3" strokeLinecap="round" />
            {/* Sell */}
            <path d="M 23.5 19.5 A 40 40 0 0 1 45 10.5" fill="none" stroke="#f97316" strokeWidth="3" strokeLinecap="round" />
            {/* Hold */}
            <path d="M 47 10.2 A 40 40 0 0 1 53 10.2" fill="none" stroke="#fbbf24" strokeWidth="3" strokeLinecap="round" />
            <path d="M 55 10.5 A 40 40 0 0 1 76.5 19.5" fill="none" stroke="#fbbf24" strokeWidth="3" strokeLinecap="round" />
            {/* Buy */}
            <path d="M 78.3 21.7 A 40 40 0 0 1 90 50" fill="none" stroke="#34d399" strokeWidth="3" strokeLinecap="round" />
            
            {/* Ticks & Labels could be added here, we keep it clean */}
            
            {/* Needle */}
            <g style={{ transform: `rotate(${rotation}deg)`, transformOrigin: '50px 50px', transition: 'transform 1s cubic-bezier(0.22, 1, 0.36, 1)' }}>
              <polygon points="48,50 52,50 50,15" fill="#f5f5f5" />
              <circle cx="50" cy="50" r="4" fill="#f5f5f5" />
            </g>
          </svg>
          
          {/* Labels for arc */}
          <div className="absolute top-[80%] -left-6 text-[9px] text-neutral-400 text-center w-12">Strong<br/>Sell</div>
          <div className="absolute top-[40%] -left-2 text-[9px] text-neutral-400">Sell</div>
          <div className="absolute top-[10%] left-1/2 -translate-x-1/2 text-[9px] text-neutral-400">Hold</div>
          <div className="absolute top-[40%] -right-2 text-[9px] text-neutral-400">Buy</div>
          <div className="absolute top-[80%] -right-6 text-[9px] text-neutral-400 text-center w-12">Strong<br/>Buy</div>
        </div>
      </div>

      {/* Bar charts breakdown */}
      <div className="space-y-2 mt-6">
        {[
          { label: "Strong Buy", count: strongBuy, color: "bg-emerald-400" },
          { label: "Buy", count: buy, color: "bg-emerald-500" },
          { label: "Hold", count: hold, color: "bg-amber-400" },
          { label: "Sell", count: sell, color: "bg-orange-500" },
          { label: "Strong Sell", count: strongSell, color: "bg-rose-500" },
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-3 text-xs">
            <div className="w-16 text-neutral-400">{item.label}</div>
            <div className="flex-1 bg-neutral-950 h-1.5 rounded-full overflow-hidden">
              <div 
                className={`h-full ${item.color} rounded-full transition-all duration-1000`} 
                style={{ width: `${item.count > 0 ? Math.max((item.count / maxBar) * 100, 2) : 0}%` }}
              />
            </div>
            <div className="w-4 text-right text-neutral-300 font-mono">{item.count}</div>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center mt-6 pt-4 border-t border-neutral-800/60">
        <span className="text-xs text-neutral-400">12 Month Price Target</span>
        <span className="text-sm font-bold text-white font-mono">USD {targetMeanPrice.toFixed(2)}</span>
      </div>
      
    </div>
  );
}
