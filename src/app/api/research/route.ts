import { NextResponse } from "next/server";
import { agent } from "@/lib/agent";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
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
          const accumulatedState: any = { companyName };
          const eventStream = await agent.stream(initialState, { streamMode: "updates" });

          for await (const chunk of eventStream) {
            const nodeName = Object.keys(chunk)[0];
            const stateUpdate = (chunk as any)[nodeName];
            Object.assign(accumulatedState, stateUpdate);

            const eventData = {
              type: "node_complete",
              node: nodeName,
              data: stateUpdate,
            };

            controller.enqueue(encoder.encode(JSON.stringify(eventData) + "\n"));
          }

          // Final decision response mapping with robust flat schema
          const responseData = {
            companyName: accumulatedState.companyName || companyName,
            verdict: accumulatedState.recommendation || "PASS",
            confidence: accumulatedState.confidence ?? 50,
            reasoning: accumulatedState.reasoning || [],
            positives: accumulatedState.positives || [],
            negatives: accumulatedState.negatives || [],
            summary: accumulatedState.summary || "",
            financial: accumulatedState.financialData || {
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
            news: accumulatedState.newsData || {
              sentiment: "neutral",
              sentimentScore: 50,
              positives: [],
              negatives: [],
              keyEvents: ["No recent news found."],
              investmentImpact: "Insufficient news data to assess investment impact.",
              sources: ["Tavily Search"]
            },
            competitors: accumulatedState.competitorData || {
              marketPosition: "Competitor data unavailable.",
              strengths: [],
              weaknesses: [],
              competitors: [],
              score: 50,
              sources: ["Tavily Search"]
            },
            risks: accumulatedState.riskData || {
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
            valuation: accumulatedState.valuationData || {
              valuation: "Fairly Valued",
              score: 50,
              positives: [],
              negatives: ["Valuation data unavailable."],
              sources: ["Yahoo Finance"]
            },
            earnings: accumulatedState.earnings || [],
            analystData: accumulatedState.analystData || null,
          };

          controller.enqueue(
            encoder.encode(
              JSON.stringify({
                type: "complete",
                result: responseData,
              }) + "\n"
            )
          );
          controller.close();
        } catch (err: any) {
          console.error("Stream generation error:", err);
          controller.enqueue(
            encoder.encode(
              JSON.stringify({
                type: "error",
                error: err?.message || "Internal error during streaming.",
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
  } catch (error: any) {
    console.error("Research API Error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to perform research." },
      { status: 500 }
    );
  }
}
