"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ChevronRight, Download, Home, Loader2 } from "lucide-react";
import AppShell from "@/components/layout/AppShell";
import StockDashboard from "@/components/StockDashboard";
import DetailedReport from "@/components/DetailedReport";
import VerdictCard from "@/components/VerdictCard";
import ResearchProgress from "@/components/ResearchProgress";
import DebateProgress from "@/components/debate/DebateProgress";
import DebateTimeline from "@/components/debate/DebateTimeline";
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

function formatSlugTitle(slug: string) {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export default function StockPageClient({ slug }: StockPageClientProps) {
  const router = useRouter();
  const supabase = createClient();

  const [researchState, setResearchState] = useState<ResearchState>("idle");
  const [result, setResult] = useState<ResearchResult | null>(null);
  const [activeNode, setActiveNode] = useState<string | null>(null);
  const [completedNodes, setCompletedNodes] = useState<string[]>([]);
  const [debateNodes, setDebateNodes] = useState({
    bullComplete: false,
    bearComplete: false,
    judgeComplete: false,
  });
  const [companyName, setCompanyName] = useState("");
  const [credits, setCredits] = useState<number | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [isMethodologyOpen, setIsMethodologyOpen] = useState(false);

  const displayName = companyName || formatSlugTitle(slug);

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
    setDebateNodes({ bullComplete: false, bearComplete: false, judgeComplete: false });
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
              const node = event.node as string;
              setCompletedNodes((prev) =>
                prev.includes(node) ? prev : [...prev, node]
              );

              if (node === "fetch_financials") setActiveNode("fetch_news");
              else if (node === "fetch_news") setActiveNode("analyze_competitors");
              else if (node === "analyze_competitors") setActiveNode("assess_risks");
              else if (node === "assess_risks") setActiveNode("evaluate_valuation");
              else if (node === "evaluate_valuation") setActiveNode("bull_agent");
              else if (node === "bull_agent" || node === "bear_agent") {
                setDebateNodes((prev) => {
                  const next = {
                    ...prev,
                    bullComplete: node === "bull_agent" ? true : prev.bullComplete,
                    bearComplete: node === "bear_agent" ? true : prev.bearComplete,
                  };
                  if (next.bullComplete && next.bearComplete) {
                    setActiveNode("judge_agent");
                  } else {
                    setActiveNode("bull_agent");
                  }
                  return next;
                });
              } else if (node === "judge_agent") {
                setDebateNodes((prev) => ({ ...prev, judgeComplete: true }));
                setActiveNode("final_decision");
              } else if (node === "final_decision") {
                setActiveNode(null);
              }
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
    <div id="ai-research" className="report-section scroll-mt-24 w-full">
      {researchState === "loading" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start w-full">
          <div className="lg:col-span-1">
            <ResearchProgress
              companyName={companyName}
              activeNode={activeNode}
              completedNodes={completedNodes}
            />
          </div>
          <div className="lg:col-span-2 space-y-4">
            <DebateProgress
              bullComplete={debateNodes.bullComplete}
              bearComplete={debateNodes.bearComplete}
              judgeComplete={debateNodes.judgeComplete}
              bullActive={
                activeNode === "bull_agent" && !debateNodes.bullComplete
              }
              bearActive={
                activeNode === "bull_agent" && !debateNodes.bearComplete
              }
              judgeActive={activeNode === "judge_agent" && !debateNodes.judgeComplete}
            />
            <div className="flex items-center justify-center h-48 saas-card">
              <Loader2 className="w-8 h-8 text-[var(--primary)] animate-spin" />
            </div>
          </div>
        </div>
      )}

      {researchState === "result" && result && (
        <div className="space-y-6 w-full">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-xl font-semibold text-[var(--text-primary)] tracking-tight">
              AI Research Report
            </h2>
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

          {result.debate && <DebateTimeline debate={result.debate} />}

          <DetailedReport report={result} />
        </div>
      )}

      {researchState === "idle" && (
        <div className="py-12 text-center border border-dashed border-[var(--border)] rounded-xl bg-white">
          <p className="text-[var(--text-secondary)] text-sm mb-5 max-w-md mx-auto leading-relaxed">
            Run AI research to get financial health, valuation, news sentiment, and a buy/hold/pass verdict.
          </p>
          <Button onClick={() => handleRunResearch(displayName)}>
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
        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm mb-5">
          <Link
            href="/dashboard"
            className="flex items-center gap-1 text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors"
          >
            <Home className="w-3.5 h-3.5" />
            Dashboard
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-[var(--text-muted)]" />
          <Link
            href="/#stocks"
            className="text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors"
          >
            Stocks
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-[var(--text-muted)]" />
          <span className="font-medium text-[var(--text-primary)] truncate max-w-[200px]">
            {displayName}
          </span>
        </nav>

        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors mb-6"
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
