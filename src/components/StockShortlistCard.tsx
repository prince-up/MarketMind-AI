"use client";

import Link from "next/link";
import { TrendingDown, TrendingUp } from "lucide-react";
import { stockPagePath } from "@/lib/stockSlug";
import type { PopularStock } from "@/lib/popularStocks";

interface StockShortlistCardProps {
  stock: PopularStock;
  compact?: boolean;
}

export default function StockShortlistCard({ stock, compact = false }: StockShortlistCardProps) {
  const isPositive = stock.change >= 0;
  const href = stockPagePath(stock.name);

  return (
    <Link
      href={href}
      className={`group block bg-white rounded-xl border border-[var(--border)] hover:border-[color-mix(in_srgb,var(--primary)_30%,var(--border))] hover:shadow-md transition-all duration-200 ${
        compact ? "p-4" : "p-5"
      }`}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="min-w-0">
          <h3 className="font-semibold text-[var(--text-primary)] truncate group-hover:text-[var(--primary)] transition-colors">
            {stock.name}
          </h3>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            {stock.ticker}
            {stock.exchange && <span className="ml-1.5 opacity-70">· {stock.exchange}</span>}
          </p>
        </div>
        <div
          className={`shrink-0 flex items-center gap-0.5 text-xs font-semibold px-2 py-1 rounded-md ${
            isPositive ? "text-[var(--primary)] bg-[var(--primary-muted)]" : "text-red-600 bg-red-50"
          }`}
        >
          {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          {isPositive ? "+" : ""}
          {stock.changePercent.toFixed(2)}%
        </div>
      </div>

      <div className="flex items-end justify-between">
        <span className="text-lg font-bold text-[var(--text-primary)] font-mono">
          {stock.price.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
        <span className={`text-xs font-medium ${isPositive ? "text-[var(--primary)]" : "text-red-600"}`}>
          {isPositive ? "+" : ""}
          {stock.change.toFixed(2)}
        </span>
      </div>

      {!compact && (
        <div className="mt-4 h-8 flex items-end gap-0.5">
          {Array.from({ length: 12 }).map((_, i) => {
            const h = 20 + Math.sin(i * 0.8 + stock.ticker.length) * 12 + (isPositive ? i * 1.5 : -i * 0.5);
            return (
              <div
                key={i}
                className={`flex-1 rounded-sm ${isPositive ? "bg-[var(--primary)]/30" : "bg-red-400/30"}`}
                style={{ height: `${Math.max(4, h)}%` }}
              />
            );
          })}
        </div>
      )}
    </Link>
  );
}
