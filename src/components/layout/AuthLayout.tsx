import Link from "next/link";
import { CheckCircle2, Quote, Sparkles } from "lucide-react";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

const FEATURES = [
  "AI-powered research in under 30 seconds",
  "Live charts and fundamentals data",
  "Risk analysis and buy/hold verdicts",
  "Free credits to get started",
];

export default function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex">
      {/* Brand panel */}
      <div className="hidden lg:flex lg:w-[52%] relative bg-[var(--text-primary)] overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="hero-gradient h-full" />
        </div>
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-[var(--primary)]/25 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-10 w-72 h-72 bg-[var(--primary)]/15 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgb(255_255_255/0.03)_1px,transparent_0)] bg-[size:32px_32px]" />

        <div className="relative z-10 flex flex-col justify-between p-12 xl:p-16 w-full">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-[var(--primary)] flex items-center justify-center shadow-lg shadow-[var(--primary)]/30 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-white text-xl tracking-tight">MarketMind</span>
          </Link>

          <div>
            <h2 className="text-3xl xl:text-[2.75rem] font-bold text-white tracking-tight leading-[1.12] mb-5">
              Institutional-grade research,
              <br />
              <span className="text-[var(--primary)]">built for everyone.</span>
            </h2>
            <p className="text-slate-400 text-base max-w-md leading-relaxed mb-8">
              Search any stock, analyze fundamentals, and generate AI-powered investment reports in seconds.
            </p>

            <ul className="space-y-3 mb-10">
              {FEATURES.map((feature) => (
                <li key={feature} className="flex items-center gap-3 text-sm text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-[var(--primary)] shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>

            <div className="rounded-2xl bg-white/5 border border-white/10 p-5 backdrop-blur-sm">
              <Quote className="w-5 h-5 text-[var(--primary)]/60 mb-3" />
              <p className="text-sm text-slate-300 leading-relaxed mb-4">
                &ldquo;MarketMind replaced three different tools for me. The AI research quality is genuinely impressive.&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[var(--primary)]/20 flex items-center justify-center">
                  <span className="text-xs font-semibold text-[var(--primary)]">AK</span>
                </div>
                <div>
                  <div className="text-sm font-medium text-white">Arjun Kapoor</div>
                  <div className="text-xs text-slate-500">Active trader, Mumbai</div>
                </div>
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-600">
            Market data is for research purposes only. Not financial advice.
          </p>
        </div>
      </div>

      {/* Form panel */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 bg-white">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2.5 mb-8">
            <div className="w-9 h-9 rounded-xl bg-[var(--primary)] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-[var(--text-primary)] text-lg">MarketMind</span>
          </div>

          <div className="mb-8">
            <h1 className="page-title">{title}</h1>
            <p className="page-subtitle">{subtitle}</p>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}
