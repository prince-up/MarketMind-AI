"use client";

import React, { useState } from "react";
import { Search, Sparkles } from "lucide-react";

interface CompanyInputProps {
  onResearch: (companyName: string) => void;
}

const EXAMPLE_COMPANIES = ["Tesla", "Zomato", "Apple", "NVIDIA", "Shopify"];

export default function CompanyInput({ onResearch }: CompanyInputProps) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onResearch(query.trim());
    }
  };

  const handleChipClick = (company: string) => {
    setQuery(company);
    onResearch(company);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] w-full max-w-2xl mx-auto px-4 text-center">
      <div className="inline-flex items-center gap-2 px-3 py-1 mb-8 text-sm text-neutral-300 bg-neutral-900 border border-neutral-800 rounded-full">
        <Sparkles className="w-4 h-4 text-emerald-500" />
        <span>AI-Powered Insights</span>
      </div>
      
      <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-transparent bg-clip-text bg-gradient-to-r from-neutral-50 to-neutral-500">
        AI Investment Research Agent
      </h1>
      
      <p className="text-lg text-neutral-400 mb-10 max-w-lg">
        Enter a company name to generate a comprehensive investment analysis, complete with financials, risks, and a final verdict.
      </p>

      <form onSubmit={handleSubmit} className="w-full relative flex items-center group">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-neutral-500 group-focus-within:text-emerald-500 transition-colors">
          <Search className="w-5 h-5" />
        </div>
        
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g. Tesla, Apple, Zomato..."
          className="w-full h-14 pl-12 pr-32 bg-neutral-900 border border-neutral-800 rounded-2xl text-lg text-neutral-50 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all placeholder:text-neutral-600 shadow-sm"
        />
        
        <div className="absolute inset-y-1.5 right-1.5 flex items-center">
          <button
            type="submit"
            disabled={!query.trim()}
            className="h-full px-6 bg-neutral-100 hover:bg-white text-neutral-900 font-medium rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Research
          </button>
        </div>
      </form>

      <div className="mt-8 flex flex-col items-center">
        <span className="text-sm text-neutral-500 mb-3">Or try an example</span>
        <div className="flex flex-wrap justify-center gap-2">
          {EXAMPLE_COMPANIES.map((company) => (
            <button
              key={company}
              onClick={() => handleChipClick(company)}
              className="px-4 py-2 text-sm text-neutral-300 bg-neutral-900 border border-neutral-800 rounded-lg hover:bg-neutral-800 hover:border-neutral-700 transition-colors"
            >
              {company}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
