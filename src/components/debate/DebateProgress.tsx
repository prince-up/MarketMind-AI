"use client";

import { CheckCircle2, Loader2, Swords } from "lucide-react";

interface DebateProgressProps {
  bullComplete: boolean;
  bearComplete: boolean;
  judgeComplete: boolean;
  bullActive: boolean;
  bearActive: boolean;
  judgeActive: boolean;
}

export default function DebateProgress({
  bullComplete,
  bearComplete,
  judgeComplete,
  bullActive,
  bearActive,
  judgeActive,
}: DebateProgressProps) {
  const debateStarted = bullActive || bearActive || bullComplete || bearComplete || judgeActive || judgeComplete;

  if (!debateStarted) return null;

  return (
    <div className="saas-card p-6 border border-indigo-100 bg-gradient-to-br from-indigo-50/50 to-white">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center">
          <Swords className="w-5 h-5 text-indigo-600 animate-pulse" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-slate-900">AI Investment Debate</h3>
          <p className="text-xs text-slate-500">Bull &amp; bear agents running in parallel</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <DebateAgentStatus
          label="Bull Analyst"
          sub="Building growth thesis"
          color="emerald"
          isComplete={bullComplete}
          isActive={bullActive}
        />
        <DebateAgentStatus
          label="Bear Analyst"
          sub="Identifying downside risks"
          color="rose"
          isComplete={bearComplete}
          isActive={bearActive}
        />
      </div>

      <DebateAgentStatus
        label="Investment Judge"
        sub="Weighing evidence from both sides"
        color="indigo"
        isComplete={judgeComplete}
        isActive={judgeActive}
        fullWidth
      />
    </div>
  );
}

interface DebateAgentStatusProps {
  label: string;
  sub: string;
  color: "emerald" | "rose" | "indigo";
  isComplete: boolean;
  isActive: boolean;
  fullWidth?: boolean;
}

function DebateAgentStatus({
  label,
  sub,
  color,
  isComplete,
  isActive,
  fullWidth = false,
}: DebateAgentStatusProps) {
  const colorMap = {
    emerald: {
      active: "border-emerald-200 bg-emerald-50/80",
      dot: "bg-emerald-500",
      text: "text-emerald-700",
    },
    rose: {
      active: "border-rose-200 bg-rose-50/80",
      dot: "bg-rose-500",
      text: "text-rose-700",
    },
    indigo: {
      active: "border-indigo-200 bg-indigo-50/80",
      dot: "bg-indigo-500",
      text: "text-indigo-700",
    },
  };

  const styles = colorMap[color];

  return (
    <div
      className={`flex items-start gap-3 p-3 rounded-xl border transition-all duration-300 ${
        fullWidth ? "w-full" : ""
      } ${
        isActive
          ? `${styles.active} debate-pulse`
          : isComplete
            ? "border-slate-200 bg-white"
            : "border-slate-100 bg-slate-50/50 opacity-50"
      }`}
    >
      <div className="flex items-center justify-center w-5 h-5 mt-0.5 flex-shrink-0">
        {isComplete ? (
          <CheckCircle2 className={`w-5 h-5 ${styles.text}`} />
        ) : isActive ? (
          <Loader2 className={`w-4 h-4 ${styles.text} animate-spin`} />
        ) : (
          <div className={`w-2 h-2 rounded-full ${styles.dot} opacity-40`} />
        )}
      </div>
      <div>
        <span
          className={`text-sm font-semibold block ${
            isComplete ? "text-slate-700" : isActive ? "text-slate-900" : "text-slate-400"
          }`}
        >
          {label}
        </span>
        <span className="text-xs text-slate-500">{sub}</span>
      </div>
    </div>
  );
}
