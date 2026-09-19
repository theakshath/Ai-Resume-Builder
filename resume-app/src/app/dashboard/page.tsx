"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { DashboardEmptyState } from "@/components/dashboard/DashboardEmptyState";
import { LiveResumePaperPreview } from "@/components/builder/LiveResumePaperPreview";
import {
  Plus,
  Mic,
  Sparkles,
  ArrowRight,
  FileEdit,
  Download,
  Share2,
  MoreHorizontal,
  CheckCircle2,
  Copy,
  Check,
  Award,
  Zap,
  LayoutTemplate,
  Target,
  Bot,
  Layers,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { fetchApi } from "@/lib/api-client";
import Link from "next/link";

export interface ResumeItem {
  id: string;
  name: string;
  targetRole: string;
  lastEdited: string;
  atsScore?: number;
  templateName: string;
}

export interface InterviewSession {
  id: string;
  role: string;
  date: string;
  score: number;
  type: string;
  questionsCount: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [resumes, setResumes] = useState<ResumeItem[]>([]);
  const [interviews, setInterviews] = useState<InterviewSession[]>([]);
  const [planId, setPlanId] = useState<string>("free");
  const [userName, setUserName] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [appliedFix, setAppliedFix] = useState(false);

  useEffect(() => {
    async function loadDashboardData() {
      setLoading(true);
      try {
        const sessionRaw = localStorage.getItem("active_user_session");
        if (sessionRaw) {
          try {
            const parsed = JSON.parse(sessionRaw);
            const name = parsed.fullName || parsed.full_name || (parsed.email ? parsed.email.split("@")[0] : "");
            if (name) setUserName(name.split(" ")[0]);
          } catch {}
        }

        // Fetch user resumes
        const resResumes = await fetchApi<{ items: any[] }>("/api/resumes?limit=5");
        if (resResumes.success && resResumes.data?.items) {
          setResumes(
            resResumes.data.items.map((r: any) => ({
              id: r.id,
              name: r.title || "Untitled Resume",
              targetRole: r.target_role || "Software Engineer",
              lastEdited: new Date(r.updated_at || r.created_at).toLocaleDateString(),
              atsScore: r.ats_score || undefined,
              templateName: r.resume_templates?.name || "Modern Tech",
            }))
          );
        }

        // Fetch mock interview sessions
        const resInterviews = await fetchApi<{ items: any[] }>("/api/interviews?limit=3");
        if (resInterviews.success && resInterviews.data?.items) {
          setInterviews(
            resInterviews.data.items.map((i: any) => ({
              id: i.id,
              role: i.target_role,
              date: new Date(i.created_at).toLocaleDateString(),
              score: i.overall_score || 80,
              type: i.interview_type,
              questionsCount: 5,
            }))
          );
        }

        // Fetch user subscription tier
        const resSub = await fetchApi<any>("/api/billing/subscription");
        if (resSub.success && resSub.data?.plan_id) {
          setPlanId(resSub.data.plan_id);
        }
      } catch (err) {
        console.error("Dashboard data load error:", err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  const handleCreateNewResume = async () => {
    const res = await fetchApi("/api/resumes", {
      method: "POST",
      body: JSON.stringify({
        title: "Untitled Resume",
        status: "draft",
      }),
    });
    if (res.success && res.data?.id) {
      router.push(`/dashboard/resumes/builder?id=${res.data.id}`);
    } else {
      router.push("/dashboard/resumes/builder");
    }
  };

  const handleStartInterview = () => {
    router.push("/dashboard/interviews");
  };

  const activeResume = resumes.length > 0 ? resumes[0] : {
    id: "demo-resume",
    name: "Demo_Candidate_Resume.pdf",
    targetRole: "Software Engineer",
    lastEdited: "2 min ago",
    atsScore: 92,
    templateName: "Modern Tech",
  };

  const handleEditClick = () => {
    if (activeResume.id === "demo-resume" || resumes.length === 0) {
      handleCreateNewResume();
    } else {
      router.push(`/dashboard/resumes/builder?id=${activeResume.id}`);
    }
  };

  return (
    <div className="space-y-5 text-left selection:bg-indigo-100 selection:text-indigo-700">
      {/* Top Banner: Welcome Greeting Left + Graphic Gradient Banner Right (Matching Image) */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-100/90 via-purple-100/70 to-blue-100/80 border border-indigo-200/80 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        {/* Left Side: Welcome Greeting & Tagline */}
        <div className="space-y-1.5 z-10 max-w-xl">
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Welcome back, {userName || "Akash"}! 👋
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 font-semibold leading-relaxed">
            Build. Improve. Get Hired. Let AI help you showcase your best self.
          </p>
        </div>

        {/* Right Side: Floating Graphic Callouts & Career Art */}
        <div className="flex items-center gap-3 z-10 shrink-0">
          <div className="px-3.5 py-2 bg-white/90 backdrop-blur-md rounded-2xl border border-white/90 shadow-sm text-center transform -rotate-2">
            <span className="text-[11px] font-black text-slate-800 block leading-tight">
              Small Steps
            </span>
            <span className="text-[10.5px] font-extrabold text-[#4338CA] block leading-tight">
              Big Career
            </span>
          </div>

          <div className="hidden sm:block text-right pr-2">
            <span className="font-serif italic text-lg text-[#4338CA] block tracking-tight leading-none font-bold">
              Your Future
            </span>
            <span className="font-serif italic text-lg text-slate-700 block tracking-tight leading-none font-bold mt-0.5">
              Starts Here.
            </span>
          </div>
        </div>

        {/* Background Decorative Gradient Blobs */}
        <div className="absolute -right-8 -bottom-10 w-64 h-64 bg-indigo-400/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 -top-10 w-48 h-48 bg-purple-300/30 rounded-full blur-2xl pointer-events-none" />
      </div>

      {loading ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 h-96 rounded-3xl bg-slate-200/50 animate-pulse border border-slate-200/80" />
            <div className="lg:col-span-5 h-96 rounded-3xl bg-slate-200/50 animate-pulse border border-slate-200/80" />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            {/* LEFT COLUMN: Resume Card Showcase (lg:col-span-7) */}
            <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/90 p-5 shadow-xs text-left flex flex-col justify-between space-y-4">
              {/* Card Header: Title, Status Badge, Edit & Menu */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 text-[#4338CA] flex items-center justify-center border border-indigo-100 shrink-0">
                    <Download className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                      Your Resume
                    </h3>
                    <p className="text-[11px] font-medium text-slate-500">
                      {activeResume?.name || "Demo_Candidate_Resume.pdf"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    ✓ Saved {activeResume?.lastEdited || "2 min ago"}
                  </span>
                  <button
                    onClick={handleEditClick}
                    className="px-3 py-1.5 bg-[#4338CA] hover:bg-[#3730A3] text-white text-xs font-bold rounded-xl flex items-center gap-1 shadow-2xs transition-all"
                  >
                    <FileEdit className="w-3.5 h-3.5" />
                    <span>Edit Resume</span>
                  </button>
                  <button className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Embedded Document Preview Card */}
              <div className="bg-[#FAF9FD] rounded-2xl border border-slate-200/80 p-3 shadow-inner overflow-hidden max-h-[480px]">
                <LiveResumePaperPreview />
              </div>

              {/* Footer Action Buttons */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleEditClick}
                    className="py-2 px-4 bg-[#4338CA] hover:bg-[#3730A3] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-xs transition-all"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </button>

                  <button
                    onClick={() => {
                      navigator.clipboard?.writeText(window.location.href);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }}
                    className="py-2 px-4 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-2xs transition-all"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Link Copied!</span>
                      </>
                    ) : (
                      <>
                        <Share2 className="w-3.5 h-3.5 text-slate-500" />
                        <span>Share</span>
                      </>
                    )}
                  </button>
                </div>

                <button
                  onClick={() => router.push("/dashboard/resumes")}
                  className="text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors"
                >
                  ... More
                </button>
              </div>
            </div>

            {/* RIGHT COLUMN: Analytics, Gauges & AI Actions (lg:col-span-5) */}
            <div className="lg:col-span-5 flex flex-col gap-4 text-left">
              {/* Top Row: ATS Score, Job Match & AI Suggestions Cards (3 Grid Columns) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {/* ATS Score Card */}
                <div className="bg-white rounded-3xl border border-slate-200/90 p-3.5 shadow-2xs flex flex-col justify-between">
                  <span className="text-[11px] font-extrabold text-slate-800 block mb-1">
                    ATS Score
                  </span>
                  <div className="flex items-center gap-2 my-1">
                    <div className="relative w-10 h-10 flex items-center justify-center shrink-0">
                      <svg className="w-10 h-10 transform -rotate-90" viewBox="0 0 36 36">
                        <path
                          className="text-slate-100"
                          strokeWidth="3.5"
                          stroke="currentColor"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        <path
                          className="text-[#10B981]"
                          strokeDasharray={`${activeResume?.atsScore || 92}, 100`}
                          strokeWidth="3.5"
                          strokeLinecap="round"
                          stroke="currentColor"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                      </svg>
                      <span className="absolute text-[11px] font-black text-slate-900">
                        {activeResume?.atsScore || 92}%
                      </span>
                    </div>
                    <div>
                      <span className="text-[9.5px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 inline-block">
                        Excellent
                      </span>
                    </div>
                  </div>
                  <p className="text-[9.5px] text-slate-400 font-medium leading-tight">
                    Your resume is ATS-friendly!
                  </p>
                </div>

                {/* Job Match Card */}
                <div className="bg-white rounded-3xl border border-slate-200/90 p-3.5 shadow-2xs flex flex-col justify-between">
                  <span className="text-[11px] font-extrabold text-slate-800 block mb-1">
                    Job Match
                  </span>
                  <div className="flex items-center gap-2 my-1">
                    <div className="relative w-10 h-10 flex items-center justify-center shrink-0">
                      <svg className="w-10 h-10 transform -rotate-90" viewBox="0 0 36 36">
                        <path
                          className="text-slate-100"
                          strokeWidth="3.5"
                          stroke="currentColor"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        <path
                          className="text-[#3B82F6]"
                          strokeDasharray="88, 100"
                          strokeWidth="3.5"
                          strokeLinecap="round"
                          stroke="currentColor"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                      </svg>
                      <span className="absolute text-[11px] font-black text-slate-900">88%</span>
                    </div>
                    <div>
                      <span className="text-[9.5px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200 inline-block">
                        High Match
                      </span>
                    </div>
                  </div>
                  <p className="text-[9.5px] text-slate-400 font-medium leading-tight">
                    Matches 88% of job requirements
                  </p>
                </div>

                {/* AI Suggestions Card */}
                <Link
                  href="/dashboard/assistant"
                  className="bg-white rounded-3xl border border-slate-200/90 p-3.5 shadow-2xs hover:border-rose-200 transition-all group flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between">
                    <div className="w-7 h-7 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100 group-hover:scale-105 transition-transform">
                      <span className="text-xs font-black">↗</span>
                    </div>
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-slate-700 block">
                      AI Suggestions
                    </span>
                    <span className="text-xl font-black text-slate-900 leading-none block my-0.5">
                      2
                    </span>
                    <span className="text-[9.5px] text-slate-400 font-medium block">
                      Important improvements
                    </span>
                  </div>
                </Link>
              </div>

              {/* AI Resume Optimizer Card */}
              <div className="bg-white rounded-3xl border border-slate-200/90 p-4 sm:p-5 shadow-xs flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-black text-slate-900">
                    <Sparkles className="w-4 h-4 text-[#4338CA]" />
                    <span>AI Resume Optimizer</span>
                  </div>
                  <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
                    High Priority
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  Get personalized suggestions to make your resume stand out. Your lead experience bullet lacks metric quantification.
                </p>

                <button
                  onClick={() => setAppliedFix(!appliedFix)}
                  className="w-full py-2.5 px-4 bg-[#4338CA] hover:bg-[#3730A3] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-xs transition-all"
                >
                  {appliedFix ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                      Applied (+4% ATS)
                    </>
                  ) : (
                    <>Apply Fix →</>
                  )}
                </button>

                {/* Recommended Keywords Pills */}
                <div className="pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-800">
                      Recommended Keywords
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">
                      2 missing keywords
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 text-[10px]">
                    {["GraphQL", "CI/CD", "System Design", "Product Design"].map((kw) => (
                      <span
                        key={kw}
                        className="px-2.5 py-1 bg-indigo-50/80 text-[#4338CA] rounded-lg font-bold border border-indigo-100/90 cursor-pointer hover:bg-indigo-100 transition-colors"
                      >
                        + {kw}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Quick Action Cards (3-Card Row) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Action Card 1: Templates */}
                <Link
                  href="/dashboard/templates"
                  className="bg-white rounded-2xl border border-slate-200/90 p-3.5 shadow-2xs hover:border-indigo-300 hover:shadow-sm transition-all group flex flex-col justify-between space-y-2"
                >
                  <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                    <LayoutTemplate className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 group-hover:text-[#4338CA] transition-colors">
                      Try New Templates
                    </h4>
                    <p className="text-[10px] text-slate-500 font-medium mt-0.5">
                      Choose from 50+ modern ATS-friendly templates.
                    </p>
                  </div>
                  <span className="text-[10px] font-bold text-[#4338CA] flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    Explore →
                  </span>
                </Link>

                {/* Action Card 2: Job Match */}
                <Link
                  href="/dashboard/ats"
                  className="bg-white rounded-2xl border border-slate-200/90 p-3.5 shadow-2xs hover:border-indigo-300 hover:shadow-sm transition-all group flex flex-col justify-between space-y-2"
                >
                  <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100">
                    <Target className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 group-hover:text-[#4338CA] transition-colors">
                      Find Better Jobs
                    </h4>
                    <p className="text-[10px] text-slate-500 font-medium mt-0.5">
                      Match your resume with relevant job opportunities.
                    </p>
                  </div>
                  <span className="text-[10px] font-bold text-[#4338CA] flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    Find Jobs →
                  </span>
                </Link>

                {/* Action Card 3: Practice Interviews */}
                <Link
                  href="/dashboard/interviews"
                  className="bg-white rounded-2xl border border-slate-200/90 p-3.5 shadow-2xs hover:border-indigo-300 hover:shadow-sm transition-all group flex flex-col justify-between space-y-2"
                >
                  <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100">
                    <Mic className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 group-hover:text-[#4338CA] transition-colors">
                      Practice Interviews
                    </h4>
                    <p className="text-[10px] text-slate-500 font-medium mt-0.5">
                      AI-powered mock interviews to build your confidence.
                    </p>
                  </div>
                  <span className="text-[10px] font-bold text-[#4338CA] flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    Practice →
                  </span>
                </Link>
              </div>

              {/* Inspiring Motivational Footer Quote */}
              <div className="p-3.5 bg-indigo-50/60 border border-indigo-100/80 rounded-2xl flex items-center justify-between text-left">
                <p className="text-[11px] font-semibold text-slate-600 italic">
                  "Opportunities don't happen. You create them."
                </p>
                <Link
                  href="/dashboard/resumes/builder"
                  className="text-xs font-bold text-[#4338CA] hover:underline flex items-center gap-1 shrink-0 ml-2"
                >
                  <span>Keep Building</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        )}
    </div>
  );
}

