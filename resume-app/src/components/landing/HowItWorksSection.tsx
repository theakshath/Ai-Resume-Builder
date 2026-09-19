"use client";

import React from "react";
import Link from "next/link";
import {
  FileText,
  Bot,
  Layout,
  Download,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Zap,
  Clock,
  Award,
} from "lucide-react";

export const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      number: "1",
      icon: <FileText className="w-5 h-5 text-[#4338CA]" />,
      title: "Add Your Information",
      description:
        "Enter your basic details, education, work experience, skills, and achievements.",
      bullets: [
        "Easy-to-fill form",
        "Guided suggestions",
        "AI helps you write better",
      ],
    },
    {
      number: "2",
      icon: <Bot className="w-5 h-5 text-[#4338CA]" />,
      title: "Let AI Do the Magic",
      description:
        "Our AI analyzes your information, improves your content, and optimizes it for ATS.",
      bullets: [
        "Smart suggestions",
        "Keyword optimization",
        "Professional tone & formatting",
      ],
    },
    {
      number: "3",
      icon: <Layout className="w-5 h-5 text-[#4338CA]" />,
      title: "Choose a Template",
      description:
        "Pick from 50+ modern, professional templates designed for every industry.",
      bullets: [
        "Modern & clean designs",
        "Industry-specific templates",
        "Live preview",
      ],
    },
    {
      number: "4",
      icon: <Download className="w-5 h-5 text-[#4338CA]" />,
      title: "Download & Apply",
      description:
        "Download your resume in PDF or share a link and start applying to your dream jobs.",
      bullets: [
        "High-quality PDF",
        "Shareable link",
        "Ready to apply anywhere",
      ],
    },
  ];

  return (
    <section id="how-it-works" className="py-20 sm:py-28 bg-[#FFFFFF] border-t border-slate-200/70">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        {/* TOP BLOCK: "From Your Information to Your Dream Job" */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Hero-style Text */}
          <div className="lg:col-span-6 space-y-5 text-left">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#4338CA] bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100 inline-block">
              HOW IT WORKS
            </span>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0F172A] tracking-tight leading-tight">
              From Your Information<br />
              <span className="text-[#4338CA]">to Your Dream Job</span>
            </h2>

            <p className="text-base text-slate-600 max-w-lg leading-relaxed">
              Create a professional, ATS-optimized resume in just a few simple steps — powered by AI.
            </p>

            {/* 3 Value Pillars */}
            <div className="grid grid-cols-3 gap-4 pt-2">
              <div className="space-y-1">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-[#4338CA] flex items-center justify-center mb-2">
                  <Zap className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-slate-900">Simple Process</h4>
                <p className="text-[11px] text-slate-500">No complex forms</p>
              </div>

              <div className="space-y-1">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-[#4338CA] flex items-center justify-center mb-2">
                  <Clock className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-slate-900">Save Time</h4>
                <p className="text-[11px] text-slate-500">Create in minutes</p>
              </div>

              <div className="space-y-1">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-[#4338CA] flex items-center justify-center mb-2">
                  <Award className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-slate-900">Better Results</h4>
                <p className="text-[11px] text-slate-500">Get noticed faster</p>
              </div>
            </div>
          </div>

          {/* Right Visual Workflow Mockup */}
          <div className="lg:col-span-6 relative">
            <div className="bg-[#FAF9FD] rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-lg flex flex-col sm:flex-row items-center gap-6 text-left">
              {/* Left Form preview pill */}
              <div className="w-full sm:w-44 bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-2">
                <span className="text-[11px] font-bold text-slate-900 block">Your Details</span>
                <div className="space-y-1.5 text-[10px] text-slate-500">
                  <div className="p-1.5 bg-slate-50 rounded border border-slate-100">🎓 Education</div>
                  <div className="p-1.5 bg-slate-50 rounded border border-slate-100">💼 Work Experience</div>
                  <div className="p-1.5 bg-slate-50 rounded border border-slate-100">⚡ Skills</div>
                  <div className="p-1.5 bg-slate-50 rounded border border-slate-100">★ Achievements</div>
                </div>
              </div>

              {/* Connecting Arrow */}
              <div className="hidden sm:block text-slate-300">
                <ArrowRight className="w-5 h-5" />
              </div>

              {/* Central Resume Preview */}
              <div className="flex-1 bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-2.5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="font-bold text-xs text-slate-900">ResumeAI Document</span>
                  <span className="text-[10px] font-bold text-[#10B981] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    ATS Ready
                  </span>
                </div>
                <div className="space-y-1">
                  <div className="h-2 w-28 bg-[#4338CA] rounded" />
                  <div className="h-1.5 w-full bg-slate-100 rounded" />
                  <div className="h-1.5 w-5/6 bg-slate-100 rounded" />
                </div>
                <div className="flex gap-1.5 pt-1">
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-indigo-50 text-[#4338CA] font-medium">
                    AI Optimized
                  </span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-50 text-[#10B981] font-medium">
                    Clean Format
                  </span>
                </div>
              </div>
            </div>

            {/* Handwritten Decorative Callout Top */}
            <div className="hidden sm:block absolute -top-6 left-1/3 pointer-events-none">
              <span className="font-serif italic text-xs text-slate-400 -rotate-6 block">
                Easy Steps<br />Big Results
              </span>
            </div>
          </div>
        </div>

        {/* 4-STEP FLOW: "How ResumeAI Works" */}
        <div className="space-y-10 pt-8 border-t border-slate-200/60">
          <div className="text-center space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#4338CA] bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100 inline-block">
              STEP BY STEP
            </span>
            <h3 className="text-3xl sm:text-4xl font-black text-[#0F172A] tracking-tight">
              How ResumeAI Works
            </h3>
            <p className="text-sm text-slate-500">
              Four simple steps to create a resume that gets you hired.
            </p>
          </div>

          {/* 4 Cards Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, idx) => (
              <div
                key={idx}
                className="bg-[#FAF9FD] rounded-2xl border border-slate-200/90 p-6 flex flex-col justify-between text-left hover:border-indigo-300 hover:shadow-md transition-all duration-300"
              >
                <div>
                  {/* Step Number Circle */}
                  <div className="w-8 h-8 rounded-full bg-[#4338CA] text-white flex items-center justify-center font-bold text-sm mb-4 shadow-sm">
                    {step.number}
                  </div>

                  <h4 className="text-base font-bold text-slate-900 mb-2">
                    {step.title}
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    {step.description}
                  </p>

                  {/* Bullet points */}
                  <div className="space-y-1.5 border-t border-slate-200/70 pt-3">
                    {step.bullets.map((bullet, bIdx) => (
                      <div key={bIdx} className="flex items-center gap-1.5 text-[11px] text-slate-600">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#4338CA]" />
                        <span>{bullet}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* BOTTOM CALLOUT BANNER: Ready to Build Your Professional Resume? */}
        <div className="bg-gradient-to-r from-indigo-50 via-purple-50 to-indigo-50 rounded-3xl border border-indigo-100 p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 text-left shadow-sm">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#4338CA]">
              <Sparkles className="w-4 h-4" />
              <span>Join 500,000+ students and professionals who trust ResumeAI.</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Ready to Build Your Professional Resume?
            </h3>
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
              <span>✓ No credit card required</span>
              <span>✓ Free forever plan</span>
              <span>✓ Trusted by professionals</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <Link href="/signup">
              <button className="bg-[#4338CA] hover:bg-[#3730A3] text-white text-sm font-semibold px-6 py-3.5 rounded-full shadow-sm hover:shadow transition-all inline-flex items-center gap-2">
                Get Started Free →
              </button>
            </Link>
            <Link href="/dashboard/templates">
              <button className="bg-white hover:bg-slate-50 text-slate-800 text-sm font-semibold px-6 py-3.5 rounded-full border border-slate-300 shadow-2xs transition-all">
                View Templates
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
