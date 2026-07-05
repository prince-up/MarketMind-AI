"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  LayoutDashboard,
  LineChart,
  Sparkles,
  X,
} from "lucide-react";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Stocks", href: "/#stocks", icon: LineChart },
  { label: "Research", href: "/dashboard", icon: Sparkles },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onMethodologyOpen?: () => void;
}

export default function Sidebar({ isOpen, onClose, onMethodologyOpen }: SidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard" || pathname.startsWith("/stocks");
    return false;
  };

  const navContent = (
    <>
      <div className="flex items-center justify-between px-4 h-14 border-b border-[var(--border)] lg:border-none">
        <Link href="/dashboard" className="flex items-center gap-2.5" onClick={onClose}>
          <div className="w-8 h-8 rounded-lg bg-[var(--primary)] flex items-center justify-center shadow-sm">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold text-[var(--text-primary)] text-[15px] tracking-tight">
            MarketMind
          </span>
        </Link>
        <button
          onClick={onClose}
          className="lg:hidden p-1.5 rounded-lg text-[var(--text-muted)] hover:bg-[var(--surface-muted)]"
          aria-label="Close sidebar"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV_ITEMS.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.label}
              href={item.href}
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? "bg-[var(--primary-muted)] text-[var(--primary)]"
                  : "text-[var(--text-secondary)] hover:bg-[var(--surface-muted)] hover:text-[var(--text-primary)]"
              }`}
            >
              <item.icon className="w-4 h-4 shrink-0" />
              {item.label}
            </Link>
          );
        })}

        {onMethodologyOpen && (
          <button
            onClick={() => {
              onMethodologyOpen();
              onClose();
            }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--surface-muted)] hover:text-[var(--text-primary)] transition-colors"
          >
            <BookOpen className="w-4 h-4 shrink-0" />
            Methodology
          </button>
        )}
      </nav>

      <div className="px-4 py-4 border-t border-[var(--border)]">
        <div className="rounded-xl bg-[var(--surface-muted)] border border-[var(--border-subtle)] p-3">
          <p className="text-xs font-medium text-[var(--text-primary)] mb-1">Need more credits?</p>
          <p className="text-[11px] text-[var(--text-muted)] leading-relaxed mb-2">
            Upgrade to Pro for unlimited AI research runs.
          </p>
          <Link
            href="/signup"
            onClick={onClose}
            className="text-xs font-semibold text-[var(--primary)] hover:text-[var(--primary-hover)]"
          >
            Upgrade →
          </Link>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={onClose}
          aria-hidden
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-[var(--sidebar-width)] bg-white border-r border-[var(--border)] flex flex-col transition-transform duration-200 lg:translate-x-0 lg:static lg:z-auto ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {navContent}
      </aside>
    </>
  );
}
