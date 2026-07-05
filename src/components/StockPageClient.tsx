"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Download, Loader2 } from "lucide-react";
import StockDashboard from "@/components/StockDashboard";
import StockPageHeader from "@/components/StockPageHeader";
import DetailedReport from "@/components/DetailedReport";
import VerdictCard from "@/components/VerdictCard";
import ResearchProgress from "@/components/ResearchProgress";
import HelpChatWidget from "@/components/HelpChatWidget";
import MethodologyPanel from "@/components/MethodologyPanel";
import { ResearchResult } from "@/types";
import { stockPagePath } from "@/lib/stockSlug";
import { createClient } from "@/lib/supabase/client";

type ResearchState = "idle" | "loading" | "result";

interface StockPageClientProps {
  slug: string;
  logoHref?: string;
}

export default function StockPageClient({ slug, logoHref = "/" }: StockPageClientProps) {
  const router = useRouter();
  const supabase = createClient();

  const [researchState, setResearchState] = useState<ResearchState>("idle");
  const [result, setResult] = useState<ResearchResult | null>(null);
  const [activeNode, setActiveNode] = useState<string | null>(null);
  const [completedNodes, setCompletedNodes] = useState<string[]>([]);
  const [companyName, setCompanyName] = useState("");
  const [credits, setCredits] = useState<number | null>(null);
  const [isMethodologyOpen, setIsMethodologyOpen] = useState(false);

  useEffect(() => {
    const fetchCredits = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from("profiles")
          .select("credits")
          .eq("id", user.id)
          .single();
        if (data) setCredits(data.credits);
      }
    };
    fetchCredits();
  }, [supabase]);

  const handleSearch = useCallback(
    (query: string) => {
      router.push(stockPagePath(query));
    },
    [router]
  );

  const handleRunResearch = async (displayName: string) => {
    if (credits !== null && credits <= 0) {
      alert("Insufficient credits. Please upgrade to Pro.");
      return;
    }

    setCompanyName(displayName);
    setResearchState("loading");
    setActiveNode("fetch_financials");
    setCompletedNodes([]);
    setResult(null);

    try {
      const response = await fetch("/api/research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companyName: displayName }),
      });

      if (response.status === 401) {
        router.push("/login");
        return;
      }

      if (response.status === 402) {
        const err = await response.json();
        throw new Error(err.error);
      }

      if (!response.ok) {
        throw new Error("Failed to fetch research");
      }

      setCredits((prev) => (prev !== null ? prev - 1 : prev));

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No readable stream response found.");

      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.trim()) continue;
          try {
            const event = JSON.parse(line);
            if (event.type === "node_complete") {
              const node = event.node;
              setCompletedNodes((prev) =>
                prev.includes(node) ? prev : [...prev, node]
              );
              if (node === "fetch_financials") setActiveNode("fetch_news");
              else if (node === "fetch_news") setActiveNode("analyze_competitors");
              else if (node === "analyze_competitors") setActiveNode("assess_risks");
              else if (node === "assess_risks") setActiveNode("evaluate_valuation");
              else if (node === "evaluate_valuation") setActiveNode("final_decision");
            } else if (event.type === "complete") {
              setResult(event.result);
              setResearchState("result");
              setTimeout(() => {
                document.getElementById("ai-research")?.scrollIntoView({ behavior: "smooth" });
              }, 100);
            } else if (event.type === "error") {
              throw new Error(event.error);
            }
          } catch (e) {
            console.error("Stream parse line error:", e);
          }
        }
      }
    } catch (error: unknown) {
      console.error(error);
      const message = error instanceof Error ? error.message : "An error occurred during research.";
      alert(`Research Failed: ${message}`);
      setResearchState("idle");
    }
  };

  const handleDownloadPDF = () => {
    window.print();
  };

  const aiResearchSection = (
    <div id="ai-research" className="scroll-mt-36 pt-4">
      {researchState === "loading" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start w-full mb-8">
          <div className="lg:col-span-1">
            <ResearchProgress
              companyName={companyName}
              activeNode={activeNode}
              completedNodes={completedNodes}
            />
          </div>
          <div className="lg:col-span-2 flex items-center justify-center h-64 bg-slate-50 rounded-lg border border-slate-200">
            <Loader2 className="w-8 h-8 text-[#00b386] animate-spin" />
          </div>
        </div>
      )}

      {researchState === "result" && result && (
        <div className="space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-[20px] font-semibold text-[#44475b]">AI Research Report</h2>
            <div className="flex items-center gap-3">
              <button
                onClick={handleDownloadPDF}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors"
              >
                <Download className="w-4 h-4" />
                Export PDF
              </button>
            </div>
          </div>

          <VerdictCard
            verdict={result.verdict}
            confidence={result.confidence}
            reasoning={result.reasoning}
            summary={result.summary}
            positives={result.positives}
            negatives={result.negatives}
          />

          <DetailedReport report={result} />
        </div>
      )}

      {researchState === "idle" && (
        <div className="py-12 text-center border border-dashed border-slate-200 rounded-lg bg-slate-50/50">
          <p className="text-[#7c7e8c] text-sm mb-4">
            Run AI research to get financial health, valuation, news sentiment, and a buy/hold/pass verdict.
          </p>
          <button
            onClick={() => handleRunResearch(companyName || slug.replace(/-/g, " "))}
            className="inline-flex items-center gap-2 bg-[#00b386] hover:bg-[#00926d] text-white font-semibold px-6 py-3 rounded-lg transition-colors"
          >
            Run AI Research
          </button>
        </div>
      )}
    </div>
  );

  return (
    <main className="min-h-screen flex flex-col items-center bg-white text-slate-900">
      <StockPageHeader
        onSearch={handleSearch}
        credits={credits}
        onMethodologyOpen={() => setIsMethodologyOpen(true)}
        logoHref={logoHref}
      />

      <div className="w-full max-w-[1280px] flex-1 px-4 md:px-8 py-8">
        <div className="mb-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-sm text-[#7c7e8c] hover:text-[#44475b] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
        </div>

        <StockDashboard
          ticker={slug}
          onRunResearch={(name) => handleRunResearch(name)}
          onCompanyResolved={setCompanyName}
          researchState={researchState}
          aiResearchSection={aiResearchSection}
        />
      </div>

      <HelpChatWidget />
      <MethodologyPanel isOpen={isMethodologyOpen} onClose={() => setIsMethodologyOpen(false)} />
    </main>
  );
}
