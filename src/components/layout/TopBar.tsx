"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Bell, ChevronDown, Coins, LogOut, Menu, Search, Settings, User } from "lucide-react";
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
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);

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

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
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
    <header className="sticky top-0 z-30 h-[var(--topbar-height)] bg-white/90 backdrop-blur-xl border-b border-[var(--border)]">
      <div className="h-full px-4 md:px-6 flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 -ml-1 rounded-lg text-[var(--text-secondary)] hover:bg-[var(--surface-muted)] transition-colors"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <form onSubmit={handleSubmit} className="relative flex-1 max-w-lg">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)] pointer-events-none" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full h-9 pl-9 pr-16 rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] text-sm text-[var(--text-primary)] outline-none focus:border-[var(--primary)] focus:bg-white focus:ring-2 focus:ring-[var(--primary-muted)] transition-all placeholder:text-[var(--text-muted)]"
          />
          <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-medium text-[var(--text-muted)] bg-white border border-[var(--border)] rounded-md">
            ⌘K
          </kbd>
        </form>

        <div className="flex items-center gap-1.5 shrink-0">
          {credits !== null && (
            <Badge variant="warning" className="hidden sm:inline-flex font-mono">
              <Coins className="w-3 h-3" />
              {credits} credits
            </Badge>
          )}

          <button
            type="button"
            aria-label="Notifications"
            className="relative p-2 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-muted)] transition-colors"
          >
            <Bell className="w-4.5 h-4.5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[var(--primary)] rounded-full border-2 border-white" />
          </button>

          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 p-1 pl-1.5 rounded-xl hover:bg-[var(--surface-muted)] transition-colors"
              aria-expanded={dropdownOpen}
              aria-haspopup="true"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--primary-muted)] to-[color-mix(in_srgb,var(--primary)_20%,white)] border border-[color-mix(in_srgb,var(--primary)_25%,transparent)] flex items-center justify-center">
                {userName ? (
                  <span className="text-xs font-bold text-[var(--primary)]">{initials}</span>
                ) : (
                  <User className="w-4 h-4 text-[var(--primary)]" />
                )}
              </div>
              <ChevronDown
                className={`w-3.5 h-3.5 text-[var(--text-muted)] hidden sm:block transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
              />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-52 py-1.5 bg-white rounded-xl border border-[var(--border)] shadow-lg z-50">
                {userName && (
                  <div className="px-4 py-2.5 border-b border-[var(--border-subtle)]">
                    <p className="text-sm font-semibold text-[var(--text-primary)] truncate">
                      {userName}
                    </p>
                    <p className="text-xs text-[var(--text-muted)]">Free plan</p>
                  </div>
                )}
                <Link
                  href="/dashboard"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[var(--text-secondary)] hover:bg-[var(--surface-muted)] hover:text-[var(--text-primary)] transition-colors"
                >
                  <User className="w-4 h-4" />
                  Dashboard
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[var(--text-secondary)] hover:bg-[var(--surface-muted)] hover:text-[var(--text-primary)] transition-colors"
                >
                  <Settings className="w-4 h-4" />
                  Upgrade plan
                </Link>
                <div className="my-1 border-t border-[var(--border-subtle)]" />
                <Link
                  href="/login"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[var(--text-secondary)] hover:bg-[var(--surface-muted)] hover:text-red-600 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Sign in
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
