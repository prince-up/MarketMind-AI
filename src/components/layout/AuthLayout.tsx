import Link from "next/link";
import { Sparkles } from "lucide-react";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

export default function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex">
      {/* Brand panel */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[var(--text-primary)] overflow-hidden">
        <div className="absolute inset-0 hero-gradient opacity-20" />
        <div className="absolute top-1/4 -left-20 w-80 h-80 bg-[var(--primary)]/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-10 w-60 h-60 bg-[var(--primary)]/10 rounded-full blur-3xl" />

        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-[var(--primary)] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-white text-lg">MarketMind</span>
          </Link>

          <div>
            <h2 className="text-3xl xl:text-4xl font-bold text-white tracking-tight leading-tight mb-4">
              Institutional-grade research,
              <br />
              <span className="text-[var(--primary)]">built for everyone.</span>
            </h2>
            <p className="text-slate-400 text-base max-w-md leading-relaxed">
              Search any stock, analyze fundamentals, and generate AI-powered investment reports in seconds.
            </p>

            <div className="mt-10 grid grid-cols-3 gap-4">
              {[
                { value: "10K+", label: "Stocks covered" },
                { value: "<30s", label: "AI research time" },
                { value: "Free", label: "Credits to start" },
              ].map((stat) => (
                <div key={stat.label} className="rounded-xl bg-white/5 border border-white/10 p-4">
                  <div className="text-xl font-bold text-white">{stat.value}</div>
                  <div className="text-xs text-slate-400 mt-0.5">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          <p className="text-xs text-slate-500">
            Market data is for research purposes only. Not financial advice.
          </p>
        </div>
      </div>

      {/* Form panel */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 bg-white">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2.5 mb-8">
            <div className="w-8 h-8 rounded-lg bg-[var(--primary)] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-[var(--text-primary)]">MarketMind</span>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-[var(--text-primary)] tracking-tight">{title}</h1>
            <p className="text-sm text-[var(--text-muted)] mt-1.5">{subtitle}</p>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}
