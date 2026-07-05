const COMPANIES = [
  { name: "Bloomberg", initials: "BB" },
  { name: "Morningstar", initials: "MS" },
  { name: "Yahoo Finance", initials: "YF" },
  { name: "TradingView", initials: "TV" },
  { name: "Seeking Alpha", initials: "SA" },
  { name: "Finviz", initials: "FV" },
];

export default function LogoCloud() {
  return (
    <section className="py-12 md:py-16 border-y border-[var(--border-subtle)] bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <p className="text-center text-xs font-semibold text-[var(--text-muted)] uppercase tracking-widest mb-8">
          Trusted by investors who do their homework
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-4 md:gap-x-10">
          {COMPANIES.map((company) => (
            <div
              key={company.name}
              className="flex items-center gap-2.5 px-4 py-2 rounded-lg opacity-50 hover:opacity-100 transition-opacity duration-300 grayscale hover:grayscale-0"
            >
              <div className="w-8 h-8 rounded-md bg-[var(--surface-muted)] border border-[var(--border)] flex items-center justify-center">
                <span className="text-[10px] font-bold text-[var(--text-secondary)]">
                  {company.initials}
                </span>
              </div>
              <span className="text-sm font-semibold text-[var(--text-secondary)] hidden sm:inline">
                {company.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
