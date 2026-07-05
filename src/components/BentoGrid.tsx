import Link from "next/link";
import { ArrowRight, BarChart3, Brain, Check, LineChart, ShieldCheck, Zap } from "lucide-react";

const BENTO = [
  {
    icon: Brain,
    title: "AI Research Engine",
    description: "Deep-dive analysis with fundamentals, risks, news sentiment, and buy/hold/pass verdicts.",
    className: "sm:col-span-2 lg:row-span-2",
    featured: true,
  },
  {
    icon: LineChart,
    title: "Live Charts",
    description: "Interactive price charts with intraday, weekly, and yearly views.",
    className: "",
  },
  {
    icon: BarChart3,
    title: "Fundamentals",
    description: "Revenue, margins, and peer comparisons at a glance.",
    className: "",
  },
  {
    icon: ShieldCheck,
    title: "Risk Analysis",
    description: "Downside risks, volatility, and analyst recommendations.",
    className: "",
  },
  {
    icon: Zap,
    title: "Instant Search",
    description: "Find any stock globally and jump straight to research.",
    className: "sm:col-span-2",
  },
];

export default function BentoGrid() {
  return (
    <section id="features" className="py-20 md:py-28 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] tracking-tight mb-4">
            Everything you need to research
          </h2>
          <p className="text-[var(--text-secondary)] text-base md:text-lg max-w-2xl mx-auto">
            From shortlisting to deep analysis — institutional-grade tools, simplified for modern investors.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {BENTO.map((item) => (
            <div
              key={item.title}
              className={`group rounded-xl border border-[var(--border)] bg-white p-6 hover:border-[color-mix(in_srgb,var(--primary)_30%,var(--border))] hover:shadow-lg transition-all duration-300 ${item.className} ${
                item.featured ? "bg-gradient-to-br from-white to-[var(--primary-muted)]/30" : ""
              }`}
            >
              <div className="w-10 h-10 rounded-lg bg-[var(--primary-muted)] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <item.icon className="w-5 h-5 text-[var(--primary)]" />
              </div>
              <h3 className="text-base font-semibold text-[var(--text-primary)] mb-2">{item.title}</h3>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const PLANS = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for getting started with AI research.",
    features: ["5 free research credits", "Live stock charts", "Fundamentals data", "Basic search"],
    cta: "Get started",
    href: "/signup",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$19",
    period: "/month",
    description: "For serious investors who research daily.",
    features: [
      "Unlimited AI research",
      "Priority processing",
      "PDF export",
      "Advanced screener",
      "Email support",
    ],
    cta: "Start Pro trial",
    href: "/signup",
    highlighted: true,
  },
];

export function PricingSection() {
  return (
    <section id="pricing" className="py-20 md:py-28 px-4 sm:px-6 bg-[var(--surface-muted)]">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] tracking-tight mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-[var(--text-secondary)] text-base max-w-xl mx-auto">
            Start free with research credits. Upgrade when you need unlimited AI analysis.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-xl border p-6 md:p-8 ${
                plan.highlighted
                  ? "border-[var(--primary)] bg-white shadow-lg shadow-[var(--primary)]/5 relative"
                  : "border-[var(--border)] bg-white"
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 text-xs font-semibold text-white bg-[var(--primary)] rounded-full">
                  Most popular
                </div>
              )}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-[var(--text-primary)]">{plan.name}</h3>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-[var(--text-primary)]">{plan.price}</span>
                  <span className="text-sm text-[var(--text-muted)]">{plan.period}</span>
                </div>
                <p className="text-sm text-[var(--text-secondary)] mt-2">{plan.description}</p>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2.5 text-sm text-[var(--text-secondary)]">
                    <Check className="w-4 h-4 text-[var(--primary)] shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Link
                href={plan.href}
                className={`flex items-center justify-center gap-2 w-full py-3 text-sm font-semibold rounded-xl transition-colors ${
                  plan.highlighted
                    ? "bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)]"
                    : "border border-[var(--border)] text-[var(--text-primary)] hover:border-[var(--primary)] hover:text-[var(--primary)]"
                }`}
              >
                {plan.cta} <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
