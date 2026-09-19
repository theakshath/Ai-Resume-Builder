"use client";

import React from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { CheckCircle2, AlertCircle, Sparkles, ArrowRight, Award, RefreshCw, XCircle } from "lucide-react";

export interface QuestionFeedbackProps {
  isOpen: boolean;
  onClose: () => void;
  onNextQuestion: () => void;
  onRetry?: () => void;
  isLastQuestion: boolean;
  isError?: boolean;
  errorMessage?: string;
  score?: number;
  technicalScore?: number;
  relevanceScore?: number;
  communicationScore?: number;
  correctnessScore?: number;
  depthScore?: number;
  starScore?: number;
  starApplicable?: boolean;
  isSubstantive?: boolean;
  strengths?: string[];
  adjustments?: string[];
  missingConcepts?: string[];
  recommendedPhrasing?: string;
}

export const QuestionFeedbackModal: React.FC<QuestionFeedbackProps> = ({
  isOpen,
  onClose,
  onNextQuestion,
  onRetry,
  isLastQuestion,
  isError = false,
  errorMessage,
  score,
  technicalScore,
  relevanceScore,
  communicationScore,
  correctnessScore,
  depthScore,
  starScore,
  starApplicable = false,
  isSubstantive = true,
  strengths = [],
  adjustments = [],
  missingConcepts = [],
  recommendedPhrasing,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Question AI Evaluation"
      description="Genuine response evaluation & feedback rubric"
      maxWidth="lg"
      footer={
        <div className="flex items-center justify-between w-full">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Review Response
          </Button>
          <div className="flex gap-2">
            {isError && onRetry && (
              <Button
                variant="outline"
                size="sm"
                onClick={onRetry}
                leftIcon={<RefreshCw className="w-3.5 h-3.5 text-[#4F46E5]" />}
              >
                Retry Evaluation
              </Button>
            )}
            <Button
              variant="primary"
              size="sm"
              onClick={onNextQuestion}
              rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
              className="font-bold px-5"
            >
              {isLastQuestion ? "View Complete Results" : "Next Question"}
            </Button>
          </div>
        </div>
      }
    >
      {isError ? (
        <div className="p-6 text-center space-y-3 bg-[#FEF2F2] border border-[#FCA5A5] rounded-xl text-[#991B1B]">
          <XCircle className="w-10 h-10 mx-auto text-[#EF4444]" />
          <h4 className="text-sm font-bold">AI evaluation temporarily unavailable.</h4>
          <p className="text-xs text-[#7F1D1D]">{errorMessage || "The evaluation server is temporarily unavailable. Click Retry to re-evaluate your answer."}</p>
        </div>
      ) : (
        <div className="space-y-4 text-left">
          {/* Overall Score Badge */}
          <div className="p-4 bg-[#FAF9F6] border border-[#E4E4E7] rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-[#EEF2FF] text-[#4F46E5]">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-[#09090B]">Question Score</span>
                <p className="text-xs text-[#71717A]">
                  {!isSubstantive ? "Non-substantive / empty response" : score !== undefined && score < 40 ? "Needs improvement" : score !== undefined && score < 75 ? "Satisfactory response" : "Strong answer"}
                </p>
              </div>
            </div>
            <Badge variant={score !== undefined && score >= 75 ? "indigo" : score !== undefined && score >= 40 ? "warning" : "error"} size="md" className="font-extrabold text-sm">
              {score !== undefined ? `${score}/100` : "Not evaluated"}
            </Badge>
          </div>

          {/* Granular metric grid: Technical, Correctness, Depth, STAR */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center">
            <div className="p-2.5 bg-white border border-[#E4E4E7] rounded-lg">
              <span className="text-[10px] font-bold uppercase text-[#71717A]">Technical</span>
              <p className="text-sm font-bold text-[#09090B] mt-0.5">{technicalScore !== undefined ? `${technicalScore}%` : "Data unavailable"}</p>
            </div>
            <div className="p-2.5 bg-white border border-[#E4E4E7] rounded-lg">
              <span className="text-[10px] font-bold uppercase text-[#71717A]">Relevance</span>
              <p className="text-sm font-bold text-[#09090B] mt-0.5">{relevanceScore !== undefined ? `${relevanceScore}%` : "Data unavailable"}</p>
            </div>
            <div className="p-2.5 bg-white border border-[#E4E4E7] rounded-lg">
              <span className="text-[10px] font-bold uppercase text-[#71717A]">Communication</span>
              <p className="text-sm font-bold text-[#09090B] mt-0.5">{communicationScore !== undefined ? `${communicationScore}%` : "Data unavailable"}</p>
            </div>
            <div className="p-2.5 bg-white border border-[#E4E4E7] rounded-lg">
              <span className="text-[10px] font-bold uppercase text-[#71717A]">STAR Method</span>
              <p className="text-sm font-bold text-[#09090B] mt-0.5">
                {starApplicable && starScore !== undefined ? `${starScore}%` : "STAR: N/A"}
              </p>
            </div>
          </div>

          {/* Strengths */}
          {strengths.length > 0 && (
            <div className="space-y-1.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#059669] flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Key Strengths
              </h4>
              <ul className="space-y-1 text-xs text-[#52525B] pl-5 list-disc">
                {strengths.map((s, idx) => (
                  <li key={idx}>{s}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Missing Concepts */}
          {missingConcepts.length > 0 && (
            <div className="space-y-1.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#DC2626] flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-[#DC2626]" /> Missing Concepts
              </h4>
              <ul className="space-y-1 text-xs text-[#52525B] pl-5 list-disc">
                {missingConcepts.map((m, idx) => (
                  <li key={idx}>{m}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Adjustments / Improvements */}
          {adjustments.length > 0 && (
            <div className="space-y-1.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#D97706] flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4" /> Recommended Adjustments
              </h4>
              <ul className="space-y-1 text-xs text-[#52525B] pl-5 list-disc">
                {adjustments.map((adj, idx) => (
                  <li key={idx}>{adj}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Recommended Summary / Phrasing */}
          {recommendedPhrasing && (
            <div className="p-3 bg-[#EEF2FF]/70 border border-[#E0E7FF] rounded-lg text-xs space-y-1">
              <span className="font-bold text-[#4F46E5] flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> AI Feedback Summary
              </span>
              <p className="text-[#09090B] leading-relaxed">{recommendedPhrasing}</p>
            </div>
          )}
        </div>
      )}
    </Modal>
  );
};

