"use client";

import React from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Sparkles, ArrowRight, Lightbulb } from "lucide-react";

export interface RecommendationItem {
  id: string;
  title: string;
  category: string;
  whyItMatters: string;
  impactBadge: "High" | "Medium";
  suggestedAction: string;
  targetSection: string;
}

export const mockRecommendations: RecommendationItem[] = [
  {
    id: "rec-1",
    title: "Inject missing GraphQL & CI/CD keywords into experience bullets",
    category: "Technical Skill Alignment",
    whyItMatters:
      "Stripe's job posting mentions GraphQL and CI/CD deployment pipelines 4 times as core requirements. Adding these keywords boosts ATS parsing match by +8%.",
    impactBadge: "High",
    suggestedAction: "Optimize Experience Bullets",
    targetSection: "experience",
  },
  {
    id: "rec-2",
    title: "Align Professional Summary with Senior Design System Governance terms",
    category: "Summary Optimization",
    whyItMatters:
      "Recruiter screening algorithms prioritize resumes with explicit governance and multi-team lead experience in the top 3 lines.",
    impactBadge: "High",
    suggestedAction: "Optimize Summary",
    targetSection: "summary",
  },
  {
    id: "rec-3",
    title: "Quantify achievements in Vanguard Systems role",
    category: "Metric Quantification",
    whyItMatters:
      "Bullet points without quantitative metrics (percentages, revenue, team velocity) score 15% lower on recruiter readability indexes.",
    impactBadge: "Medium",
    suggestedAction: "Quantify Metrics",
    targetSection: "experience",
  },
];

export interface AiRecommendationListProps {
  recommendations?: RecommendationItem[];
  onOptimizeClick?: (section: string) => void;
}

export const AiRecommendationList: React.FC<AiRecommendationListProps> = ({
  recommendations = mockRecommendations,
  onOptimizeClick,
}) => {
  return (
    <div className="bg-white border border-[#E2E8F0] rounded-3xl p-6 sm:p-8 shadow-xs text-left space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F1F5F9] pb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[#4F46E5]" />
          <h3 className="text-base font-bold text-[#111827]">
            Actionable AI Improvement Recommendations
          </h3>
        </div>
        <Badge variant="indigo" size="sm">
          {recommendations.length} Actionable Items
        </Badge>
      </div>

      {/* Recommendations Cards List */}
      <div className="space-y-4">
        {recommendations.map((rec) => (
          <div
            key={rec.id}
            className="p-5 bg-[#FAF9FF] border border-[#E0E0F0] hover:border-[#4F46E5]/40 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-5 transition-all shadow-2xs hover:shadow-xs"
          >
            <div className="space-y-2.5 text-left max-w-2xl">
              <div className="flex items-center gap-2.5">
                <span className="text-sm font-bold text-[#111827]">{rec.title}</span>
                <Badge variant={rec.impactBadge === "High" ? "error" : "warning"} size="sm">
                  {rec.impactBadge} Priority
                </Badge>
              </div>

              <div className="p-3 bg-white border border-[#E2E8F0] rounded-xl text-xs text-[#475569] flex items-start gap-2.5">
                <Lightbulb className="w-4 h-4 text-[#D97706] shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <span className="font-bold text-[#111827] block">Why this matters:</span>
                  <span>{rec.whyItMatters}</span>
                </div>
              </div>
            </div>

            <Link href="/dashboard/resumes/builder" className="shrink-0 self-end md:self-auto">
              <button
                type="button"
                onClick={() => onOptimizeClick?.(rec.targetSection)}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#4F46E5] hover:bg-[#4338CA] text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
              >
                <span>{rec.suggestedAction}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};
