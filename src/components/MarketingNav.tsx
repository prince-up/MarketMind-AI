"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronDown, Menu, Search, Sparkles, X } from "lucide-react";
import { stockPagePath } from "@/lib/stockSlug";

const NAV_LINKS = [
  { label: "Stocks", href: "/#stocks" },
  { label: "Research", href: "/#features" },
];

const MORE_LINKS = [
  { label: "Methodology", href: "/dashboard" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "About", href: "/#features" },
];

export default function MarketingNav() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [query, setQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (trimmed) {
      router.push(stockPagePath(trimmed));
      setMobileOpen(false);
    }
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
    <nav className="fixed top-0 w-full z-50 border-b border-[#e9e9eb] bg-white/95 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-[60px] flex items-center gap-4">
        {/* Logo + links */}
        <div className="flex items-center gap-6 shrink-0">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#00b386] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-[#44475b] text-base hidden sm:block">MarketMind</span>
          </Link>
          <div className="hidden lg:flex items-center gap-6">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-[#44475b] hover:text-[#00b386] transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <div className="relative">
              <button
                onClick={() => setMoreOpen(!moreOpen)}
                className="flex items-center gap-1 text-sm font-medium text-[#44475b] hover:text-[#00b386] transition-colors"
              >
                More <ChevronDown className="w-3.5 h-3.5" />
              </button>
              {moreOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setMoreOpen(false)} />
                  <div className="absolute top-full left-0 mt-2 w-44 bg-white rounded-xl border border-[#e9e9eb] shadow-lg py-2 z-50">
                    {MORE_LINKS.map((link) => (
                      <Link
                        key={link.label}
                        href={link.href}
                        onClick={() => setMoreOpen(false)}
                        className="block px-4 py-2 text-sm text-[#44475b] hover:bg-[#f6f6f7] hover:text-[#00b386]"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Centered search */}
        <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-auto relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7c7e8c]" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search MarketMind..."
            className="w-full h-9 pl-10 pr-20 rounded-lg border border-[#e9e9eb] bg-[#f6f6f7] text-sm text-[#44475b] outline-none focus:border-[#00b386] focus:bg-white focus:ring-1 focus:ring-[#00b386]/30 transition-all placeholder:text-[#7c7e8c]"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden lg:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-medium text-[#7c7e8c] bg-white border border-[#e9e9eb] rounded">
            Ctrl+K
          </kbd>
        </form>

        {/* Auth CTAs */}
        <div className="flex items-center gap-2 shrink-0 ml-auto md:ml-0">
          <Link
            href="/login"
            className="hidden sm:inline text-sm font-semibold text-[#44475b] hover:text-[#00b386] px-3 py-2 transition-colors"
          >
            Login
          </Link>
          <Link
            href="/signup"
            className="px-4 py-2 text-sm font-semibold text-white bg-[#00b386] hover:bg-[#00926d] rounded-full transition-colors"
          >
            Sign up
          </Link>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 rounded-lg text-[#44475b] hover:bg-[#f6f6f7]"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden border-t border-[#e9e9eb] bg-white px-4 py-4 space-y-3">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7c7e8c]" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search MarketMind..."
              className="w-full h-10 pl-10 pr-4 rounded-lg border border-[#e9e9eb] text-sm outline-none focus:border-[#00b386]"
            />
          </form>
          {[...NAV_LINKS, ...MORE_LINKS].map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block text-sm font-medium text-[#44475b] py-2"
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
