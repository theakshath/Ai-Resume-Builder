"use client";

import React, { useState, useEffect } from "react";
import {
  Mic,
  Sparkles,
  ArrowRight,
  Video,
  Clock,
  FileText,
  Briefcase,
  HelpCircle,
  ShieldCheck,
  TrendingUp,
  BarChart3,
  Code2,
  Users,
  UserCheck,
  Layers,
  Info,
  Trophy,
  Bot,
  FileCode,
  Target,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { useAuth } from "@/lib/firebase/context";
import { getUserResumesDocs } from "@/lib/firebase/firestore";

export interface InterviewConfig {
  role: string;
  experienceLevel: string;
  interviewType: string;
  difficulty: string;
  questionsCount: number;
  resumeId?: string;
  jobDescription?: string;
  hasCamera?: boolean;
  hasMic?: boolean;
}

export interface InterviewSetupProps {
  onStartInterview: (config: InterviewConfig) => void;
}

export const InterviewSetup: React.FC<InterviewSetupProps> = ({ onStartInterview }) => {
  const { user } = useAuth();
  const [role, setRole] = useState("Software Developer");
  const [experienceLevel, setExperienceLevel] = useState("Entry Level");
  const [interviewType, setInterviewType] = useState("Mixed");
  const [difficulty, setDifficulty] = useState("Medium");
  const [questionsCount, setQuestionsCount] = useState<number>(30);
  const [selectedResumeId, setSelectedResumeId] = useState<string>("");
  const [jobDescription, setJobDescription] = useState<string>("");
  const [resumesList, setResumesList] = useState<{ label: string; value: string }[]>([]);

  // Load available resumes dynamically (Firestore -> localStorage -> Default)
  useEffect(() => {
    async function loadResumes() {
      if (user) {
        try {
          const docs = await getUserResumesDocs(user.uid);
          if (docs && docs.length > 0) {
            const options: { label: string; value: string }[] = docs.map((doc) => ({
              label: doc.title || doc.personalInfo?.fullName || "Untitled Resume",
              value: doc.id || `res_${Math.random().toString(36).substring(2, 9)}`,
            }));
            setResumesList(options);
            if (options.length > 0 && options[0].value) {
              setSelectedResumeId(options[0].value);
            }
            return;
          }
        } catch {
          /* fallback to localStorage/default below */
        }
      }

      try {
        const mockResumesRaw = localStorage.getItem("mock_resumes") || "[]";
        const parsed = JSON.parse(mockResumesRaw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const options = parsed.map((r: any) => ({
            label: `${r.title || "Untitled Resume"} (ATS ${r.ats_score || 85}%)`,
            value: r.id,
          }));
          setResumesList(options);
          setSelectedResumeId(options[0].value);
        } else {
          setResumesList([
            { label: "Default Full-Stack Developer Resume", value: "res_default_01" },
          ]);
          setSelectedResumeId("res_default_01");
        }
      } catch {
        setResumesList([
          { label: "Default Full-Stack Developer Resume", value: "res_default_01" },
        ]);
        setSelectedResumeId("res_default_01");
      }
    }
    loadResumes();
  }, [user]);

  const experienceOptions = [
    { label: "Student / Intern", value: "Student" },
    { label: "Entry Level (0 - 2 yrs)", value: "Entry Level" },
    { label: "Mid Level (2 - 5 yrs)", value: "Mid Level" },
    { label: "Senior / Lead (5+ yrs)", value: "Senior Level" },
  ];

  const focusCards = [
    {
      id: "Mixed",
      title: "Mixed Full Interview (Recommended)",
      desc: "Balanced mix of Technical, Behavioral, Situational & Resume deep-dives.",
      icon: Layers,
      isPopular: true,
      color: "#4F46E5",
    },
    {
      id: "Technical",
      title: "Technical & System Architecture",
      desc: "System design, code architecture, and problem solving.",
      icon: Code2,
      isPopular: false,
      color: "#6366F1",
    },
    {
      id: "Behavioral",
      title: "Behavioral & STAR Method",
      desc: "Leadership, teamwork, conflict resolution, and metrics.",
      icon: Users,
      isPopular: false,
      color: "#7C3AED",
    },
    {
      id: "HR",
      title: "HR & Culture Fit",
      desc: "Career outlook, background, and cultural alignment.",
      icon: UserCheck,
      isPopular: false,
      color: "#EC4899",
    },
  ];

  const questionCountOptions = [
    { label: "30 Questions (Standard)", value: 30, desc: "~30-40 min full simulation", icon: FileText },
    { label: "35 Questions (Extended)", value: 35, desc: "~45 min deep practice", icon: Clock },
    { label: "40 Questions (Mastery)", value: 40, desc: "~60 min comprehensive", icon: Trophy },
  ];

  const difficultyOptions = [
    { label: "Easy", value: "Easy" },
    { label: "Medium", value: "Medium" },
    { label: "Hard", value: "Hard" },
    { label: "Adaptive", value: "Adaptive" },
  ];

  const roleSuggestions = [
    "Software Developer",
    "Full-Stack Engineer",
    "Frontend Developer",
    "Backend Developer",
    "DevOps Engineer",
    "Product Manager",
    "Data Scientist",
    "UI/UX Designer",
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onStartInterview({
      role,
      experienceLevel,
      interviewType,
      difficulty,
      questionsCount,
      resumeId: selectedResumeId,
      jobDescription,
    });
  };

  return (
    <div className="space-y-6 text-left">
      {/* ════════════════════════════════════════════════════════════════════
          1. HERO BANNER — Matching Reference Image
         ════════════════════════════════════════════════════════════════════ */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#EEF2FF] via-[#F5F3FF] to-[#FAF9FF] border border-[#E0E0F0] p-6 sm:p-8">
        {/* Background decorative blurs */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-[#C7D2FE]/30 via-[#DDD6FE]/20 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 left-1/3 w-60 h-60 bg-gradient-to-tr from-[#DDD6FE]/20 to-transparent rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex-1 space-y-3">
            {/* Top Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 backdrop-blur-md border border-[#C7D2FE] shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-[#4F46E5]" />
              <span className="text-[11px] font-black tracking-wider uppercase text-[#4F46E5]">
                AI MOCK INTERVIEW
              </span>
            </div>

            {/* Main Title */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#111827] tracking-tight leading-tight">
              AI Mock{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4F46E5] via-[#6366F1] to-[#7C3AED]">
                Interview Setup
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-sm text-[#64748B] font-medium max-w-xl">
              Configure your personalized {questionsCount}+ question role simulation
            </p>

            {/* Feature Highlights Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3">
              <div className="flex items-center gap-2.5 p-2.5 bg-white/70 backdrop-blur-sm border border-[#E2E8F0] rounded-xl shadow-2xs">
                <div className="w-7 h-7 rounded-lg bg-[#4F46E5]/10 flex items-center justify-center text-[#4F46E5] shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-[#111827]">Realistic Questions</span>
                  <span className="text-[10px] text-[#64748B]">Industry-aligned</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5 p-2.5 bg-white/70 backdrop-blur-sm border border-[#E2E8F0] rounded-xl shadow-2xs">
                <div className="w-7 h-7 rounded-lg bg-[#7C3AED]/10 flex items-center justify-center text-[#7C3AED] shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-[#111827]">AI-Powered Feedback</span>
                  <span className="text-[10px] text-[#64748B]">Instant insights</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5 p-2.5 bg-white/70 backdrop-blur-sm border border-[#E2E8F0] rounded-xl shadow-2xs">
                <div className="w-7 h-7 rounded-lg bg-[#6366F1]/10 flex items-center justify-center text-[#6366F1] shrink-0">
                  <Video className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-[#111827]">Voice & Webcam</span>
                  <span className="text-[10px] text-[#64748B]">Practice like real</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5 p-2.5 bg-white/70 backdrop-blur-sm border border-[#E2E8F0] rounded-xl shadow-2xs">
                <div className="w-7 h-7 rounded-lg bg-[#10B981]/10 flex items-center justify-center text-[#10B981] shrink-0">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-[#111827]">Detailed Report</span>
                  <span className="text-[10px] text-[#64748B]">Track progress</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Robot Visual Graphic */}
          <div className="hidden lg:flex flex-col items-center justify-center relative shrink-0">
            {/* Speech bubble above robot */}
            <div className="mb-2 px-3 py-1.5 bg-white rounded-full border border-[#C7D2FE] shadow-md shadow-indigo-500/10 text-center animate-bounce">
              <span className="text-[11px] font-bold text-[#4F46E5] flex items-center gap-1">
                <span>Practice</span>
                <span className="text-[#94A3B8]">•</span>
                <span>Improve</span>
                <span className="text-[#94A3B8]">•</span>
                <span className="text-[#10B981]">Get Hired!</span>
              </span>
            </div>

            {/* 3D AI Robot Box */}
            <div className="relative group">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-tr from-[#4F46E5] via-[#6366F1] to-[#7C3AED] flex items-center justify-center shadow-xl shadow-indigo-500/25 transition-transform duration-300 group-hover:scale-105">
                <Bot className="w-14 h-14 text-white" />
              </div>

              {/* Decorative floating label */}
              <div className="absolute -bottom-3 -right-6 px-2.5 py-1 bg-white/90 backdrop-blur-sm border border-[#E2E8F0] rounded-xl shadow-xs text-[10px] font-bold text-[#4F46E5] flex items-center gap-1">
                <span>Better Preparation</span>
                <span className="text-[#7C3AED]">✨</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════════
          2. SETUP FORM CONTENT
         ════════════════════════════════════════════════════════════════════ */}
      <form onSubmit={handleSubmit} className="space-y-6">

        {/* ── ROW 1: Target Job Role & Experience Level ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          {/* Target Job Role */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-[#334155] flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-[#4F46E5]/10 flex items-center justify-center text-[#4F46E5]">
                <Briefcase className="w-3.5 h-3.5" />
              </div>
              Target Job Role
            </label>
            <div className="relative">
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full p-3 bg-white border border-[#CBD5E1] rounded-xl text-sm font-semibold text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/30 focus:border-[#4F46E5] shadow-2xs transition-all appearance-none cursor-pointer"
              >
                {roleSuggestions.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-[#64748B]">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
              </div>
            </div>
            <p className="text-[11px] text-[#64748B] flex items-center gap-1">
              Select the job role you are preparing for
            </p>
          </div>

          {/* Experience Level */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-[#334155] flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-[#4F46E5]/10 flex items-center justify-center text-[#4F46E5]">
                <BarChart3 className="w-3.5 h-3.5" />
              </div>
              Experience Level
            </label>
            <div className="relative">
              <select
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value)}
                className="w-full p-3 bg-white border border-[#CBD5E1] rounded-xl text-sm font-semibold text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/30 focus:border-[#4F46E5] shadow-2xs transition-all appearance-none cursor-pointer"
              >
                {experienceOptions.map((opt) => (
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
            <p className="text-[11px] text-[#64748B]">
              Choose your experience level for relevant questions
            </p>
          </div>

        </div>

        {/* ── ROW 2: Select Resume Context & Job Description ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          {/* Select Resume Context */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-[#334155] flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-[#4F46E5]/10 flex items-center justify-center text-[#4F46E5]">
                <FileText className="w-3.5 h-3.5" />
              </div>
              Select Resume Context
            </label>
            <div className="relative">
              <select
                value={selectedResumeId}
                onChange={(e) => setSelectedResumeId(e.target.value)}
                className="w-full p-3 bg-white border border-[#CBD5E1] rounded-xl text-sm font-semibold text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/30 focus:border-[#4F46E5] shadow-2xs transition-all appearance-none cursor-pointer"
              >
                {resumesList.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-[#64748B]">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
              </div>
            </div>
            <p className="text-[11px] text-[#64748B]">
              We'll use this resume to generate personalized questions
            </p>
          </div>

          {/* Job Description Context (Optional) */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-[#334155] flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-[#4F46E5]/10 flex items-center justify-center text-[#4F46E5]">
                <FileCode className="w-3.5 h-3.5" />
              </div>
              Job Description Context (Optional)
            </label>
            <textarea
              rows={2}
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste target job description to customize questions to job requirements..."
              className="w-full p-3 bg-white border border-[#CBD5E1] rounded-xl text-xs text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/30 focus:border-[#4F46E5] shadow-2xs transition-all resize-y"
            />
            <p className="text-[11px] text-[#64748B]">
              Adding a job description helps generate more relevant and role-specific questions
            </p>
          </div>

        </div>

        {/* ── ROW 3: Select Interview Focus Area ── */}
        <div className="space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-[#334155] flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-[#4F46E5]/10 flex items-center justify-center text-[#4F46E5]">
              <Target className="w-3.5 h-3.5" />
            </div>
            Select Interview Focus Area
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {focusCards.map((card) => {
              const isSelected = interviewType === card.id;
              const IconComp = card.icon;

              return (
                <div
                  key={card.id}
                  onClick={() => setInterviewType(card.id)}
                  className={`relative cursor-pointer p-4 rounded-2xl border transition-all duration-200 flex flex-col justify-between ${
                    isSelected
                      ? "border-[#4F46E5] bg-gradient-to-b from-[#F5F3FF] to-[#EEF2FF] shadow-md shadow-indigo-500/10 ring-2 ring-[#4F46E5]/40"
                      : "border-[#E2E8F0] bg-white hover:border-[#CBD5E1] hover:shadow-sm"
                  }`}
                >
                  {/* Top Header: Radio + Popular Badge */}
                  <div className="flex items-center justify-between mb-3">
                    {/* Radio Indicator */}
                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                        isSelected ? "border-[#4F46E5] bg-white" : "border-[#CBD5E1] bg-white"
                      }`}
                    >
                      {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-[#4F46E5]" />}
                    </div>

                    {/* Popular Badge if applicable */}
                    {card.isPopular && (
                      <Badge variant="indigo" size="sm" className="text-[10px] font-bold px-2 py-0.5">
                        Most Popular
                      </Badge>
                    )}
                  </div>

                  {/* Icon & Title & Description */}
                  <div className="space-y-2">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: `${card.color}15`, color: card.color }}
                    >
                      <IconComp className="w-5 h-5" />
                    </div>

                    <h4 className="text-sm font-bold text-[#0F172A] leading-snug">
                      {card.title}
                    </h4>

                    <p className="text-xs text-[#64748B] leading-relaxed">
                      {card.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── ROW 4: Number of Primary Questions ── */}
        <div className="space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-[#334155] flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-[#4F46E5]/10 flex items-center justify-center text-[#4F46E5]">
              <HelpCircle className="w-3.5 h-3.5" />
            </div>
            Number of Primary Questions
          </label>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {questionCountOptions.map((opt) => {
              const isSelected = questionsCount === opt.value;
              const OptIcon = opt.icon;

              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setQuestionsCount(opt.value)}
                  className={`p-4 rounded-2xl border text-left transition-all duration-200 flex items-center gap-3.5 ${
                    isSelected
                      ? "bg-gradient-to-r from-[#4F46E5] via-[#6366F1] to-[#7C3AED] text-white border-[#4F46E5] shadow-lg shadow-indigo-500/20"
                      : "bg-white text-[#334155] border-[#E2E8F0] hover:border-[#CBD5E1] hover:bg-[#F8FAFC]"
                  }`}
                >
                  {/* Radio indicator */}
                  <div
                    className={`w-5 h-5 rounded-full border shrink-0 flex items-center justify-center transition-all ${
                      isSelected ? "border-white bg-white/20" : "border-[#CBD5E1] bg-white"
                    }`}
                  >
                    {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-white" />}
                  </div>

                  {/* Icon */}
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      isSelected ? "bg-white/20 text-white" : "bg-[#4F46E5]/10 text-[#4F46E5]"
                    }`}
                  >
                    <OptIcon className="w-5 h-5" />
                  </div>

                  {/* Content */}
                  <div className="flex flex-col">
                    <span className="text-sm font-bold leading-tight">{opt.label}</span>
                    <span className={`text-xs mt-0.5 ${isSelected ? "text-white/80" : "text-[#64748B]"}`}>
                      {opt.desc}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── ROW 5: Select Question Difficulty ── */}
        <div className="space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-[#334155] flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-[#4F46E5]/10 flex items-center justify-center text-[#4F46E5]">
              <BarChart3 className="w-3.5 h-3.5" />
            </div>
            Select Question Difficulty
          </label>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {difficultyOptions.map((opt) => {
              const isSelected = difficulty === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setDifficulty(opt.value)}
                  className={`py-3 px-4 rounded-xl border text-sm font-bold transition-all duration-200 text-center ${
                    isSelected
                      ? "bg-[#4F46E5] text-white border-[#4F46E5] shadow-md shadow-indigo-500/20"
                      : "bg-white text-[#475569] border-[#E2E8F0] hover:border-[#CBD5E1] hover:bg-[#F8FAFC]"
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── ROW 6: Interview Summary Card ── */}
        <div className="p-5 bg-gradient-to-r from-[#FAF9FF] via-[#F5F3FF] to-[#EEF2FF] border border-[#E0E0F0] rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-[#4F46E5]/10 flex items-center justify-center text-[#4F46E5] shrink-0 mt-0.5">
              <Info className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-[#0F172A] flex items-center gap-2">
                Interview Summary: {questionsCount} Primary Questions
              </h4>
              <p className="text-xs text-[#64748B] leading-relaxed max-w-2xl">
                Your interview will contain at least {questionsCount} personalized questions tailored to your selected resume and job role. Includes real-time voice synthesis, microphone capture, posture coaching, and comprehensive report generation.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 px-3.5 py-2 bg-white/80 backdrop-blur-sm border border-[#C7D2FE] rounded-xl shrink-0 self-start md:self-auto shadow-2xs">
            <Video className="w-4 h-4 text-[#10B981]" />
            <div className="flex flex-col">
              <span className="text-xs font-bold text-[#0F172A]">Webcam & Voice Enabled</span>
              <span className="text-[10px] text-[#64748B]">Practice with real-time feedback</span>
            </div>
          </div>
        </div>

        {/* ── ROW 7: Start Interview Action CTA ── */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-[#4F46E5] via-[#6366F1] to-[#7C3AED] hover:opacity-95 text-white font-bold text-base rounded-2xl shadow-xl shadow-indigo-500/25 transition-all duration-200 active:scale-98 cursor-pointer"
          >
            <span>Start {questionsCount}-Question Interview</span>
            <ArrowRight className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" />
          </button>
        </div>

      </form>
    </div>
  );
};
