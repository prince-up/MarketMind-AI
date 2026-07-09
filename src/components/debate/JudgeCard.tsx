import { Gavel, Scale, Trophy } from "lucide-react";
import type { JudgeAnalysis } from "@/types";

interface JudgeCardProps {
  data: JudgeAnalysis;
  animationDelay?: number;
}

function getVerdictStyle(verdict: string) {
  const v = verdict.toUpperCase();
  if (v === "BUY") return "bg-emerald-50 text-emerald-700 border-emerald-200";
  if (v === "HOLD") return "bg-amber-50 text-amber-700 border-amber-200";
  return "bg-rose-50 text-rose-700 border-rose-200";
}

function getWinnerStyle(winner: JudgeAnalysis["winner"]) {
  switch (winner) {
    case "Bull":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "Bear":
      return "bg-rose-50 text-rose-700 border-rose-200";
    default:
      return "bg-slate-50 text-slate-700 border-slate-200";
  }
}

export default function JudgeCard({ data, animationDelay = 0 }: JudgeCardProps) {
  return (
    <div
      className="report-card debate-slide-up border-t-4 border-t-indigo-500"
      style={{ animationDelay: `${animationDelay}ms` }}
    >
      <div className="report-card-header">
        <div className="report-card-title">
          <div className="w-9 h-9 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-center">
            <Gavel className="w-4 h-4 text-indigo-600" />
          </div>
          <div>
            <span>Investment Judge</span>
            <p className="text-xs font-normal text-slate-500 mt-0.5">Final debate adjudication</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span
            className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg text-sm font-bold border ${getWinnerStyle(data.winner)}`}
          >
            <Trophy className="w-3.5 h-3.5" />
            {data.winner === "Balanced" ? "Balanced" : `${data.winner} Wins`}
          </span>
          <span
            className={`inline-flex items-center px-3 py-1 rounded-lg text-sm font-bold border ${getVerdictStyle(data.finalVerdict)}`}
          >
            {data.finalVerdict}
          </span>
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <span className="font-mono text-2xl font-bold text-indigo-700">{data.confidence}%</span>
            <span className="text-sm text-slate-600">Judge Confidence</span>
            <div className="flex-1 bg-slate-100 h-2 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-indigo-500 transition-all duration-1000 ease-out"
                style={{ width: `${data.confidence}%` }}
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Scale className="w-4 h-4 text-slate-500 flex-shrink-0" />
            <span className="font-mono text-2xl font-bold text-slate-800">{data.investmentScore}</span>
            <span className="text-sm text-slate-600">Investment Score / 100</span>
          </div>
        </div>

        <div>
          <p className="report-subheading">Executive Summary</p>
          <p className="text-sm text-slate-700 leading-relaxed bg-indigo-50/50 p-3 rounded-lg border border-indigo-100">
            {data.investmentSummary}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-emerald-50/50 p-3 rounded-lg border border-emerald-100">
            <p className="report-subheading text-emerald-700">Why Bull Was Compelling</p>
            <p className="text-sm text-slate-700 leading-relaxed">{data.whyBullWon}</p>
          </div>
          <div className="bg-rose-50/50 p-3 rounded-lg border border-rose-100">
            <p className="report-subheading text-rose-700">Why Bear Was Compelling</p>
            <p className="text-sm text-slate-700 leading-relaxed">{data.whyBearWon}</p>
          </div>
        </div>

        <div>
          <p className="report-subheading">Final Reasoning</p>
          <p className="text-sm text-slate-700 leading-relaxed">{data.finalReasoning}</p>
        </div>
      </div>
    </div>
  );
}
