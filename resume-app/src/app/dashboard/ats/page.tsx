"use client";

import React, { useState } from "react";
import { ProcessFlowHeader } from "@/components/ats/ProcessFlowHeader";
import { JobDescriptionInput } from "@/components/ats/JobDescriptionInput";
import { AtsScoreSummary } from "@/components/ats/AtsScoreSummary";
import { KeywordBreakdown } from "@/components/ats/KeywordBreakdown";
import { AiRecommendationList } from "@/components/ats/AiRecommendationList";
import { ConnectedOptimizeBar } from "@/components/ats/ConnectedOptimizeBar";
import { Toast } from "@/components/ui/Toast";
import { fetchApi } from "@/lib/api-client";

export default function AtsOptimizerPage() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<"success" | "error">("success");
  const [analysisReport, setAnalysisReport] = useState<any | null>(null);

  const handleAnalyze = async (jobText: string, resumeId: string) => {
    setIsAnalyzing(true);
    try {
      // Create job description record
      const jobRes = await fetchApi<any>("/api/jobs", {
        method: "POST",
        body: JSON.stringify({
          title: "Target Position",
          company: "Target Company",
          description: jobText || "Software Engineer job description",
        }),
      });

      let jobId = jobRes.data?.id;
      let targetResumeId = resumeId;

      if (!targetResumeId) {
        const resumeRes = await fetchApi<any>("/api/resumes", {
          method: "POST",
          body: JSON.stringify({ title: "Primary Resume", status: "published" }),
        });
        targetResumeId = resumeRes.data?.id;
      }

      if (targetResumeId && jobId) {
        const atsRes = await fetchApi<any>("/api/ats/analyze", {
          method: "POST",
          body: JSON.stringify({
            resume_id: targetResumeId,
            job_description_id: jobId,
          }),
        });

        if (atsRes.success && atsRes.data) {
          setAnalysisReport(atsRes.data);
          setToastType("success");
          setToastMessage(
            `ATS Scan completed! Overall Score: ${atsRes.data.analysis.overall_score}%`
          );
        } else {
          setToastType("error");
          setToastMessage(atsRes.error?.message || "Failed to complete ATS scan");
        }
      }
    } catch (err: any) {
      setToastType("error");
      setToastMessage(err.message || "ATS Analysis failed");
    } finally {
      setIsAnalyzing(false);
      setTimeout(() => setToastMessage(null), 3500);
    }
  };

  const handleAddKeyword = (keyword: string) => {
    setToastType("success");
    setToastMessage(`Added keyword "${keyword}" to optimization queue.`);
    setTimeout(() => setToastMessage(null), 2500);
  };

  return (
    <div className="space-y-6">
      {/* 1. Visual Process Header */}
      <ProcessFlowHeader analysisReady={!!analysisReport} />

      {/* 2. Top Input Section */}
      <JobDescriptionInput onAnalyze={handleAnalyze} isAnalyzing={isAnalyzing} />

      {/* Disclaimer Notice */}
      {analysisReport?.disclaimer && (
        <div className="bg-[#EFF6FF] border border-[#BFDBFE] rounded-xl p-3.5 text-xs text-[#1E40AF] leading-relaxed">
          <strong>Optimization Indicator Notice:</strong> {analysisReport.disclaimer}
        </div>
      )}

      {/* 3. Results Overview Scores */}
      <AtsScoreSummary />

      {/* 4. Keyword Analysis */}
      <KeywordBreakdown onAddKeyword={handleAddKeyword} />

      {/* 5. Actionable AI Recommendations */}
      <AiRecommendationList />

      {/* 6. Primary Connected Action Bar */}
      <ConnectedOptimizeBar />

      {/* Toast feedback */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50">
          <Toast type={toastType} title="ATS Analyzer" message={toastMessage} onClose={() => setToastMessage(null)} />
        </div>
      )}
    </div>
  );
}
