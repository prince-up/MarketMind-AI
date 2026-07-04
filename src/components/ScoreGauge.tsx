import React from "react";

interface ScoreGaugeProps {
  score: number;
  className?: string;
}

export default function ScoreGauge({ score, className = "" }: ScoreGaugeProps) {
  const getGradient = () => {
    if (score >= 80) return "from-emerald-600 to-emerald-400";
    if (score >= 60) return "from-amber-600 to-amber-400";
    return "from-rose-600 to-rose-400";
  };

  const getBg = () => {
    if (score >= 80) return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
    if (score >= 60) return "bg-amber-500/10 text-amber-400 border-amber-500/20";
    return "bg-rose-500/10 text-rose-400 border-rose-500/20";
  };

  return (
    <div className={`flex items-center gap-3 w-full max-w-[150px] ${className}`}>
      <div className="flex-1 bg-neutral-950 h-2 rounded-full overflow-hidden border border-neutral-800/60 relative">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${getGradient()} transition-all duration-1000`}
          style={{ width: `${score}%` }}
        />
      </div>
      <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border flex-shrink-0 ${getBg()}`}>
        {score}%
      </span>
    </div>
  );
}
