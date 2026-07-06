import React from "react";
import { Globe, LineChart, Search } from "lucide-react";

interface SourceTagProps {
  sources: string[];
}

export default function SourceTag({ sources }: SourceTagProps) {
  if (!sources || sources.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5 pt-3 border-t border-slate-200">
      <span className="source-tag-label text-[10px] text-slate-500 font-medium shrink-0">Sources</span>
      <div className="flex gap-1 flex-wrap">
        {sources.map((source, i) => {
          const isYahoo = source.toLowerCase().includes("yahoo");
          const isTavily = source.toLowerCase().includes("tavily") || source.toLowerCase().includes("search");

          return (
            <div
              key={i}
              className={`source-tag-pill flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium border ${
                isYahoo
                  ? "bg-indigo-50 text-indigo-600 border-indigo-200"
                  : isTavily
                  ? "bg-blue-50 text-blue-600 border-blue-200"
                  : "bg-slate-50 text-slate-600 border-slate-200"
              }`}
            >
              {isYahoo ? <LineChart className="w-2.5 h-2.5 shrink-0" /> : isTavily ? <Search className="w-2.5 h-2.5 shrink-0" /> : <Globe className="w-2.5 h-2.5 shrink-0" />}
              <span className="truncate max-w-[180px]">{source}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
