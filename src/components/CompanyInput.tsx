"use client";

import React, { useState } from "react";
import { Search, Sparkles } from "lucide-react";

interface CompanyInputProps {
  onResearch: (companyName: string) => void;
  submitLabel?: string;
  variant?: "hero" | "dashboard";
}

const EXAMPLE_COMPANIES = ["Tesla", "Zomato", "Apple", "NVIDIA", "PC Jeweller"];

export default function CompanyInput({
  onResearch,
  submitLabel = "Research",
  variant = "hero",
}: CompanyInputProps) {
  const [query, setQuery] = useState("");
  const isDashboard = variant === "dashboard";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) onResearch(query.trim());
  };

  const handleChipClick = (company: string) => {
    setQuery(company);
    onResearch(company);
  };

  if (isDashboard) {
    return (
      <div className="w-full">
        <form onSubmit={handleSubmit} className="w-full relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search any company or stock — e.g. Tesla, NVIDIA, Zomato"
            className="w-full h-12 pl-12 pr-32 bg-white border border-[var(--border)] rounded-xl text-sm text-[var(--text-primary)] outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary-muted)] transition-all placeholder:text-[var(--text-muted)] shadow-sm"
          />
          <button
            type="submit"
            disabled={!query.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 px-5 py-2 text-sm font-semibold text-white bg-[var(--primary)] hover:bg-[var(--primary-hover)] rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitLabel}
          </button>
        </form>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-xs text-[var(--text-muted)]">Popular:</span>
          {EXAMPLE_COMPANIES.map((company) => (
            <button
              key={company}
              onClick={() => handleChipClick(company)}
              className="px-3 py-1.5 text-xs font-medium text-[var(--text-secondary)] bg-[var(--surface-muted)] border border-[var(--border)] rounded-lg hover:border-[color-mix(in_srgb,var(--primary)_30%,var(--border))] hover:text-[var(--primary)] transition-colors"
            >
              {company}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] w-full max-w-2xl mx-auto px-4 text-center">
      <div className="inline-flex items-center gap-2 px-3 py-1 mb-8 text-sm text-[var(--text-primary)] bg-[var(--primary-muted)] border border-[color-mix(in_srgb,var(--primary)_20%,transparent)] rounded-full">
        <Sparkles className="w-4 h-4 text-[var(--primary)]" />
        <span>AI-Powered Insights</span>
      </div>

      <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-[#44475b]">
        AI Investment Research Agent
      </h1>

      <p className="text-lg text-[#7c7e8c] mb-10 max-w-lg">
        Search any company to view live price, chart, fundamentals, and optional AI research.
      </p>

      <form onSubmit={handleSubmit} className="w-full relative flex items-center group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)] group-focus-within:text-[var(--primary)] transition-colors" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g. Tesla, Apple, Zomato..."
          className="w-full h-14 pl-12 pr-32 bg-white border border-[var(--border)] rounded-2xl text-lg text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-muted)] focus:border-[var(--primary)] transition-all placeholder:text-[var(--text-muted)] shadow-sm"
        />
        <div className="absolute inset-y-1.5 right-1.5 flex items-center">
          <button
            type="submit"
            disabled={!query.trim()}
            className="h-full px-6 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitLabel}
          </button>
        </div>
      </form>

      <div className="mt-8 flex flex-col items-center">
        <span className="text-sm text-[#7c7e8c] mb-3">Or try an example</span>
        <div className="flex flex-wrap justify-center gap-2">
          {EXAMPLE_COMPANIES.map((company) => (
            <button
              key={company}
              onClick={() => handleChipClick(company)}
              className="px-4 py-2 text-sm text-[var(--text-primary)] bg-white border border-[var(--border)] rounded-lg hover:border-[color-mix(in_srgb,var(--primary)_40%,var(--border))] hover:text-[var(--primary)] transition-colors"
            >
              {company}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
