import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
}

const paddingClasses = {
  none: "",
  sm: "p-4",
  md: "p-5 md:p-6",
  lg: "p-6 md:p-8",
};

export default function Card({
  children,
  className = "",
  hover = false,
  padding = "md",
}: CardProps) {
  return (
    <div
      className={`bg-white border border-[var(--border)] rounded-xl shadow-sm ${paddingClasses[padding]} ${
        hover ? "hover:border-[color-mix(in_srgb,var(--primary)_30%,var(--border))] hover:shadow-md transition-all duration-200" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}
