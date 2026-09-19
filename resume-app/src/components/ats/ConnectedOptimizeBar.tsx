"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";

export const ConnectedOptimizeBar: React.FC = () => {
  return (
    <div className="relative overflow-hidden p-6 sm:p-8 bg-gradient-to-r from-[#4F46E5] via-[#6366F1] to-[#7C3AED] text-white rounded-3xl shadow-xl shadow-indigo-500/20 flex flex-col md:flex-row items-center justify-between gap-6 text-left">
      {/* Background blurs */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />

      <div className="space-y-2 relative z-10 max-w-xl">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold text-white mb-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>CONNECTED ACTION PLAN READY</span>
        </div>

        <h3 className="text-xl sm:text-2xl font-black tracking-tight">
          Ready to apply these 3 optimizations to your resume?
        </h3>

        <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
          Apply the recommended keywords and AI improvements directly to your active Resume Builder workspace with one click.
        </p>
      </div>

      <Link href="/dashboard/resumes/builder" className="shrink-0 relative z-10 w-full sm:w-auto">
        <button
          type="button"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white hover:bg-slate-50 text-[#4F46E5] font-bold text-sm rounded-xl shadow-lg transition-all duration-200 cursor-pointer"
        >
          <span>Optimize My Resume Now</span>
          <ArrowRight className="w-4 h-4 text-[#4F46E5]" />
        </button>
      </Link>
    </div>
  );
};
