"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Download, Loader2 } from "lucide-react";
import AppShell from "@/components/layout/AppShell";
import StockDashboard from "@/components/StockDashboard";
import DetailedReport from "@/components/DetailedReport";
import VerdictCard from "@/components/VerdictCard";
import ResearchProgress from "@/components/ResearchProgress";
import HelpChatWidget from "@/components/HelpChatWidget";
import MethodologyPanel from "@/components/MethodologyPanel";
import Button from "@/components/ui/Button";
import { ResearchResult } from "@/types";
import { stockPagePath } from "@/lib/stockSlug";
import { createClient } from "@/lib/supabase/client";

type ResearchState = "idle" | "loading" | "result";

interface StockPageClientProps {
  slug: string;
}

export default function StockPageClient({ slug }: StockPageClientProps) {
  const router = useRouter();
  const supabase = createClient();

  const [researchState, setResearchState] = useState<ResearchState>("idle");
  const [result, setResult] = useState<ResearchResult | null>(null);
  const [activeNode, setActiveNode] = useState<string | null>(null);
  const [completedNodes, setCompletedNodes] = useState<string[]>([]);
  const [companyName, setCompanyName] = useState("");
  const [credits, setCredits] = useState<number | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [isMethodologyOpen, setIsMethodologyOpen] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const meta = user.user_metadata?.full_name ?? user.email?.split("@")[0];
        setUserName(meta ?? null);
        const { data } = await supabase
          .from("profiles")
          .select("credits")
          .eq("id", user.id)
          .single();
        if (data) setCredits(data.credits);
      }
    };
    fetchUser();
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
    <div id="ai-research" className="scroll-mt-24 pt-4">
      {researchState === "loading" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start w-full mb-8">
          <div className="lg:col-span-1">
            <ResearchProgress
              companyName={companyName}
              activeNode={activeNode}
              completedNodes={completedNodes}
            />
          </div>
          <div className="lg:col-span-2 flex items-center justify-center h-64 bg-white rounded-xl border border-[var(--border)]">
            <Loader2 className="w-8 h-8 text-[var(--primary)] animate-spin" />
          </div>
        </div>
      )}

      {researchState === "result" && result && (
        <div className="space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">AI Research Report</h2>
            <Button variant="outline" size="sm" onClick={handleDownloadPDF}>
              <Download className="w-4 h-4" />
              Export PDF
            </Button>
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
        <div className="py-12 text-center border border-dashed border-[var(--border)] rounded-xl bg-[var(--surface-muted)]">
          <p className="text-[var(--text-secondary)] text-sm mb-4">
            Run AI research to get financial health, valuation, news sentiment, and a buy/hold/pass verdict.
          </p>
          <Button onClick={() => handleRunResearch(companyName || slug.replace(/-/g, " "))}>
            Run AI Research
          </Button>
        </div>
      )}
    </div>
  );

  return (
    <>
      <AppShell
        onSearch={handleSearch}
        credits={credits}
        userName={userName}
        onMethodologyOpen={() => setIsMethodologyOpen(true)}
        searchPlaceholder="Search stocks..."
      >
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <StockDashboard
          ticker={slug}
          onRunResearch={(name) => handleRunResearch(name)}
          onCompanyResolved={setCompanyName}
          researchState={researchState}
          aiResearchSection={aiResearchSection}
        />
      </AppShell>

      <HelpChatWidget />
      <MethodologyPanel isOpen={isMethodologyOpen} onClose={() => setIsMethodologyOpen(false)} />
    </>
  );
}
