import Link from "next/link";
import { ArrowRight, TrendingUp } from "lucide-react";

function PhoneMockup() {
  return (
    <div className="relative mx-auto w-[280px] md:w-[300px]">
      {/* Phone frame */}
      <div className="relative bg-[#1c1c1e] rounded-[2.5rem] p-3 shadow-2xl border border-white/10">
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-20 h-5 bg-black rounded-full z-10" />
        <div className="bg-[#f5f5f7] rounded-[2rem] overflow-hidden pt-8 pb-4 px-3 min-h-[420px]">
          {/* Status bar area */}
          <div className="text-[10px] font-semibold text-[#44475b] mb-3 px-1">MarketMind</div>

          {/* Blue screener card */}
          <div className="bg-[#a8d4f0] rounded-2xl p-4 mb-3 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-[#44475b]">Intraday Screener</span>
              <span className="text-[10px] text-[#44475b]/70 bg-white/50 px-2 py-0.5 rounded-full">Live</span>
            </div>
            {[
              { name: "Tesla", price: "248.42", chg: "+1.30%", up: true },
              { name: "NVIDIA", price: "875.28", chg: "-1.40%", up: false },
              { name: "Zomato", price: "268.50", chg: "+1.80%", up: true },
            ].map((s) => (
              <div key={s.name} className="flex items-center justify-between py-2 border-b border-[#44475b]/10 last:border-0">
                <div>
                  <div className="text-xs font-bold text-[#44475b]">{s.name}</div>
                  <div className="text-[10px] text-[#44475b]/60 font-mono">{s.price}</div>
                </div>
                <span className={`text-[10px] font-semibold ${s.up ? "text-[var(--buy)]" : "text-[var(--sell)]"}`}>
                  {s.chg}
                </span>
              </div>
            ))}
          </div>

          {/* Research order card */}
          <div className="bg-blue-50 rounded-2xl p-4 shadow-sm border border-blue-100">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-[var(--primary)]" />
              <span className="text-xs font-bold text-[#44475b]">Research Order</span>
            </div>
            <div className="bg-white/80 rounded-xl p-3">
              <div className="text-[10px] text-[#44475b]/60 mb-1">Stock</div>
              <div className="text-sm font-bold text-[#44475b]">Apple Inc.</div>
              <div className="flex justify-between mt-2 pt-2 border-t border-[#44475b]/10">
                <div>
                  <div className="text-[10px] text-[#44475b]/60">AI Score</div>
                  <div className="text-sm font-bold text-[var(--primary)]">82/100</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-[#44475b]/60">Verdict</div>
                  <div className="text-sm font-bold text-[var(--buy)]">Buy</div>
                </div>
              </div>
            </div>
            <button className="w-full mt-3 py-2 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white text-xs font-bold rounded-xl transition-colors">
              Run AI Research
            </button>
          </div>
        </div>
      </div>

      {/* Decorative glow */}
      <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-[#a8d4f0]/30 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -top-4 -left-4 w-24 h-24 bg-[#c8e6a0]/30 rounded-full blur-2xl pointer-events-none" />
    </div>
  );
}

export default function StockResearchSection() {
  return (
    <section className="py-20 md:py-28 px-4 sm:px-6 bg-[#0a0a0a] relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[var(--primary)]/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="order-2 lg:order-1">
            <PhoneMockup />
          </div>

          <div className="order-1 lg:order-2 text-center lg:text-left">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-[1.1] mb-6">
              Stock research
              <br />
              made simple
            </h2>
            <p className="text-white/50 text-base md:text-lg leading-relaxed mb-8 max-w-md mx-auto lg:mx-0">
              Screen stocks by fundamentals, track intraday movers, and place research orders — all from one clean interface.
            </p>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-[#0a0a0a] bg-white hover:bg-white/90 rounded-full transition-colors"
            >
              Start researching <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
