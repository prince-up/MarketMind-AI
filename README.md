This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

# AI Development Log — AI Investment Research Agent

This document captures how AI (Claude + Antigravity/Groq-powered coding assistant) was used throughout the build process — planning, prompt engineering, debugging, and design decisions. It's structured chronologically to show the actual thought process, not a cleaned-up narrative.

---

## Tools Used
- **Claude (Anthropic)** — planning, architecture decisions, debugging analysis, prompt drafting for Antigravity, code review
- **Antigravity (AI coding assistant)** — actual code generation, executed the prompts drafted with Claude
- **LLM in the app itself**: Started with Gemini 2.0 Flash, switched to Groq (Llama 3.3 70B) due to persistent free-tier quota issues

---

## Phase 1: Planning & Architecture

**Problem:** Needed to build an AI Investment Research Agent using React/Next.js + Node.js + LangGraph.js per the assignment's mandated stack.

**Approach discussed with Claude:**
- Broke the agent into a sequential LangGraph.js pipeline: fetch_financials → fetch_news → analyze_competitors → assess_risks → evaluate_valuation → final_decision
- Decided on Yahoo Finance (yahoo-finance2) for financials and Tavily for news/competitor search — both because they were free/low-friction to integrate
- Discussed how to differentiate from other students' submissions: depth of reasoning per factor (not a single LLM call), real data instead of hallucinated numbers, explainability in the UI, and a clearly justified investment philosophy

**Key decision:** Multi-node graph with each factor (financial, news, competitor, risk, valuation) as its own reasoning step, feeding into a final structured decision — rather than one big prompt asking for everything at once.

---

## Phase 2: Frontend Build

**Prompt used (via Antigravity):**
> Build the FRONTEND ONLY (no backend logic yet) for a Next.js 14 (App Router) web application called "AI Investment Research Agent"... [full prompt used — see prompts/frontend_prompt.txt]

**Outcome:** Generated CompanyInput, ResearchProgress, VerdictCard, DetailedReport components with mock data, dark fintech-style UI.

*(Antigravity successfully built out the entire UI structure, including styled components and responsive layout.)*

---

## Phase 3: Backend / LangGraph Agent Build

**Prompt used:** Full LangGraph.js StateGraph spec — nodes for fetch_financials, fetch_news, analyze_competitors, assess_risks, evaluate_valuation, final_decision, using Zod for structured output.

*(Antigravity implemented the `agent.ts` and Next.js API route to execute this graph and stream updates back to the UI.)*

---

## Phase 4: Debugging Round 1 — Environment/Library Mismatches

Three bugs surfaced on first real run:

1. **`yahoo-finance2` v3 API change** — needed `new YahooFinance()` instantiation instead of static import calls. Fixed by instantiating the class properly.
2. **Tavily tool input schema mismatch** — `TavilySearch.invoke()` expected an object (`{ query: "..." }`), not a raw string. Fixed the call signature in both fetchNews and analyzeCompetitors nodes.
3. **`gemini-1.5-flash` deprecated (404)** — swapped to `gemini-2.0-flash`.

**Reflection:** These were classic "library version drift" bugs — none were logic errors, all were API contract mismatches that only show up at runtime, reinforcing the value of reading actual error stack traces rather than guessing.

---

## Phase 5: Debugging Round 2 — Gemini Quota Issues

Even after fixing the model name, hit persistent `429 Too Many Requests` with `limit: 0` on the free tier — across multiple fresh API keys. Diagnosed as a project/account-level free-tier eligibility issue, not a key problem (confirmed by testing with a brand-new key that showed the identical error).

**Decision:** Rather than lose more days chasing a Google Cloud billing/eligibility issue this close to the deadline, switched the LLM provider entirely — from `@langchain/google-genai` to `@langchain/groq` (Llama 3.3 70B Versatile), which has a genuinely functional free tier with no billing setup required.

**Trade-off noted for README:** This is a good example of a pragmatic engineering call — prioritizing working software over sticking with the "planned" provider when the planned provider had an environment-specific blocker outside the code itself.

---

## Phase 6: Production-Grade Refactor

Restructured every agent node to return strict typed JSON (financial scores, risk scores with severity levels, structured competitor comparisons) instead of prose paragraphs, and designed a **weighted, deterministic confidence formula** instead of letting the LLM invent a confidence percentage:

```
confidence = (financialScore * 0.30) + (newsSentimentScore * 0.20)
           + ((100 - riskScore) * 0.20) + (valuationScore * 0.20)
           + (competitorScore * 0.10)
```

Note: riskScore is inverted in the formula since a higher risk score means lower investment confidence.

---

## Phase 7: Debugging Round 3 — Structured Output / Zod Schema Issues

Groq's structured-output tool-calling surfaced a new class of bugs:

1. Numeric fields sometimes returned as strings (`"80"` instead of `80`), or placeholder text (`"Not Provided"`) where a number was expected.
2. Competitor schema rejected extra fields the LLM added on its own (`aiLeadership`, `pricing`, `growth`).
3. A strict `.min(2)` requirement on the `positives` array caused failures when the LLM legitimately had only one positive to report.

**First attempted fix (incorrect):** Tried using `z.preprocess()` inside the schema passed to `.withStructuredOutput()` to coerce strings to numbers. This broke ALL nodes with a new error: *"Transforms cannot be represented in JSON Schema"* — because Groq converts the Zod schema to JSON Schema for tool-calling, and JSON Schema has no way to represent a Zod transform function.

**Corrected fix:** Kept the Zod schema transform-free (plain `z.union([z.number(), z.string()])`), and moved the string-to-number coercion into plain TypeScript logic executed *after* the LLM call returns — a `toSafeNumber()` helper. Also relaxed strict array minimums to `.min(0).default([])`, and added `.catchall(z.any())` to the competitor schema to tolerate extra LLM-added fields.

**Reflection:** This was a useful lesson in where validation logic belongs — the LLM-facing contract (JSON Schema) needs to stay simple and representable, while data cleaning/coercion belongs in application code, not inside the schema itself.

---

## Phase 8: Frontend Defensive Programming

Fixed a `Cannot read properties of undefined (reading 'map')` crash in `VerdictCard.tsx` and a similar one in `DetailedReport.tsx` — both caused by the frontend assuming API response fields would always be present, even when an upstream node had failed and returned a fallback. Added nullish-coalescing defaults (`?? []`) on every array field rendered via `.map()`, and ensured the API route always returns a complete, safely-defaulted response shape regardless of which nodes succeeded.

---

## Phase 9: Trust & UX Polish

Discussed with Claude how to make the tool feel credible without resorting to fake trust signals (e.g., no fabricated user counts or testimonials — inappropriate for a research tool and indefensible in an interview). Instead:
- Added a "How this works" methodology panel explaining the 5-factor analysis and the exact confidence weighting formula
- Added source attribution tags (Yahoo Finance / Tavily) on every data card
- Added a clear "not financial advice" disclaimer
- Added a lightweight help chatbot scoped only to explaining the tool's methodology (not re-doing investment research)

---

## Final Reflection — What This Process Demonstrates

The AI usage throughout this project was iterative and diagnostic, not "one prompt, one output." Each phase involved:
1. Running the actual code and reading real error output
2. Diagnosing root cause (library version drift, API contract change, schema/JSON-Schema incompatibility, provider-side quota issue)
3. Drafting a targeted fix with reasoning for *why* it should work
4. Verifying the fix against real output
5. Course-correcting when a fix (the Zod preprocess attempt) turned out to be wrong

This is the same loop a working engineer uses AI for day-to-day — and is the reason every part of this codebase can be explained and defended.
