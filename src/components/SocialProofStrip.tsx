const LOGOS = [
  "Retail investors",
  "Day traders",
  "Long-term holders",
  "Research analysts",
  "Finance students",
];

export default function SocialProofStrip() {
  return (
    <section className="py-10 border-y border-[var(--border-subtle)] bg-[var(--surface-muted)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <p className="text-center text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-6">
          Trusted by investors who do their homework
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          {LOGOS.map((name) => (
            <span
              key={name}
              className="text-sm font-medium text-[var(--text-secondary)] opacity-60 hover:opacity-100 transition-opacity"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
