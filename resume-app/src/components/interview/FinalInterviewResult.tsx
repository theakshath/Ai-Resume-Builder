"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  Trophy, CheckCircle2, AlertTriangle, ArrowRight, RotateCcw,
  Sparkles, FileText, BarChart3, Mic, Video, ShieldCheck, ChevronDown, ChevronUp, AlertCircle, XCircle
} from "lucide-react";

export interface EvaluatedQuestionItem {
  questionId: string;
  questionText: string;
  category?: string;
  transcript?: string;
  durationSeconds?: number;
  evalResult?: {
    overallScore: number;
    technicalScore: number;
    correctnessScore: number;
    depthScore: number;
    relevanceScore: number;
    clarityScore: number;
    completenessScore: number;
    communicationScore: number;
    structureScore: number;
    starScore?: number;
    starApplicable: boolean;
    isSubstantive: boolean;
    strengths?: string[];
    weaknesses?: string[];
    missingConcepts?: string[];
    improvementSuggestions?: string[];
    feedback?: string;
    speakingWpm?: number;
    fillerWordCount?: number;
    speechDataAvailable?: boolean;
  };
}

export interface FinalInterviewResultProps {
  overallScore?: number | null;
  technicalScore?: number | null;
  communicationScore?: number | null;
  starScore?: number | null;
  posturePercentage?: number | null;
  role: string;
  onPracticeAgain: () => void;
  evaluatedQuestions?: EvaluatedQuestionItem[];
  strengthsSummary?: string[];
  weaknessesSummary?: string[];
  missingConceptsSummary?: string[];
  communicationMetrics?: {
    wpm?: number;
    fillerWords?: number;
    pauses?: number;
    speechDataAvailable?: boolean;
  };
}

export const FinalInterviewResult: React.FC<FinalInterviewResultProps> = ({
  overallScore,
  technicalScore,
  communicationScore,
  starScore,
  posturePercentage,
  role,
  onPracticeAgain,
  evaluatedQuestions = [],
  strengthsSummary = [],
  weaknessesSummary = [],
  missingConceptsSummary = [],
  communicationMetrics,
}) => {
  const [expandedQIdx, setExpandedQIdx] = useState<number | null>(null);

  const getReadinessBadge = (score?: number | null) => {
    if (score === undefined || score === null) {
      return { label: "Not enough data", variant: "neutral" as const };
    }
    if (score >= 85) return { label: "Interview Ready — Excellent", variant: "success" as const };
    if (score >= 70) return { label: "Proficient — Minor Polish Needed", variant: "indigo" as const };
    if (score >= 40) return { label: "Practice Needed — Review Focus Areas", variant: "warning" as const };
    return { label: "Needs Significant Improvement", variant: "error" as const };
  };

  const badgeInfo = getReadinessBadge(overallScore);

  return (
    <div className="space-y-8 max-w-5xl mx-auto text-left">
      {/* Header Banner */}
      <div className="bg-white border border-[#E4E4E7] rounded-2xl p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <Badge variant={badgeInfo.variant} size="md">
              <Sparkles className="w-3.5 h-3.5 mr-1" /> {badgeInfo.label}
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#09090B] tracking-tight">
            AI Mock Interview Evaluation Report
          </h1>
          <p className="text-sm text-[#52525B]">
            Data-driven performance evaluation for <strong className="text-[#09090B]">{role}</strong> simulation.
          </p>
        </div>

        {/* Overall Score Card */}
        <div className="flex items-center justify-center w-32 h-32 rounded-full bg-[#FAF9F6] border-4 border-[#4F46E5] shadow-xs flex-shrink-0">
          <div className="text-center">
            {overallScore !== undefined && overallScore !== null ? (
              <>
                <span className="text-3xl font-black text-[#09090B]">{overallScore}</span>
                <span className="text-xs text-[#71717A] block font-semibold">/ 100</span>
              </>
            ) : (
              <span className="text-xs font-bold text-[#71717A]">Not enough data</span>
            )}
          </div>
        </div>
      </div>

      {/* Category Performance Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Technical Score */}
        <Card className="border-[#E4E4E7] bg-white p-5 shadow-2xs space-y-1">
          <div className="text-xs font-semibold text-[#52525B] uppercase tracking-wider">Technical Performance</div>
          <div className="text-2xl font-black text-[#09090B]">
            {technicalScore !== undefined && technicalScore !== null ? `${technicalScore}%` : "Not enough data"}
          </div>
          <p className="text-2xs text-[#71717A]">Domain accuracy & depth</p>
        </Card>

        {/* Communication Score */}
        <Card className="border-[#E4E4E7] bg-white p-5 shadow-2xs space-y-1">
          <div className="text-xs font-semibold text-[#52525B] uppercase tracking-wider">Communication</div>
          <div className="text-2xl font-black text-[#09090B]">
            {communicationScore !== undefined && communicationScore !== null ? `${communicationScore}%` : "Not enough data"}
          </div>
          <p className="text-2xs text-[#71717A]">
            {communicationMetrics?.speechDataAvailable && communicationMetrics?.wpm !== undefined
              ? `${communicationMetrics.wpm} WPM • ${communicationMetrics.fillerWords ?? 0} Fillers`
              : "Speech data unavailable"}
          </p>
        </Card>

        {/* STAR Behavioral Score */}
        <Card className="border-[#E4E4E7] bg-white p-5 shadow-2xs space-y-1">
          <div className="text-xs font-semibold text-[#52525B] uppercase tracking-wider">Behavioral / STAR</div>
          <div className="text-2xl font-black text-[#09090B]">
            {starScore !== undefined && starScore !== null ? `${starScore}%` : "STAR: N/A"}
          </div>
          <p className="text-2xs text-[#71717A]">Behavioral question structure</p>
        </Card>

        {/* Posture Score */}
        <Card className="border-[#E4E4E7] bg-white p-5 shadow-2xs space-y-1">
          <div className="text-xs font-semibold text-[#52525B] uppercase tracking-wider">Posture Coaching</div>
          <div className={`text-2xl font-black ${posturePercentage !== undefined && posturePercentage !== null ? "text-[#10B981]" : "text-[#71717A]"}`}>
            {posturePercentage !== undefined && posturePercentage !== null ? `${posturePercentage}%` : "Posture data unavailable"}
          </div>
          <p className="text-2xs text-[#71717A]">Centered camera posture</p>
        </Card>
      </div>

      {/* Communication Analysis & Posture Coaching Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Communication Metrics */}
        <Card className="border-[#E4E4E7] bg-white p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 font-bold text-sm text-[#09090B]">
            <Mic className="w-4 h-4 text-[#4F46E5]" /> Speech Communication Analysis
          </div>
          {communicationMetrics?.speechDataAvailable ? (
            <div className="space-y-3 text-xs text-[#52525B]">
              <div className="flex justify-between p-2.5 rounded-lg bg-[#FAF9F6]">
                <span>Speaking Pace:</span>
                <span className="font-bold text-[#09090B]">
                  {communicationMetrics.wpm !== undefined ? `${communicationMetrics.wpm} WPM` : "Speech data unavailable"}
                </span>
              </div>
              <div className="flex justify-between p-2.5 rounded-lg bg-[#FAF9F6]">
                <span>Filler Words Detected:</span>
                <span className="font-bold text-[#09090B]">{communicationMetrics.fillerWords ?? 0} fillers</span>
              </div>
              <div className="flex justify-between p-2.5 rounded-lg bg-[#FAF9F6]">
                <span>Natural Pauses:</span>
                <span className="font-bold text-[#09090B]">{communicationMetrics.pauses ?? 0} detected pauses</span>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-[#FAF9F6] border border-[#E4E4E7] rounded-lg text-xs text-[#71717A] text-center">
              Speech data unavailable
            </div>
          )}
        </Card>

        {/* Posture & Attention Coaching */}
        <Card className="border-[#E4E4E7] bg-white p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 font-bold text-sm text-[#09090B]">
            <Video className="w-4 h-4 text-[#4F46E5]" /> Posture & Positioning Coaching
          </div>
          {posturePercentage !== undefined && posturePercentage !== null ? (
            <div className="space-y-2 text-xs text-[#52525B] leading-relaxed">
              <div className="flex items-start gap-2 p-2.5 rounded-lg bg-[#F0FDF4] border border-[#BBF7D0] text-[#166534]">
                <CheckCircle2 className="w-4 h-4 text-[#10B981] flex-shrink-0 mt-0.5" />
                <span>Face remained centered in camera frame for {posturePercentage}% of analyzed frames.</span>
              </div>
              <div className="flex items-start gap-2 p-2.5 rounded-lg bg-[#FAF9F6] border border-[#E4E4E7] text-[#09090B]">
                <ShieldCheck className="w-4 h-4 text-[#4F46E5] flex-shrink-0 mt-0.5" />
                <span>Posture score is measured directly from local computer vision frame analysis.</span>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-[#FAF9F6] border border-[#E4E4E7] rounded-lg text-xs text-[#71717A] text-center">
              Posture data unavailable
            </div>
          )}
        </Card>
      </div>

      {/* Aggregate Strengths & Focus Areas */}
      {(strengthsSummary.length > 0 || weaknessesSummary.length > 0 || missingConceptsSummary.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {strengthsSummary.length > 0 && (
            <Card className="border-[#E4E4E7] bg-white p-6 shadow-xs space-y-3">
              <h3 className="text-sm font-bold text-[#059669] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> Top Demonstration Strengths
              </h3>
              <ul className="space-y-2 text-xs text-[#52525B]">
                {strengthsSummary.slice(0, 5).map((s, idx) => (
                  <li key={idx} className="p-2.5 rounded-lg bg-[#F0FDF4] border border-[#BBF7D0] text-[#166534]">
                    • {s}
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {(weaknessesSummary.length > 0 || missingConceptsSummary.length > 0) && (
            <Card className="border-[#E4E4E7] bg-white p-6 shadow-xs space-y-3">
              <h3 className="text-sm font-bold text-[#D97706] flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-[#D97706]" /> Recommended Focus Areas & Gaps
              </h3>
              <ul className="space-y-2 text-xs text-[#52525B]">
                {missingConceptsSummary.slice(0, 3).map((m, idx) => (
                  <li key={`m-${idx}`} className="p-2.5 rounded-lg bg-[#FEF2F2] border border-[#FCA5A5] text-[#991B1B]">
                    <strong>Missing Concept:</strong> {m}
                  </li>
                ))}
                {weaknessesSummary.slice(0, 3).map((w, idx) => (
                  <li key={`w-${idx}`} className="p-2.5 rounded-lg bg-[#FFFBEB] border border-[#FDE68A] text-[#92400E]">
                    • {w}
                  </li>
                ))}
              </ul>
            </Card>
          )}
        </div>
      )}

      {/* Question-by-Question Detailed Analysis */}
      {evaluatedQuestions.length > 0 && (
        <Card className="border-[#E4E4E7] bg-white p-6 shadow-xs space-y-4">
          <h3 className="text-base font-extrabold text-[#09090B] flex items-center gap-2 border-b border-[#E4E4E7] pb-3">
            <FileText className="w-5 h-5 text-[#4F46E5]" /> Question-by-Question Evaluation Breakdown
          </h3>

          <div className="space-y-4">
            {evaluatedQuestions.map((item, idx) => {
              const res = item.evalResult;
              const isExpanded = expandedQIdx === idx;
              const isSub = res?.isSubstantive !== false;

              return (
                <div key={item.questionId || idx} className="border border-[#E4E4E7] rounded-xl overflow-hidden bg-[#FAF9F6]">
                  <div
                    onClick={() => setExpandedQIdx(isExpanded ? null : idx)}
                    className="p-4 bg-white flex items-center justify-between cursor-pointer hover:bg-[#FAF9F6] transition-colors"
                  >
                    <div className="space-y-1 text-left max-w-xl">
                      <div className="flex items-center gap-2">
                        <Badge variant="indigo" size="sm">Question {idx + 1}</Badge>
                        {item.category && <Badge variant="neutral" size="sm">{item.category}</Badge>}
                        {!isSub && <Badge variant="error" size="sm">Non-substantive</Badge>}
                      </div>
                      <h4 className="text-sm font-bold text-[#09090B]">&ldquo;{item.questionText}&rdquo;</h4>
                    </div>

                    <div className="flex items-center gap-3">
                      <Badge
                        variant={res?.overallScore !== undefined && res.overallScore >= 75 ? "indigo" : res?.overallScore !== undefined && res.overallScore >= 40 ? "warning" : "error"}
                        size="md"
                        className="font-extrabold text-sm"
                      >
                        {res?.overallScore !== undefined ? `${res.overallScore}/100` : "Not evaluated"}
                      </Badge>
                      {isExpanded ? <ChevronUp className="w-4 h-4 text-[#71717A]" /> : <ChevronDown className="w-4 h-4 text-[#71717A]" />}
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="p-5 border-t border-[#E4E4E7] space-y-4 text-xs">
                      {/* Transcript */}
                      <div className="p-3 bg-white rounded-lg border border-[#E4E4E7]">
                        <span className="font-bold text-[#52525B] block mb-1 uppercase text-[10px]">Candidate Answer Transcript:</span>
                        <p className="text-[#09090B] italic">{item.transcript ? `"${item.transcript}"` : "No response provided."}</p>
                      </div>

                      {/* Rubric Breakdown Grid */}
                      {res && (
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                          <div className="p-2 bg-white rounded border border-[#E4E4E7]">
                            <span className="text-[10px] text-[#71717A] font-bold block">Correctness</span>
                            <span className="font-bold text-[#09090B] text-sm">{res.correctnessScore ?? res.technicalScore}%</span>
                          </div>
                          <div className="p-2 bg-white rounded border border-[#E4E4E7]">
                            <span className="text-[10px] text-[#71717A] font-bold block">Depth</span>
                            <span className="font-bold text-[#09090B] text-sm">{res.depthScore}%</span>
                          </div>
                          <div className="p-2 bg-white rounded border border-[#E4E4E7]">
                            <span className="text-[10px] text-[#71717A] font-bold block">Relevance</span>
                            <span className="font-bold text-[#09090B] text-sm">{res.relevanceScore}%</span>
                          </div>
                          <div className="p-2 bg-white rounded border border-[#E4E4E7]">
                            <span className="text-[10px] text-[#71717A] font-bold block">STAR Method</span>
                            <span className="font-bold text-[#09090B] text-sm">{res.starApplicable && res.starScore !== undefined ? `${res.starScore}%` : "STAR: N/A"}</span>
                          </div>
                        </div>
                      )}

                      {/* Feedback & Lists */}
                      {res?.feedback && (
                        <div className="p-3 bg-[#EEF2FF] rounded-lg border border-[#C7D2FE] text-[#3730A3]">
                          <span className="font-bold block mb-1">AI Feedback Summary:</span>
                          <p>{res.feedback}</p>
                        </div>
                      )}

                      {res?.strengths && res.strengths.length > 0 && (
                        <div>
                          <span className="font-bold text-[#059669] block mb-1">Strengths:</span>
                          <ul className="list-disc pl-5 text-[#52525B]">
                            {res.strengths.map((s, sIdx) => <li key={sIdx}>{s}</li>)}
                          </ul>
                        </div>
                      )}

                      {res?.missingConcepts && res.missingConcepts.length > 0 && (
                        <div>
                          <span className="font-bold text-[#DC2626] block mb-1">Missing Concepts:</span>
                          <ul className="list-disc pl-5 text-[#52525B]">
                            {res.missingConcepts.map((m, mIdx) => <li key={mIdx}>{m}</li>)}
                          </ul>
                        </div>
                      )}

                      {res?.improvementSuggestions && res.improvementSuggestions.length > 0 && (
                        <div>
                          <span className="font-bold text-[#D97706] block mb-1">Improvement Suggestions:</span>
                          <ul className="list-disc pl-5 text-[#52525B]">
                            {res.improvementSuggestions.map((imp, iIdx) => <li key={iIdx}>{imp}</li>)}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Action CTAs */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[#E4E4E7]">
        <Button
          variant="outline"
          size="lg"
          onClick={onPracticeAgain}
          leftIcon={<RotateCcw className="w-4 h-4" />}
          className="font-bold"
        >
          Practice Again
        </Button>

        <div className="flex flex-wrap gap-3">
          <Link href="/dashboard/resumes">
            <Button variant="outline" size="lg" leftIcon={<FileText className="w-4 h-4" />}>
              Improve My Resume
            </Button>
          </Link>
          <Link href="/dashboard/ats">
            <Button variant="primary" size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Analyze ATS Score
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

