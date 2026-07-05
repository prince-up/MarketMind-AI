# Build Log — AI-Assisted Development of MarketMind

This document is an honest summary of how AI coding assistants (primarily **Cursor** with Claude/GPT models, and earlier **Antigravity**) were used to build MarketMind. It is inferred from the codebase structure, git history, README notes, and Cursor agent transcripts — not fabricated full chat logs.

> **For submission:** Export your actual Cursor chat transcripts and add them to this `docs/` folder. This file is the narrative summary; transcripts are the raw evidence.

---

## Tools Used

| Tool | Role |
|------|------|
| **Cursor IDE** | Primary development environment; agent mode for multi-file refactors |
| **Claude / GPT (via Cursor)** | Architecture planning, debugging analysis, prompt drafting |
| **Antigravity** | Early code generation from structured prompts (frontend + initial agent) |
| **Groq Llama 3.3 70B** | Runtime LLM in the app (after Gemini quota issues) |

---

## Timeline (from git history and project artifacts)

### Phase 1 — Scaffolding & Agent Core

**Goal:** Meet assignment requirements — Next.js + Node + LangGraph.js multi-agent pipeline.

- Bootstrapped Next.js 16 App Router project.
- Designed a **6-node sequential StateGraph** in `src/lib/agent.ts`:
  - `fetch_financials` → `fetch_news` → `analyze_competitors` → `assess_risks` → `evaluate_valuation` → `final_decision`
- Integrated **Yahoo Finance** (`yahoo-finance2`) for live quotes and **Tavily** for news/competitor search.
- Built `POST /api/research` with NDJSON streaming so the UI shows per-node progress.

**AI usage:** Antigravity generated initial `agent.ts` and API route from a detailed LangGraph spec prompt. Human reviewed node ordering and fallback strategy.

---

### Phase 2 — Frontend (Research Console)

**Goal:** Dark fintech-style UI for the research workflow.

- Components created: `CompanyInput`, `ResearchProgress`, `VerdictCard`, `DetailedReport`, `ScoreGauge`, `MethodologyPanel`.
- Dashboard page wired to stream API events and render structured `ResearchResult`.
- Added earnings history and analyst recommendation widgets (commit: `feat: Add Earnings History and Analyst Recommendation widgets`).

**AI usage:** Frontend-only prompt to Antigravity produced component skeletons with mock data; later wired to live API in Cursor sessions.

---

### Phase 3 — Debugging Round 1 (Library/API Mismatches)

**Issues found on first real run:**

1. **`yahoo-finance2` v3** — Required `new YahooFinance()` instantiation instead of static calls.
2. **Tavily invoke signature** — `TavilySearch.invoke()` expects `{ query: "..." }`, not a raw string.
3. **Gemini model deprecation** — `gemini-1.5-flash` returned 404; switched to `gemini-2.0-flash`.

**AI usage:** Error stack traces pasted into chat; AI diagnosed API contract mismatches. Fixes were small, targeted diffs — not logic rewrites.

---

### Phase 4 — LLM Provider Switch (Gemini → Groq)

**Problem:** Persistent `429 Too Many Requests` on Gemini free tier across multiple API keys — diagnosed as account/project-level quota, not a code bug.

**Decision:** Swap `@langchain/google-genai` for `@langchain/groq` (Llama 3.3 70B Versatile) with a working free tier.

**Trade-off documented in README:** Prioritize working software over the originally planned provider when blocked by external quota.

---

### Phase 5 — Production-Grade Agent Refactor

**Changes:**

- Every node returns **strict typed JSON** (Zod schemas) instead of free-form prose.
- **Deterministic confidence formula** implemented in code — LLM no longer invents confidence %.
- Fallback objects (`FALLBACK_FINANCIAL`, etc.) so no node returns `undefined`.
- API route always returns a complete `ResearchResult` shape with safe defaults.

**AI usage:** Cursor agent refactored `final_decision` to compute weighted confidence; human specified weight distribution (30/20/20/20/10).

---

### Phase 6 — Structured Output / Zod Schema Debugging

**Groq-specific issues:**

1. Numeric fields returned as strings (`"80"`) or placeholder text (`"Not Provided"`).
2. Competitor schema rejected extra LLM fields (`aiLeadership`, `pricing`, `growth`).
3. `.min(2)` on arrays caused failures when LLM had fewer items.

**Failed approach:** `z.preprocess()` inside schemas passed to `.withStructuredOutput()` → *"Transforms cannot be represented in JSON Schema"*.

**Working fix:**

- Schemas use `z.union([z.number(), z.string()])` (JSON Schema-safe).
- `coerceNumber()` helper runs **after** LLM response.
- `.catchall(z.any())` on competitor objects; relaxed array minimums.

**Lesson:** LLM-facing contracts must stay JSON Schema-compatible; coercion belongs in application code.

---

### Phase 7 — Frontend Defensive Programming

- Fixed `Cannot read properties of undefined (reading 'map')` in `VerdictCard` and `DetailedReport`.
- Added `?? []` defaults on all array fields rendered via `.map()`.
- Ensured streaming partial state doesn't crash the UI mid-run.

---

### Phase 8 — Trust & UX Polish

- **Methodology panel** explaining the 5-factor analysis and confidence weights.
- **Source tags** (Yahoo Finance / Tavily domains) on data cards.
- **Help chat widget** (`/api/help-chat`) — scoped to explaining methodology, not giving stock advice.
- Clear "not financial advice" disclaimer.

---

### Phase 9 — Groww-Style Stock Pages

**User request (Cursor transcript, Jul 5 2026):** App opened to a research dashboard; user wanted Groww-like stock URLs (e.g. `/stocks/pc-jeweller-ltd`).

**Implemented (commit: `Add Groww-inspired UI, stock pages, and auth integration`):**

| Change | File(s) |
|--------|---------|
| New `/stocks/[slug]` route | `src/app/stocks/[slug]/page.tsx`, `StockPageClient.tsx` |
| Slug utilities | `src/lib/stockSlug.ts` |
| Instant stock data | `src/app/api/stock/route.ts` (Yahoo Finance) |
| Groww-style dashboard UI | `src/components/StockDashboard.tsx` |
| Search → navigate (not immediate AI) | `dashboard/page.tsx`, `StockPageHeader.tsx` |
| AI research as optional action | "Run AI Research" button on stock page |
| Marketing landing page | `src/app/page.tsx`, hero/feature sections |
| Public `/stocks/*` routes | `src/lib/supabase/session.ts` |

**AI usage:** Cursor agent analyzed Groww's layout vs. existing `StockDashboard` (already ~70% built but buried in `DetailedReport`). Implemented slug routing, auth exceptions, and navigation rewire.

---

### Phase 10 — Vercel Deployment Fix

**Issue (commit: `fix: resolve Vercel ERESOLVE by removing unused LangChain packages`):** `npm install` failed on Vercel due to peer dependency conflicts from unused `@langchain/google-genai` and related packages left over after the Groq migration.

**Fix:** Removed unused LangChain provider packages from `package.json`; verified `npm run build` passes locally.

---

## What This Process Demonstrates

The AI was used in an **iterative diagnostic loop**, not as a one-shot code generator:

1. Run the app → read real errors
2. Diagnose root cause (API drift, schema incompatibility, quota limits)
3. Apply targeted fix with reasoning
4. Verify against live output
5. Course-correct when a fix made things worse (Zod preprocess attempt)

Every architectural choice in the final codebase — sequential graph, deterministic confidence, fallback data, Groww-style routing — can be explained and defended because it emerged from concrete runtime failures, not blind trust in generated code.

---

## Files to Export for Full Submission Evidence

Place these in `docs/` alongside this log:

- Cursor agent transcripts (`.jsonl` from `~/.cursor/projects/.../agent-transcripts/`)
- Screenshots of example runs (NVIDIA, Zomato, PC Jeweller)
- Vercel deployment URL once live
