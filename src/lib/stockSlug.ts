/**
 * Convert a company name to a URL slug (e.g. "PC Jeweller Ltd" → "pc-jeweller-ltd").
 */
export function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Convert a URL slug back to a searchable company name (e.g. "pc-jeweller-ltd" → "Pc Jeweller Ltd").
 */
export function deslugify(slug: string): string {
  return slug
    .split("-")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Build a stock page path from a company name or ticker.
 */
export function stockPagePath(nameOrTicker: string): string {
  return `/stocks/${slugify(nameOrTicker)}`;
}

/**
 * Known slug/name → Yahoo Finance symbol aliases (Indian renames, common names).
 */
const INDIAN_STOCK_ALIASES: Record<string, string[]> = {
  zomato: ["ETERNAL.NS", "ETERNAL.BO", "ZOMATO.NS", "ZOMATO.BO"],
  eternal: ["ETERNAL.NS", "ETERNAL.BO"],
  "tata-motors": ["TATAMOTORS.NS", "TATAMOTORS.BO"],
  tatamotors: ["TATAMOTORS.NS", "TATAMOTORS.BO"],
  "hdfc-bank": ["HDFCBANK.NS", "HDFCBANK.BO"],
  hdfcbank: ["HDFCBANK.NS", "HDFCBANK.BO"],
};

/**
 * Resolve known aliases for a slug or company name.
 */
export function resolveStockAliases(input: string): string[] {
  const normalized = input.trim().toLowerCase();
  const slugKey = normalized.replace(/[^a-z0-9-]/g, "");
  const compactKey = slugKey.replace(/-/g, "");

  const direct = INDIAN_STOCK_ALIASES[slugKey] ?? INDIAN_STOCK_ALIASES[compactKey];
  if (direct) return direct;

  return [];
}

/**
 * Candidate tickers to try for Indian stocks (NSE/BSE).
 */
export function indianTickerCandidates(name: string): string[] {
  const compact = name.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
  if (!compact) return [];
  return [`${compact}.NS`, `${compact}.BO`];
}

/**
 * Build search terms from a slug or ticker input.
 */
export function searchTermsFromInput(input: string): string[] {
  const trimmed = input.trim();
  const terms = new Set<string>();

  if (trimmed) terms.add(trimmed);
  if (trimmed.includes("-")) terms.add(deslugify(trimmed));
  else terms.add(deslugify(trimmed));

  return [...terms];
}