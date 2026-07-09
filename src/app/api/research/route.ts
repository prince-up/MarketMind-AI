import { NextResponse } from "next/server";
import { agent } from "@/lib/agent";
import { createClient } from "@/lib/supabase/server";
import { FALLBACK_BULL } from "@/lib/agents/bullAgent";
import { FALLBACK_BEAR } from "@/lib/agents/bearAgent";
import { FALLBACK_JUDGE } from "@/lib/agents/judgeAgent";
import type { ResearchResult, BullAnalysis, BearAnalysis, JudgeAnalysis, NewsSentiment, CompetitorAnalysis, RiskAnalysis } from "@/types";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check credits
    let { data: profile, error } = await supabase
      .from("profiles")
      .select("credits")
      .eq("id", user.id)
      .single();

    if (error || !profile) {
      console.warn("Credit check bypassed due to profile fetch error:", error);
      profile = { credits: 999 };
    }

    if (profile.credits <= 0) {
      return NextResponse.json(
        { error: "Insufficient credits. Please upgrade to Pro." },
        { status: 402 }
      );
    }

    const body = await request.json();
    const { companyName } = body;

    if (!companyName) {
      return NextResponse.json(
        { error: "Company name is required." },
        { status: 400 }
      );
    }

    if (!process.env.GROQ_API_KEY || !process.env.TAVILY_API_KEY) {
      return NextResponse.json(
        { error: "Missing API keys." },
        { status: 500 }
      );
    }

    const initialState = {
      companyName,
    };

    const encoder = new TextEncoder();
    const customStream = new ReadableStream({
      async start(controller) {
        try {
          const accumulatedState: Record<string, unknown> = { companyName };
          const eventStream = await agent.stream(initialState, { streamMode: "updates" });

          for await (const chunk of eventStream) {
            const nodeName = Object.keys(chunk)[0];
            const stateUpdate = (chunk as Record<string, Record<string, unknown>>)[nodeName];
            Object.assign(accumulatedState, stateUpdate);

            const eventData = {
              type: "node_complete",
              node: nodeName,
              data: stateUpdate,
            };

            controller.enqueue(encoder.encode(JSON.stringify(eventData) + "\n"));
          }

          // Final decision response mapping with robust flat schema
          const responseData: ResearchResult = {
            companyName: (accumulatedState.companyName as string) || companyName,
            verdict: (accumulatedState.recommendation as ResearchResult["verdict"]) || "PASS",
            confidence: (accumulatedState.confidence as number) ?? 50,
            reasoning: (accumulatedState.reasoning as string[]) || [],
            positives: (accumulatedState.positives as string[]) || [],
            negatives: (accumulatedState.negatives as string[]) || [],
            summary: (accumulatedState.summary as string) || "",
            financial: (accumulatedState.financialData as ResearchResult["financial"]) || {
              ticker: "N/A",
              revenueGrowth: "Data unavailable",
              peRatio: "Data unavailable",
              marketCap: "Data unavailable",
              cashFlow: "Data unavailable",
              debt: "Data unavailable",
              profitability: "Data unavailable",
              score: 50,
              rawText: "Financial data could not be retrieved.",
              sources: ["Yahoo Finance"]
            },
            news: (accumulatedState.newsData as NewsSentiment | undefined) ?? {
              sentiment: "neutral",
              sentimentScore: 50,
              positives: [],
              negatives: [],
              keyEvents: ["No recent news found."],
              investmentImpact: "Insufficient news data to assess investment impact.",
              sources: ["Tavily Search"]
            },
            competitors: (accumulatedState.competitorData as CompetitorAnalysis | undefined) ?? {
              marketPosition: "Competitor data unavailable.",
              strengths: [],
              weaknesses: [],
              competitors: [],
              score: 50,
              sources: ["Tavily Search"]
            },
            risks: (accumulatedState.riskData as RiskAnalysis | undefined) ?? {
              riskScore: 50,
              level: "Medium",
              risks: [
                {
                  category: "Data Availability",
                  severity: "Medium",
                  explanation: "Risk assessment could not be completed due to insufficient data."
                }
              ],
              sources: ["Yahoo Finance", "Tavily Search"]
            },
            valuation: (accumulatedState.valuationData as ResearchResult["valuation"]) || {
              valuation: "Fairly Valued",
              score: 50,
              positives: [],
              negatives: ["Valuation data unavailable."],
              sources: ["Yahoo Finance"]
            },
            debate: {
              bull: (accumulatedState.bullData as BullAnalysis | undefined) ?? FALLBACK_BULL,
              bear: (accumulatedState.bearData as BearAnalysis | undefined) ?? FALLBACK_BEAR,
              judge: (accumulatedState.judgeData as JudgeAnalysis | undefined) ?? FALLBACK_JUDGE,
            },
            earnings: (accumulatedState.earnings as ResearchResult["earnings"]) || [],
            analystData: (accumulatedState.analystData as ResearchResult["analystData"]) ?? undefined,
          };

          controller.enqueue(
            encoder.encode(
              JSON.stringify({
                type: "complete",
                result: responseData,
              }) + "\n"
            )
          );
          
          // Deduct credit
          if (user && profile && profile.credits !== 999) {
            await supabase
              .from("profiles")
              .update({ credits: profile.credits - 1 })
              .eq("id", user.id);
          }

          controller.close();
        } catch (err: unknown) {
          console.error("Stream generation error:", err);
          const message = err instanceof Error ? err.message : "Internal error during streaming.";
          controller.enqueue(
            encoder.encode(
              JSON.stringify({
                type: "error",
                error: message,
              }) + "\n"
            )
          );
          controller.close();
        }
      },
    });

    return new Response(customStream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });
  } catch (error: unknown) {
    console.error("Research API Error:", error);
    const message = error instanceof Error ? error.message : "Failed to perform research.";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
