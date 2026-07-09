import { StateGraph, Annotation } from "@langchain/langgraph";
import { ChatGroq } from "@langchain/groq";
import { TavilySearch } from "@langchain/tavily";
import YahooFinance from "yahoo-finance2";
import { z } from "zod";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import type {
  FinancialSummary,
  NewsSentiment,
  CompetitorAnalysis,
  RiskAnalysis,
  ValuationAnalysis,
  EarningsHistoryEntry,
  AnalystData,
  BullAnalysis,
  BearAnalysis,
  JudgeAnalysis,
} from "@/types";
import { runBullAgent, FALLBACK_BULL } from "@/lib/agents/bullAgent";
import { runBearAgent, FALLBACK_BEAR } from "@/lib/agents/bearAgent";
import { runJudgeAgent, FALLBACK_JUDGE } from "@/lib/agents/judgeAgent";

// ─── Yahoo Finance instance ───────────────────────────────────────────────────
const yf = new YahooFinance();

// ─── LLM factory ─────────────────────────────────────────────────────────────
const getLLM = () =>
  new ChatGroq({
    model: "llama-3.3-70b-versatile",
    apiKey: process.env.GROQ_API_KEY,
    temperature: 0.1,
  });

// Schema helper: Allow number or string to avoid "Transforms cannot be represented in JSON Schema" errors
const unionScoreSchema = (desc: string) =>
  z.union([z.number(), z.string()]).describe(`${desc}. MUST be returned as a plain number.`);

// Coercion helper used in node return mappings (runtime execution)
function coerceNumber(val: any, fallback = 50): number {
  if (typeof val === "number") {
    return isNaN(val) ? fallback : Math.max(0, Math.min(100, Math.round(val)));
  }
  if (typeof val === "string") {
    const parsed = parseFloat(val);
    return isNaN(parsed) ? fallback : Math.max(0, Math.min(100, Math.round(parsed)));
  }
  return fallback;
}

// ─── LangGraph State ─────────────────────────────────────────────────────────
export const GraphState = Annotation.Root({
  companyName: Annotation<string>(),
  financialData: Annotation<FinancialSummary | null>({
    reducer: (_, b) => b,
    default: () => null,
  }),
  newsData: Annotation<NewsSentiment | null>({
    reducer: (_, b) => b,
    default: () => null,
  }),
  competitorData: Annotation<CompetitorAnalysis | null>({
    reducer: (_, b) => b,
    default: () => null,
  }),
  riskData: Annotation<RiskAnalysis | null>({
    reducer: (_, b) => b,
    default: () => null,
  }),
  valuationData: Annotation<ValuationAnalysis | null>({
    reducer: (_, b) => b,
    default: () => null,
  }),
  bullData: Annotation<BullAnalysis | null>({
    reducer: (_, b) => b,
    default: () => null,
  }),
  bearData: Annotation<BearAnalysis | null>({
    reducer: (_, b) => b,
    default: () => null,
  }),
  judgeData: Annotation<JudgeAnalysis | null>({
    reducer: (_, b) => b,
    default: () => null,
  }),
  earnings: Annotation<EarningsHistoryEntry[]>({
    reducer: (_, b) => b,
    default: () => [],
  }),
  analystData: Annotation<AnalystData | null>({
    reducer: (_, b) => b,
    default: () => null,
  }),
  recommendation: Annotation<string>({
    reducer: (_, b) => b,
    default: () => "PASS",
  }),
  confidence: Annotation<number>({
    reducer: (_, b) => b,
    default: () => 0,
  }),
  reasoning: Annotation<string[]>({
    reducer: (_, b) => b,
    default: () => [],
  }),
  positives: Annotation<string[]>({
    reducer: (_, b) => b,
    default: () => [],
  }),
  negatives: Annotation<string[]>({
    reducer: (_, b) => b,
    default: () => [],
  }),
  summary: Annotation<string>({
    reducer: (_, b) => b,
    default: () => "",
  }),
});

// ─── Fallback data (no node ever returns undefined) ───────────────────────────
const FALLBACK_FINANCIAL: FinancialSummary = {
  ticker: "N/A",
  revenueGrowth: "Data unavailable",
  peRatio: "Data unavailable",
  marketCap: "Data unavailable",
  cashFlow: "Data unavailable",
  debt: "Data unavailable",
  profitability: "Data unavailable",
  score: 50,
  rawText: "Financial data could not be retrieved.",
  sources: ["Yahoo Finance"],
};

const FALLBACK_NEWS: NewsSentiment = {
  sentiment: "neutral",
  sentimentScore: 50,
  positives: [],
  negatives: [],
  keyEvents: ["No recent news found."],
  investmentImpact: "Insufficient news data to assess investment impact.",
  sources: ["Tavily Search"],
};

const FALLBACK_COMPETITOR: CompetitorAnalysis = {
  marketPosition: "Competitor data unavailable.",
  strengths: [],
  weaknesses: [],
  competitors: [],
  score: 50,
  sources: ["Tavily Search"],
};

const FALLBACK_RISK: RiskAnalysis = {
  riskScore: 50,
  level: "Medium",
  risks: [
    {
      category: "Data Availability",
      severity: "Medium",
      explanation: "Risk assessment could not be completed due to insufficient data.",
    },
  ],
  sources: ["Yahoo Finance", "Tavily Search"],
};

const FALLBACK_VALUATION: ValuationAnalysis = {
  valuation: "Fairly Valued",
  score: 50,
  positives: [],
  negatives: ["Valuation data unavailable."],
  sources: ["Yahoo Finance"],
};

// ─── Helper: format raw Tavily results into a readable string ─────────────────
function formatTavilyResults(raw: unknown): string {
  if (!raw) return "";
  try {
    let data = raw;
    if (typeof raw === "string") {
      try {
        data = JSON.parse(raw);
      } catch {
        // Plain string
      }
    }

    if (data && typeof data === "object" && "results" in data && Array.isArray((data as any).results)) {
      data = (data as any).results;
    }

    if (Array.isArray(data) && data.length > 0) {
      return data
        .slice(0, 5)
        .map((r: any, i: number) => {
          const title = r.title ?? r.name ?? "N/A";
          const url = r.url ?? r.link ?? "N/A";
          const content = r.content ?? r.snippet ?? r.description ?? "N/A";
          return `[Article ${i + 1}]\nTitle: ${title}\nSource: ${url}\nContent: ${content}`;
        })
        .join("\n\n---\n\n");
    }

    if (typeof data === "string") {
      return data;
    }
  } catch (err) {
    console.error("[formatTavilyResults] Error:", err);
  }

  const str = String(raw ?? "");
  if (str && str !== "[object Object]" && str !== "undefined" && str.length > 10) {
    return str;
  }
  return "";
}

// Extract domains for sources list
function extractSourcesFromTavily(raw: unknown): string[] {
  const sourcesSet = new Set<string>();
  try {
    let data = raw;
    if (typeof raw === "string") {
      try {
        data = JSON.parse(raw);
      } catch {
        // Plain string
      }
    }

    if (data && typeof data === "object" && "results" in data && Array.isArray((data as any).results)) {
      data = (data as any).results;
    }

    if (Array.isArray(data)) {
      data.forEach((r: any) => {
        const url = r.url ?? r.link;
        if (url && typeof url === "string") {
          try {
            const domain = new URL(url).hostname.replace("www.", "");
            sourcesSet.add(domain);
          } catch {
            sourcesSet.add(url);
          }
        }
      });
    }
  } catch {
    // Ignore errors
  }
  if (sourcesSet.size === 0) {
    sourcesSet.add("Tavily Search");
  }
  return Array.from(sourcesSet);
}

// ─── Node 1: fetch_financials ─────────────────────────────────────────────────
const fetchFinancials = async (state: typeof GraphState.State) => {
  console.log(`[fetch_financials] Searching: "${state.companyName}"`);
  try {
    const searchRes = await yf.search(state.companyName);
    if (!searchRes.quotes?.length) {
      console.warn("[fetch_financials] No ticker found.");
      return {
        financialData: { ...FALLBACK_FINANCIAL, rawText: "No matching ticker found.", sources: ["Yahoo Finance"] },
      };
    }

    const ticker = searchRes.quotes[0].symbol as string;
    const quote = await yf.quote(ticker);

    let earnings: EarningsHistoryEntry[] = [];
    let analystData: AnalystData | null = null;
    let summary: any = {};
    try {
      summary = await yf.quoteSummary(ticker, { modules: ['earningsHistory', 'recommendationTrend', 'financialData', 'defaultKeyStatistics'] });
      
      if (summary.earningsHistory?.history) {
        earnings = summary.earningsHistory.history
          .filter((h: any) => h.quarter && h.epsActual !== undefined)
          .map((h: any) => ({
            quarter: h.quarter instanceof Date ? h.quarter.toISOString() : String(h.quarter),
            epsActual: h.epsActual ?? 0,
            epsEstimate: h.epsEstimate ?? 0,
            epsDifference: h.epsDifference ?? 0,
            surprisePercent: h.surprisePercent ?? 0
          }));
      }

      if (summary.recommendationTrend?.trend?.[0]) {
        const trend = summary.recommendationTrend.trend[0];
        const finData = summary.financialData || {};
    
        analystData = {
          strongBuy: trend.strongBuy ?? 0,
          buy: trend.buy ?? 0,
          hold: trend.hold ?? 0,
          sell: trend.sell ?? 0,
          strongSell: trend.strongSell ?? 0,
          targetMeanPrice: finData.targetMeanPrice ?? 0,
          numberOfAnalystOpinions: finData.numberOfAnalystOpinions ?? 0,
          recommendationKey: finData.recommendationKey ?? 'none'
        };
      }
    } catch (e) {
      console.warn("[fetch_financials] Failed to fetch extended yahoo finance data:", e);
    }

    const finData = summary?.financialData || {};
    const keyStats = summary?.defaultKeyStatistics || {};

    const rawText = [
      `Ticker: ${ticker}`,
      `Current Price: ${quote.regularMarketPrice != null ? `$${quote.regularMarketPrice}` : "N/A"}`,
      `Market Cap: ${quote.marketCap != null ? `$${(quote.marketCap / 1e9).toFixed(2)}B` : "N/A"}`,
      `P/E Ratio (Trailing): ${quote.trailingPE?.toFixed(2) ?? "N/A"}`,
      `P/E Ratio (Forward): ${quote.forwardPE?.toFixed(2) ?? "N/A"}`,
      `EPS (Trailing): ${quote.epsTrailingTwelveMonths ?? "N/A"}`,
      `Dividend Yield: ${quote.trailingAnnualDividendYield != null ? `${(quote.trailingAnnualDividendYield * 100).toFixed(2)}%` : "N/A"}`,
      `Revenue Growth: ${finData.revenueGrowth != null ? `${(finData.revenueGrowth * 100).toFixed(2)}%` : "N/A"}`,
      `Profit Margins: ${finData.profitMargins != null ? `${(finData.profitMargins * 100).toFixed(2)}%` : "N/A"}`,
      `Operating Margins: ${finData.operatingMargins != null ? `${(finData.operatingMargins * 100).toFixed(2)}%` : "N/A"}`,
      `Free Cash Flow: ${finData.freeCashflow != null ? `$${(finData.freeCashflow / 1e9).toFixed(2)}B` : "N/A"}`,
      `Total Debt: ${finData.totalDebt != null ? `$${(finData.totalDebt / 1e9).toFixed(2)}B` : "N/A"}`,
      `Debt to Equity: ${finData.debtToEquity != null ? `${finData.debtToEquity}` : "N/A"}`,
    ].join("\n");

    const schema = z.object({
      revenueGrowth: z.string().describe("Revenue growth description, e.g. '15.5% YoY' or 'Declining'"),
      peRatio: z.string().describe("P/E ratio assessment and what it implies"),
      marketCap: z.string().describe("Market cap figure and what tier it represents"),
      cashFlow: z.string().describe("Cash flow assessment based on available data (Free Cash Flow)"),
      debt: z.string().describe("Debt situation based on available data (Total Debt / Debt to Equity)"),
      profitability: z.string().describe("Profitability status (Profit Margins / Operating Margins)"),
      score: unionScoreSchema("Financial health score 0–100. 80+ = strong, 60–79 = moderate, <60 = weak. Base on actual data."),
    });

    const llm = getLLM().withStructuredOutput(schema);
    const result = await llm.invoke([
      new SystemMessage(
        "You are a financial analyst. Analyze the raw financial data provided and return a structured assessment. Only reference data that is explicitly present. Do NOT invent figures. All numeric fields MUST be plain numbers (e.g., 75), never strings, never text like 'Not Provided' or 'N/A'. If data is genuinely unavailable, use a reasonable default numeric estimate instead of a placeholder string."
      ),
      new HumanMessage(
        `Company: ${state.companyName}\n\nRaw Financial Data:\n${rawText}\n\nReturn a structured financial health assessment.`
      ),
    ]);

    const finalScore = coerceNumber(result.score, 50);
    console.log(`[fetch_financials] OK. Ticker=${ticker} Score=${finalScore}`);
    return {
      financialData: { ticker, ...result, score: finalScore, rawText, sources: ["Yahoo Finance"] } as FinancialSummary,
      earnings,
      analystData
    };
  } catch (err) {
    console.error("[fetch_financials] Error:", err);
    return { financialData: FALLBACK_FINANCIAL };
  }
};

// ─── Node 2: fetch_news ───────────────────────────────────────────────────────
const fetchNews = async (state: typeof GraphState.State) => {
  console.log(`[fetch_news] Fetching news for: "${state.companyName}"`);
  try {
    const tavily = new TavilySearch({ maxResults: 5 });
    const raw = await tavily.invoke({
      query: `${state.companyName} company stock market news latest updates 2026`,
    });
    const articles = formatTavilyResults(raw);
    const sources = extractSourcesFromTavily(raw);

    if (!articles || articles.trim().length === 0) {
      console.warn("[fetch_news] No article content extracted.");
      return {
        newsData: {
          ...FALLBACK_NEWS,
          investmentImpact: "No recent news found.",
          keyEvents: ["No recent news found."],
          sources: ["Tavily Search"]
        }
      };
    }

    const schema = z.object({
      sentiment: z
        .enum(["positive", "negative", "neutral"])
        .describe("Overall news sentiment"),
      sentimentScore: unionScoreSchema(
        "Numeric sentiment: 80–100=very positive, 60–79=positive, 40–59=neutral, 20–39=negative, 0–19=very negative"
      ),
      positives: z.array(z.string()).describe("Positive developments from the articles"),
      negatives: z.array(z.string()).describe("Negative developments from the articles"),
      keyEvents: z.array(z.string()).describe("Key recent events mentioned in news"),
      investmentImpact: z
        .string()
        .describe("How this news affects the investment thesis (2–3 sentences)"),
    });

    const llm = getLLM().withStructuredOutput(schema);
    const result = await llm.invoke([
      new SystemMessage(
        "You are a financial news analyst. Analyze the news articles provided and extract structured sentiment data. Summarize the overall sentiment, positive developments, negative developments, important recent events, and investment impact. Only use information from the articles. Do NOT hallucinate. If no news exists, make sure to state that. All numeric fields MUST be plain numbers (e.g., 75), never strings, never text like 'Not Provided' or 'N/A'. If data is genuinely unavailable, use a reasonable default numeric estimate instead of a placeholder string."
      ),
      new HumanMessage(
        `Company: ${state.companyName}\n\nNews Articles:\n${articles}\n\nProvide a structured news sentiment analysis.`
      ),
    ]);

    const finalScore = coerceNumber(result.sentimentScore, 50);
    console.log(`[fetch_news] OK. Sentiment=${result.sentiment} Score=${finalScore}`);
    return { newsData: { ...result, sentimentScore: finalScore, sources } as NewsSentiment };
  } catch (err) {
    console.error("[fetch_news] Error:", err);
    return { newsData: FALLBACK_NEWS };
  }
};

// ─── Node 3: analyze_competitors ─────────────────────────────────────────────
const analyzeCompetitors = async (state: typeof GraphState.State) => {
  console.log(`[analyze_competitors] Searching competitors for: "${state.companyName}"`);
  try {
    const tavily = new TavilySearch({ maxResults: 5 });
    const raw = await tavily.invoke({
      query: `${state.companyName} key business competitors market share industry comparison 2026`,
    });
    const results = formatTavilyResults(raw);
    const sources = extractSourcesFromTavily(raw);

    if (!results || results.trim().length === 0) {
      console.warn("[analyze_competitors] No results.");
      return { competitorData: { ...FALLBACK_COMPETITOR, sources } };
    }

    const schema = z.object({
      marketPosition: z.string().describe("The company's overall market position in one sentence"),
      strengths: z
        .array(z.string())
        .describe("Competitive strengths vs peers (from search results only)"),
      weaknesses: z
        .array(z.string())
        .describe("Competitive weaknesses vs peers (from search results only)"),
      competitors: z
        .array(
          z.object({
            name: z.string().describe("Competitor name"),
            assessment: z.string().describe("Brief comparison: how this competitor compares to the target company"),
            marketPosition: z.string().optional().describe("Market position of competitor"),
            strengths: z.array(z.string()).optional().default([]).describe("Strengths of competitor"),
            weaknesses: z.array(z.string()).optional().default([]).describe("Weaknesses of competitor"),
            aiLeadership: z.string().optional().describe("AI Leadership assessment of competitor"),
            pricing: z.string().optional().describe("Pricing details of competitor"),
            growth: z.string().optional().describe("Growth details of competitor"),
          }).catchall(z.any())
        )
        .describe("Key named competitors found in search results, detailing AI leadership, pricing, and growth if available"),
      score: unionScoreSchema(
        "Competitive position score: 80+=market leader, 60–79=strong player, 40–59=average, <40=weak"
      ),
    });

    const llm = getLLM().withStructuredOutput(schema);
    const result = await llm.invoke([
      new SystemMessage(
        "You are a competitive intelligence analyst. Use ONLY the provided search results. Compare market position, strengths, weaknesses, AI leadership, pricing, and growth. Do NOT invent competitors not mentioned. Be specific and factual. Omit optional fields (AI Leadership, Pricing, Growth) entirely if the data is not mentioned in the text. NEVER return 'none mentioned', 'not applicable', 'N/A', or placeholder text for strings. All numeric fields MUST be plain numbers (e.g., 75)."
      ),
      new HumanMessage(
        `Company: ${state.companyName}\n\nSearch Results:\n${results}\n\nProvide a structured competitive analysis comparing market position, strengths, weaknesses, AI leadership, pricing, and growth.`
      ),
    ]);

    const finalScore = coerceNumber(result.score, 50);
    console.log(`[analyze_competitors] OK. Score=${finalScore}`);
    return { competitorData: { ...result, score: finalScore, sources } as CompetitorAnalysis };
  } catch (err) {
    console.error("[analyze_competitors] Error:", err);
    return { competitorData: FALLBACK_COMPETITOR };
  }
};

// ─── Node 4: assess_risks ────────────────────────────────────────────────────
const assessRisks = async (state: typeof GraphState.State) => {
  console.log(`[assess_risks] Assessing risks for: "${state.companyName}"`);
  try {
    const fin = state.financialData;
    const news = state.newsData;

    const context = [
      `Financial Overview:\n${fin?.rawText ?? "Not available"}`,
      `News Negatives:\n${news?.negatives?.join("\n") ?? "Not available"}`,
      `Key Events:\n${news?.keyEvents?.join("\n") ?? "Not available"}`,
      `Market Position:\n${state.competitorData?.marketPosition ?? "Not available"}`,
    ].join("\n\n");

    const schema = z.object({
      riskScore: unionScoreSchema(
        "Overall risk score 0–100. 0=no risk, 100=extreme risk. 70+=high, 40–69=medium, <40=low."
      ),
      level: z
        .enum(["Low", "Medium", "High", "Very High"])
        .describe("Risk level category"),
      risks: z
        .array(
          z.object({
            category: z
              .string()
              .describe(
                "Risk category, e.g. Regulatory, Market, Competition, Execution, Valuation, Liquidity, Geopolitical"
              ),
            severity: z.enum(["Low", "Medium", "High"]),
            explanation: z.string().describe("Concise 1–2 sentence explanation of the risk"),
          })
        )
        .describe("List of distinct risks"),
    });

    const llm = getLLM().withStructuredOutput(schema);
    const result = await llm.invoke([
      new SystemMessage(
        "You are a risk analyst. Identify and score investment risks based on the provided context. Return a structured JSON containing a riskScore, level, and risks array. Be specific. Cover different risk categories. All numeric fields MUST be plain numbers (e.g., 75), never strings, never text like 'Not Provided' or 'N/A'. If data is genuinely unavailable, use a reasonable default numeric estimate instead of a placeholder string."
      ),
      new HumanMessage(
        `Company: ${state.companyName}\n\nContext:\n${context}\n\nProvide a structured risk assessment.`
      ),
    ]);

    const sources = [
      ...(fin?.sources ?? []),
      ...(news?.sources ?? []),
      ...(state.competitorData?.sources ?? [])
    ];
    const uniqueSources = Array.from(new Set(sources));

    const finalScore = coerceNumber(result.riskScore, 50);
    console.log(`[assess_risks] OK. RiskScore=${finalScore} Level=${result.level}`);
    return { riskData: { ...result, riskScore: finalScore, sources: uniqueSources } as RiskAnalysis };
  } catch (err) {
    console.error("[assess_risks] Error:", err);
    return { riskData: FALLBACK_RISK };
  }
};

// ─── Node 5: evaluate_valuation ──────────────────────────────────────────────
const evaluateValuation = async (state: typeof GraphState.State) => {
  console.log(`[evaluate_valuation] Evaluating for: "${state.companyName}"`);
  try {
    const fin = state.financialData;
    const context = [
      `Financial Data:\n${fin?.rawText ?? "Not available"}`,
      `News Sentiment: ${state.newsData?.sentiment ?? "unknown"} (score ${state.newsData?.sentimentScore ?? 50}/100)`,
      `Market Position: ${state.competitorData?.marketPosition ?? "unknown"}`,
      `Risk Level: ${state.riskData?.level ?? "unknown"} (score ${state.riskData?.riskScore ?? 50}/100)`,
    ].join("\n\n");

    const schema = z.object({
      valuation: z
        .enum(["Undervalued", "Fairly Valued", "Overvalued"])
        .describe("Overall valuation verdict"),
      score: unionScoreSchema(
        "Valuation attractiveness score: 80+=very attractive, 60–79=moderate, 40–59=fair, <40=unattractive"
      ),
      positives: z.array(z.string()).describe("Positive valuation factors"),
      negatives: z.array(z.string()).describe("Negative valuation factors or red flags"),
    });

    const llm = getLLM().withStructuredOutput(schema);
    const result = await llm.invoke([
      new SystemMessage(
        "You are a valuation specialist. Assess whether the stock appears undervalued, fairly valued, or overvalued based on the provided data. Return a structured JSON containing valuation status, score, positives, and negatives. Reference P/E ratios, market cap, and sector context where possible. All numeric fields MUST be plain numbers (e.g., 75), never strings, never text like 'Not Provided' or 'N/A'. If data is genuinely unavailable, use a reasonable default numeric estimate instead of a placeholder string."
      ),
      new HumanMessage(
        `Company: ${state.companyName}\n\nContext:\n${context}\n\nProvide a structured valuation assessment.`
      ),
    ]);

    const finalScore = coerceNumber(result.score, 50);
    console.log(`[evaluate_valuation] OK. Valuation=${result.valuation} Score=${finalScore}`);
    return {
      valuationData: { ...result, score: finalScore, sources: ["Yahoo Finance", ...(state.competitorData?.sources ?? [])] } as ValuationAnalysis
    };
  } catch (err) {
    console.error("[evaluate_valuation] Error:", err);
    return { valuationData: FALLBACK_VALUATION };
  }
};

// ─── Node 6a: bull_agent (parallel branch) ────────────────────────────────────
const bullAgentNode = async (state: typeof GraphState.State) => {
  const result = await runBullAgent(state);
  return { bullData: result };
};

// ─── Node 6b: bear_agent (parallel branch) ────────────────────────────────────
const bearAgentNode = async (state: typeof GraphState.State) => {
  const result = await runBearAgent(state);
  return { bearData: result };
};

// ─── Node 6c: judge_agent (waits for bull + bear) ─────────────────────────────
const judgeAgentNode = async (state: typeof GraphState.State) => {
  const result = await runJudgeAgent({
    companyName: state.companyName,
    financialData: state.financialData,
    newsData: state.newsData,
    competitorData: state.competitorData,
    riskData: state.riskData,
    valuationData: state.valuationData,
    bullData: state.bullData ?? FALLBACK_BULL,
    bearData: state.bearData ?? FALLBACK_BEAR,
  });
  return { judgeData: result };
};

// ─── Node 7: final_decision ───────────────────────────────────────────────────
const finalDecision = async (state: typeof GraphState.State) => {
  console.log(`[final_decision] Generating recommendation for: "${state.companyName}"`);

  const fin = state.financialData;
  const news = state.newsData;
  const comp = state.competitorData;
  const risk = state.riskData;
  const val = state.valuationData;
  const judge = state.judgeData;

  // ── Deterministic weighted confidence (never LLM-invented) ────────────────
  const financialScore = fin?.score ?? 50;
  const newsSentiment = news?.sentiment ?? "neutral";
  // Convert news sentiment: positive=80, neutral=50, negative=20
  const newsSentimentScore = newsSentiment === "positive" ? 80 : newsSentiment === "negative" ? 20 : 50;
  const riskScore = risk?.riskScore ?? 50;        // higher = worse; inverted below
  const valuationScore = val?.score ?? 50;
  const competitorScore = comp?.score ?? 50;
  const judgeScore = judge?.investmentScore ?? 50;
  const judgeConfidence = judge?.confidence ?? 50;

  // weighted scores — blend pipeline scores with debate judge score
  const rawConfidence =
    financialScore * 0.25 +
    newsSentimentScore * 0.15 +
    (100 - riskScore) * 0.15 +
    valuationScore * 0.15 +
    competitorScore * 0.10 +
    judgeScore * 0.10 +
    judgeConfidence * 0.10;

  // Clamp to 10–99 so it's never 0 and never a false certainty of 100
  const confidence = Math.max(10, Math.min(99, Math.round(rawConfidence)));

  try {
    const context = [
      `Financial Health Score: ${financialScore}/100 — ${fin?.profitability ?? "N/A"}`,
      `News Sentiment: ${newsSentiment} (${newsSentimentScore}/100)`,
      `Competitive Position Score: ${competitorScore}/100 — ${comp?.marketPosition ?? "N/A"}`,
      `Risk Level: ${risk?.level ?? "Medium"} (risk score ${riskScore}/100)`,
      `Valuation: ${val?.valuation ?? "Fairly Valued"} (attractiveness ${valuationScore}/100)`,
      `Calculated Confidence: ${confidence}%`,
      ``,
      `=== AI INVESTMENT DEBATE VERDICT ===`,
      `Judge Verdict: ${judge?.finalVerdict ?? "N/A"}`,
      `Debate Winner: ${judge?.winner ?? "Balanced"}`,
      `Judge Confidence: ${judgeConfidence}%`,
      `Investment Score: ${judgeScore}/100`,
      `Judge Summary: ${judge?.investmentSummary ?? "N/A"}`,
      `Why Bull Won: ${judge?.whyBullWon ?? "N/A"}`,
      `Why Bear Won: ${judge?.whyBearWon ?? "N/A"}`,
      `Judge Reasoning: ${judge?.finalReasoning ?? "N/A"}`,
      ``,
      `Bull Case: ${state.bullData?.recommendation ?? "N/A"} (${state.bullData?.confidence ?? 50}% confidence)`,
      `Bear Case: ${state.bearData?.recommendation ?? "N/A"} (${state.bearData?.confidence ?? 50}% confidence)`,
      ``,
      `Key Risks: ${risk?.risks?.map((r) => r.category).join(", ") ?? "N/A"}`,
      `News Highlights: ${news?.keyEvents?.slice(0, 3).join("; ") ?? "N/A"}`,
      `Valuation Positives: ${val?.positives?.join("; ") ?? "N/A"}`,
      `Valuation Negatives: ${val?.negatives?.join("; ") ?? "N/A"}`,
    ].join("\n");

    const schema = z.object({
      recommendation: z
        .enum(["BUY", "HOLD", "PASS"])
        .describe(
          "BUY = strong positive case (confidence 65+, low-medium risk), HOLD = mixed signals, PASS = poor fundamentals or very high risk"
        ),
      reasoning: z
        .array(z.string())
        .describe("Bullet points explaining the recommendation"),
      positives: z
        .array(z.string())
        .describe("Key investment positives (at least 2 if available)"),
      negatives: z
        .array(z.string())
        .describe("Key investment negatives or risks (at least 2 if available)"),
      summary: z
        .string()
        .describe(
          "2–3 sentence executive summary of the investment case for a sophisticated investor"
        ),
    });

    const llm = getLLM().withStructuredOutput(schema);
    const result = await llm.invoke([
      new SystemMessage(
        "You are a senior investment analyst making a final recommendation after an AI bull vs bear debate. Your recommendation must align with the judge's debate verdict, confidence score, and aggregated research data. Strongly consider the debate winner and judge reasoning. BUY when scores are strong, bull case won, and risk is low. HOLD for mixed signals or balanced debate. PASS for weak fundamentals, bear case won, or high risk. Be direct and specific. Return a structured JSON. All numeric fields MUST be plain numbers (e.g., 75), never strings, never text like 'Not Provided' or 'N/A'. If data is genuinely unavailable, use a reasonable default numeric estimate instead of a placeholder string."
      ),
      new HumanMessage(
        `Company: ${state.companyName}\n\nAggregated Research Summary:\n${context}\n\nProvide the final investment recommendation.`
      ),
    ]);

    console.log(
      `[final_decision] OK. Recommendation=${result.recommendation} Confidence=${confidence}`
    );
    return {
      recommendation: result.recommendation,
      confidence,
      reasoning: result.reasoning,
      positives: result.positives,
      negatives: result.negatives,
      summary: result.summary,
    };
  } catch (err) {
    console.error("[final_decision] Error (using deterministic fallback):", err);

    // Deterministic fallback — never returns 0% confidence
    const judgeVerdict = judge?.finalVerdict;
    const rec =
      judgeVerdict === "BUY" || judgeVerdict === "HOLD" || judgeVerdict === "PASS"
        ? judgeVerdict
        : confidence >= 65
          ? "HOLD"
          : "PASS";
    return {
      recommendation: rec,
      confidence,
      reasoning: [
        "Research data was collected across financial, news, competitor, risk, and valuation dimensions.",
        "AI bull vs bear debate was adjudicated by the judge agent.",
        "Confidence score was calculated from weighted agent and debate scores.",
        "Manual review is recommended due to LLM response error on final synthesis.",
      ],
      positives: ["Research data successfully collected across all dimensions."],
      negatives: [
        "Final synthesis agent encountered an error — results are based on automated scoring only.",
      ],
      summary:
        "Automated research completed. The confidence score is based on weighted financial, news, risk, valuation, and competitive intelligence scores. Please review each section and consult a financial advisor.",
    };
  }
};

// ─── Build & compile the StateGraph ──────────────────────────────────────────
const workflow = new StateGraph(GraphState)
  .addNode("fetch_financials", fetchFinancials)
  .addNode("fetch_news", fetchNews)
  .addNode("analyze_competitors", analyzeCompetitors)
  .addNode("assess_risks", assessRisks)
  .addNode("evaluate_valuation", evaluateValuation)
  .addNode("bull_agent", bullAgentNode)
  .addNode("bear_agent", bearAgentNode)
  .addNode("judge_agent", judgeAgentNode)
  .addNode("final_decision", finalDecision)
  .addEdge("__start__", "fetch_financials")
  .addEdge("fetch_financials", "fetch_news")
  .addEdge("fetch_news", "analyze_competitors")
  .addEdge("analyze_competitors", "assess_risks")
  .addEdge("assess_risks", "evaluate_valuation")
  // Parallel debate branches after valuation
  .addEdge("evaluate_valuation", "bull_agent")
  .addEdge("evaluate_valuation", "bear_agent")
  // Judge waits for both bull and bear to complete (LangGraph fan-in)
  .addEdge("bull_agent", "judge_agent")
  .addEdge("bear_agent", "judge_agent")
  .addEdge("judge_agent", "final_decision")
  .addEdge("final_decision", "__end__");

export const agent = workflow.compile();
