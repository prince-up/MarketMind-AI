import { z } from "zod";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import type { BearAnalysis, BullAnalysis, JudgeAnalysis } from "@/types";
import { buildResearchContext, coerceNumber, getLLM, unionScoreSchema, type ResearchStateSlice } from "./shared";

export const FALLBACK_JUDGE: JudgeAnalysis = {
  finalVerdict: "HOLD",
  winner: "Balanced",
  confidence: 50,
  investmentSummary: "Debate synthesis could not be completed. Review bull and bear cases individually.",
  whyBullWon: "Bull case data unavailable for comparison.",
  whyBearWon: "Bear case data unavailable for comparison.",
  finalReasoning: "Judge agent encountered an error. Recommendation based on underlying research scores only.",
  investmentScore: 50,
};

const judgeSchema = z.object({
  finalVerdict: z
    .enum(["BUY", "HOLD", "PASS"])
    .describe("Final investment verdict after weighing both sides"),
  winner: z
    .enum(["Bull", "Bear", "Balanced"])
    .describe("Which side presented the stronger evidence-based case"),
  confidence: unionScoreSchema("Judge confidence in the final verdict 0-100"),
  investmentSummary: z
    .string()
    .describe("2-3 sentence executive investment summary synthesizing the debate"),
  whyBullWon: z
    .string()
    .describe("Why the bull case was compelling, even if it did not win (1-2 sentences)"),
  whyBearWon: z
    .string()
    .describe("Why the bear case was compelling, even if it did not win (1-2 sentences)"),
  finalReasoning: z
    .string()
    .describe("Detailed reasoning for the final verdict comparing evidence quality on both sides"),
  investmentScore: unionScoreSchema(
    "Overall investment attractiveness score 0-100 after debate adjudication"
  ),
});

export interface JudgeAgentInput extends ResearchStateSlice {
  bullData: BullAnalysis | null;
  bearData: BearAnalysis | null;
}

function formatBullCase(bull: BullAnalysis | null): string {
  if (!bull) return "Bull case unavailable.";
  return [
    `Recommendation: ${bull.recommendation}`,
    `Confidence: ${bull.confidence}%`,
    `Thesis: ${bull.investment_thesis}`,
    `Strongest Arguments: ${bull.strongest_arguments.join("; ")}`,
    `Supporting Metrics: ${bull.supporting_metrics.join("; ")}`,
    `Conclusion: ${bull.conclusion}`,
  ].join("\n");
}

function formatBearCase(bear: BearAnalysis | null): string {
  if (!bear) return "Bear case unavailable.";
  return [
    `Recommendation: ${bear.recommendation}`,
    `Confidence: ${bear.confidence}%`,
    `Thesis: ${bear.investment_thesis}`,
    `Strongest Arguments: ${bear.strongest_arguments.join("; ")}`,
    `Key Risks: ${bear.risks.join("; ")}`,
    `Conclusion: ${bear.conclusion}`,
  ].join("\n");
}

export async function runJudgeAgent(state: JudgeAgentInput): Promise<JudgeAnalysis> {
  console.log(`[judge_agent] Adjudicating debate for: "${state.companyName}"`);
  try {
    const researchContext = buildResearchContext(state);
    const bullCase = formatBullCase(state.bullData);
    const bearCase = formatBearCase(state.bearData);

    const llm = getLLM().withStructuredOutput(judgeSchema);
    const result = await llm.invoke([
      new SystemMessage(
        `You are a senior investment committee judge adjudicating a bull vs bear debate. You must NOT blindly average the two sides.

Evaluate:
- Evidence quality and specificity of each argument
- Financial strength vs risk profile from underlying research
- Valuation attractiveness relative to fundamentals
- Confidence levels and reasoning depth of each analyst
- Which side has more compelling, data-backed arguments

Declare a winner (Bull, Bear, or Balanced) and a final verdict (BUY, HOLD, or PASS).
BUY requires strong bull evidence with manageable risks. PASS requires compelling bear case or very high risk.
Return structured JSON. All numeric fields MUST be plain numbers.`
      ),
      new HumanMessage(
        `Adjudicate the investment debate for ${state.companyName}.

=== UNDERLYING RESEARCH ===
${researchContext}

=== BULL ANALYST CASE ===
${bullCase}

=== BEAR ANALYST CASE ===
${bearCase}

Compare evidence quality, weigh risks vs opportunities, and deliver your final verdict.`
      ),
    ]);

    const confidence = coerceNumber(result.confidence, 50);
    const investmentScore = coerceNumber(result.investmentScore, 50);
    console.log(
      `[judge_agent] OK. Verdict=${result.finalVerdict} Winner=${result.winner} Confidence=${confidence}`
    );
    return { ...result, confidence, investmentScore };
  } catch (err) {
    console.error("[judge_agent] Error:", err);
    return FALLBACK_JUDGE;
  }
}
