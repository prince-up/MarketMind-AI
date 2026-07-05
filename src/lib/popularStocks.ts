export interface PopularStock {
  name: string;
  ticker: string;
  price: number;
  change: number;
  changePercent: number;
  exchange?: string;
}

export const POPULAR_STOCKS: PopularStock[] = [
  { name: "Tesla", ticker: "TSLA", price: 248.42, change: 3.18, changePercent: 1.30, exchange: "NASDAQ" },
  { name: "NVIDIA", ticker: "NVDA", price: 875.28, change: -12.45, changePercent: -1.40, exchange: "NASDAQ" },
  { name: "Apple", ticker: "AAPL", price: 189.84, change: 1.22, changePercent: 0.65, exchange: "NASDAQ" },
  { name: "Zomato", ticker: "ZOMATO", price: 268.50, change: 4.75, changePercent: 1.80, exchange: "NSE" },
  { name: "PC Jeweller", ticker: "PCJEWELLER", price: 12.85, change: -0.32, changePercent: -2.43, exchange: "NSE" },
];

export const TRENDING_STOCKS = POPULAR_STOCKS.slice(0, 4);
