import React from "react";
import { Calendar } from "lucide-react";
import type { EarningsHistoryEntry } from "@/types";

interface EarningsHistoryProps {
  earnings: EarningsHistoryEntry[];
}

export default function EarningsHistory({ earnings }: EarningsHistoryProps) {
  if (!earnings || earnings.length === 0) {
    return (
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 shadow-lg relative overflow-hidden group hover:-translate-y-1 hover:shadow-2xl hover:border-neutral-700 transition-all duration-300">
        <div className="flex items-center gap-2 text-white font-bold mb-4">
          <Calendar className="w-5 h-5 text-indigo-400" />
          EARNINGS HISTORY
        </div>
        <div className="text-neutral-500 text-sm py-4 text-center italic">
          Earnings history unavailable.
        </div>
      </div>
    );
  }

  // Sort by date descending (newest first)
  const sortedEarnings = [...earnings].sort((a, b) => new Date(b.quarter).getTime() - new Date(a.quarter).getTime());

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 shadow-lg relative overflow-hidden group hover:-translate-y-1 hover:shadow-2xl hover:border-neutral-700 transition-all duration-300">
      <div className="flex items-center gap-2 text-white font-bold mb-6 uppercase tracking-wider text-sm">
        <Calendar className="w-5 h-5 text-indigo-400" />
        Earnings History
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead>
            <tr className="border-b border-neutral-800 text-neutral-400 font-semibold uppercase tracking-widest text-[10px]">
              <th className="pb-3 font-medium">Report Date</th>
              <th className="pb-3 font-medium">Forecast / Actual</th>
              <th className="pb-3 font-medium">Difference</th>
              <th className="pb-3 font-medium">Surprise %</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800/60">
            {sortedEarnings.map((entry, idx) => {
              const dateObj = new Date(entry.quarter);
              const formattedDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
              const isPositive = entry.epsDifference >= 0;
              const isSurprisePositive = entry.surprisePercent >= 0;

              return (
                <tr key={idx} className="hover:bg-neutral-800/30 transition-colors">
                  <td className="py-3.5 font-medium text-neutral-200">{formattedDate}</td>
                  <td className="py-3.5 text-neutral-300 font-mono text-xs">
                    {entry.epsEstimate.toFixed(3)} <span className="text-neutral-500 mx-1">/</span> 
                    <span className={isPositive ? "text-emerald-400 font-bold" : "text-rose-400 font-bold"}>
                      {entry.epsActual.toFixed(3)}
                    </span>
                  </td>
                  <td className="py-3.5 font-mono text-xs text-neutral-300">
                    {entry.epsDifference.toFixed(3)}
                  </td>
                  <td className="py-3.5 font-mono text-xs">
                    <span className={isSurprisePositive ? "text-emerald-400" : "text-rose-400"}>
                      {(entry.surprisePercent * 100).toFixed(2)}%
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      <div className="mt-4 pt-3 border-t border-neutral-800/60 text-[10px] text-neutral-500 flex justify-end cursor-pointer hover:text-neutral-300 transition-colors">
        SEE MORE ∨
      </div>
    </div>
  );
}
