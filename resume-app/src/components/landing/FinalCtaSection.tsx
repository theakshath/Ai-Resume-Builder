"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ArrowRight, ShieldCheck, Sparkles } from "lucide-react";

export const FinalCtaSection: React.FC = () => {
  return (
    <section className="py-20 sm:py-28 bg-gradient-to-b from-white to-indigo-50/40 text-center relative overflow-hidden">
      {/* Background Soft Gradients */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-indigo-200/30 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-100/70 border border-indigo-200 text-xs font-semibold text-indigo-700">
          <Sparkles className="w-3.5 h-3.5" /> Start Building Today
        </div>

        <div className="space-y-3">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight max-w-2xl mx-auto">
            Your next opportunity starts with a better application.
          </h2>
          <p className="text-base text-slate-600 max-w-xl mx-auto">
            Join thousands of job seekers who build ATS-optimized resumes and practice mock interviews with AI.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <Link href="/signup">
            <Button
              variant="primary"
              size="lg"
              rightIcon={<ArrowRight className="w-4 h-4" />}
              className="w-full sm:w-auto font-semibold px-8 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/20"
            >
              Build My Resume Free
            </Button>
          </Link>
          <Link href="/signup">
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto font-medium rounded-full border-slate-300 hover:bg-white text-slate-800"
            >
              Try AI Mock Interview
            </Button>
          </Link>
        </div>

        <p className="text-xs text-slate-500 flex items-center justify-center gap-1.5 pt-2">
          <ShieldCheck className="w-4 h-4 text-emerald-500" /> No credit card required. Free to get started.
        </p>
      </div>
    </section>
  );
};
