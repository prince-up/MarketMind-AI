import { Quote, Star } from "lucide-react";

const TESTIMONIALS = [
  {
    quote:
      "MarketMind cut my research time from hours to minutes. The AI verdicts are surprisingly thorough — I use them before every trade.",
    author: "Sarah Chen",
    role: "Independent investor",
    avatar: "SC",
  },
  {
    quote:
      "Finally, a tool that combines live charts with real fundamental analysis. The risk assessment section alone is worth the subscription.",
    author: "Marcus Rivera",
    role: "Portfolio manager",
    avatar: "MR",
  },
  {
    quote:
      "As a finance student, this gives me institutional-quality research at a fraction of the cost. My thesis work has never been easier.",
    author: "Priya Sharma",
    role: "MBA candidate, IIM",
    avatar: "PS",
  },
];

export default function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-20 md:py-28 px-4 sm:px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="section-title mb-4">Loved by researchers</h2>
          <p className="section-subtitle mx-auto">
            See why investors and analysts choose MarketMind for smarter stock research.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.author}
              className="saas-card p-6 md:p-7 flex flex-col h-full"
            >
              <div className="flex items-center gap-0.5 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className="w-3.5 h-3.5 fill-amber-400 text-amber-400"
                  />
                ))}
              </div>
              <Quote className="w-5 h-5 text-[var(--primary)]/40 mb-3 shrink-0" />
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed flex-1 mb-6">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="flex items-center gap-3 pt-4 border-t border-[var(--border-subtle)]">
                <div className="w-9 h-9 rounded-full bg-[var(--primary-muted)] border border-[color-mix(in_srgb,var(--primary)_15%,transparent)] flex items-center justify-center">
                  <span className="text-xs font-semibold text-[var(--primary)]">
                    {t.avatar}
                  </span>
                </div>
                <div>
                  <div className="text-sm font-semibold text-[var(--text-primary)]">
                    {t.author}
                  </div>
                  <div className="text-xs text-[var(--text-muted)]">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
