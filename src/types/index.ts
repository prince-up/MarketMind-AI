// ─── Core Types ────────────────────────────────────────────────────────────────

export interface FinancialSummary {
  ticker: string;
  revenueGrowth: string;
  peRatio: string;
  marketCap: string;
  cashFlow: string;
  debt: string;
  profitability: string;
  score: number;       // 0-100, higher = healthier
  rawText: string;     // original yahoo finance dump
  sources: string[];
}

export interface NewsSentiment {
  sentiment: "positive" | "negative" | "neutral";
  sentimentScore: number; // 0-100
  positives: string[];
  negatives: string[];
  keyEvents: string[];
  investmentImpact: string;
  sources: string[];
}

export interface CompetitorEntry {
  name: string;
  assessment: string;
  marketPosition?: string;
  strengths?: string[];
  weaknesses?: string[];
  aiLeadership?: string;
  pricing?: string;
  growth?: string;
}

export interface CompetitorAnalysis {
  marketPosition: string;
  strengths: string[];
  weaknesses: string[];
  competitors: CompetitorEntry[];
  score: number; // 0-100, higher = stronger competitive position
  sources: string[];
}

export interface RiskFactor {
  category: string;
  severity: "Low" | "Medium" | "High";
  explanation: string;
}

export interface RiskAnalysis {
  riskScore: number;  // 0-100, higher = MORE risky (inverted in confidence formula)
  level: "Low" | "Medium" | "High" | "Very High";
  risks: RiskFactor[];
  sources: string[];
}

export interface ValuationAnalysis {
  valuation: "Undervalued" | "Fairly Valued" | "Overvalued";
  score: number;   // 0-100, higher = more attractive valuation
  positives: string[];
  negatives: string[];
  sources: string[];
}

export interface ResearchResult {
  companyName: string;
  verdict: "BUY" | "HOLD" | "PASS";
  confidence: number;      // deterministically calculated, 0-100
  reasoning: string[];
  positives: string[];
  negatives: string[];
  summary: string;
  financial: FinancialSummary;
  news: NewsSentiment;
  competitors: CompetitorAnalysis;
  risks: RiskAnalysis;
  valuation: ValuationAnalysis;
}
