"use client";

import React, { useEffect, useState } from "react";
import { Loader2, ChevronRight, Calendar, Bell, Bookmark, BarChart3, AlertCircle, RefreshCw } from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface StockDashboardProps {
  ticker: string;
  onRunResearch?: (companyName: string) => void;
  onCompanyResolved?: (companyName: string) => void;
  researchState?: "idle" | "loading" | "result";
  aiResearchSection?: React.ReactNode;
}

const formatNumber = (num: number, isCurrency = false) => {
  if (num === null || num === undefined) return "-";
  if (num >= 1e12) return (isCurrency ? "₹" : "") + (num / 1e12).toFixed(2) + "T";
  if (num >= 1e9) return (isCurrency ? "₹" : "") + (num / 1e9).toFixed(2) + "B";
  if (num >= 1e7) return (isCurrency ? "₹" : "") + (num / 1e7).toFixed(2) + "Cr";
  if (num >= 1e5) return (isCurrency ? "₹" : "") + (num / 1e5).toFixed(2) + "L";
  return (isCurrency ? "₹" : "") + num.toLocaleString();
};

export default function StockDashboard({
  ticker,
  onRunResearch,
  onCompanyResolved,
  researchState = "idle",
  aiResearchSection,
}: StockDashboardProps) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [range, setRange] = useState("1y");
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let active = true;
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/stock?ticker=${encodeURIComponent(ticker)}&range=${range}`);
        const json = await res.json();
        if (!res.ok) {
          throw new Error(json.error || `Failed to load stock data (${res.status})`);
        }
        if (json.error) {
          throw new Error(json.error);
        }
        if (active) {
          setData(json);
          setLoading(false);
          const name = json.quote?.name;
          if (name && onCompanyResolved) onCompanyResolved(name);
        }
      } catch (e) {
        console.error(e);
        if (active) {
          setData(null);
          setError(e instanceof Error ? e.message : "Could not load stock data");
          setLoading(false);
        }
      }
    };
    fetchData();
    return () => { active = false; };
  }, [ticker, range, onCompanyResolved, retryCount]);

  if (loading && !data) {
    return (
      <div className="w-full h-96 bg-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#00b386] animate-spin" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="w-full min-h-96 bg-white flex flex-col items-center justify-center px-6 py-16 text-center">
        <AlertCircle className="w-12 h-12 text-[#eb5b3c] mb-4" />
        <h2 className="text-xl font-semibold text-[#44475b] mb-2">
          Could not load stock data
        </h2>
        <p className="text-[#7c7e8c] text-sm max-w-md mb-6">
          {error || `We couldn't find market data for "${ticker}". The ticker may be invalid or temporarily unavailable.`}
        </p>
        <button
          type="button"
          onClick={() => setRetryCount((c) => c + 1)}
          className="inline-flex items-center gap-2 bg-[#00b386] hover:bg-[#00926d] text-white font-medium px-5 py-2.5 rounded-lg transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Try again
        </button>
      </div>
    );
  }

  const { quote, chartData, financials, fundamentals, similarStocks, recommendation, growthStats } = data;
  const revenue1Y = growthStats?.revenueGrowth1Y ?? "-";
  const revenue3Y = growthStats?.revenueGrowth3Y ?? "-";
  const profit1Y = growthStats?.profitGrowth1Y ?? "-";
  const profit3Y = growthStats?.profitGrowth3Y ?? "-";

  const growthColor = (val: string) =>
    val.startsWith("+") ? "text-[#00b386]" : val.startsWith("-") && val !== "-" ? "text-[#eb5b3c]" : "text-[#44475b]";
  const isPositive = quote?.change >= 0;
  const strokeColor = isPositive ? "#00b386" : "#eb5b3c";

  const CustomTooltipLine = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-transparent text-sm text-neutral-800 z-50 flex flex-col items-center">
          <p className="text-xs text-neutral-500 font-medium">
            ₹{payload[0].value.toFixed(2)} | {new Date(label).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
          </p>
          <div className="w-3 h-3 bg-white border-[3px] border-neutral-300 rounded-full mt-1" />
        </div>
      );
    }
    return null;
  };

  const CustomTooltipBar = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-neutral-200 p-3 shadow-lg z-50 rounded-lg">
          <p className="text-neutral-500 text-xs mb-2 font-semibold uppercase">{label}</p>
          {payload.map((p: any, i: number) => (
            <div key={i} className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: p.color }} />
              <p className="text-xs font-semibold text-neutral-600 uppercase">
                {p.name}: <span className="text-neutral-900 ml-1">₹{(p.value / 1e7).toFixed(0)}</span>
              </p>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  // Recommendations logic (Analyst Meter)
  const getRecommendationIndex = (rec: string) => {
    if (!rec) return 2;
    const r = rec.toLowerCase();
    if (r.includes("strong buy")) return 4;
    if (r.includes("buy")) return 3;
    if (r.includes("hold")) return 2;
    if (r.includes("sell") && !r.includes("strong")) return 1;
    if (r.includes("strong sell")) return 0;
    return 2;
  };
  const recIndex = getRecommendationIndex(recommendation);
  const recColors = ["#eb5b3c", "#f97316", "#eab308", "#00b386", "#00b386"];
  const recLabels = ["Strong Sell", "Sell", "Hold", "Buy", "Strong Buy"];

  // Range Math
  const dayLow = quote.dayLow || 0;
  const dayHigh = quote.dayHigh || 0;
  const dayRange = dayHigh - dayLow;
  const dayPct = dayRange === 0 ? 50 : ((quote.price - dayLow) / dayRange) * 100;

  const yearLow = quote.yearLow || 0;
  const yearHigh = quote.yearHigh || 0;
  const yearRange = yearHigh - yearLow;
  const yearPct = yearRange === 0 ? 50 : ((quote.price - yearLow) / yearRange) * 100;

  return (
    <section className="w-full bg-white text-neutral-900 font-sans mt-2">
      
      {/* TWO COLUMN LAYOUT: LEFT = CHART, RIGHT = BUY BOX */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-12">
        
        {/* LEFT COLUMN (Spans 8) */}
        <div className="lg:col-span-8">
          
          {/* HEADER */}
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-11 h-11 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-center text-[#00b386] font-bold">
                  {quote.symbol?.slice(0, 2) || quote.name?.slice(0, 2)}
                </div>
                <div>
                  <h1 className="text-[25px] font-semibold text-[#44475b]">{quote.name}</h1>
                  <p className="text-xs text-[#7c7e8c]">{quote.symbol} · {quote.exchange || "Market"}</p>
                </div>
              </div>
            <div className="flex items-baseline gap-2">
              <span className="text-[28px] font-medium text-[#44475b]">
                ₹{quote.price?.toFixed(2)}
              </span>
            </div>
            <div className={`flex items-center text-sm font-medium mt-1 ${isPositive ? 'text-[#00b386]' : 'text-[#eb5b3c]'}`}>
              {isPositive ? '+' : '-'}₹{Math.abs(quote.change)?.toFixed(2)} ({isPositive ? '+' : '-'}{Math.abs(quote.changePercent)?.toFixed(2)}%)
              <span className="text-[#7c7e8c] font-normal ml-2">1D</span>
            </div>
            </div>
            <div className="flex items-center gap-2">
              <button title="Create alert" className="w-10 h-10 border border-slate-200 rounded-lg flex items-center justify-center text-slate-500 hover:text-[#00b386] hover:border-[#00b386]">
                <Bell className="w-4 h-4" />
              </button>
              <button title="Add to watchlist" className="w-10 h-10 border border-slate-200 rounded-lg flex items-center justify-center text-slate-500 hover:text-[#00b386] hover:border-[#00b386]">
                <Bookmark className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* MAIN CHART */}
          <div className="h-[320px] md:h-[360px] w-full relative">
            {loading ? (
               <div className="w-full h-full flex items-center justify-center">
                 <Loader2 className="w-6 h-6 text-[#00b386] animate-spin" />
               </div>
            ) : chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 20, right: 0, left: 0, bottom: 0 }}>
                  <Tooltip 
                    content={<CustomTooltipLine />} 
                    cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '4 4' }} 
                    position={{ y: -20 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="price" 
                    stroke={strokeColor} 
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 0 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[#7c7e8c] text-sm">
                Chart data unavailable
              </div>
            )}
          </div>

          {/* BOTTOM CHART BORDER */}
          <div className="w-full h-[1px] bg-neutral-200 border-b border-dashed border-neutral-300 mb-6"></div>

          {/* TIME RANGE TOGGLES */}
          <div className="flex items-center gap-2 overflow-x-auto text-sm pb-6 border-b border-neutral-100">
            {[
              { id: '1d', label: '1D' },
              { id: '1w', label: '1W' },
              { id: '1m', label: '1M' },
              { id: '3m', label: '3M' },
              { id: '6m', label: '6M' },
              { id: '1y', label: '1Y' },
              { id: '3y', label: '3Y' },
              { id: '5y', label: '5Y' },
              { id: 'all', label: 'All' },
            ].map((r) => (
              <button
                key={r.id}
                onClick={() => setRange(r.id)}
                className={`min-w-11 rounded-full border px-3 py-1.5 font-medium transition-colors ${
                  range === r.id ? 'border-[#44475b] text-[#44475b] bg-slate-50' : 'border-transparent text-[#7c7e8c] hover:bg-slate-50 hover:text-[#44475b]'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>

          {/* SIP WIDGET */}
          <div className="mt-7 mb-10 flex items-center justify-between border border-neutral-200 rounded-lg p-4 cursor-pointer hover:border-neutral-300 hover:bg-slate-50/60 transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-600">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-[#44475b] text-base">Create Stock SIP</h3>
                <p className="text-sm text-[#7c7e8c]">Automate your investments in this Stock</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-neutral-400" />
          </div>

          <nav className="sticky top-[72px] z-20 bg-white border-b border-slate-200 flex gap-8 overflow-x-auto mb-10">
            {[
              ["overview", "Overview"],
              ["fundamentals", "Fundamentals"],
              ["financials", "Financials"],
              ["peers", "Peers"],
              ["ai-research", "AI Research"],
            ].map(([href, label], index) => (
              <a
                key={href}
                href={`#${href}`}
                className={`py-4 text-sm font-medium whitespace-nowrap border-b-2 ${
                  index === 0
                    ? "text-[#00b386] border-[#00b386]"
                    : "text-[#44475b] border-transparent hover:text-[#00b386]"
                }`}
              >
                {label}
              </a>
            ))}
          </nav>

          {/* PERFORMANCE / ANALYST ROW */}
          <div id="overview" className="scroll-mt-36" />
          <h2 className="text-[20px] font-semibold text-[#44475b] mb-6">Performance</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 mb-12">
            
            {/* Today's Low / High */}
            <div>
              <div className="flex justify-between items-center text-sm font-medium text-[#44475b] mb-4">
                <span>Today&apos;s Low</span>
                <span>Today&apos;s High</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-[#44475b]">₹{dayLow?.toFixed(2)}</span>
                <div className="flex-1 h-1.5 bg-neutral-200 rounded-full relative overflow-visible">
                  <div className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white shadow-md border-2 border-[#44475b] rounded-full z-10" style={{ left: `clamp(0%, ${dayPct}%, 100%)`, transform: `translate(-50%, -50%)` }} />
                  <div className="absolute inset-y-0 left-0 bg-[#00b386]" style={{ width: `clamp(0%, ${dayPct}%, 100%)` }} />
                </div>
                <span className="text-sm font-medium text-[#44475b]">₹{dayHigh?.toFixed(2)}</span>
              </div>
            </div>

            {/* 52W Low / High */}
            <div>
              <div className="flex justify-between items-center text-sm font-medium text-[#44475b] mb-4">
                <span>52W Low</span>
                <span>52W High</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-[#44475b]">₹{yearLow?.toFixed(2)}</span>
                <div className="flex-1 h-1.5 bg-neutral-200 rounded-full relative overflow-visible">
                  <div className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white shadow-md border-2 border-[#44475b] rounded-full z-10" style={{ left: `clamp(0%, ${yearPct}%, 100%)`, transform: `translate(-50%, -50%)` }} />
                  <div className="absolute inset-y-0 left-0 bg-[#00b386]" style={{ width: `clamp(0%, ${yearPct}%, 100%)` }} />
                </div>
                <span className="text-sm font-medium text-[#44475b]">₹{yearHigh?.toFixed(2)}</span>
              </div>
            </div>

          </div>

          {/* FUNDAMENTALS */}
          {fundamentals && (
            <div id="fundamentals" className="mb-12 scroll-mt-36">
              <h2 className="text-[20px] font-semibold text-[#44475b] mb-6">Fundamentals</h2>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-y-8 gap-x-4">
                {[
                  { label: "Market Cap", value: formatNumber(fundamentals.marketCap, true) },
                  { label: "P/E Ratio(TTM)", value: fundamentals.peRatioTTM?.toFixed(2) || "-" },
                  { label: "P/B Ratio", value: fundamentals.pbRatio?.toFixed(2) || "-" },
                  { label: "Industry P/E", value: fundamentals.industryPE || "-" },
                  { label: "Debt to Equity", value: fundamentals.debtToEquity?.toFixed(2) || "-" },
                  { label: "ROE", value: `${(fundamentals.roe * 100).toFixed(2)}%` },
                  { label: "EPS(TTM)", value: fundamentals.epsTTM?.toFixed(2) || "-" },
                  { label: "Dividend Yield", value: `${(fundamentals.dividendYield * 100).toFixed(2)}%` },
                  { label: "Book Value", value: fundamentals.bookValue?.toFixed(2) || "-" },
                  { label: "Face Value", value: fundamentals.faceValue || "-" },
                ].map((f, i) => (
                  <div key={i} className="flex flex-col">
                    <span className="text-[13px] text-[#7c7e8c] mb-1">{f.label}</span>
                    <span className="text-[15px] font-medium text-[#44475b]">{f.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* FINANCIAL PERFORMANCE */}
          {financials && financials.length > 0 && (
            <div id="financials" className="mb-12 scroll-mt-36">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-[20px] font-semibold text-[#44475b]">Financial performance</h2>
                <button className="text-[13px] font-medium text-[#00b386] hover:text-[#00926d]">All Financials &gt;</button>
              </div>
              <div className="flex gap-3 mb-8">
                <button className="px-5 py-2 text-[13px] font-medium border border-neutral-300 rounded-full text-[#44475b]">Quarterly</button>
                <button className="px-5 py-2 text-[13px] font-medium text-[#7c7e8c] hover:text-[#44475b]">Yearly</button>
              </div>
              
              <div className="h-[250px] w-full mb-8">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={financials} margin={{ top: 20, right: 0, left: -25, bottom: 0 }}>
                    <XAxis 
                      dataKey="endDate" 
                      axisLine={{ stroke: '#e2e8f0', strokeDasharray: '3 3' }}
                      tickLine={false}
                      tick={{ fill: '#7c7e8c', fontSize: 11 }}
                      tickFormatter={(val) => {
                        const d = new Date(val);
                        return `${d.toLocaleString('default', { month: 'short' })} '${d.getFullYear().toString().slice(2)}`;
                      }}
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#7c7e8c', fontSize: 11 }}
                      tickFormatter={(val) => `${(val / 1e7).toFixed(0)}k`} 
                    />
                    <Tooltip content={<CustomTooltipBar />} cursor={{ fill: '#f8fafc' }} />
                    <Bar dataKey="revenue" name="Revenue (CR)" fill="#94a3b8" radius={[2, 2, 0, 0]} barSize={14} />
                    <Bar dataKey="profit" name="Profit (CR)" fill="#00b386" radius={[2, 2, 0, 0]} barSize={14} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* GROWTH STATS UNDER CHART */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-6 border-t border-dashed border-neutral-200">
                <div className="flex flex-col">
                  <span className="text-[11px] text-[#7c7e8c] font-semibold tracking-wider mb-3">REVENUE GROWTH</span>
                  <div className="flex justify-between items-center text-[13px] font-medium text-[#44475b] mb-2">
                    <span>1Y (TTM)</span>
                    <span className={growthColor(revenue1Y)}>{revenue1Y}</span>
                  </div>
                  <div className="flex justify-between items-center text-[13px] font-medium text-[#44475b]">
                    <span>3Y CAGR</span>
                    <span className={growthColor(revenue3Y)}>{revenue3Y}</span>
                  </div>
                </div>
                <div className="hidden md:block"></div>
                <div className="flex flex-col">
                  <span className="text-[11px] text-[#7c7e8c] font-semibold tracking-wider mb-3">PROFIT GROWTH</span>
                  <div className="flex justify-between items-center text-[13px] font-medium text-[#44475b] mb-2">
                    <span>1Y (TTM)</span>
                    <span className={growthColor(profit1Y)}>{profit1Y}</span>
                  </div>
                  <div className="flex justify-between items-center text-[13px] font-medium text-[#44475b]">
                    <span>3Y CAGR</span>
                    <span className={growthColor(profit3Y)}>{profit3Y}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SIMILAR STOCKS */}
          {similarStocks && similarStocks.length > 0 && (
            <div id="peers" className="mb-12 scroll-mt-36">
              <h2 className="text-[20px] font-semibold text-[#44475b] mb-6">Similar stocks</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="text-[13px] text-[#7c7e8c] font-medium border-b border-neutral-100">
                    <tr>
                      <th className="pb-3 font-normal w-1/3">Stock</th>
                      <th className="pb-3 text-right font-normal pr-8">Mkt price (1D)</th>
                      <th className="pb-3 font-normal text-center w-32">52 week performance</th>
                      <th className="pb-3 text-right font-normal">Market cap</th>
                    </tr>
                  </thead>
                  <tbody>
                    {similarStocks.map((peer: any, i: number) => {
                      const pIsPos = peer.change >= 0;
                      const dummySliderPct = 24 + ((i * 17) % 55);
                      
                      return (
                        <tr key={i} className="border-b border-neutral-100/50 hover:bg-neutral-50/50 cursor-pointer transition-colors">
                          <td className="py-5 flex items-center gap-3">
                            <div className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center font-bold text-slate-400 text-xs shrink-0">
                              {peer.symbol.slice(0, 2)}
                            </div>
                            <div className="flex flex-col">
                              <span className="font-medium text-[#44475b] hover:text-[#00b386] truncate max-w-[200px]">{peer.name}</span>
                              <span className="text-[11px] text-[#7c7e8c] mt-0.5">{peer.symbol}</span>
                            </div>
                          </td>
                          <td className="py-5 text-right pr-8">
                            <p className="font-medium text-[#44475b]">₹{peer.price?.toFixed(2)}</p>
                            <p className={`text-xs mt-1 ${pIsPos ? 'text-[#00b386]' : 'text-[#eb5b3c]'}`}>
                              {pIsPos ? '+' : ''}₹{peer.change?.toFixed(2)} ({pIsPos ? '+' : ''}{peer.changePercent?.toFixed(2)}%)
                            </p>
                          </td>
                          <td className="py-5">
                            <div className="flex items-center justify-center gap-2">
                              <span className="text-[10px] text-neutral-400">L</span>
                              <div className="w-16 h-[2px] bg-neutral-200 relative">
                                <div className="absolute top-1/2 -translate-y-1/2 w-1.5 h-3 bg-neutral-700 rounded-sm" style={{ left: `${dummySliderPct}%` }} />
                              </div>
                              <span className="text-[10px] text-neutral-400">H</span>
                            </div>
                          </td>
                          <td className="py-5 text-right font-medium text-[#44475b]">
                            {formatNumber(peer.marketCap, true)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* AI RESEARCH SECTION */}
          {aiResearchSection && (
            <div className="mb-12">
              <h2 className="text-[20px] font-semibold text-[#44475b] mb-6">AI Research</h2>
              {aiResearchSection}
            </div>
          )}

        </div>

        {/* RIGHT COLUMN (Spans 4) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* GROWW "WANT TO INVEST" BOX */}
          <div className="border border-neutral-200 rounded-lg p-7 flex flex-col items-center text-center sticky top-24">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-[#00b386] flex items-center justify-center mb-5">
              <BarChart3 className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold text-[#44475b] mb-3">Research this stock deeper</h3>
            <p className="text-[#7c7e8c] text-[15px] mb-8 leading-relaxed">
              Review the AI verdict, financial health, valuation, news sentiment, competitors, and risks.
            </p>
            {researchState === "result" ? (
              <a
                href="#ai-research"
                className="w-full bg-[#00b386] hover:bg-[#00926d] text-white font-semibold py-3 rounded-lg text-base transition-colors block text-center"
              >
                View AI research
              </a>
            ) : (
              <button
                type="button"
                onClick={() => onRunResearch?.(quote.name || ticker)}
                disabled={researchState === "loading"}
                className="w-full bg-[#00b386] hover:bg-[#00926d] disabled:opacity-60 text-white font-semibold py-3 rounded-lg text-base transition-colors"
              >
                {researchState === "loading" ? "Running research…" : "Run AI Research"}
              </button>
            )}
          </div>

          {/* ANALYST CONSENSUS GAUGE (Placed subtly below so user still gets their data request) */}
          <div className="border border-neutral-200 bg-slate-50/60 rounded-lg p-6">
            <h3 className="font-medium text-[#44475b] text-[15px] mb-6">Analyst Consensus</h3>
            
            <div className="flex flex-col items-center">
              <div className="relative w-40 h-20 mb-3">
                <div className="absolute inset-0 overflow-hidden rounded-t-full">
                  <div className="absolute top-0 left-0 w-40 h-40 rounded-full border-[12px] border-slate-200" />
                  <div className="absolute top-0 left-0 w-40 h-40 rounded-full border-[12px] border-transparent border-t-rose-400 border-l-rose-400 rotate-[-45deg] opacity-40" />
                  <div className="absolute top-0 left-0 w-40 h-40 rounded-full border-[12px] border-transparent border-t-amber-400 rotate-[0deg] opacity-40" />
                  <div className="absolute top-0 left-0 w-40 h-40 rounded-full border-[12px] border-transparent border-t-emerald-400 border-r-emerald-400 rotate-[45deg] opacity-40" />
                  <div 
                    className="absolute top-0 left-0 w-40 h-40 rounded-full border-[12px] border-transparent transition-all duration-1000"
                    style={{ borderColor: `${recColors[recIndex]} ${recColors[recIndex]} transparent transparent`, transform: `rotate(${ -135 + (recIndex * 36) }deg)` }}
                  />
                </div>
                <div 
                  className="absolute bottom-0 left-1/2 w-0.5 h-16 bg-[#44475b] rounded-t-full origin-bottom transition-transform duration-1000 z-10"
                  style={{ transform: `translateX(-50%) rotate(${ -90 + (recIndex * 45) }deg)` }}
                >
                  <div className="absolute -bottom-1 -left-1 w-2.5 h-2.5 bg-[#44475b] rounded-full" />
                </div>
              </div>
              
              <div className="text-base font-bold tracking-tight" style={{ color: recColors[recIndex] }}>
                {recLabels[recIndex].toUpperCase()}
              </div>
            </div>
          </div>

        </div>

      </div>

    </section>
  );
}
