import { z } from "zod";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import type { BullAnalysis } from "@/types";
import { buildResearchContext, coerceNumber, getLLM, unionScoreSchema, type ResearchStateSlice } from "./shared";

export const FALLBACK_BULL: BullAnalysis = {
  recommendation: "HOLD",
  confidence: 50,
  investment_thesis: "Insufficient data to form a strong bullish thesis.",
  strongest_arguments: ["Research data was collected but bullish synthesis encountered an error."],
  supporting_metrics: ["Financial health score available for manual review."],
  conclusion: "Bull case could not be fully synthesized. Review individual analysis sections.",
};

const bullSchema = z.object({
  recommendation: z
    .enum(["BUY", "HOLD", "PASS"])
    .describe("Bullish analyst recommendation based on growth and opportunity"),
  confidence: unionScoreSchema("Bullish conviction score 0-100. Higher = stronger bull case."),
  investment_thesis: z
    .string()
    .describe("2-3 sentence bullish investment thesis emphasizing growth and opportunity"),
  strongest_arguments: z
    .array(z.string())
    .describe("3-5 strongest bullish arguments with specific evidence from the research"),
  supporting_metrics: z
    .array(z.string())
    .describe("3-5 supporting financial metrics or data points backing the bull case"),
  conclusion: z.string().describe("1-2 sentence bullish conclusion for the investment committee"),
});

export async function runBullAgent(state: ResearchStateSlice): Promise<BullAnalysis> {
  console.log(`[bull_agent] Building bullish case for: "${state.companyName}"`);
  try {
    const context = buildResearchContext(state);
    const llm = getLLM().withStructuredOutput(bullSchema);
    const result = await llm.invoke([
      new SystemMessage(
        `You are a professional bullish equity analyst at a top-tier investment bank. Your job is to build the strongest possible BULL CASE for investing in this company.

Focus exclusively on positives:
- Revenue growth and earnings momentum
- Cash flow strength and balance sheet health
- Competitive moat and market position
- AI/technology leadership and innovation
- Positive news catalysts and market expansion
- Future growth opportunities and strategic strengths

Be persuasive but evidence-based. Only cite data present in the research context. Do NOT invent figures.
Return structured JSON. All numeric fields MUST be plain numbers.`
      ),
      new HumanMessage(
        `Build the strongest bullish investment case for ${state.companyName}.\n\nResearch Context:\n${context}`
      ),
    ]);

    const confidence = coerceNumber(result.confidence, 50);
    console.log(`[bull_agent] OK. Recommendation=${result.recommendation} Confidence=${confidence}`);
    return { ...result, confidence };
  } catch (err) {
    console.error("[bull_agent] Error:", err);
    return FALLBACK_BULL;
  }
}
