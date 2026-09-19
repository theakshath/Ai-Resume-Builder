"use client";

import React from "react";
import { FileText, Plus, Target, ArrowRight, Sparkles, CheckCircle2, TrendingUp, ShieldCheck, Zap } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

export interface ProcessFlowHeaderProps {
  analysisReady?: boolean;
}

export const ProcessFlowHeader: React.FC<ProcessFlowHeaderProps> = ({ analysisReady = false }) => {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#EEF2FF] via-[#F5F3FF] to-[#FAF9FF] border border-[#E0E0F0] p-6 sm:p-8 space-y-6 shadow-2xs text-left">
      {/* Background blurs */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-[#C7D2FE]/30 via-[#DDD6FE]/20 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          {/* Top Pill Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 backdrop-blur-md border border-[#C7D2FE] shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-[#4F46E5]" />
            <span className="text-xs font-black tracking-wider uppercase text-[#4F46E5]">
              AI-POWERED JOB MATCH
            </span>
          </div>

          {/* Main Title */}
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#111827] tracking-tight leading-tight">
            ATS Resume Optimizer &{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4F46E5] via-[#6366F1] to-[#7C3AED]">
              Job Matcher
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-sm text-[#64748B] font-medium leading-relaxed">
            Compare your resume against any target job description to eliminate parser blockers and get more interviews.
          </p>

          {/* Feature Highlights Row */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-white/80 backdrop-blur-sm border border-[#E2E8F0] rounded-xl text-xs font-bold text-[#111827] shadow-2xs">
              <ShieldCheck className="w-4 h-4 text-[#4F46E5]" />
              <span>Boost ATS Score</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-white/80 backdrop-blur-sm border border-[#E2E8F0] rounded-xl text-xs font-bold text-[#111827] shadow-2xs">
              <Sparkles className="w-4 h-4 text-[#7C3AED]" />
              <span>Find Missing Keywords</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-white/80 backdrop-blur-sm border border-[#E2E8F0] rounded-xl text-xs font-bold text-[#111827] shadow-2xs">
              <TrendingUp className="w-4 h-4 text-[#10B981]" />
              <span>Land More Interviews</span>
            </div>
          </div>
        </div>

        {/* Right Info Tag */}
        <div className="hidden lg:flex flex-col items-end gap-2 shrink-0">
          <Badge variant="indigo" size="md" className="gap-1.5 px-3.5 py-1.5">
            <Zap className="w-3.5 h-3.5 text-[#4F46E5]" /> Workday & Taleo Parser Engine
          </Badge>
          <span className="text-[11px] text-[#64748B] font-semibold">Real-time keyword density matching</span>
        </div>
      </div>

      {/* ── 3-STEP HORIZONTAL WORKFLOW COMPONENT ── */}
      <div className="relative z-10 pt-2 border-t border-[#E2E8F0]/80">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          {/* STEP 1 */}
          <div className="p-4 bg-white/90 backdrop-blur-sm border border-[#E2E8F0] rounded-2xl flex items-center gap-3.5 shadow-2xs">
            <div className="w-9 h-9 rounded-xl bg-[#4F46E5] text-white font-black text-sm flex items-center justify-center shrink-0 shadow-md shadow-indigo-500/20">
              1
            </div>
            <div className="flex flex-col text-left">
              <span className="text-xs font-bold text-[#111827]">Select Active Resume</span>
              <span className="text-[11px] text-[#64748B]">Choose the resume you want to optimize</span>
            </div>
          </div>

          {/* STEP 2 */}
          <div className="p-4 bg-white/90 backdrop-blur-sm border border-[#E2E8F0] rounded-2xl flex items-center gap-3.5 shadow-2xs">
            <div className="w-9 h-9 rounded-xl bg-[#6366F1] text-white font-black text-sm flex items-center justify-center shrink-0 shadow-md shadow-indigo-500/20">
              2
            </div>
            <div className="flex flex-col text-left">
              <span className="text-xs font-bold text-[#111827]">Paste Target Job Posting</span>
              <span className="text-[11px] text-[#64748B]">Add the job description or posting</span>
            </div>
          </div>

          {/* STEP 3 */}
          <div className={`p-4 backdrop-blur-sm border rounded-2xl flex items-center gap-3.5 shadow-2xs transition-all ${
            analysisReady
              ? "bg-[#ECFDF5] border-[#A7F3D0] text-[#065F46]"
              : "bg-white/90 border-[#E2E8F0]"
          }`}>
            <div className={`w-9 h-9 rounded-xl font-black text-sm flex items-center justify-center shrink-0 shadow-md ${
              analysisReady
                ? "bg-[#10B981] text-white shadow-emerald-500/20"
                : "bg-[#7C3AED] text-white shadow-purple-500/20"
            }`}>
              {analysisReady ? <CheckCircle2 className="w-5 h-5" /> : "3"}
            </div>
            <div className="flex flex-col text-left">
              <span className="text-xs font-bold text-[#111827]">Get AI-Powered Analysis</span>
              <span className="text-[11px] text-[#64748B]">See your match score & action plan</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
