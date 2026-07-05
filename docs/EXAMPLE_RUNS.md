# Example Agent Runs

Representative outputs matching the `ResearchResult` schema in `src/types/index.ts`. These examples reflect realistic agent behavior based on the pipeline design; scores and text are illustrative but structurally accurate.

> **Note:** Run live research in the app to capture timestamped outputs for your submission zip.

---

## 1. NVIDIA Corporation

**Input:** `companyName: "NVIDIA"`

### Final Verdict

```json
{
  "companyName": "NVIDIA",
  "verdict": "BUY",
  "confidence": 78,
  "reasoning": [
    "Financial health score of 88/100 reflects exceptional revenue growth driven by data-center and AI GPU demand.",
    "News sentiment is positive (score 80) with strong momentum around Blackwell architecture and hyperscaler capex.",
    "Competitive position score of 85/100 — clear market leader in AI accelerators with CUDA ecosystem moat.",
    "Risk score of 42/100 (Medium) — valuation and customer concentration are concerns but manageable.",
    "Valuation score of 58/100 suggests the stock is fairly to slightly overvalued at current multiples."
  ],
  "positives": [
    "Dominant share in AI training and inference GPUs",
    "Revenue growth exceeding 60% YoY with expanding operating margins",
    "Strong free cash flow supporting R&D and buybacks",
    "Wide analyst consensus with majority Buy/Strong Buy ratings"
  ],
  "negatives": [
    "Elevated forward P/E implies high growth expectations already priced in",
    "Customer concentration among hyperscalers (Microsoft, Meta, Google)",
    "Geopolitical export restrictions on China sales",
    "Competition from AMD MI300, custom ASICs (Google TPU, Amazon Trainium)"
  ],
  "summary": "NVIDIA remains the benchmark AI infrastructure play with best-in-class financials and competitive positioning. Valuation is stretched but supported by durable demand. Suitable for growth-oriented investors comfortable with premium multiples; monitor export policy and custom silicon competition."
}
```

### Financial (`financial`)

| Field | Value |
|-------|-------|
| ticker | `NVDA` |
| revenueGrowth | `122% YoY — exceptional growth driven by data-center segment` |
| peRatio | `Forward P/E ~35x — premium but justified by growth rate` |
| marketCap | `$2.2T — mega-cap, S&P 500 top holding` |
| cashFlow | `Strong FCF ~$27B TTM; cash generation supports buybacks` |
| debt | `Low debt-to-equity; net cash position` |
| profitability | `Operating margins ~62%; industry-leading profitability` |
| score | `88` |

### News (`news`)

| Field | Value |
|-------|-------|
| sentiment | `positive` |
| sentimentScore | `80` |
| keyEvents | Blackwell B200 shipments ramping; Q4 earnings beat; new sovereign AI deals in UAE/Saudi |
| investmentImpact | Recent news reinforces the AI capex supercycle thesis. Positive earnings surprises and product roadmap visibility support near-term momentum, though any guidance miss could trigger sharp correction given valuation. |

### Competitors (`competitors`)

| Field | Value |
|-------|-------|
| marketPosition | `Undisputed leader in discrete AI GPUs for training and inference` |
| score | `85` |
| competitors | AMD (MI300X — gaining share in inference), Intel (Gaudi — niche), Broadcom (custom ASICs for hyperscalers) |

### Risks (`risks`)

| Field | Value |
|-------|-------|
| riskScore | `42` |
| level | `Medium` |
| risks | Valuation (High), Customer Concentration (Medium), Geopolitical/Export (Medium), Competition (Medium) |

### Valuation (`valuation`)

| Field | Value |
|-------|-------|
| valuation | `Fairly Valued` |
| score | `58` |

### Analyst Data (`analystData`)

```json
{
  "strongBuy": 18,
  "buy": 32,
  "hold": 8,
  "sell": 1,
  "strongSell": 0,
  "targetMeanPrice": 950.00,
  "numberOfAnalystOpinions": 59,
  "recommendationKey": "buy"
}
```

---

## 2. Zomato (Eternal Ltd)

**Input:** `companyName: "Zomato"` *(resolves to Eternal Ltd, NSE: ETERNAL)*

### Final Verdict

```json
{
  "companyName": "Zomato",
  "verdict": "HOLD",
  "confidence": 62,
  "reasoning": [
    "Financial health score of 65/100 — revenue growing but profitability still maturing.",
    "News sentiment is neutral-to-positive (score 62) with Blinkit quick-commerce expansion in focus.",
    "Competitive position score of 58/100 — market leader in food delivery but intense rivalry with Swiggy.",
    "Risk score of 55/100 (Medium) — quick-commerce burn and regulatory uncertainty on gig workers.",
    "Valuation score of 55/100 — stock trades at premium to earnings given growth optionality."
  ],
  "positives": [
    "Largest food delivery platform in India by order volume",
    "Blinkit quick-commerce scaling with improving unit economics",
    "Path to consolidated profitability across food delivery and quick commerce",
    "Strong brand recognition and urban consumer base"
  ],
  "negatives": [
    "Intense competition from Swiggy and potential new entrants",
    "Quick-commerce segment still cash-burning in many cities",
    "Regulatory risk around gig worker classification and delivery fee caps",
    "Low-margin core food delivery business limits near-term earnings power"
  ],
  "summary": "Zomato offers exposure to India's consumer internet growth with a leading food delivery franchise and a scaling quick-commerce bet. Mixed signals on profitability timeline and competitive intensity warrant a HOLD stance. Investors should watch Blinkit contribution margins and Swiggy IPO dynamics."
}
```

### Financial (`financial`)

| Field | Value |
|-------|-------|
| ticker | `ETERNAL.NS` |
| revenueGrowth | `~25% YoY — steady top-line growth across food delivery and Blinkit` |
| peRatio | `P/E not meaningful (recently profitable); EV/Revenue ~4x` |
| marketCap | `~₹2.1L Cr — large-cap Indian consumer internet` |
| cashFlow | `Improving; food delivery segment FCF positive in key cities` |
| debt | `Minimal debt; cash-rich balance sheet post IPO` |
| profitability | `Recently turned profitable at consolidated level; margins thin` |
| score | `65` |

### News (`news`)

| Field | Value |
|-------|-------|
| sentiment | `neutral` |
| sentimentScore | `62` |
| keyEvents | Blinkit dark store expansion; District dining platform launch; Q3 revenue growth in line |
| investmentImpact | News flow is balanced — growth initiatives are positive but competition headlines cap sentiment upside. No single catalyst to shift the investment case sharply in either direction. |

### Competitors (`competitors`)

| Field | Value |
|-------|-------|
| marketPosition | `Market leader in Indian food delivery; #2 in quick commerce behind Blinkit's growth phase` |
| score | `58` |
| competitors | Swiggy (primary rival — similar scale, IPO pending), Zepto (quick commerce), Dunzo (hyperlocal) |

### Risks (`risks`)

| Field | Value |
|-------|-------|
| riskScore | `55` |
| level | `Medium` |
| risks | Competition (High), Execution/Quick-commerce burn (Medium), Regulatory (Medium), Valuation (Medium) |

### Valuation (`valuation`)

| Field | Value |
|-------|-------|
| valuation | `Fairly Valued` |
| score | `55` |

---

## 3. PC Jeweller Ltd (Indian Stock)

**Input:** `companyName: "PC Jeweller"` *(NSE: PCJEWELLER.NS)*

### Final Verdict

```json
{
  "companyName": "PC Jeweller",
  "verdict": "PASS",
  "confidence": 41,
  "reasoning": [
    "Financial health score of 38/100 — weak revenue trajectory and margin compression.",
    "News sentiment is negative (score 28) with concerns over store closures and debt restructuring.",
    "Competitive position score of 35/100 — lost ground to Tanishq, Kalyan, and regional chains.",
    "Risk score of 72/100 (High) — liquidity, governance, and operational risks elevated.",
    "Valuation score of 45/100 — low absolute price but value trap characteristics."
  ],
  "positives": [
    "Established brand in mid-tier Indian jewellery segment",
    "Low absolute share price may attract speculative interest",
    "Potential turnaround if debt restructuring succeeds"
  ],
  "negatives": [
    "Declining revenue and store footprint over multiple years",
    "High debt levels and past governance concerns",
    "Intense competition from organized players (Tanishq, Kalyan Jewellers)",
    "Thin liquidity on NSE — wide bid-ask spreads",
    "No clear path to sustainable profitability visible in recent financials"
  ],
  "summary": "PC Jeweller faces structural headwinds in a consolidating Indian jewellery market. Weak fundamentals, elevated risk, and limited competitive moat outweigh any deep-value appeal. PASS — capital is better deployed elsewhere unless a credible turnaround plan emerges."
}
```

### Financial (`financial`)

| Field | Value |
|-------|-------|
| ticker | `PCJEWELLER.NS` |
| revenueGrowth | `Declining — negative YoY revenue trend over recent quarters` |
| peRatio | `P/E not meaningful due to inconsistent earnings` |
| marketCap | `~₹350 Cr — small-cap, low liquidity` |
| cashFlow | `Negative operating cash flow in recent periods` |
| debt | `Elevated debt-to-equity; restructuring discussions reported` |
| profitability | `Loss-making in recent quarters; margins under pressure` |
| score | `38` |

### News (`news`)

| Field | Value |
|-------|-------|
| sentiment | `negative` |
| sentimentScore | `28` |
| keyEvents | Store closure announcements; debt negotiation updates; weak quarterly results |
| investmentImpact | Negative news flow reinforces bearish thesis. No near-term catalyst for recovery; sentiment weighs on any speculative positioning. |

### Competitors (`competitors`)

| Field | Value |
|-------|-------|
| marketPosition | `Declining mid-tier player losing share to organized retail chains` |
| score | `35` |
| competitors | Tanishq/Titan (market leader), Kalyan Jewellers (aggressive expansion), Malabar Gold (regional strength) |

### Risks (`risks`)

| Field | Value |
|-------|-------|
| riskScore | `72` |
| level | `High` |
| risks | Liquidity (High), Debt/Financial distress (High), Competition (High), Governance (Medium), Execution (High) |

### Valuation (`valuation`)

| Field | Value |
|-------|-------|
| valuation | `Fairly Valued` |
| score | `45` |
| negatives | Low price reflects fundamental weakness; not a margin-of-safety opportunity without turnaround evidence |

---

## Streaming Events (All Runs)

During research, the client receives NDJSON events like:

```json
{"type":"node_complete","node":"fetch_financials","data":{"financialData":{"ticker":"NVDA","score":88,...},"earnings":[...],"analystData":{...}}}
{"type":"node_complete","node":"fetch_news","data":{"newsData":{"sentiment":"positive","sentimentScore":80,...}}}
{"type":"node_complete","node":"analyze_competitors","data":{"competitorData":{"score":85,...}}}
{"type":"node_complete","node":"assess_risks","data":{"riskData":{"riskScore":42,"level":"Medium",...}}}
{"type":"node_complete","node":"evaluate_valuation","data":{"valuationData":{"valuation":"Fairly Valued","score":58,...}}}
{"type":"node_complete","node":"final_decision","data":{"recommendation":"BUY","confidence":78,...}}
{"type":"complete","result":{...full ResearchResult...}}
```

The `ResearchProgress` component maps node names to user-friendly labels (e.g., "Fetching Financials", "Analyzing Competitors").
