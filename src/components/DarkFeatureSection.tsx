import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

function DesktopMockup() {
  return (
    <div className="relative">
      {/* Tablet/desktop frame */}
      <div className="bg-[#1c1c1e] rounded-2xl p-2 shadow-2xl border border-white/10">
        <div className="flex items-center gap-1.5 px-3 py-2 border-b border-white/5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#eb5b3c]/80" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#eab308]/80" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#00b386]/80" />
          <span className="ml-2 text-[10px] text-white/30">MarketMind — AI Shortlisting</span>
        </div>

        <div className="bg-[#141414] rounded-b-xl p-4 md:p-5 min-h-[280px]">
          <div className="grid md:grid-cols-5 gap-3">
            {/* Left panel - option chain style */}
            <div className="md:col-span-3 bg-[#a8d4f0]/20 rounded-xl p-4 border border-[#a8d4f0]/20">
              <div className="text-xs font-bold text-white/80 mb-3">AI Shortlist — Top Picks</div>
              <div className="space-y-2">
                {[
                  { name: "NVIDIA", score: 88, verdict: "Strong Buy", color: "bg-[#c8e6a0]" },
                  { name: "Tesla", score: 76, verdict: "Buy", color: "bg-[#a8d4f0]" },
                  { name: "Apple", score: 72, verdict: "Buy", color: "bg-[#c8e6a0]" },
                ].map((item) => (
                  <div key={item.name} className={`${item.color} rounded-xl p-3 flex items-center justify-between`}>
                    <div>
                      <div className="text-xs font-bold text-[#44475b]">{item.name}</div>
                      <div className="text-[10px] text-[#44475b]/70">{item.verdict}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-[#44475b]">{item.score}</div>
                      <div className="text-[9px] text-[#44475b]/60">AI Score</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right panel - payoff / verdict */}
            <div className="md:col-span-2 space-y-3">
              <div className="bg-[#c8e6a0]/30 rounded-xl p-4 border border-[#c8e6a0]/20">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-[#00b386]" />
                  <span className="text-xs font-bold text-white/80">AI Verdict</span>
                </div>
                <div className="text-2xl font-extrabold text-[#00b386] mb-1">Buy</div>
                <div className="text-[10px] text-white/40">High confidence · 88/100</div>
              </div>

              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <div className="text-[10px] text-white/40 uppercase tracking-wide mb-2">Risk Payoff</div>
                <div className="flex items-end gap-1 h-16">
                  {[30, 45, 60, 55, 75, 85, 70, 90].map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-t bg-[#00b386]/50"
                      style={{ height: `${h}%` }}
                    />
                  ))}
                </div>
                <div className="flex justify-between mt-2 text-[9px] text-white/30">
                  <span>Low risk</span>
                  <span>High reward</span>
                </div>
              </div>

              <div className="bg-[#a8d4f0]/20 rounded-xl p-3 border border-[#a8d4f0]/20">
                <div className="text-[10px] text-white/50 mb-1">Create basket</div>
                <div className="flex gap-1.5">
                  {["NVDA", "TSLA", "AAPL"].map((t) => (
                    <span key={t} className="px-2 py-1 bg-white/10 rounded text-[10px] font-mono text-white/70">
                      {t}
                    </span>
                  ))}
                  <span className="px-2 py-1 bg-[#00b386]/30 rounded text-[10px] text-[#00b386] font-semibold">+2</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute -bottom-4 -left-4 w-28 h-28 bg-[#00b386]/15 rounded-2xl blur-2xl pointer-events-none" />
    </div>
  );
}

export default function DarkFeatureSection() {
  return (
    <section className="py-20 md:py-28 px-4 sm:px-6 bg-[#0a0a0a] relative overflow-hidden border-t border-white/5">
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#a8d4f0]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="text-center lg:text-left">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-[1.1] mb-6">
              AI-powered
              <br />
              shortlisting
            </h2>
            <p className="text-white/50 text-base md:text-lg leading-relaxed mb-4 max-w-md mx-auto lg:mx-0">
              Analyse fundamentals, view risk payoffs, and create research baskets — powered by deterministic AI scoring.
            </p>
            <p className="text-white/30 text-sm mb-8 max-w-md mx-auto lg:mx-0">
              Like option chain analysis, but for stock research. Compare peers, score conviction, and act with confidence.
            </p>
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-[#0a0a0a] bg-[#00b386] hover:bg-[#00d49a] rounded-full transition-colors"
            >
              Try AI shortlisting <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <DesktopMockup />
        </div>
      </div>
    </section>
  );
}
