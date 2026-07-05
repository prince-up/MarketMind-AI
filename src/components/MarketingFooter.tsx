import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function MarketingFooter() {
  return (
    <footer className="py-12 md:py-16 border-t border-[#e9e9eb] bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          <div className="sm:col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-full bg-[#00b386] flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-[#44475b]">MarketMind</span>
            </div>
            <p className="text-sm text-[#7c7e8c] leading-relaxed">
              AI-powered stock research for confident investing decisions.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-[#44475b] mb-3">Product</h4>
            <ul className="space-y-2 text-sm text-[#7c7e8c]">
              <li><Link href="/dashboard" className="hover:text-[#00b386] transition-colors">Dashboard</Link></li>
              <li><Link href="/#features" className="hover:text-[#00b386] transition-colors">Features</Link></li>
              <li><Link href="/#stocks" className="hover:text-[#00b386] transition-colors">Stocks</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-[#44475b] mb-3">Account</h4>
            <ul className="space-y-2 text-sm text-[#7c7e8c]">
              <li><Link href="/login" className="hover:text-[#00b386] transition-colors">Login</Link></li>
              <li><Link href="/signup" className="hover:text-[#00b386] transition-colors">Sign Up</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-[#44475b] mb-3">Legal</h4>
            <ul className="space-y-2 text-sm text-[#7c7e8c]">
              <li><span className="cursor-default">Privacy Policy</span></li>
              <li><span className="cursor-default">Terms of Service</span></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-[#e9e9eb] flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-[#7c7e8c]">
          <p>© {new Date().getFullYear()} MarketMind. All rights reserved.</p>
          <p className="text-xs">Market data is for research purposes only. Not financial advice.</p>
        </div>
      </div>
    </footer>
  );
}
