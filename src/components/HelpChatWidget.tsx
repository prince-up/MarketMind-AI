"use client";

import React, { useState, useRef, useEffect } from "react";
import { Bot, X, Send, Sparkles, Loader2 } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const CHIPS = [
  "How is confidence calculated?",
  "What data sources do you use?",
  "Is this financial advice?",
];

export default function HelpChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hi! I'm MarketMind Guide — ask me about our research methodology, data sources, or how to read the AI verdict.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: text };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/help-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage],
        }),
      });

      if (!response.ok) throw new Error("Failed to send message");

      const data = await response.json();
      setMessages((prev) => [...prev, { role: "assistant", content: data.response }]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, I ran into an error. Please try again in a moment." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSend(input);
  };

  return (
    <div id="help-chat-widget" className="fixed bottom-6 right-6 z-40">
      {/* Floating Action Button */}
      {!isOpen && (
        <div className="relative">
          <span
            className="absolute inset-0 rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] chat-fab-pulse"
            aria-hidden
          />
          <button
            onClick={() => setIsOpen(true)}
            className="relative w-14 h-14 rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] text-white flex items-center justify-center shadow-lg shadow-blue-500/30 border border-white/20 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300"
            aria-label="Open chat assistant"
          >
            <Bot className="w-6 h-6" />
            <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-[var(--buy)] rounded-full border-2 border-white" />
          </button>
        </div>
      )}

      {/* Chat Panel */}
      {isOpen && (
        <div className="w-[360px] sm:w-[400px] h-[520px] bg-white/95 backdrop-blur-xl border border-slate-200/80 rounded-2xl shadow-2xl shadow-slate-900/10 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
          {/* Header */}
          <div className="relative px-4 py-4 bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 backdrop-blur-sm rounded-xl border border-white/25">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-white">MarketMind Guide</h3>
                <span className="text-[10px] text-blue-100 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-300 animate-pulse" />
                  Online · Methodology help
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-lg transition-colors border border-white/20"
              aria-label="Close chat"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Chips */}
          <div className="px-3 py-2.5 bg-slate-50/80 border-b border-slate-100 flex flex-wrap gap-1.5 shrink-0">
            {CHIPS.map((chip) => (
              <button
                key={chip}
                onClick={() => handleSend(chip)}
                disabled={isLoading}
                className="text-[10px] px-2.5 py-1.5 bg-white hover:bg-blue-50 border border-slate-200 hover:border-[var(--primary)]/30 text-slate-600 hover:text-[var(--primary)] rounded-full transition-colors disabled:opacity-55"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gradient-to-b from-slate-50/50 to-white">
            {messages.map((msg, i) => {
              const isAssistant = msg.role === "assistant";
              return (
                <div
                  key={i}
                  className={`flex ${isAssistant ? "justify-start" : "justify-end"}`}
                >
                  {isAssistant && (
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] flex items-center justify-center mr-2 mt-1 shrink-0">
                      <Bot className="w-3 h-3 text-white" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                      isAssistant
                        ? "bg-white text-slate-700 border border-slate-200/80 shadow-sm rounded-tl-sm"
                        : "bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] text-white font-medium rounded-tr-sm shadow-sm"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              );
            })}
            {isLoading && (
              <div className="flex justify-start">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] flex items-center justify-center mr-2 mt-1 shrink-0">
                  <Bot className="w-3 h-3 text-white" />
                </div>
                <div className="bg-white border border-slate-200/80 px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-2">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                  <span className="text-[10px] text-slate-500">Thinking...</span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input Form */}
          <form
            onSubmit={handleFormSubmit}
            className="p-3 bg-white border-t border-slate-100 flex gap-2 items-center shrink-0"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about methodology..."
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary-muted)] transition-all placeholder:text-slate-400"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="p-2.5 bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] hover:from-[var(--primary-hover)] hover:to-[var(--primary)] text-white rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
