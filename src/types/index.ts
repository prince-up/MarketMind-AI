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

export interface EarningsHistoryEntry {
  quarter: string;
  epsActual: number;
  epsEstimate: number;
  epsDifference: number;
  surprisePercent: number;
}

export interface AnalystData {
  strongBuy: number;
  buy: number;
  hold: number;
  sell: number;
  strongSell: number;
  targetMeanPrice: number;
  numberOfAnalystOpinions: number;
  recommendationKey: string;
}

export interface BullAnalysis {
  recommendation: string;
  confidence: number;
  investment_thesis: string;
  strongest_arguments: string[];
  supporting_metrics: string[];
  conclusion: string;
}

export interface BearAnalysis {
  recommendation: string;
  confidence: number;
  investment_thesis: string;
  strongest_arguments: string[];
  risks: string[];
  conclusion: string;
}

export interface JudgeAnalysis {
  finalVerdict: string;
  winner: "Bull" | "Bear" | "Balanced";
  confidence: number;
  investmentSummary: string;
  whyBullWon: string;
  whyBearWon: string;
  finalReasoning: string;
  investmentScore: number;
}

export interface DebateAnalysis {
  bull: BullAnalysis;
  bear: BearAnalysis;
  judge: JudgeAnalysis;
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
  debate?: DebateAnalysis;
  earnings?: EarningsHistoryEntry[];
  analystData?: AnalystData;
}
