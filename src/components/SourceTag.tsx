import React from "react";
import { Globe, LineChart, Search } from "lucide-react";

interface SourceTagProps {
  sources: string[];
}

export default function SourceTag({ sources }: SourceTagProps) {
  if (!sources || sources.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 mt-6 pt-4 border-t border-neutral-800/60">
      <span className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold">Sources:</span>
      <div className="flex gap-1.5 flex-wrap">
        {sources.map((source, i) => {
          const isYahoo = source.toLowerCase().includes("yahoo");
          const isTavily = source.toLowerCase().includes("tavily") || source.toLowerCase().includes("search");
          
          return (
            <div 
              key={i} 
              className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] font-medium border ${
                isYahoo 
                  ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/20" 
                  : isTavily 
                  ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                  : "bg-neutral-800/50 text-neutral-400 border-neutral-700"
              }`}
            >
              {isYahoo ? <LineChart className="w-3 h-3" /> : isTavily ? <Search className="w-3 h-3" /> : <Globe className="w-3 h-3" />}
              {source}
            </div>
          );
        })}
      </div>
    </div>
  );
}
