"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Coins, Menu, Search, User } from "lucide-react";
import Badge from "@/components/ui/Badge";

interface TopBarProps {
  onSearch: (query: string) => void;
  credits?: number | null;
  userName?: string | null;
  onMenuClick: () => void;
  searchPlaceholder?: string;
}

export default function TopBar({
  onSearch,
  credits = null,
  userName = null,
  onMenuClick,
  searchPlaceholder = "Search stocks...",
}: TopBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
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

  const initials = userName
    ? userName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "U";

  return (
    <header className="sticky top-0 z-30 h-[var(--topbar-height)] bg-white/80 backdrop-blur-xl border-b border-[var(--border)]">
      <div className="h-full px-4 md:px-6 flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 -ml-1 rounded-lg text-[var(--text-secondary)] hover:bg-[var(--surface-muted)]"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <form onSubmit={handleSubmit} className="relative flex-1 max-w-lg">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full h-9 pl-9 pr-16 rounded-lg border border-[var(--border)] bg-[var(--surface-muted)] text-sm text-[var(--text-primary)] outline-none focus:border-[var(--primary)] focus:bg-white focus:ring-2 focus:ring-[var(--primary-muted)] transition-all placeholder:text-[var(--text-muted)]"
          />
          <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-medium text-[var(--text-muted)] bg-white border border-[var(--border)] rounded">
            ⌘K
          </kbd>
        </form>

        <div className="flex items-center gap-2 shrink-0">
          {credits !== null && (
            <Badge variant="warning" className="hidden sm:inline-flex font-mono">
              <Coins className="w-3 h-3" />
              {credits} credits
            </Badge>
          )}

          <Link
            href="/login"
            className="flex items-center gap-2 p-1 rounded-lg hover:bg-[var(--surface-muted)] transition-colors"
            title={userName ?? "Account"}
          >
            <div className="w-8 h-8 rounded-full bg-[var(--primary-muted)] border border-[color-mix(in_srgb,var(--primary)_20%,transparent)] flex items-center justify-center">
              {userName ? (
                <span className="text-xs font-semibold text-[var(--primary)]">{initials}</span>
              ) : (
                <User className="w-4 h-4 text-[var(--primary)]" />
              )}
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
}
