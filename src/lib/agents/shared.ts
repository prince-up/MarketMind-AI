import { ChatGroq } from "@langchain/groq";
import { z } from "zod";
import type {
  FinancialSummary,
  NewsSentiment,
  CompetitorAnalysis,
  RiskAnalysis,
  ValuationAnalysis,
} from "@/types";

export const getLLM = () =>
  new ChatGroq({
    model: "llama-3.3-70b-versatile",
    apiKey: process.env.GROQ_API_KEY,
    temperature: 0.1,
  });

export const unionScoreSchema = (desc: string) =>
  z.union([z.number(), z.string()]).describe(`${desc}. MUST be returned as a plain number.`);

export function coerceNumber(val: unknown, fallback = 50): number {
  if (typeof val === "number") {
    return isNaN(val) ? fallback : Math.max(0, Math.min(100, Math.round(val)));
  }
  if (typeof val === "string") {
    const parsed = parseFloat(val);
    return isNaN(parsed) ? fallback : Math.max(0, Math.min(100, Math.round(parsed)));
  }
  return fallback;
}

export interface ResearchStateSlice {
  companyName: string;
  financialData: FinancialSummary | null;
  newsData: NewsSentiment | null;
  competitorData: CompetitorAnalysis | null;
  riskData: RiskAnalysis | null;
  valuationData: ValuationAnalysis | null;
}

export function buildResearchContext(state: ResearchStateSlice): string {
  const fin = state.financialData;
  const news = state.newsData;
  const comp = state.competitorData;
  const risk = state.riskData;
  const val = state.valuationData;

  return [
    `Company: ${state.companyName}`,
    "",
    `=== FINANCIAL ANALYSIS ===`,
    fin?.rawText ?? "Not available",
    `Financial Health Score: ${fin?.score ?? 50}/100`,
    `Revenue Growth: ${fin?.revenueGrowth ?? "N/A"}`,
    `P/E Ratio: ${fin?.peRatio ?? "N/A"}`,
    `Cash Flow: ${fin?.cashFlow ?? "N/A"}`,
    `Debt: ${fin?.debt ?? "N/A"}`,
    `Profitability: ${fin?.profitability ?? "N/A"}`,
    "",
    `=== NEWS ANALYSIS ===`,
    `Sentiment: ${news?.sentiment ?? "neutral"} (${news?.sentimentScore ?? 50}/100)`,
    `Positives: ${news?.positives?.join("; ") ?? "None"}`,
    `Negatives: ${news?.negatives?.join("; ") ?? "None"}`,
    `Key Events: ${news?.keyEvents?.join("; ") ?? "None"}`,
    `Investment Impact: ${news?.investmentImpact ?? "N/A"}`,
    "",
    `=== COMPETITOR ANALYSIS ===`,
    `Market Position: ${comp?.marketPosition ?? "N/A"}`,
    `Competitive Score: ${comp?.score ?? 50}/100`,
    `Strengths: ${comp?.strengths?.join("; ") ?? "None"}`,
    `Weaknesses: ${comp?.weaknesses?.join("; ") ?? "None"}`,
    `Key Competitors: ${comp?.competitors?.map((c) => c.name).join(", ") ?? "None"}`,
    "",
    `=== RISK ANALYSIS ===`,
    `Risk Level: ${risk?.level ?? "Medium"} (score ${risk?.riskScore ?? 50}/100)`,
    `Risks: ${risk?.risks?.map((r) => `${r.category} (${r.severity}): ${r.explanation}`).join("; ") ?? "None"}`,
    "",
    `=== VALUATION ANALYSIS ===`,
    `Valuation: ${val?.valuation ?? "Fairly Valued"} (score ${val?.score ?? 50}/100)`,
    `Positives: ${val?.positives?.join("; ") ?? "None"}`,
    `Negatives: ${val?.negatives?.join("; ") ?? "None"}`,
  ].join("\n");
}
