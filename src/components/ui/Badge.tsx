import React from "react";

type BadgeVariant = "default" | "primary" | "success" | "warning" | "destructive";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: "bg-[var(--surface-muted)] text-[var(--text-secondary)] border-[var(--border)]",
  primary: "bg-[var(--primary-muted)] text-[var(--primary)] border-[color-mix(in_srgb,var(--primary)_20%,transparent)]",
  success: "bg-emerald-50 text-emerald-700 border-emerald-200",
  warning: "bg-amber-50 text-amber-700 border-amber-200",
  destructive: "bg-red-50 text-red-700 border-red-200",
};

export default function Badge({
  children,
  variant = "default",
  className = "",
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-medium border rounded-full ${variantClasses[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
