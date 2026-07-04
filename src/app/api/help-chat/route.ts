import { NextResponse } from "next/server";
import { ChatGroq } from "@langchain/groq";
import { HumanMessage, SystemMessage, AIMessage } from "@langchain/core/messages";

export async function POST(request: Request) {
  try {
    const { messages } = await request.json();
    
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid messages array" }, { status: 400 });
    }

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json({ error: "Missing GROQ_API_KEY" }, { status: 500 });
    }

    const llm = new ChatGroq({
      modelName: "llama-3.3-70b-versatile",
      temperature: 0.1,
    });

    const systemPrompt = new SystemMessage(`You are the Console Assistant, a helpful guide for the AI Investment Research Console. 
Your ONLY job is to explain how this tool works, its methodology, its features, and how to interpret its results. 
Do NOT provide investment advice. 
Do NOT analyze specific companies or stocks. If a user asks you to analyze a company, politely redirect them to use the main search bar in the app.

Methodology details: 
- Confidence is calculated deterministically with weights: Financials 30%, News 20%, Risk 20%, Valuation 20%, Competitors 10%.
- Data sources: Yahoo Finance (financials, valuation) and Tavily Web Search (news, competitors, risks).
- This is an AI research assistant, not licensed financial advice.

Keep answers concise, professional, and helpful.`);

    const formattedMessages = [
      systemPrompt,
      ...messages.map((m: any) => 
        m.role === "user" ? new HumanMessage(m.content) : new AIMessage(m.content)
      )
    ];

    const response = await llm.invoke(formattedMessages);

    return NextResponse.json({ response: response.content });

  } catch (error: any) {
    console.error("Help Chat API Error:", error);
    return NextResponse.json({ error: error.message || "Failed to generate response" }, { status: 500 });
  }
}
