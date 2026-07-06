"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { BookOpen, Coins, Search, Sparkles } from "lucide-react";

interface StockPageHeaderProps {
  onSearch: (query: string) => void;
  credits?: number | null;
  onMethodologyOpen?: () => void;
  logoHref?: string;
}

export default function StockPageHeader({
  onSearch,
  credits = null,
  onMethodologyOpen,
  logoHref = "/dashboard",
}: StockPageHeaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [headerQuery, setHeaderQuery] = useState("");

  const handleHeaderSearch = (event: React.FormEvent) => {
    event.preventDefault();
    const trimmed = headerQuery.trim();
    if (trimmed) onSearch(trimmed);
  };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <header className="w-full border-b border-[#e9e9eb] bg-white/95 backdrop-blur-xl sticky top-0 z-40">
      <div className="h-[60px] w-full max-w-7xl mx-auto px-4 md:px-8 flex items-center gap-4">
        <Link href={logoHref} className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded-full bg-[var(--primary)] flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="hidden sm:block text-base font-bold text-[#44475b]">MarketMind</span>
        </Link>

        <form onSubmit={handleHeaderSearch} className="relative flex-1 max-w-md mx-auto">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7c7e8c]" />
          <input
            ref={inputRef}
            value={headerQuery}
            onChange={(event) => setHeaderQuery(event.target.value)}
            placeholder="Search MarketMind..."
            className="w-full h-9 pl-10 pr-20 rounded-lg border border-[var(--border)] bg-[var(--surface-muted)] text-sm text-[var(--text-primary)] outline-none focus:border-[var(--primary)] focus:bg-white focus:ring-1 focus:ring-[var(--primary-muted)] transition-all placeholder:text-[var(--text-muted)]"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden lg:inline-flex items-center px-1.5 py-0.5 text-[10px] font-medium text-[#7c7e8c] bg-white border border-[#e9e9eb] rounded">
            Ctrl+K
          </kbd>
        </form>

        <div className="flex items-center gap-2 shrink-0">
          {credits !== null && (
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg font-mono">
              <Coins className="w-3.5 h-3.5" />
              {credits} Credits
            </div>
          )}
          {onMethodologyOpen && (
            <button
              onClick={onMethodologyOpen}
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-[var(--text-primary)] hover:text-[var(--primary)] bg-white border border-[var(--border)] rounded-lg transition-colors"
            >
              <BookOpen className="w-3.5 h-3.5" />
              Methodology
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
