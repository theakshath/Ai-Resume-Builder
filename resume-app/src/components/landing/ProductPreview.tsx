"use client";

import React, { useState } from "react";
import {
  Sparkles,
  CheckCircle2,
  Mail,
  Phone,
  MapPin,
  Play,
  Copy,
  Check,
  Award,
  ChevronRight,
} from "lucide-react";

export const ProductPreview: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"resume" | "match" | "interview">("resume");
  const [applied, setApplied] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="relative w-full select-none">
      {/* Background Soft Glow Accents */}
      <div className="absolute -top-10 -right-6 w-96 h-96 bg-purple-200/45 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute -bottom-10 -left-6 w-96 h-96 bg-blue-100/50 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Top-Right Handwritten Style Decorative Callout: Your Future Starts Here. */}
      <div className="hidden xl:block absolute -top-12 -right-6 z-20 text-right pointer-events-none">
        <span className="font-serif italic text-lg text-slate-400 block tracking-tight">
          Your Future
        </span>
        <span className="font-serif italic text-lg text-slate-400 block -mt-1 tracking-tight">
          Starts Here.
        </span>
        <svg
          className="w-10 h-8 text-slate-300 ml-auto mt-0.5"
          viewBox="0 0 40 30"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        >
          <path d="M5 5 C 15 20, 25 22, 35 15" />
          <path d="M30 14 L 35 15 L 34 20" />
        </svg>
      </div>

      {/* Main Container Mockup Window */}
      <div className="w-full bg-[#FAF9FD] border border-slate-200/90 rounded-3xl p-3.5 sm:p-5 shadow-2xl shadow-indigo-500/10">
        {/* Top Browser Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-200/60 mb-3 px-1">
          {/* Traffic light dots */}
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#EF4444]" />
            <div className="w-3 h-3 rounded-full bg-[#F59E0B]" />
            <div className="w-3 h-3 rounded-full bg-[#10B981]" />
          </div>

          {/* Centered Filename */}
          <span className="text-xs font-medium text-slate-500 tracking-tight">
            My_Resume.pdf
          </span>

          {/* Top Segmented Controls */}
          <div className="flex items-center bg-white border border-slate-200/80 rounded-xl p-0.5 shadow-2xs text-[11px] font-semibold">
            <button
              onClick={() => setActiveTab("resume")}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                activeTab === "resume"
                  ? "bg-indigo-50 text-[#4338CA] shadow-2xs font-bold"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Resume Optimizer
            </button>
            <button
              onClick={() => setActiveTab("match")}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                activeTab === "match"
                  ? "bg-indigo-50 text-[#4338CA] shadow-2xs font-bold"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Job Match
            </button>
            <button
              onClick={() => setActiveTab("interview")}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                activeTab === "interview"
                  ? "bg-indigo-50 text-[#4338CA] shadow-2xs font-bold"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              AI Interview
            </button>
          </div>
        </div>

        {/* 2-Column Split: Left = Alex Morgan Resume Document | Right = ATS Scorecards & AI Optimizer */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* LEFT INNER COLUMN: Resume Card (lg:col-span-7) */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-sm text-left flex flex-col justify-between">
            <div>
              {/* Header: Photo Avatar + Name + Title */}
              <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-tr from-slate-200 to-indigo-100 shrink-0 border border-slate-200 flex items-center justify-center text-slate-700 font-bold text-sm">
                  AM
                </div>
                <div>
                  <h3 className="text-lg font-black tracking-tight text-slate-900">
                    Alex Morgan
                  </h3>
                  <p className="text-[11px] font-semibold text-slate-500">
                    Software Engineer
                  </p>
                </div>
              </div>

              {/* Contact Info Row */}
              <div className="grid grid-cols-2 gap-x-2 gap-y-1 py-2 text-[10px] text-slate-500 border-b border-slate-100">
                <span className="flex items-center gap-1 truncate">
                  <Mail className="w-2.5 h-2.5 text-slate-400 shrink-0" />
                  alex.morgan@example.com
                </span>
                <span className="flex items-center gap-1 truncate">
                  <Phone className="w-2.5 h-2.5 text-slate-400 shrink-0" />
                  +1 (415) 555-0128
                </span>
                <span className="flex items-center gap-1 truncate">
                  <MapPin className="w-2.5 h-2.5 text-slate-400 shrink-0" />
                  San Francisco, CA
                </span>
                <span className="flex items-center gap-1 truncate">
                  <svg className="w-2.5 h-2.5 text-slate-400 shrink-0 fill-current" viewBox="0 0 24 24">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.88a1.62 1.62 0 0 0-1.63 1.62c0 .89.73 1.62 1.63 1.62.89 0 1.62-.73 1.62-1.62 0-.89-.73-1.62-1.62-1.62Z" />
                  </svg>
                  linkedin.com/in/alexmorgan
                </span>
                <span className="flex items-center gap-1 truncate col-span-2">
                  <svg className="w-2.5 h-2.5 text-slate-400 shrink-0 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.1-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2Z" />
                  </svg>
                  github.com/alexmorgan
                </span>
              </div>

              {/* Section: Professional Summary */}
              <div className="py-2 border-b border-slate-100">
                <h4 className="text-[10px] font-extrabold uppercase tracking-wider text-slate-900 mb-0.5">
                  Professional Summary
                </h4>
                <p className="text-[10.5px] text-slate-600 leading-relaxed">
                  Results-driven Software Engineer with 5+ years of experience building scalable web applications and cloud-based systems. Passionate about creating reliable products and solving complex technical problems.
                </p>
              </div>

              {/* Section: Experience */}
              <div className="py-2 border-b border-slate-100 text-[10.5px]">
                <h4 className="text-[10px] font-extrabold uppercase tracking-wider text-slate-900 mb-1">
                  Experience
                </h4>
                <div className="flex justify-between items-baseline font-bold text-slate-900">
                  <span>Senior Software Engineer</span>
                  <span className="text-[10px] text-slate-500 font-normal">2022 – Present</span>
                </div>
                <div className="text-[10px] font-semibold text-slate-700 mb-1">Nova Technologies</div>
                <ul className="list-disc list-inside text-[10px] text-slate-600 space-y-0.5">
                  <li>Built scalable web applications serving millions of users.</li>
                  <li>Improved application performance by 38%.</li>
                </ul>
              </div>

              {/* Section: Education */}
              <div className="py-2 border-b border-slate-100 text-[10.5px]">
                <h4 className="text-[10px] font-extrabold uppercase tracking-wider text-slate-900 mb-1">
                  Education
                </h4>
                <div className="flex justify-between items-baseline font-bold text-slate-900">
                  <span>B.S. Computer Science</span>
                  <span className="text-[10px] text-slate-500 font-normal">2020 – 2024</span>
                </div>
                <div className="flex justify-between items-baseline text-slate-500">
                  <span>Stanford University</span>
                  <span className="font-semibold text-slate-800">GPA: 3.8</span>
                </div>
              </div>

              {/* Section: Skills */}
              <div className="py-2 border-b border-slate-100">
                <h4 className="text-[10px] font-extrabold uppercase tracking-wider text-slate-900 mb-1">
                  Skills
                </h4>
                <div className="flex flex-wrap gap-1 text-[9.5px]">
                  {["Python", "JavaScript", "TypeScript", "React", "Next.js", "Node.js", "SQL", "AWS", "Docker", "Git"].map(
                    (skill) => (
                      <span
                        key={skill}
                        className="px-2 py-0.5 bg-slate-100/90 text-slate-700 rounded-md font-medium"
                      >
                        {skill}
                      </span>
                    )
                  )}
                </div>
              </div>

              {/* Section: Projects */}
              <div className="py-2 border-b border-slate-100 text-[10.5px]">
                <h4 className="text-[10px] font-extrabold uppercase tracking-wider text-slate-900 mb-0.5">
                  Projects
                </h4>
                <p className="font-bold text-slate-900">AI Career Assistant</p>
                <p className="text-slate-600 text-[10px]">
                  Built an AI-powered career platform that analyzes resumes, recommends improvements, and matches candidates with relevant job opportunities.
                </p>
              </div>

              {/* Section: Certifications */}
              <div className="pt-2 text-[10.5px]">
                <h4 className="text-[10px] font-extrabold uppercase tracking-wider text-slate-900 mb-0.5">
                  Certifications
                </h4>
                <p className="text-slate-700 font-medium">AWS Certified Developer</p>
              </div>
            </div>
          </div>

          {/* RIGHT INNER COLUMN: ATS Score, Job Match, and AI Resume Optimizer (lg:col-span-5) */}
          <div className="lg:col-span-5 flex flex-col gap-3 text-left">
            {/* Top Score Cards Row: ATS Score (Left) & Job Match (Right) */}
            <div className="grid grid-cols-2 gap-2.5">
              {/* ATS Score Card */}
              <div className="bg-white rounded-2xl border border-slate-200/90 p-3 shadow-2xs flex flex-col justify-between">
                <span className="text-[11px] font-bold text-slate-700 block mb-1">ATS Score</span>
                <div className="flex items-center gap-2.5 my-1">
                  <div className="relative w-11 h-11 flex items-center justify-center shrink-0">
                    <svg className="w-11 h-11 transform -rotate-90" viewBox="0 0 36 36">
                      <path
                        className="text-slate-100"
                        strokeWidth="3.5"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className="text-[#10B981]"
                        strokeDasharray="92, 100"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <span className="absolute text-xs font-black text-slate-900">92%</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 inline-block">
                      Excellent
                    </span>
                  </div>
                </div>
                <p className="text-[9.5px] text-slate-400 mt-1">Your resume is ATS-friendly!</p>
              </div>

              {/* Job Match Card */}
              <div className="bg-white rounded-2xl border border-slate-200/90 p-3 shadow-2xs flex flex-col justify-between">
                <span className="text-[11px] font-bold text-slate-700 block mb-1">Job Match</span>
                <div className="flex items-center gap-2.5 my-1">
                  <div className="relative w-11 h-11 flex items-center justify-center shrink-0">
                    <svg className="w-11 h-11 transform -rotate-90" viewBox="0 0 36 36">
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
                    <span className="absolute text-xs font-black text-slate-900">88%</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200 inline-block">
                      High Match
                    </span>
                  </div>
                </div>
                <p className="text-[9.5px] text-slate-400 mt-1">Matches 88% of job requirements</p>
              </div>
            </div>

            {/* AI Resume Optimizer Card */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                  <Sparkles className="w-3.5 h-3.5 text-[#4338CA]" />
                  <span>AI Resume Optimizer</span>
                </div>
                <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                  High Priority
                </span>
              </div>

              <p className="text-[11px] text-slate-600 leading-relaxed">
                Your lead experience bullet lacks metric quantification. Add numbers to increase ATS score to 96%.
              </p>

              <button
                onClick={() => setApplied(!applied)}
                className="w-full py-2 px-3 bg-[#4338CA] hover:bg-[#3730A3] text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 shadow-xs transition-all"
              >
                {applied ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                    Applied (+4% ATS)
                  </>
                ) : (
                  <>Improve with AI →</>
                )}
              </button>

              {/* Suggested Phrasing */}
              <div className="bg-slate-50/80 border border-slate-200/70 rounded-xl p-2.5 text-left relative">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold text-slate-700">Suggested Phrasing</span>
                  <button
                    onClick={handleCopy}
                    className="p-1 text-slate-400 hover:text-slate-600 rounded transition-colors"
                    title="Copy phrasing"
                  >
                    {copied ? (
                      <Check className="w-3 h-3 text-emerald-600" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </button>
                </div>
                <p className="text-[10.5px] text-slate-700 italic leading-snug">
                  "Designed and built a company design system across 14 apps, cutting design-to-code velocity by 42%."
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Right Pills: Dream Jobs, Better Career, Higher Growth */}
      <div className="hidden xl:flex flex-col gap-2 absolute top-1/2 -right-14 -translate-y-1/2 z-20">
        <div className="px-3 py-1.5 bg-white/95 backdrop-blur-md rounded-xl border border-slate-200/90 shadow-md text-xs font-semibold text-slate-700 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[#4338CA]" />
          <span>Dream Jobs</span>
        </div>
        <div className="px-3 py-1.5 bg-white/95 backdrop-blur-md rounded-xl border border-slate-200/90 shadow-md text-xs font-semibold text-slate-700 flex items-center gap-1.5">
          <Award className="w-3.5 h-3.5 text-[#4338CA]" />
          <span>Better Career</span>
        </div>
        <div className="px-3 py-1.5 bg-white/95 backdrop-blur-md rounded-xl border border-slate-200/90 shadow-md text-xs font-semibold text-slate-700 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[#4338CA]" />
          <span>Higher Growth</span>
        </div>
      </div>

      {/* Bottom-Right Floating Community Pill: Join 500,000+ users */}
      <div className="hidden sm:inline-flex items-center gap-2.5 px-4 py-2 bg-white/95 backdrop-blur-md rounded-full border border-slate-200/90 shadow-lg absolute -bottom-5 right-6 z-30">
        {/* Overlapping User Avatars */}
        <div className="flex -space-x-1.5">
          <div className="w-6 h-6 rounded-full bg-slate-300 border-2 border-white overflow-hidden text-[9px] font-bold flex items-center justify-center text-slate-700">
            J
          </div>
          <div className="w-6 h-6 rounded-full bg-indigo-300 border-2 border-white overflow-hidden text-[9px] font-bold flex items-center justify-center text-indigo-900">
            S
          </div>
          <div className="w-6 h-6 rounded-full bg-purple-300 border-2 border-white overflow-hidden text-[9px] font-bold flex items-center justify-center text-purple-900">
            M
          </div>
        </div>
        <div className="text-left leading-tight">
          <span className="text-[11px] font-bold text-slate-900 block">Join 500,000+ users</span>
          <span className="text-[9.5px] text-slate-400">building their dream career</span>
        </div>
        <ChevronRight className="w-4 h-4 text-slate-400 ml-1" />
      </div>
    </div>
  );
};
