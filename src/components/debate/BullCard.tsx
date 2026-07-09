import type { BullAnalysis } from "@/types";

interface BullCardProps {
  data: BullAnalysis;
  isWinner?: boolean;
  animationDelay?: number;
}

function getRecommendationStyle(recommendation: string) {
  const rec = recommendation.toUpperCase();
  if (rec === "BUY") return "bg-emerald-50 text-emerald-700 border-emerald-200";
  if (rec === "HOLD") return "bg-amber-50 text-amber-700 border-amber-200";
  return "bg-rose-50 text-rose-700 border-rose-200";
}

export default function BullCard({ data, isWinner = false, animationDelay = 0 }: BullCardProps) {
  return (
    <div
      className={`report-card debate-slide-left border-l-4 border-l-emerald-500 ${
        isWinner ? "debate-winner-glow" : ""
      }`}
      style={{ animationDelay: `${animationDelay}ms` }}
    >
      <div className="report-card-header">
        <div className="report-card-title">
          <div className="w-9 h-9 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center">
            <span className="text-emerald-600 font-bold text-sm">B+</span>
          </div>
          <div>
            <span>Bull Analyst</span>
            <p className="text-xs font-normal text-slate-500 mt-0.5">Growth & opportunity advocate</p>
          </div>
        </div>
        <span
          className={`inline-flex items-center px-3 py-1 rounded-lg text-sm font-bold border ${getRecommendationStyle(data.recommendation)}`}
        >
          {data.recommendation}
        </span>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="font-mono text-2xl font-bold text-emerald-700">{data.confidence}%</span>
          <span className="text-sm text-slate-600">Confidence</span>
          <div className="flex-1 bg-slate-100 h-2 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-emerald-500 transition-all duration-1000 ease-out"
              style={{ width: `${data.confidence}%` }}
            />
          </div>
        </div>

        <div>
          <p className="report-subheading">Investment Thesis</p>
          <p className="text-sm text-slate-700 leading-relaxed">{data.investment_thesis}</p>
        </div>

        <div>
          <p className="report-subheading">Strongest Arguments</p>
          <ul className="space-y-2">
            {data.strongest_arguments.map((arg, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-sm text-slate-700 bg-emerald-50/50 p-2.5 rounded-lg border border-emerald-100"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                <span className="leading-relaxed">{arg}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="report-subheading">Supporting Metrics</p>
          <div className="flex flex-wrap gap-1.5">
            {data.supporting_metrics.map((metric, i) => (
              <span
                key={i}
                className="text-xs px-2 py-1 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-md"
              >
                {metric}
              </span>
            ))}
          </div>
        </div>

        <p className="text-sm text-slate-600 pt-3 border-t border-slate-200 leading-relaxed">
          <span className="font-semibold text-slate-800">Conclusion:</span> {data.conclusion}
        </p>
      </div>
    </div>
  );
}
