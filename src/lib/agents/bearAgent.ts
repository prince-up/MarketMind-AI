import { z } from "zod";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import type { BearAnalysis } from "@/types";
import { buildResearchContext, coerceNumber, getLLM, unionScoreSchema, type ResearchStateSlice } from "./shared";

export const FALLBACK_BEAR: BearAnalysis = {
  recommendation: "PASS",
  confidence: 50,
  investment_thesis: "Insufficient data to form a strong bearish thesis.",
  strongest_arguments: ["Research data was collected but bearish synthesis encountered an error."],
  risks: ["Risk assessment data available for manual review."],
  conclusion: "Bear case could not be fully synthesized. Review individual analysis sections.",
};

const bearSchema = z.object({
  recommendation: z
    .enum(["BUY", "HOLD", "PASS"])
    .describe("Bearish analyst recommendation based on risks and weaknesses"),
  confidence: unionScoreSchema("Bearish conviction score 0-100. Higher = stronger bear case."),
  investment_thesis: z
    .string()
    .describe("2-3 sentence bearish investment thesis emphasizing risks and concerns"),
  strongest_arguments: z
    .array(z.string())
    .describe("3-5 strongest bearish arguments with specific evidence from the research"),
  risks: z
    .array(z.string())
    .describe("3-5 key investment risks that could impair returns"),
  conclusion: z.string().describe("1-2 sentence bearish conclusion for the investment committee"),
});

export async function runBearAgent(state: ResearchStateSlice): Promise<BearAnalysis> {
  console.log(`[bear_agent] Building bearish case for: "${state.companyName}"`);
  try {
    const context = buildResearchContext(state);
    const llm = getLLM().withStructuredOutput(bearSchema);
    const result = await llm.invoke([
      new SystemMessage(
        `You are a professional bearish hedge fund analyst known for identifying downside risks. Your job is to build the strongest possible BEAR CASE against investing in this company.

Focus exclusively on negatives and risks:
- Debt levels and balance sheet concerns
- High P/E ratios and valuation stretch
- Weak margins and deteriorating fundamentals
- Competitive threats and market share erosion
- Negative news and regulatory headwinds
- Market slowdown risks and governance issues

Be skeptical but evidence-based. Only cite data present in the research context. Do NOT invent figures.
Return structured JSON. All numeric fields MUST be plain numbers.`
      ),
      new HumanMessage(
        `Build the strongest bearish investment case against ${state.companyName}.\n\nResearch Context:\n${context}`
      ),
    ]);

    const confidence = coerceNumber(result.confidence, 50);
    console.log(`[bear_agent] OK. Recommendation=${result.recommendation} Confidence=${confidence}`);
    return { ...result, confidence };
  } catch (err) {
    console.error("[bear_agent] Error:", err);
    return FALLBACK_BEAR;
  }
}
