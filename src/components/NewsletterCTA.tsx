"use client";

import { ArrowRight } from "lucide-react";
import { useState } from "react";

export default function NewsletterCTA() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) setSubmitted(true);
  };

  return (
    <div>
      <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-2">
        Stay in the loop
      </h4>
      <p className="text-sm text-[var(--text-secondary)] mb-4 leading-relaxed">
        Weekly market insights and product updates. No spam.
      </p>
      {submitted ? (
        <p className="text-sm font-medium text-[var(--primary)]">
          Thanks for subscribing!
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@email.com"
            required
            className="flex-1 min-w-0 h-10 px-3 text-sm border border-[var(--border)] rounded-lg bg-white outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary-muted)] transition-all placeholder:text-[var(--text-muted)]"
          />
          <button
            type="submit"
            aria-label="Subscribe"
            className="shrink-0 w-10 h-10 flex items-center justify-center bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--primary-hover)] transition-colors"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      )}
    </div>
  );
}
