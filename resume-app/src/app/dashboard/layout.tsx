"use client";

import React, { useState } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { TermsOnboardingModal } from "@/components/auth/TermsOnboardingModal";
import { useAuth } from "@/lib/firebase/context";
import { X } from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const { user, profile, loading } = useAuth();
  const [termsLocallyAccepted, setTermsLocallyAccepted] = useState(false);

  const needsTermsAcceptance =
    !loading &&
    !!user &&
    !termsLocallyAccepted &&
    (!profile?.termsAccepted || !profile?.privacyAccepted);

  return (
    <div className="min-h-screen bg-[#F4F5F9] text-slate-900 flex flex-col relative selection:bg-indigo-100 selection:text-indigo-700">
      {/* First-Login Terms & Conditions Onboarding Overlay */}
      {needsTermsAcceptance && (
        <TermsOnboardingModal onAccepted={() => setTermsLocallyAccepted(true)} />
      )}

      {/* Top Full-Width Header */}
      <DashboardHeader onOpenMobileMenu={() => setMobileSidebarOpen(true)} />

      {/* Body Area: Sidebar + Main Content */}
      <div className="flex flex-1 min-w-0">
        {/* Desktop Sidebar */}
        <div className="hidden md:block shrink-0">
          <Sidebar />
        </div>

        {/* Mobile Drawer Sidebar */}
        {mobileSidebarOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex">
            <div
              className="fixed inset-0 bg-black/40 backdrop-blur-xs"
              onClick={() => setMobileSidebarOpen(false)}
            />
            <div className="relative z-10 w-64 bg-white h-full shadow-2xl animate-in slide-in-from-left duration-200">
              <button
                onClick={() => setMobileSidebarOpen(false)}
                className="absolute top-4 right-4 p-1 rounded-md text-slate-500 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
              <Sidebar onCloseMobile={() => setMobileSidebarOpen(false)} />
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-5 lg:p-6 w-full max-w-[1600px] mx-auto space-y-5 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}

