"use client";

import React, { useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Check, Plus, AlertCircle, Sparkles, Layers } from "lucide-react";

export interface KeywordBreakdownProps {
  matchedKeywords?: string[];
  missingKeywords?: string[];
  recommendedKeywords?: { name: string; priority: "High" | "Medium" }[];
  onAddKeyword?: (keyword: string) => void;
}

export const KeywordBreakdown: React.FC<KeywordBreakdownProps> = ({
  matchedKeywords = [
    "React",
    "TypeScript",
    "Design Systems",
    "Tailwind CSS",
    "Figma",
    "User Research",
    "A/B Testing",
    "WCAG 2.1 AA",
    "Component Architecture",
  ],
  missingKeywords = ["GraphQL", "CI/CD Pipeline", "Kubernetes", "OKRs"],
  recommendedKeywords = [
    { name: "GraphQL", priority: "High" },
    { name: "CI/CD Pipeline", priority: "High" },
    { name: "Design System Governance", priority: "Medium" },
    { name: "OKRs", priority: "Medium" },
  ],
  onAddKeyword,
}) => {
  const [activeCategory, setActiveCategory] = useState<"all" | "hard" | "soft" | "tools">("all");

  // Keyword categorization mock mapping
  const categorizedMatched = matchedKeywords.filter((kw) => {
    if (activeCategory === "all") return true;
    if (activeCategory === "hard") return ["React", "TypeScript", "WCAG 2.1 AA", "Component Architecture"].includes(kw);
    if (activeCategory === "soft") return ["User Research", "A/B Testing"].includes(kw);
    if (activeCategory === "tools") return ["Figma", "Tailwind CSS", "Design Systems"].includes(kw);
    return true;
  });

  return (
    <div className="bg-white border border-[#E2E8F0] rounded-3xl p-6 sm:p-8 shadow-xs text-left space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F1F5F9] pb-4">
        <div>
          <h3 className="text-base font-bold text-[#111827] flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#4F46E5]" />
            Keyword Heatmap & Density Analysis
          </h3>
          <p className="text-xs text-[#64748B]">
            Optimized for ATS parser algorithm score density
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="success" size="sm">
            {matchedKeywords.length} Matched
          </Badge>
          <Badge variant="warning" size="sm">
            {missingKeywords.length} Missing
          </Badge>
          <Badge variant="indigo" size="sm">
            Density: 8.4/10
          </Badge>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none border-b border-[#F1F5F9] pb-3">
        {[
          { id: "all", label: "All Categories" },
          { id: "hard", label: "Hard Skills" },
          { id: "soft", label: "Soft Skills & Leadership" },
          { id: "tools", label: "Tools & Frameworks" },
        ].map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id as any)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
              activeCategory === cat.id
                ? "bg-[#4F46E5] text-white shadow-2xs"
                : "bg-[#F8FAFC] text-[#475569] border border-[#E2E8F0] hover:bg-[#F1F5F9]"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* MATCHED JOB KEYWORDS */}
      <div className="space-y-2.5">
        <h4 className="text-xs font-bold uppercase tracking-wider text-[#059669] flex items-center gap-1.5">
          <Check className="w-4 h-4 stroke-[3]" /> Matched Job Keywords ({categorizedMatched.length})
        </h4>
        <div className="flex flex-wrap gap-2">
          {categorizedMatched.map((kw, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-xl bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0] font-bold shadow-2xs"
            >
              <Check className="w-3.5 h-3.5 stroke-[3] text-[#10B981]" />
              {kw}
            </span>
          ))}
        </div>
      </div>

      {/* MISSING TARGET JOB KEYWORDS */}
      <div className="space-y-2.5">
        <h4 className="text-xs font-bold uppercase tracking-wider text-[#D97706] flex items-center gap-1.5">
          <AlertCircle className="w-4 h-4 text-[#D97706]" /> Missing Target Job Keywords ({missingKeywords.length})
        </h4>
        <div className="flex flex-wrap gap-2">
          {missingKeywords.map((kw, idx) => (
            <button
              key={idx}
              onClick={() => onAddKeyword?.(kw)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-xl bg-[#FFFBEB] text-[#B45309] border border-[#FDE68A] hover:bg-[#FEF3C7] font-bold transition-all cursor-pointer shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5 text-[#D97706]" />
              {kw}
            </button>
          ))}
        </div>
      </div>

      {/* HIGH-IMPACT RECOMMENDED ADDITIONS */}
      <div className="p-4 bg-gradient-to-r from-[#FAF9FF] to-[#EEF2FF] border border-[#E0E0F0] rounded-2xl space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-[#4F46E5] flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-[#4F46E5]" /> High-Impact Recommended Additions
        </h4>
        <div className="flex flex-wrap gap-2.5">
          {recommendedKeywords.map((rec, idx) => (
            <div
              key={idx}
              onClick={() => onAddKeyword?.(rec.name)}
              className="px-3.5 py-2 bg-white border border-[#E0E7FF] rounded-xl flex items-center gap-2.5 text-xs font-bold text-[#111827] cursor-pointer hover:border-[#4F46E5] hover:shadow-xs transition-all"
            >
              <span>{rec.name}</span>
              <Badge variant={rec.priority === "High" ? "error" : "warning"} size="sm">
                {rec.priority} Priority
              </Badge>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
