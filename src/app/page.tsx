"use client";

import React, { useState } from "react";
import CompanyInput from "@/components/CompanyInput";
import ResearchProgress from "@/components/ResearchProgress";
import VerdictCard from "@/components/VerdictCard";
import DetailedReport from "@/components/DetailedReport";
import HelpChatWidget from "@/components/HelpChatWidget";
import MethodologyPanel from "@/components/MethodologyPanel";
import { ResearchResult } from "@/types";
import { ArrowLeft, BookOpen } from "lucide-react";

type AppState = "idle" | "loading" | "result";

export default function Home() {
  const [appState, setAppState] = useState<AppState>("idle");
  const [currentCompany, setCurrentCompany] = useState("");
  const [result, setResult] = useState<ResearchResult | null>(null);
  const [activeNode, setActiveNode] = useState<string | null>(null);
  const [completedNodes, setCompletedNodes] = useState<string[]>([]);
  const [isMethodologyOpen, setIsMethodologyOpen] = useState(false);

  const handleStartResearch = async (companyName: string) => {
    setCurrentCompany(companyName);
    setAppState("loading");
    setActiveNode("fetch_financials");
    setCompletedNodes([]);
    
    try {
      const response = await fetch("/api/research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companyName }),
      });
      
      if (!response.ok) {
        throw new Error("Failed to fetch research");
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error("No readable stream response found.");
      }

      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        // Keep the last partial line in the buffer
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.trim()) continue;
          try {
            const event = JSON.parse(line);
            if (event.type === "node_complete") {
              const node = event.node;
              setCompletedNodes((prev) => {
                if (prev.includes(node)) return prev;
                return [...prev, node];
              });
              // Set the next active node based on graph order
              if (node === "fetch_financials") setActiveNode("fetch_news");
              else if (node === "fetch_news") setActiveNode("analyze_competitors");
              else if (node === "analyze_competitors") setActiveNode("assess_risks");
              else if (node === "assess_risks") setActiveNode("evaluate_valuation");
              else if (node === "evaluate_valuation") setActiveNode("final_decision");
            } else if (event.type === "complete") {
              setResult(event.result);
              setAppState("result");
            } else if (event.type === "error") {
              throw new Error(event.error);
            }
          } catch (e) {
            console.error("Stream parse line error:", e);
          }
        }
      }
    } catch (error: any) {
      console.error(error);
      alert(`Research Failed: ${error?.message || "An error occurred during research."}`);
      setAppState("idle");
    }
  };

  const handleReset = () => {
    setAppState("idle");
    setCurrentCompany("");
    setResult(null);
    setActiveNode(null);
    setCompletedNodes([]);
  };

  return (
    <main className="min-h-screen p-4 md:p-8 flex flex-col items-center bg-black text-neutral-200">
      {/* Top Navigation / Logo area */}
      <div className="w-full max-w-5xl flex items-center justify-between mb-8">
        <div className="flex items-center gap-2 cursor-pointer" onClick={handleReset}>
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/30">
            <div className="w-4 h-4 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          <span className="font-bold text-neutral-100 tracking-tight">AI Investment Research Console</span>
        </div>
        
        <button
          onClick={() => setIsMethodologyOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-neutral-400 hover:text-white bg-neutral-900 border border-neutral-800 rounded-xl transition-all"
        >
          <BookOpen className="w-3.5 h-3.5" />
          Methodology
        </button>
      </div>

      <div className="w-full max-w-5xl flex-1 flex flex-col justify-start">
        {/* State Machine Rendering */}
        <div className={`transition-opacity duration-300 ${appState === "idle" ? "opacity-100" : "opacity-0 hidden"}`}>
          {appState === "idle" && <CompanyInput onResearch={handleStartResearch} />}
        </div>

        {/* Loading with Skeletons */}
        <div className={`transition-opacity duration-300 w-full ${appState === "loading" ? "opacity-100" : "opacity-0 hidden"}`}>
          {appState === "loading" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start w-full">
              {/* Progress Panel */}
              <div className="lg:col-span-1">
                <ResearchProgress 
                  companyName={currentCompany} 
                  activeNode={activeNode}
                  completedNodes={completedNodes}
                />
              </div>
              
              {/* Dashboard Layout Skeletons */}
              <div className="lg:col-span-2 space-y-6">
                <div className="h-44 w-full rounded-3xl bg-neutral-900/60 border border-neutral-800/40 p-6 flex flex-col justify-between animate-pulse">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2.5 w-1/3">
                      <div className="h-4 bg-neutral-800 rounded-md w-3/4" />
                      <div className="h-8 bg-neutral-800 rounded-md w-full" />
                    </div>
                    <div className="h-10 bg-neutral-800 rounded-xl w-24" />
                  </div>
                  <div className="h-4 bg-neutral-800 rounded-md w-full mt-4" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="h-56 bg-neutral-900/60 border border-neutral-800/40 rounded-3xl p-6 flex flex-col justify-between animate-pulse">
                    <div className="h-4 bg-neutral-800 rounded-md w-1/2" />
                    <div className="space-y-2">
                      <div className="h-3 bg-neutral-800 rounded-md w-full" />
                      <div className="h-3 bg-neutral-800 rounded-md w-5/6" />
                      <div className="h-3 bg-neutral-800 rounded-md w-2/3" />
                    </div>
                    <div className="h-3 bg-neutral-800 rounded-md w-1/3" />
                  </div>
                  <div className="h-56 bg-neutral-900/60 border border-neutral-800/40 rounded-3xl p-6 flex flex-col justify-between animate-pulse">
                    <div className="h-4 bg-neutral-800 rounded-md w-1/2" />
                    <div className="space-y-2">
                      <div className="h-3 bg-neutral-800 rounded-md w-full" />
                      <div className="h-3 bg-neutral-800 rounded-md w-5/6" />
                      <div className="h-3 bg-neutral-800 rounded-md w-2/3" />
                    </div>
                    <div className="h-3 bg-neutral-800 rounded-md w-1/3" />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className={`transition-opacity duration-300 w-full ${appState === "result" ? "opacity-100" : "opacity-0 hidden"}`}>
          {appState === "result" && result && (
            <div className="w-full space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-white tracking-tight">{result.companyName}</h1>
                  <p className="text-neutral-400 text-sm mt-1">Research complete • Deterministic confidence calculated</p>
                </div>
                <button 
                  onClick={handleReset}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-neutral-300 hover:text-white bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 rounded-xl transition-all"
                >
                  <ArrowLeft className="w-4 h-4" />
                  New Research
                </button>
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
        </div>
      </div>

      {/* Floating Onboarding/Help Chatbot Widget */}
      <HelpChatWidget />

      {/* Methodology Overlay Modal */}
      <MethodologyPanel isOpen={isMethodologyOpen} onClose={() => setIsMethodologyOpen(false)} />
    </main>
  );
}
