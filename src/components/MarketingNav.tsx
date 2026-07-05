"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, Search, Sparkles, X } from "lucide-react";
import { stockPagePath } from "@/lib/stockSlug";
import Button from "@/components/ui/Button";

const NAV_LINKS = [
  { label: "Features", href: "/#features" },
  { label: "Pricing", href: "/#pricing" },
  { label: "Stocks", href: "/#stocks" },
];

export default function MarketingNav() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
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
    <nav className="fixed top-0 w-full z-50 border-b border-[var(--border)] bg-white/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-[var(--topbar-height)] flex items-center gap-4">
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-[var(--primary)] flex items-center justify-center shadow-sm">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold text-[var(--text-primary)] text-[15px] hidden sm:block">
            MarketMind
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-1 ml-4">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="px-3 py-1.5 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-lg hover:bg-[var(--surface-muted)] transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <form onSubmit={handleSearch} className="hidden lg:flex flex-1 max-w-sm mx-auto relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search stocks..."
            className="w-full h-9 pl-9 pr-16 rounded-lg border border-[var(--border)] bg-[var(--surface-muted)] text-sm text-[var(--text-primary)] outline-none focus:border-[var(--primary)] focus:bg-white focus:ring-2 focus:ring-[var(--primary-muted)] transition-all placeholder:text-[var(--text-muted)]"
          />
          <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 hidden xl:inline-flex items-center px-1.5 py-0.5 text-[10px] font-medium text-[var(--text-muted)] bg-white border border-[var(--border)] rounded">
            ⌘K
          </kbd>
        </form>

        <div className="flex items-center gap-2 shrink-0 ml-auto">
          <Link
            href="/login"
            className="hidden sm:inline text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] px-3 py-2 transition-colors"
          >
            Log in
          </Link>
          <Link href="/signup" className="hidden sm:block">
            <Button size="sm">Sign up free</Button>
          </Link>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg text-[var(--text-secondary)] hover:bg-[var(--surface-muted)]"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-[var(--border)] bg-white px-4 py-4 space-y-3">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search stocks..."
              className="w-full h-10 pl-10 pr-4 rounded-lg border border-[var(--border)] text-sm outline-none focus:border-[var(--primary)]"
            />
          </form>
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block text-sm font-medium text-[var(--text-secondary)] py-2"
            >
              {link.label}
            </Link>
          ))}
          <div className="flex gap-2 pt-2">
            <Link href="/login" className="flex-1 text-center py-2.5 text-sm font-medium border border-[var(--border)] rounded-xl">
              Log in
            </Link>
            <Link href="/signup" className="flex-1 text-center py-2.5 text-sm font-semibold text-white bg-[var(--primary)] rounded-xl">
              Sign up
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
