"use client";

import React from "react";
import { ProgressRing } from "@/components/ui/ProgressBar";
import { Badge } from "@/components/ui/Badge";
import { ShieldCheck, Trophy, Sparkles, CheckCircle2 } from "lucide-react";

export interface AtsScoreSummaryProps {
  atsScore?: number;
  keywordMatch?: number;
  skillsMatch?: number;
  formattingScore?: number;
}

export const AtsScoreSummary: React.FC<AtsScoreSummaryProps> = ({
  atsScore = 92,
  keywordMatch = 88,
  skillsMatch = 91,
  formattingScore = 96,
}) => {
  return (
    <div className="bg-white border border-[#E2E8F0] rounded-3xl p-6 sm:p-8 shadow-xs text-left space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F1F5F9] pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#10B981]/10 text-[#10B981] flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#111827]">
              ATS Compatibility & Match Score
            </h3>
            <p className="text-xs text-[#64748B]">
              Real-time algorithm metrics parsed against Workday, Taleo & Greenhouse systems
            </p>
          </div>
        </div>

        <Badge variant="indigo" size="sm" className="self-start sm:self-auto gap-1">
          <Sparkles className="w-3 h-3" /> Estimated ATS compatibility
        </Badge>
      </div>

      {/* POSITIVE RESULT CARD BANNER */}
      {atsScore >= 80 && (
        <div className="p-4 bg-gradient-to-r from-[#ECFDF5] via-[#F0FDF4] to-[#EEF2FF] border border-[#A7F3D0] rounded-2xl flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#10B981] text-white flex items-center justify-center shrink-0 shadow-md shadow-emerald-500/20">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#065F46] flex items-center gap-1.5">
                Your resume is highly compatible!
              </h4>
              <p className="text-xs text-[#047857]">
                You're well on your way to getting noticed by recruiters and passing automated screening.
              </p>
            </div>
          </div>
          <Badge variant="success" size="sm" className="hidden sm:flex">
            Top 10% Candidate Match
          </Badge>
        </div>
      )}

      {/* 4 CIRCULAR SCORE RINGS GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 items-center text-center pt-2">
        {/* Overall ATS */}
        <div className="flex flex-col items-center gap-3 p-4 rounded-2xl bg-[#FAF9FF] border border-[#E0E0F0]">
          <ProgressRing score={atsScore} label="Overall ATS" size={90} strokeWidth={8} />
          <div className="flex flex-col">
            <span className="text-xs font-bold text-[#111827]">ATS Compatibility</span>
            <span className="text-[10px] text-[#10B981] font-semibold mt-0.5 flex items-center justify-center gap-0.5">
              <CheckCircle2 className="w-3 h-3" /> Great match
            </span>
          </div>
        </div>

        {/* Keyword Match */}
        <div className="flex flex-col items-center gap-3 p-4 rounded-2xl bg-[#FAF9FF] border border-[#E0E0F0]">
          <ProgressRing score={keywordMatch} label="Keywords" size={90} strokeWidth={8} />
          <div className="flex flex-col">
            <span className="text-xs font-bold text-[#111827]">Keyword Match</span>
            <span className="text-[10px] text-[#4F46E5] font-semibold mt-0.5">
              Strong alignment
            </span>
          </div>
        </div>

        {/* Skills Match */}
        <div className="flex flex-col items-center gap-3 p-4 rounded-2xl bg-[#FAF9FF] border border-[#E0E0F0]">
          <ProgressRing score={skillsMatch} label="Skills" size={90} strokeWidth={8} />
          <div className="flex flex-col">
            <span className="text-xs font-bold text-[#111827]">Skills Alignment</span>
            <span className="text-[10px] text-[#7C3AED] font-semibold mt-0.5">
              Skills match well
            </span>
          </div>
        </div>

        {/* Formatting */}
        <div className="flex flex-col items-center gap-3 p-4 rounded-2xl bg-[#FAF9FF] border border-[#E0E0F0]">
          <ProgressRing score={formattingScore} label="Formatting" size={90} strokeWidth={8} />
          <div className="flex flex-col">
            <span className="text-xs font-bold text-[#111827]">Parser Formatting</span>
            <span className="text-[10px] text-[#10B981] font-semibold mt-0.5">
              Well structured
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
