"use client";

import React, { useEffect, useState } from "react";
import { TrendingDown, TrendingUp } from "lucide-react";

const initialIndices = [
  { name: "NIFTY 50", value: 24324.5, change: 0, percent: 0 },
  { name: "SENSEX", value: 79986.8, change: 0, percent: 0 },
  { name: "NIFTY BANK", value: 52431.1, change: 0, percent: 0 },
  { name: "NIFTY IT", value: 37542.2, change: 0, percent: 0 },
  { name: "INDIA VIX", value: 14.25, change: 0, percent: 0 },
];

export default function MarketIndicesStrip() {
  const [indices, setIndices] = useState(initialIndices);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndices((prev) =>
        prev.map((index) => {
          const maxFluctuation = index.value * 0.0015;
          const fluctuation = Math.random() * maxFluctuation * 2 - maxFluctuation;
          const newValue = index.value + fluctuation;
          const diff = newValue - index.value;
          const percentChange = (diff / index.value) * 100;
          return { ...index, value: newValue, change: diff, percent: percentChange };
        })
      );
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-4 border-y border-[#e9e9eb] bg-[#1a1a2e] overflow-hidden">
      <div className="flex items-center gap-2 px-4 mb-2">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00b386] opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00b386]" />
        </span>
        <span className="text-xs font-semibold text-white/70 uppercase tracking-wider">Live Markets</span>
      </div>
      <div className="flex gap-3 overflow-x-auto px-4 pb-1 scrollbar-hide">
        {indices.map((index) => {
          const isPositive = index.change >= 0;
          return (
            <div
              key={index.name}
              className="shrink-0 flex items-center gap-4 px-5 py-3 rounded-xl bg-white/5 border border-white/10 min-w-[200px]"
            >
              <div>
                <div className="text-xs font-medium text-white/60">{index.name}</div>
                <div className="text-lg font-bold text-white font-mono mt-0.5">{index.value.toFixed(2)}</div>
              </div>
              <div
                className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-lg ${
                  isPositive ? "text-[#00b386] bg-[#00b386]/15" : "text-[#eb5b3c] bg-[#eb5b3c]/15"
                }`}
              >
                {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {isPositive ? "+" : ""}
                {index.percent.toFixed(2)}%
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
