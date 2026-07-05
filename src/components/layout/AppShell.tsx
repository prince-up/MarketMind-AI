"use client";

import React, { useState } from "react";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import MarketingFooter from "@/components/MarketingFooter";

interface AppShellProps {
  children: React.ReactNode;
  onSearch: (query: string) => void;
  credits?: number | null;
  userName?: string | null;
  onMethodologyOpen?: () => void;
  searchPlaceholder?: string;
  showFooter?: boolean;
}

export default function AppShell({
  children,
  onSearch,
  credits = null,
  userName = null,
  onMethodologyOpen,
  searchPlaceholder,
  showFooter = false,
}: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex app-bg">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onMethodologyOpen={onMethodologyOpen}
      />

      <div className="flex-1 flex flex-col min-w-0 lg:ml-0">
        <TopBar
          onSearch={onSearch}
          credits={credits}
          userName={userName}
          onMenuClick={() => setSidebarOpen(true)}
          searchPlaceholder={searchPlaceholder}
        />

        <main className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
            {children}
          </div>
        </main>

        {showFooter && <MarketingFooter variant="compact" />}
      </div>
    </div>
  );
}
