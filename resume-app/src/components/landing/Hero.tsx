"use client";

import React from "react";
import Link from "next/link";
import { ProductPreview } from "@/components/landing/ProductPreview";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Play,
} from "lucide-react";

export const Hero: React.FC = () => {
  const companies = [
    { name: "Google", font: "font-semibold tracking-tight" },
    { name: "Microsoft", font: "font-medium tracking-tight" },
    { name: "amazon", font: "font-bold lowercase tracking-normal" },
    { name: "tcs", font: "font-bold lowercase tracking-wider" },
    { name: "Infosys", font: "font-medium tracking-wide" },
    { name: "accenture", font: "font-semibold lowercase tracking-tight" },
  ];

  return (
    <section className="pt-24 pb-16 sm:pt-28 sm:pb-24 overflow-hidden relative bg-[#FAF9FD]">
      {/* Background Soft Purple/Blue Radial Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1440px] h-[800px] pointer-events-none -z-10 overflow-hidden">
        <div className="absolute -top-32 left-1/4 w-[600px] h-[600px] bg-gradient-to-br from-indigo-100/70 via-purple-100/40 to-transparent rounded-full blur-3xl opacity-80" />
        <div className="absolute top-10 right-10 w-[650px] h-[650px] bg-gradient-to-bl from-purple-100/60 via-blue-50/40 to-transparent rounded-full blur-3xl opacity-80" />
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main 2-Column Hero Grid: Left content, Right product preview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-10 items-center">
          {/* LEFT HERO COLUMN (lg:col-span-5) */}
          <div className="lg:col-span-5 flex flex-col items-start text-left space-y-6">
            {/* Small Eyebrow Badge: AI-powered career toolkit */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50/90 border border-indigo-100 text-xs font-semibold text-[#4338CA] shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-[#4338CA]" />
              <span>AI-powered career toolkit</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-[58px] font-black tracking-tight text-[#0F172A] leading-[1.08]">
              Build a resume that{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4338CA] via-[#6366F1] to-[#3B82F6] block mt-1">
                gets you noticed.
              </span>
            </h1>

            {/* Supporting Description */}
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-lg font-normal">
              Create an ATS-friendly resume, tailor it to the job, and practice your interview with AI.
            </p>

            {/* Compact Feature Highlights Row with Purple Badges */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-1 text-xs font-semibold text-slate-800">
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#4338CA] fill-indigo-100" />
                ATS-Optimized
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#4338CA] fill-indigo-100" />
                AI Suggestions
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#4338CA] fill-indigo-100" />
                Professional Templates
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#4338CA] fill-indigo-100" />
                Interview Practice
              </span>
            </div>

            {/* CTA Buttons Row */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 w-full sm:w-auto pt-2">
              <Link href="/signup">
                <button className="inline-flex items-center justify-center gap-2 bg-[#4338CA] hover:bg-[#3730A3] text-white text-sm font-semibold px-7 py-3.5 rounded-full shadow-md shadow-indigo-600/25 hover:shadow-lg transition-all">
                  Build My Resume — It's Free
                  <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
              <a href="#how-it-works">
                <button className="inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-900 text-sm font-semibold px-6 py-3.5 rounded-full border border-slate-200/90 shadow-2xs transition-all">
                  <span className="w-5 h-5 rounded-full bg-indigo-50 text-[#4338CA] flex items-center justify-center">
                    <Play className="w-2.5 h-2.5 fill-current ml-0.5" />
                  </span>
                  See How It Works
                </button>
              </a>
            </div>

            {/* Trust Line */}
            <div className="flex items-center gap-4 text-xs text-slate-500 pt-1">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-slate-400" /> No credit card required
              </span>
              <span className="text-slate-300">|</span>
              <span className="flex items-center gap-1.5">
                <span className="text-slate-400 font-bold">∞</span> Save your work automatically
              </span>
            </div>

            {/* Statistics Row: 500K+, 3x, 94% */}
            <div className="grid grid-cols-3 gap-6 pt-4 border-t border-slate-200/60 w-full max-w-md text-left">
              <div>
                <span className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight block">500K+</span>
                <span className="text-[11px] font-medium text-slate-500 leading-tight block">Resumes Created</span>
              </div>
              <div>
                <span className="text-2xl sm:text-3xl font-black text-[#4338CA] tracking-tight block">3x</span>
                <span className="text-[11px] font-medium text-slate-500 leading-tight block">Higher Interview Calls</span>
              </div>
              <div>
                <span className="text-2xl sm:text-3xl font-black text-[#4338CA] tracking-tight block">94%</span>
                <span className="text-[11px] font-medium text-slate-500 leading-tight block">User Satisfaction</span>
              </div>
            </div>

            {/* Decorative Handwritten Annotation Bottom-Left: Better Resumes Brighter Opportunities. */}
            <div className="relative pt-1">
              <div className="font-serif italic text-sm text-slate-400 -rotate-6 pointer-events-none select-none">
                Better Resumes<br />Brighter Opportunities.
                <svg
                  className="w-12 h-6 text-slate-300 mt-1 ml-4"
                  viewBox="0 0 50 25"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                >
                  <path d="M5 5 C 20 20, 35 15, 45 5" />
                  <path d="M40 5 L 45 5 L 44 10" />
                </svg>
              </div>
            </div>

            {/* Trusted Companies */}
            <div className="pt-2 w-full">
              <p className="text-[11px] font-medium text-slate-400 mb-2.5">
                Trusted by students and professionals at
              </p>
              <div className="flex flex-wrap items-center gap-x-6 sm:gap-x-8 gap-y-2 opacity-65 grayscale hover:grayscale-0 transition-all duration-300">
                {companies.map((company, idx) => (
                  <span
                    key={idx}
                    className={`text-slate-600 hover:text-slate-900 text-sm sm:text-base ${company.font} select-none`}
                  >
                    {company.name}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT HERO COLUMN (lg:col-span-7) */}
          <div className="lg:col-span-7 w-full pt-4 lg:pt-0">
            <ProductPreview />
          </div>
        </div>
      </div>
    </section>
  );
};
