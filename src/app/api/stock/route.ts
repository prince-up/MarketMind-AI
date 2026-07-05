import { NextResponse } from "next/server";
import YahooFinance from "yahoo-finance2";
import {
  indianTickerCandidates,
  resolveStockAliases,
  searchTermsFromInput,
} from "@/lib/stockSlug";

const yahooFinance = new YahooFinance({ suppressNotices: ["yahooSurvey"] });

class TickerNotFoundError extends Error {
  constructor(input: string) {
    super(`Could not resolve ticker for "${input}"`);
    this.name = "TickerNotFoundError";
  }
}

interface GrowthStats {
  revenueGrowth1Y: number | null;
  revenueGrowth3Y: number | null;
  profitGrowth1Y: number | null;
  profitGrowth3Y: number | null;
}

function computeGrowthStats(
  financials: Array<{ revenue: number; profit: number }>
): GrowthStats {
  const empty: GrowthStats = {
    revenueGrowth1Y: null,
    revenueGrowth3Y: null,
    profitGrowth1Y: null,
    profitGrowth3Y: null,
  };

  if (financials.length < 5) return empty;

  const sum = (items: number[]) => items.reduce((a, b) => a + b, 0);

  const last4 = financials.slice(-4);
  const prev4 = financials.slice(-8, -4);

  if (prev4.length === 4) {
    const revLast = sum(last4.map((f) => f.revenue));
    const revPrev = sum(prev4.map((f) => f.revenue));
    const profitLast = sum(last4.map((f) => f.profit));
    const profitPrev = sum(prev4.map((f) => f.profit));

    if (revPrev > 0) empty.revenueGrowth1Y = ((revLast - revPrev) / revPrev) * 100;
    if (profitPrev !== 0) empty.profitGrowth1Y = ((profitLast - profitPrev) / Math.abs(profitPrev)) * 100;
  }

  if (financials.length >= 12) {
    const revFirst4 = sum(financials.slice(0, 4).map((f) => f.revenue));
    const revLast4 = sum(financials.slice(-4).map((f) => f.revenue));
    const profitFirst4 = sum(financials.slice(0, 4).map((f) => f.profit));
    const profitLast4 = sum(financials.slice(-4).map((f) => f.profit));

    if (revFirst4 > 0 && revLast4 > 0) {
      empty.revenueGrowth3Y = (Math.pow(revLast4 / revFirst4, 1 / 3) - 1) * 100;
    }
    if (profitFirst4 !== 0 && profitLast4 !== 0) {
      empty.profitGrowth3Y = (Math.pow(Math.abs(profitLast4) / Math.abs(profitFirst4), 1 / 3) - 1) * 100;
    }
  }

  return empty;
}

function formatGrowth(value: number | null | undefined): string {
  if (value === null || value === undefined || Number.isNaN(value)) return "-";
  const sign = value >= 0 ? "+" : "";
  return `${sign}${value.toFixed(0)}%`;
}

async function tryQuote(symbol: string): Promise<{ symbol: string; quote: any } | null> {
  try {
    const quote = await yahooFinance.quote(symbol);
    if (!quote || (!quote.symbol && quote.regularMarketPrice == null)) return null;
    return { symbol: quote.symbol || symbol, quote };
  } catch {
    return null;
  }
}

async function resolveTicker(input: string): Promise<{ symbol: string; quote: any }> {
  const trimmed = input.trim();
  if (!trimmed) throw new Error("Ticker is required");

  // Direct ticker (e.g. NVDA, ETERNAL.NS)
  const direct = await tryQuote(trimmed.toUpperCase());
  if (direct) return direct;

  const directOriginal = await tryQuote(trimmed);
  if (directOriginal) return directOriginal;

  // Known aliases (e.g. zomato → ETERNAL.NS)
  for (const alias of resolveStockAliases(trimmed)) {
    const resolved = await tryQuote(alias);
    if (resolved) return resolved;
  }

  const searchNames = searchTermsFromInput(trimmed);

  // Yahoo symbol search (try deslugified name and original input)
  for (const searchName of searchNames) {
    try {
      const searchRes = (await yahooFinance.search(searchName)) as {
        quotes?: Array<{ symbol: string; quoteType?: string }>;
      };

      const equityQuote = searchRes.quotes?.find(
        (q) => q.symbol && (!q.quoteType || q.quoteType === "EQUITY")
      );
      if (equityQuote?.symbol) {
        const resolved = await tryQuote(equityQuote.symbol);
        if (resolved) return resolved;
      }
    } catch (e) {
      console.warn(`Yahoo search failed for "${searchName}":`, e);
    }
  }

  // Indian exchange suffixes for each search term
  for (const searchName of searchNames) {
    for (const candidate of indianTickerCandidates(searchName)) {
      const resolved = await tryQuote(candidate);
      if (resolved) return resolved;
    }
  }

  // Compact slug as ticker (pc-jeweller-ltd → PCJEWELLER)
  const compact = trimmed.replace(/-/g, "").toUpperCase();
  const compactResolved = await tryQuote(compact);
  if (compactResolved) return compactResolved;

  for (const candidate of indianTickerCandidates(compact)) {
    const resolved = await tryQuote(candidate);
    if (resolved) return resolved;
  }

  throw new TickerNotFoundError(input);
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const input = searchParams.get("ticker") || searchParams.get("slug");
  const range = searchParams.get("range") || "1mo";

  if (!input || input === "N/A") {
    return NextResponse.json({ error: "Ticker is required" }, { status: 400 });
  }

  try {
    const { symbol: ticker, quote } = await resolveTicker(input);

    const now = new Date();
    let period1Date = new Date();
    let interval: "1m" | "5m" | "15m" | "1d" | "1wk" = "1d";

    switch (range) {
      case "1d":
        period1Date.setDate(now.getDate() - 1);
        interval = "5m";
        break;
      case "1w":
        period1Date.setDate(now.getDate() - 7);
        interval = "15m";
        break;
      case "1m":
      case "1mo":
        period1Date.setMonth(now.getMonth() - 1);
        interval = "1d";
        break;
      case "3m":
        period1Date.setMonth(now.getMonth() - 3);
        interval = "1d";
        break;
      case "6mo":
        period1Date.setMonth(now.getMonth() - 6);
        interval = "1d";
        break;
      case "1y":
        period1Date.setFullYear(now.getFullYear() - 1);
        interval = "1d";
        break;
      case "3y":
        period1Date.setFullYear(now.getFullYear() - 3);
        interval = "1wk";
        break;
      case "5y":
        period1Date.setFullYear(now.getFullYear() - 5);
        interval = "1wk";
        break;
      case "all":
        period1Date = new Date("2000-01-01");
        interval = "1wk";
        break;
      default:
        period1Date.setMonth(now.getMonth() - 1);
        interval = "1d";
    }

    let chart: { quotes?: Array<{ date: Date; close: number | null }> } | null = null;
    try {
      chart = (await yahooFinance.chart(ticker, {
        period1: period1Date.toISOString().split("T")[0],
        interval: interval as "1m" | "5m" | "15m" | "1d" | "1wk",
      })) as { quotes?: Array<{ date: Date; close: number | null }> };
    } catch (e) {
      console.warn("Chart fetch error", e);
    }

    const chartData =
      chart?.quotes
        ?.filter((q) => q.close !== null)
        .map((q) => ({
          date: q.date.toISOString(),
          price: q.close as number,
        })) ?? [];

    let financials: Array<{ endDate: string; revenue: number; profit: number }> = [];
    let recommendation = "hold";
    let dataFundamentals: Record<string, number | string> = {};

    try {
      const summary = (await yahooFinance.quoteSummary(ticker, {
        modules: [
          "incomeStatementHistoryQuarterly",
          "recommendationTrend",
          "summaryDetail",
          "defaultKeyStatistics",
          "financialData",
        ],
      })) as {
        incomeStatementHistoryQuarterly?: {
          incomeStatementHistory?: Array<{
            endDate: Date | string;
            totalRevenue?: number;
            netIncome?: number;
          }>;
        };
        recommendationTrend?: {
          trend?: Array<{
            strongBuy: number;
            buy: number;
            hold: number;
            sell: number;
            strongSell: number;
          }>;
        };
        summaryDetail?: Record<string, number | undefined>;
        defaultKeyStatistics?: Record<string, number | undefined>;
        financialData?: Record<string, number | undefined>;
      };

      if (summary.incomeStatementHistoryQuarterly?.incomeStatementHistory) {
        const quarters = summary.incomeStatementHistoryQuarterly.incomeStatementHistory.slice(0, 12);
        financials = quarters
          .map((q) => ({
            endDate:
              q.endDate instanceof Date
                ? q.endDate.toISOString().split("T")[0]
                : String(q.endDate),
            revenue: q.totalRevenue || 0,
            profit: q.netIncome || 0,
          }))
          .reverse();
      }

      if (summary.recommendationTrend?.trend?.[0]) {
        const trend = summary.recommendationTrend.trend[0];
        const counts: Record<string, number> = {
          "Strong Buy": trend.strongBuy,
          Buy: trend.buy,
          Hold: trend.hold,
          Sell: trend.sell,
          "Strong Sell": trend.strongSell,
        };
        recommendation = Object.keys(counts).reduce((a, b) =>
          counts[a] > counts[b] ? a : b
        );
      }

      const sd = summary.summaryDetail || {};
      const dks = summary.defaultKeyStatistics || {};
      const fd = summary.financialData || {};
      const marketCap = sd.marketCap || quote.marketCap || 0;

      dataFundamentals = {
        marketCap,
        peRatioTTM: sd.trailingPE || dks.trailingPE || quote.trailingPE || 0,
        pbRatio: dks.priceToBook || 0,
        industryPE: 0,
        debtToEquity: fd.debtToEquity || 0,
        roe: fd.returnOnEquity || 0,
        epsTTM: dks.trailingEps || 0,
        dividendYield: sd.dividendYield || 0,
        bookValue: dks.bookValue || 0,
        faceValue: 1,
      };
    } catch (e) {
      console.warn("Could not fetch extended summary data", e);
    }

    const growthStats = computeGrowthStats(financials);

    let similarStocks: Array<{
      symbol: string;
      name: string;
      price?: number;
      change?: number;
      changePercent?: number;
      marketCap?: number;
    }> = [];

    try {
      const recs = (await yahooFinance.recommendationsBySymbol(ticker)) as any;
      if (recs?.recommendedSymbols?.length) {
        const peerSymbols = recs.recommendedSymbols.slice(0, 4).map((s: { symbol: string }) => s.symbol);
        if (peerSymbols.length > 0) {
          const peerQuotes = await yahooFinance.quote(peerSymbols);
          similarStocks = (Array.isArray(peerQuotes) ? peerQuotes : [peerQuotes]).map((pq: any) => ({
            symbol: pq.symbol,
            name: pq.shortName || pq.longName || pq.symbol,
            price: pq.regularMarketPrice,
            change: pq.regularMarketChange,
            changePercent: pq.regularMarketChangePercent,
            marketCap: pq.marketCap,
          }));
        }
      }
    } catch (e) {
      console.warn("Could not fetch similar stocks", e);
    }

    return NextResponse.json({
      resolvedTicker: ticker,
      quote: {
        symbol: quote.symbol || ticker,
        exchange: quote.fullExchangeName || quote.exchange || "",
        name: quote.shortName || quote.longName || ticker,
        price: quote.regularMarketPrice,
        change: quote.regularMarketChange,
        changePercent: quote.regularMarketChangePercent,
        open: quote.regularMarketOpen,
        previousClose: quote.regularMarketPreviousClose,
        volume: quote.regularMarketVolume,
        dayLow: quote.regularMarketDayLow,
        dayHigh: quote.regularMarketDayHigh,
        yearLow: quote.fiftyTwoWeekLow,
        yearHigh: quote.fiftyTwoWeekHigh,
      },
      chartData,
      financials,
      growthStats: {
        revenueGrowth1Y: formatGrowth(growthStats.revenueGrowth1Y),
        revenueGrowth3Y: formatGrowth(growthStats.revenueGrowth3Y),
        profitGrowth1Y: formatGrowth(growthStats.profitGrowth1Y),
        profitGrowth3Y: formatGrowth(growthStats.profitGrowth3Y),
      },
      fundamentals: dataFundamentals,
      recommendation,
      similarStocks,
    });
  } catch (error: unknown) {
    if (error instanceof TickerNotFoundError) {
      console.warn("Ticker not found:", input, error.message);
      return NextResponse.json({ error: error.message }, { status: 404 });
    }

    console.error("Error fetching stock data:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    const status = message === "Ticker is required" ? 400 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
