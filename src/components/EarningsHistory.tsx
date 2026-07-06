import React from "react";
import { Calendar } from "lucide-react";
import type { EarningsHistoryEntry } from "@/types";

interface EarningsHistoryProps {
  earnings: EarningsHistoryEntry[];
}

export default function EarningsHistory({ earnings }: EarningsHistoryProps) {
  if (!earnings || earnings.length === 0) {
    return (
      <div className="report-card">
        <div className="report-card-title mb-4">
          <Calendar className="w-5 h-5 text-indigo-500" />
          Earnings History
        </div>
        <div className="text-slate-500 text-sm py-4 text-center italic">
          Earnings history unavailable.
        </div>
      </div>
    );
  }

  const sortedEarnings = [...earnings].sort(
    (a, b) => new Date(b.quarter).getTime() - new Date(a.quarter).getTime()
  );

  return (
    <div className="report-card">
      <div className="report-card-title mb-4">
        <Calendar className="w-5 h-5 text-indigo-500" />
        Earnings History
      </div>

      <div className="overflow-x-auto -mx-1 px-1 flex-1">
        <table className="w-full min-w-[420px] text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-slate-500 text-xs font-semibold">
              <th className="pb-2.5 pr-4 font-medium">Report Date</th>
              <th className="pb-2.5 pr-4 font-medium">Forecast / Actual</th>
              <th className="pb-2.5 pr-4 font-medium">Difference</th>
              <th className="pb-2.5 font-medium">Surprise %</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {sortedEarnings.map((entry, idx) => {
              const dateObj = new Date(entry.quarter);
              const formattedDate = dateObj.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              });
              const isPositive = entry.epsDifference >= 0;
              const isSurprisePositive = entry.surprisePercent >= 0;

              return (
                <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 pr-4 font-medium text-slate-800 whitespace-nowrap">{formattedDate}</td>
                  <td className="py-3 pr-4 text-slate-700 font-mono text-xs whitespace-nowrap">
                    {entry.epsEstimate.toFixed(3)}
                    <span className="text-slate-400 mx-1">/</span>
                    <span className={isPositive ? "text-emerald-600 font-semibold" : "text-rose-600 font-semibold"}>
                      {entry.epsActual.toFixed(3)}
                    </span>
                  </td>
                  <td className="py-3 pr-4 font-mono text-xs text-slate-700">
                    {entry.epsDifference.toFixed(3)}
                  </td>
                  <td className="py-3 font-mono text-xs">
                    <span className={isSurprisePositive ? "text-emerald-600" : "text-rose-600"}>
                      {(entry.surprisePercent * 100).toFixed(2)}%
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
