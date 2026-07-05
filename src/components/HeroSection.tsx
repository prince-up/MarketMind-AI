"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

function IsometricIllustration() {
  return (
    <div className="relative w-full max-w-[480px] mx-auto h-[320px] md:h-[380px]">
      {/* Ground plane */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-[90%] h-32 bg-gradient-to-t from-[#e8f5f0] to-[#f0faf6] rounded-3xl transform skew-y-1" />

      {/* Buildings - isometric style using CSS transforms */}
      <div className="absolute bottom-16 left-[8%] w-16 h-28 bg-[#00b386]/20 border border-[#00b386]/30 rounded-t-lg transform -skew-x-6 shadow-lg">
        <div className="absolute inset-x-2 top-3 space-y-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-1.5 bg-[#00b386]/30 rounded-full" />
          ))}
        </div>
      </div>

      <div className="absolute bottom-16 left-[28%] w-20 h-36 bg-[#a8d4f0]/60 border border-[#7eb8e0]/40 rounded-t-xl transform skew-x-3 shadow-lg">
        <div className="absolute top-0 inset-x-0 h-6 bg-[#7eb8e0]/30 rounded-t-xl" />
        <div className="absolute inset-x-2 top-10 space-y-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-1 bg-white/50 rounded-full" />
          ))}
        </div>
      </div>

      <div className="absolute bottom-16 left-[48%] w-24 h-44 bg-[#c8e6a0]/70 border border-[#a8d080]/40 rounded-t-2xl transform -skew-x-3 shadow-xl">
        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[#00b386]/30 flex items-center justify-center">
          <div className="w-4 h-4 rounded-full bg-[#00b386]" />
        </div>
        <div className="absolute inset-x-3 top-14 space-y-2">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex gap-1">
              <div className="flex-1 h-1 bg-white/40 rounded-full" />
              <div className="w-4 h-1 bg-[#00b386]/40 rounded-full" />
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-16 right-[12%] w-14 h-24 bg-[#44475b]/10 border border-[#44475b]/15 rounded-t-lg transform skew-x-6 shadow-md">
        <div className="absolute inset-x-2 top-4 space-y-1.5">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-1 bg-[#44475b]/20 rounded-full" />
          ))}
        </div>
      </div>

      {/* Floating chart card */}
      <div className="absolute top-8 right-[5%] w-36 bg-white rounded-2xl shadow-xl border border-[#e9e9eb] p-3 transform rotate-3">
        <div className="text-[10px] font-semibold text-[#44475b] mb-2">NIFTY 50</div>
        <div className="text-lg font-bold text-[#44475b] font-mono">24,324</div>
        <div className="text-xs text-[#00b386] font-medium">+0.42%</div>
        <div className="mt-2 flex items-end gap-0.5 h-8">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="flex-1 bg-[#00b386]/40 rounded-sm"
              style={{ height: `${40 + i * 6}%` }}
            />
          ))}
        </div>
      </div>

      {/* Floating stock card */}
      <div className="absolute top-16 left-[2%] w-32 bg-[#a8d4f0] rounded-2xl shadow-lg p-3 transform -rotate-6">
        <div className="text-[10px] font-bold text-[#44475b]">NVDA</div>
        <div className="text-sm font-bold text-[#44475b] font-mono mt-0.5">$875.28</div>
        <div className="mt-2 h-1.5 bg-white/60 rounded-full overflow-hidden">
          <div className="h-full w-3/4 bg-[#00b386] rounded-full" />
        </div>
      </div>

      {/* Decorative dots */}
      <div className="absolute top-4 right-[40%] w-3 h-3 rounded-full bg-[#00b386]/30" />
      <div className="absolute bottom-32 right-[30%] w-2 h-2 rounded-full bg-[#a8d4f0]" />
    </div>
  );
}

export default function HeroSection() {
  return (
    <section className="relative pt-[60px] bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* Left: copy */}
          <div className="text-center lg:text-left">
            <h1 className="text-[2.75rem] sm:text-5xl md:text-6xl lg:text-[4.25rem] font-extrabold text-[#44475b] tracking-tight leading-[1.05] mb-6">
              MarketMind
              <br />
              <span className="text-[#00b386]">your research</span>
            </h1>
            <p className="text-base md:text-lg text-[#7c7e8c] max-w-md mx-auto lg:mx-0 leading-relaxed mb-8">
              Shortlist stocks, analyze fundamentals, and get AI-powered insights — built for investors who do their homework.
            </p>
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 px-8 py-3.5 text-base font-bold text-white bg-[#00b386] hover:bg-[#00926d] rounded-full transition-all hover:scale-[1.02] shadow-lg shadow-[#00b386]/20"
            >
              Get started <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          {/* Right: illustration */}
          <div className="relative">
            <IsometricIllustration />
          </div>
        </div>
      </div>
    </section>
  );
}
