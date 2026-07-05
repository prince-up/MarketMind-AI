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
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#7c7e8c]" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search any company or stock — e.g. Tesla, NVIDIA, Zomato"
            className="w-full h-14 pl-14 pr-32 bg-white border border-[#e9e9eb] rounded-2xl text-base text-[#44475b] outline-none focus:border-[#00b386] focus:ring-2 focus:ring-[#00b386]/20 transition-all placeholder:text-[#7c7e8c] shadow-sm"
          />
          <button
            type="submit"
            disabled={!query.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2.5 text-sm font-semibold text-white bg-[#00b386] hover:bg-[#00926d] rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitLabel}
          </button>
        </form>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-xs text-[#7c7e8c]">Popular:</span>
          {EXAMPLE_COMPANIES.map((company) => (
            <button
              key={company}
              onClick={() => handleChipClick(company)}
              className="px-3 py-1.5 text-xs font-medium text-[#44475b] bg-[#f6f6f7] border border-[#e9e9eb] rounded-lg hover:border-[#00b386]/40 hover:text-[#00b386] transition-colors"
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
      <div className="inline-flex items-center gap-2 px-3 py-1 mb-8 text-sm text-[#44475b] bg-[#00b386]/5 border border-[#00b386]/20 rounded-full">
        <Sparkles className="w-4 h-4 text-[#00b386]" />
        <span>AI-Powered Insights</span>
      </div>

      <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-[#44475b]">
        AI Investment Research Agent
      </h1>

      <p className="text-lg text-[#7c7e8c] mb-10 max-w-lg">
        Search any company to view live price, chart, fundamentals, and optional AI research.
      </p>

      <form onSubmit={handleSubmit} className="w-full relative flex items-center group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#7c7e8c] group-focus-within:text-[#00b386] transition-colors" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g. Tesla, Apple, Zomato..."
          className="w-full h-14 pl-12 pr-32 bg-white border border-[#e9e9eb] rounded-2xl text-lg text-[#44475b] focus:outline-none focus:ring-2 focus:ring-[#00b386]/20 focus:border-[#00b386] transition-all placeholder:text-[#7c7e8c] shadow-sm"
        />
        <div className="absolute inset-y-1.5 right-1.5 flex items-center">
          <button
            type="submit"
            disabled={!query.trim()}
            className="h-full px-6 bg-[#00b386] hover:bg-[#00926d] text-white font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
              className="px-4 py-2 text-sm text-[#44475b] bg-white border border-[#e9e9eb] rounded-lg hover:border-[#00b386]/40 hover:text-[#00b386] transition-colors"
            >
              {company}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
