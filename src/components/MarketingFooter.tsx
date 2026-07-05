import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export default function MarketingFooter() {
  return (
    <footer className="border-t border-[var(--border)]">
      {/* CTA band */}
      <div className="bg-[var(--text-primary)] py-16 md:py-20 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight mb-4">
            Ready to research smarter?
          </h2>
          <p className="text-slate-400 text-base mb-8 max-w-lg mx-auto">
            Join MarketMind and get your first AI research reports free. No credit card required.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-[var(--text-primary)] bg-white hover:bg-slate-100 rounded-xl transition-colors"
          >
            Get started free <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Links */}
      <div className="py-12 md:py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8 mb-10">
            <div className="sm:col-span-2 md:col-span-1">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 rounded-lg bg-[var(--primary)] flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <span className="font-semibold text-[var(--text-primary)]">MarketMind</span>
              </div>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                AI-powered stock research for confident investing decisions.
              </p>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-3">Product</h4>
              <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
                <li><Link href="/dashboard" className="hover:text-[var(--primary)] transition-colors">Dashboard</Link></li>
                <li><Link href="/#features" className="hover:text-[var(--primary)] transition-colors">Features</Link></li>
                <li><Link href="/#pricing" className="hover:text-[var(--primary)] transition-colors">Pricing</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-3">Account</h4>
              <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
                <li><Link href="/login" className="hover:text-[var(--primary)] transition-colors">Log in</Link></li>
                <li><Link href="/signup" className="hover:text-[var(--primary)] transition-colors">Sign up</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-3">Legal</h4>
              <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
                <li><span className="cursor-default">Privacy Policy</span></li>
                <li><span className="cursor-default">Terms of Service</span></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-[var(--border)] flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-[var(--text-muted)]">
            <p>© {new Date().getFullYear()} MarketMind. All rights reserved.</p>
            <p className="text-xs">Market data is for research purposes only. Not financial advice.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
