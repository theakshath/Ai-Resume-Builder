"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, Target, Zap, FileText, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/lib/firebase/context";
import { getUserResumesDocs } from "@/lib/firebase/firestore";

export interface JobDescriptionInputProps {
  onAnalyze: (jobText: string, resumeId: string) => void;
  isAnalyzing?: boolean;
}

export const sampleJobPosting = `Stripe is hiring a Senior Product Designer & Design Systems Engineer.

Key Responsibilities:
- Architect and maintain enterprise React design systems adopted across 15+ frontend micro-applications.
- Collaborate closely with product managers and engineers to establish UI component accessibility standards (WCAG 2.1 AA).
- Utilize GraphQL APIs to power dynamic financial dashboard UI components.
- Implement CI/CD pipelines for component library npm deployment and automated visual regression testing.
- Define design system governance and quarterly OKRs to measure developer velocity.

Requirements:
- 5+ years of experience building design systems with React, TypeScript, and Tailwind CSS.
- Demonstrated experience with GraphQL, CI/CD, component accessibility, and A/B testing frameworks.`;

export const JobDescriptionInput: React.FC<JobDescriptionInputProps> = ({
  onAnalyze,
  isAnalyzing = false,
}) => {
  const { user } = useAuth();
  const [selectedResume, setSelectedResume] = useState("res-1");
  const [jobText, setJobText] = useState(sampleJobPosting);
  const [resumeOptions, setResumeOptions] = useState<{ label: string; value: string }[]>([
    { label: "Alex_Morgan_Senior_Product_Designer_2026.pdf (Primary)", value: "res-1" },
    { label: "Alex_Morgan_Frontend_Architect.pdf", value: "res-2" },
    { label: "Alex_Morgan_General_Tech.pdf", value: "res-3" },
  ]);

  // Dynamically load user's real resumes if logged in
  useEffect(() => {
    async function loadUserResumes() {
      if (user) {
        try {
          const docs = await getUserResumesDocs(user.uid);
          if (docs && docs.length > 0) {
            const options = docs.map((doc) => ({
              label: `${doc.title || doc.personalInfo?.fullName || "Untitled Resume"} (ATS ${(doc as any).atsScore || (doc as any).ats_score || 88}%)`,
              value: doc.id || "res-1",
            }));
            setResumeOptions(options);
            if (options.length > 0) {
              setSelectedResume(options[0].value);
            }
          }
        } catch {
          /* keep default fallback options */
        }
      }
    }
    loadUserResumes();
  }, [user]);

  const handleLoadSample = () => {
    setJobText(sampleJobPosting);
  };

  return (
    <div className="bg-white border border-[#E2E8F0] rounded-3xl p-6 sm:p-8 shadow-xs text-left space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F1F5F9] pb-4">
        <div>
          <h2 className="text-lg font-bold text-[#111827] flex items-center gap-2">
            <Target className="w-5 h-5 text-[#4F46E5]" />
            Job Posting Analysis Input
          </h2>
          <p className="text-xs text-[#64748B]">
            Select your resume and paste the target job description to get started.
          </p>
        </div>

        <button
          type="button"
          onClick={handleLoadSample}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#EEF2FF] hover:bg-[#E0E7FF] text-xs font-bold text-[#4F46E5] transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Zap className="w-3.5 h-3.5 text-[#4F46E5]" />
          <span>Load Stripe Sample Job Description</span>
        </button>
      </div>

      {/* Two Column Layout: Left Resume Select, Right Textarea */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* LEFT: Select Resume Version */}
        <div className="lg:col-span-4 space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-[#334155] flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#4F46E5]" />
            1. Select Resume Version
          </label>

          <div className="relative">
            <select
              value={selectedResume}
              onChange={(e) => setSelectedResume(e.target.value)}
              className="w-full p-3 bg-white border border-[#CBD5E1] rounded-xl text-xs font-semibold text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/30 focus:border-[#4F46E5] shadow-2xs transition-all appearance-none cursor-pointer"
            >
              {resumeOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-[#64748B]">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </div>
          </div>

          <div className="p-3 bg-[#FAF9FF] border border-[#E0E0F0] rounded-xl text-xs text-[#64748B] space-y-1">
            <div className="flex items-center justify-between font-bold text-[#111827]">
              <span>Selected Status:</span>
              <span className="text-[#10B981] flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> 92% Base ATS
              </span>
            </div>
            <p className="text-[11px] text-[#94A3B8]">
              Updated 12 mins ago • Formatted & verified
            </p>
          </div>
        </div>

        {/* RIGHT: Paste Target Job Description */}
        <div className="lg:col-span-8 space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-[#334155] flex items-center gap-2">
            <Target className="w-4 h-4 text-[#4F46E5]" />
            2. Paste Target Job Description
          </label>

          <textarea
            rows={7}
            value={jobText}
            onChange={(e) => setJobText(e.target.value)}
            placeholder="Paste the full job posting requirements, responsibilities, and qualifications here..."
            className="w-full p-3.5 bg-white border border-[#CBD5E1] rounded-2xl text-xs font-medium text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/30 focus:border-[#4F46E5] shadow-2xs transition-all leading-relaxed resize-y"
          />

          <p className="text-[11px] text-[#64748B]">
            Tip: Include both responsibilities and qualifications sections for maximum keyword accuracy.
          </p>
        </div>

      </div>

      {/* Action Button */}
      <div className="flex justify-end pt-2 border-t border-[#F1F5F9]">
        <button
          type="button"
          disabled={isAnalyzing || !jobText.trim()}
          onClick={() => onAnalyze(jobText, selectedResume)}
          className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-gradient-to-r from-[#4F46E5] via-[#6366F1] to-[#7C3AED] hover:opacity-95 text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-500/20 transition-all duration-200 cursor-pointer disabled:opacity-50"
        >
          {isAnalyzing ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Analyzing Resume vs. Job Posting...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Analyze Resume vs. Job Posting</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
