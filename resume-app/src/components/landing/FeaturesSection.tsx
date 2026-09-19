"use client";

import React from "react";
import Link from "next/link";
import {
  Sparkles,
  Layout,
  Target,
  FileCheck2,
  Mic,
  Lightbulb,
  Download,
  TrendingUp,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

export const FeaturesSection: React.FC = () => {
  const featureCards = [
    {
      icon: <Sparkles className="w-5 h-5 text-[#4338CA]" />,
      title: "AI Resume Optimizer",
      description:
        "Get personalized suggestions to improve your content, fix mistakes, and make it ATS-friendly.",
    },
    {
      icon: <Layout className="w-5 h-5 text-[#4338CA]" />,
      title: "Professional Templates",
      description:
        "Choose from 50+ modern, recruiter-approved templates for every industry.",
    },
    {
      icon: <Target className="w-5 h-5 text-[#4338CA]" />,
      title: "ATS Score Checker",
      description:
        "Check how well your resume performs with ATS and get actionable feedback.",
    },
    {
      icon: <FileCheck2 className="w-5 h-5 text-[#4338CA]" />,
      title: "Job Match",
      description:
        "Find jobs that match your skills and get tailored resume suggestions.",
    },
    {
      icon: <Mic className="w-5 h-5 text-[#4338CA]" />,
      title: "Interview Practice",
      description:
        "Practice with AI-powered mock interviews and get real-time feedback.",
    },
    {
      icon: <Lightbulb className="w-5 h-5 text-[#4338CA]" />,
      title: "AI Suggestions",
      description:
        "Get smart recommendations for skills, keywords, and achievements based on your target role.",
    },
    {
      icon: <Download className="w-5 h-5 text-[#4338CA]" />,
      title: "Easy Export",
      description:
        "Download your resume in PDF or share a link — ready to apply everywhere.",
    },
    {
      icon: <TrendingUp className="w-5 h-5 text-[#4338CA]" />,
      title: "Track & Improve",
      description:
        "See your progress, ATS score history, and tips to make your resume even stronger.",
    },
  ];

  return (
    <section id="features" className="py-20 sm:py-28 bg-[#FFFFFF] border-t border-slate-200/70">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        {/* TOP HERO SECTION OF FEATURES: Powerful Features for a Brighter Career */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-6 space-y-5 text-left">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#4338CA] bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100 inline-block">
              # FEATURES
            </span>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0F172A] tracking-tight leading-tight">
              Powerful Features<br />
              <span className="text-[#4338CA]">for a Brighter Career</span>
            </h2>

            <p className="text-base text-slate-600 max-w-lg leading-relaxed">
              Everything you need to create a professional resume, stand out from the crowd, and land your dream job — powered by AI.
            </p>

            {/* Metrics */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-200/60 max-w-md">
              <div>
                <span className="text-2xl sm:text-3xl font-black text-[#0F172A] block">500K+</span>
                <span className="text-xs text-slate-500">Resumes Created</span>
              </div>
              <div>
                <span className="text-2xl sm:text-3xl font-black text-[#4338CA] block">94%</span>
                <span className="text-xs text-slate-500">User Satisfaction</span>
              </div>
              <div>
                <span className="text-2xl sm:text-3xl font-black text-[#10B981] block">3x</span>
                <span className="text-xs text-slate-500">Higher Interview Calls</span>
              </div>
            </div>
          </div>

          {/* Right Visual: Before & After Transformation Mockup */}
          <div className="lg:col-span-6 relative">
            <div className="bg-[#FAF9FD] rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-lg flex flex-col sm:flex-row items-center gap-6 text-left">
              {/* Left raw resume draft */}
              <div className="w-full sm:w-44 bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-2 opacity-80">
                <span className="text-[11px] font-bold text-slate-400 block uppercase">Draft Resume</span>
                <div className="space-y-1">
                  <div className="h-2 w-20 bg-slate-300 rounded" />
                  <div className="h-1.5 w-full bg-slate-200 rounded" />
                  <div className="h-1.5 w-4/5 bg-slate-200 rounded" />
                </div>
                <span className="text-[10px] text-rose-500 bg-rose-50 px-2 py-0.5 rounded block text-center font-medium">
                  Needs Optimization
                </span>
              </div>

              {/* Transformation Arrow */}
              <div className="hidden sm:block text-slate-300">
                <ArrowRight className="w-5 h-5 text-[#4338CA]" />
              </div>

              {/* Right Optimized Resume & ATS Score badge */}
              <div className="flex-1 bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3 relative">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <div>
                    <h4 className="font-bold text-xs text-slate-900">Alex Morgan</h4>
                    <p className="text-[10px] text-slate-500">Software Engineer</p>
                  </div>
                  {/* ATS 92 Excellent badge */}
                  <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-1 rounded-full text-[10px] font-bold">
                    <span className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[9px]">
                      92
                    </span>
                    <span>Excellent!</span>
                  </div>
                </div>

                <div className="space-y-1.5 text-[10px] text-slate-600">
                  <div className="flex items-center gap-1 text-emerald-700 font-semibold">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    AI Optimized Bullets
                  </div>
                  <div className="flex items-center gap-1 text-emerald-700 font-semibold">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    Professionally Formatted
                  </div>
                  <div className="flex items-center gap-1 text-emerald-700 font-semibold">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    100% ATS Friendly
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative Handwritten labels */}
            <div className="hidden sm:block absolute -top-5 left-10 pointer-events-none">
              <span className="font-serif italic text-xs text-slate-400">From This</span>
            </div>
            <div className="hidden sm:block absolute -top-5 right-10 pointer-events-none">
              <span className="font-serif italic text-xs text-slate-400">To This</span>
            </div>
          </div>
        </div>

        {/* 8 FEATURE CARDS GRID: "Features Designed for Your Success" */}
        <div className="space-y-10 pt-8 border-t border-slate-200/60">
          <div className="text-center space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#4338CA] bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100 inline-block">
              WHAT YOU GET
            </span>
            <h3 className="text-3xl sm:text-4xl font-black text-[#0F172A] tracking-tight">
              Features Designed for Your Success
            </h3>
            <p className="text-sm text-slate-500">
              Simple tools. Powerful results. All in one place.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featureCards.map((card, idx) => (
              <div
                key={idx}
                className="group bg-[#FAF9FD] rounded-2xl border border-slate-200/90 p-6 flex flex-col justify-between text-left hover:border-indigo-300 hover:shadow-md transition-all duration-300"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-200/90 flex items-center justify-center mb-4 shadow-2xs group-hover:scale-105 transition-transform">
                    {card.icon}
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 mb-1.5 group-hover:text-[#4338CA] transition-colors">
                    {card.title}
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {card.description}
                  </p>
                </div>
                <div className="pt-4 flex items-center text-xs font-semibold text-[#4338CA] opacity-0 group-hover:opacity-100 transition-opacity">
                  Learn more <ArrowRight className="w-3 h-3 ml-1" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* BOTTOM PROMO BANNER: Your Career Growth Partner */}
        <div className="bg-gradient-to-r from-indigo-50 via-purple-50 to-indigo-50 rounded-3xl border border-indigo-100 p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 text-left shadow-sm">
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#4338CA]">
              MORE THAN A RESUME
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Your Career Growth Partner
            </h3>
            <p className="text-xs sm:text-sm text-slate-600">
              Build. Improve. Practice. Get Hired — with ResumeAI.
            </p>
          </div>

          <div className="flex flex-col items-center sm:items-end gap-2 shrink-0">
            <Link href="/signup">
              <button className="bg-[#4338CA] hover:bg-[#3730A3] text-white text-sm font-semibold px-7 py-3.5 rounded-full shadow-sm hover:shadow transition-all inline-flex items-center gap-2">
                Get Started Free →
              </button>
            </Link>
            <span className="text-[11px] text-slate-500">✓ No credit card required</span>
          </div>
        </div>
      </div>
    </section>
  );
};
