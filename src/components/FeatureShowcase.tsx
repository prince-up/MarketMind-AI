import { BarChart3, Brain, LineChart, ShieldCheck } from "lucide-react";

const FEATURES = [
  {
    icon: Brain,
    title: "AI Research",
    description: "Get deep-dive analysis powered by deterministic AI — fundamentals, risks, and verdicts in seconds.",
  },
  {
    icon: LineChart,
    title: "Live Charts",
    description: "Interactive price charts with intraday, weekly, and yearly views for every stock you track.",
  },
  {
    icon: BarChart3,
    title: "Fundamentals",
    description: "Revenue, profit, margins, and peer comparisons — all the data you need to shortlist winners.",
  },
  {
    icon: ShieldCheck,
    title: "Risk Analysis",
    description: "Understand downside risks, volatility, and analyst recommendations before you invest.",
  },
];

export default function FeatureShowcase() {
  return (
    <section id="features" className="py-16 md:py-24 px-4 sm:px-6 bg-[var(--surface-muted)]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] tracking-tight mb-4">
            Everything you need to research stocks
          </h2>
          <p className="text-[var(--text-secondary)] text-base md:text-lg max-w-2xl mx-auto">
            From shortlisting to deep analysis — MarketMind gives you institutional-grade tools, simplified.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="group p-6 md:p-7 bg-white rounded-2xl border border-[var(--border)] hover:border-[color-mix(in_srgb,var(--primary)_30%,var(--border))] hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-[var(--primary-muted)] flex items-center justify-center mb-5 group-hover:bg-[color-mix(in_srgb,var(--primary)_15%,white)] transition-colors">
                <feature.icon className="w-6 h-6 text-[var(--primary)]" />
              </div>
              <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">{feature.title}</h3>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
