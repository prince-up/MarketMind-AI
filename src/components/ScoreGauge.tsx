import React, { useEffect, useState } from "react";

interface ScoreGaugeProps {
  score: number;
  className?: string;
}

export default function ScoreGauge({ score, className = "" }: ScoreGaugeProps) {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedScore(score), 100);
    return () => clearTimeout(timer);
  }, [score]);

  const getGradient = () => {
    if (score >= 80) return "from-emerald-600 to-emerald-400";
    if (score >= 60) return "from-amber-600 to-amber-400";
    return "from-rose-600 to-rose-400";
  };

  const getBg = () => {
    if (score >= 80) return "bg-emerald-50 text-emerald-700 border-emerald-200";
    if (score >= 60) return "bg-amber-50 text-amber-700 border-amber-200";
    return "bg-rose-50 text-rose-700 border-rose-200";
  };

  return (
    <div className={`flex items-center gap-2 min-w-[100px] max-w-[140px] ${className}`}>
      <div className="flex-1 bg-slate-100 h-1.5 rounded-full overflow-hidden min-w-[60px]">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${getGradient()} transition-all duration-1000 ease-out`}
          style={{ width: `${animatedScore}%` }}
        />
      </div>
      <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border flex-shrink-0 ${getBg()}`}>
        {score}%
      </span>
    </div>
  );
}
