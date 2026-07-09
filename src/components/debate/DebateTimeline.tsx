"use client";

import { Swords } from "lucide-react";
import type { DebateAnalysis } from "@/types";
import BullCard from "./BullCard";
import BearCard from "./BearCard";
import JudgeCard from "./JudgeCard";

interface DebateTimelineProps {
  debate: DebateAnalysis;
}

export default function DebateTimeline({ debate }: DebateTimelineProps) {
  const { bull, bear, judge } = debate;
  const bullWon = judge.winner === "Bull";
  const bearWon = judge.winner === "Bear";

  return (
    <section className="report-section w-full">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-indigo-50 rounded-lg border border-indigo-200">
          <Swords className="w-5 h-5 text-indigo-600" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-[var(--text-primary)] tracking-tight">
            AI Investment Debate
          </h2>
          <p className="text-sm text-slate-500">
            Bull and bear analysts argue in parallel — the judge delivers the final verdict
          </p>
        </div>
      </div>

      <div className="debate-arena space-y-6">
        <div className="debate-vs-row grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          <BullCard data={bull} isWinner={bullWon} animationDelay={100} />
          <BearCard data={bear} isWinner={bearWon} animationDelay={200} />
        </div>

        <div className="debate-judge-row relative">
          <div className="hidden lg:flex absolute left-1/2 -top-6 -translate-x-1/2 z-10">
            <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider bg-white border border-slate-200 rounded-full text-slate-500 shadow-sm">
              vs
            </span>
          </div>
          <JudgeCard data={judge} animationDelay={400} />
        </div>
      </div>
    </section>
  );
}
