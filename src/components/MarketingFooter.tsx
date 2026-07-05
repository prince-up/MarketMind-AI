import Link from "next/link";
import { ArrowRight, Globe, Mail, Share2, Sparkles } from "lucide-react";
import NewsletterCTA from "@/components/NewsletterCTA";

const FOOTER_LINKS = {
  product: [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Features", href: "/#features" },
    { label: "Pricing", href: "/#pricing" },
    { label: "Trending stocks", href: "/#stocks" },
  ],
  company: [
    { label: "About", href: "/#" },
    { label: "Blog", href: "/#" },
    { label: "Careers", href: "/#" },
    { label: "Contact", href: "/#" },
  ],
  resources: [
    { label: "Documentation", href: "/#" },
    { label: "Methodology", href: "/dashboard" },
    { label: "API", href: "/#" },
    { label: "Changelog", href: "/#" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/#" },
    { label: "Terms of Service", href: "/#" },
    { label: "Cookie Policy", href: "/#" },
  ],
};

const SOCIAL = [
  { icon: Share2, href: "#", label: "Share" },
  { icon: Globe, href: "#", label: "Website" },
  { icon: Mail, href: "#", label: "Email" },
];

interface MarketingFooterProps {
  variant?: "full" | "compact";
}

export default function MarketingFooter({ variant = "full" }: MarketingFooterProps) {
  if (variant === "compact") {
    return (
      <footer className="border-t border-[var(--border)] bg-white px-4 md:px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[var(--text-muted)]">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-[var(--primary)]" />
            <span>© {new Date().getFullYear()} MarketMind</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/#" className="hover:text-[var(--primary)] transition-colors">
              Privacy
            </Link>
            <Link href="/#" className="hover:text-[var(--primary)] transition-colors">
              Terms
            </Link>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="footer-gradient-top">
      {/* CTA band */}
      <div className="relative overflow-hidden bg-[var(--text-primary)] py-16 md:py-24 px-4 sm:px-6">
        <div className="absolute inset-0 hero-gradient opacity-30" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[var(--primary)]/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-4xl font-bold text-white tracking-tight mb-4">
            Ready to research smarter?
          </h2>
          <p className="text-slate-400 text-base md:text-lg mb-8 max-w-lg mx-auto leading-relaxed">
            Join thousands of investors using MarketMind. Get your first AI research reports free — no credit card required.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 px-7 py-3.5 text-sm font-semibold text-[var(--text-primary)] bg-white hover:bg-slate-100 rounded-xl transition-all shadow-lg hover:shadow-xl"
            >
              Get started free <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-7 py-3.5 text-sm font-semibold text-white border border-white/20 hover:bg-white/10 rounded-xl transition-colors"
            >
              View demo
            </Link>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="py-14 md:py-20 bg-[var(--surface-muted)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-8 lg:gap-12 mb-12">
            {/* Brand column */}
            <div className="col-span-2">
              <Link href="/" className="flex items-center gap-2.5 mb-4">
                <div className="w-9 h-9 rounded-xl bg-[var(--primary)] flex items-center justify-center shadow-sm">
                  <Sparkles className="w-4.5 h-4.5 text-white" />
                </div>
                <span className="font-bold text-[var(--text-primary)] text-lg tracking-tight">
                  MarketMind
                </span>
              </Link>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-5 max-w-xs">
                AI-powered stock research for confident investing decisions. Institutional-grade analysis, built for everyone.
              </p>
              <div className="flex items-center gap-2">
                {SOCIAL.map(({ icon: Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    aria-label={label}
                    className="w-9 h-9 rounded-lg border border-[var(--border)] bg-white flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--primary)] hover:border-[color-mix(in_srgb,var(--primary)_30%,var(--border))] transition-all"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>

            {/* Link columns */}
            <div>
              <h4 className="text-xs font-semibold text-[var(--text-primary)] uppercase tracking-wider mb-4">
                Product
              </h4>
              <ul className="space-y-2.5">
                {FOOTER_LINKS.product.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-semibold text-[var(--text-primary)] uppercase tracking-wider mb-4">
                Company
              </h4>
              <ul className="space-y-2.5">
                {FOOTER_LINKS.company.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-semibold text-[var(--text-primary)] uppercase tracking-wider mb-4">
                Resources
              </h4>
              <ul className="space-y-2.5">
                {FOOTER_LINKS.resources.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-semibold text-[var(--text-primary)] uppercase tracking-wider mb-4">
                Legal
              </h4>
              <ul className="space-y-2.5">
                {FOOTER_LINKS.legal.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Newsletter row */}
          <div className="pt-10 border-t border-[var(--border)]">
            <div className="max-w-md">
              <NewsletterCTA />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[var(--border)] bg-white py-6 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-[var(--text-muted)]">
            © {new Date().getFullYear()} MarketMind, Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm text-[var(--text-muted)]">
            <Link href="/#" className="hover:text-[var(--primary)] transition-colors">
              Privacy
            </Link>
            <Link href="/#" className="hover:text-[var(--primary)] transition-colors">
              Terms
            </Link>
            <span className="text-xs hidden md:inline">
              Market data is for research only. Not financial advice.
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
