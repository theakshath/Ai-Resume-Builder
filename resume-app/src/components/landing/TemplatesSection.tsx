"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface TemplateCard {
  id: string;
  name: string;
  author: string;
  description: string;
  accentClass: string;
  isDark?: boolean;
}

export const TemplatesSection: React.FC = () => {
  const templates: TemplateCard[] = [
    {
      id: "modern-professional",
      name: "Modern Professional",
      author: "Alex Morgan",
      description: "Clean single-column layout with bold titles and structured bullet points.",
      accentClass: "from-blue-500 to-indigo-600",
    },
    {
      id: "minimal-clean",
      name: "Minimal Clean",
      author: "Alex Morgan",
      description: "Monospaced hierarchy, generous whitespace, and 100% parser compatibility.",
      accentClass: "from-slate-400 to-slate-600",
    },
    {
      id: "dark-professional",
      name: "Dark Professional",
      author: "Alex Morgan",
      description: "High-contrast dark card aesthetic for creative, tech, and executive roles.",
      accentClass: "from-slate-900 to-slate-950",
      isDark: true,
    },
    {
      id: "creative-modern",
      name: "Creative Modern",
      author: "Alex Morgan",
      description: "Compact sidebar accent with skills tags and project portfolio links.",
      accentClass: "from-purple-500 to-indigo-600",
    },
    {
      id: "elegant-classic",
      name: "Elegant Classic",
      author: "ALEX MORGAN",
      description: "Traditional corporate typography with centered headers and clean dividers.",
      accentClass: "from-slate-700 to-slate-900",
    },
    {
      id: "modern-gradient",
      name: "Modern Gradient",
      author: "Alex Morgan",
      description: "Vibrant accent column with emerald tags designed for modern tech candidates.",
      accentClass: "from-emerald-500 to-teal-600",
    },
  ];

  return (
    <section id="templates" className="py-20 sm:py-24 bg-[#FAF9FD] border-t border-slate-200/70">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Eyebrow badge */}
        <div className="text-center mb-3">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#4338CA] bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100 inline-block">
            POPULAR TEMPLATES
          </span>
        </div>

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-2 mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-black tracking-tight text-[#0F172A]">
            Professional Templates for Every Career
          </h2>
          <p className="text-sm sm:text-base text-slate-500">
            Choose from 50+ ATS-optimized templates designed by experts.
          </p>
        </div>

        {/* View All Templates link on top right */}
        <div className="flex justify-end mb-6">
          <Link
            href="/dashboard/templates"
            className="text-xs font-bold text-[#4338CA] hover:text-[#3730A3] inline-flex items-center gap-1 group"
          >
            View All Templates
            <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* 6 Template Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5">
          {templates.map((template) => (
            <Link
              key={template.id}
              href={`/dashboard/resumes/builder?template=${template.id}`}
              className="group bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-xl hover:border-indigo-300 transition-all duration-300 overflow-hidden flex flex-col text-left p-3"
            >
              {/* Template Miniature Paper Mockup */}
              <div
                className={`h-56 rounded-xl border p-3.5 flex flex-col justify-between transition-transform duration-300 group-hover:scale-102 ${
                  template.isDark
                    ? "bg-[#111827] border-slate-800 text-white"
                    : "bg-white border-slate-200/80 text-slate-900 shadow-2xs"
                }`}
              >
                {/* Header in paper */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold ${
                        template.isDark ? "bg-slate-700 text-slate-200" : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      AM
                    </div>
                    <div>
                      <div className="text-[11px] font-bold leading-none">{template.author}</div>
                      <div
                        className={`text-[8.5px] ${
                          template.isDark ? "text-slate-400" : "text-slate-500"
                        } mt-0.5`}
                      >
                        Software Engineer
                      </div>
                    </div>
                  </div>

                  <div
                    className={`h-px w-full my-1.5 ${
                      template.isDark ? "bg-slate-800" : "bg-slate-100"
                    }`}
                  />

                  {/* Section lines */}
                  <div className="space-y-1">
                    <div
                      className={`h-1.5 w-12 rounded ${
                        template.isDark ? "bg-indigo-400/50" : "bg-indigo-500"
                      }`}
                    />
                    <div
                      className={`h-1 w-full rounded ${
                        template.isDark ? "bg-slate-800" : "bg-slate-100"
                      }`}
                    />
                    <div
                      className={`h-1 w-5/6 rounded ${
                        template.isDark ? "bg-slate-800" : "bg-slate-100"
                      }`}
                    />
                  </div>

                  <div className="space-y-1 mt-2.5">
                    <div
                      className={`h-1.5 w-14 rounded ${
                        template.isDark ? "bg-indigo-400/50" : "bg-indigo-500"
                      }`}
                    />
                    <div
                      className={`h-1 w-full rounded ${
                        template.isDark ? "bg-slate-800" : "bg-slate-100"
                      }`}
                    />
                    <div
                      className={`h-1 w-4/6 rounded ${
                        template.isDark ? "bg-slate-800" : "bg-slate-100"
                      }`}
                    />
                  </div>
                </div>

                {/* Bottom skill pills in paper */}
                <div className="flex gap-1 pt-2">
                  <div
                    className={`h-2 w-7 rounded ${
                      template.isDark ? "bg-slate-800" : "bg-slate-100"
                    }`}
                  />
                  <div
                    className={`h-2 w-7 rounded ${
                      template.isDark ? "bg-slate-800" : "bg-slate-100"
                    }`}
                  />
                  <div
                    className={`h-2 w-7 rounded ${
                      template.isDark ? "bg-slate-800" : "bg-slate-100"
                    }`}
                  />
                </div>
              </div>

              {/* Title & Category below paper */}
              <div className="pt-3 pb-1 px-1">
                <h3 className="font-bold text-xs text-slate-900 group-hover:text-[#4338CA] transition-colors truncate">
                  {template.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>

        {/* Explore All Templates Bottom Button + Decorative Callout */}
        <div className="mt-12 flex flex-col items-center relative">
          <Link href="/dashboard/templates">
            <button className="bg-[#4338CA] hover:bg-[#3730A3] text-white font-semibold text-sm px-8 py-3.5 rounded-full shadow-md shadow-indigo-600/20 hover:shadow-lg transition-all inline-flex items-center gap-2">
              Explore All Templates
              <ArrowRight className="w-4 h-4" />
            </button>
          </Link>

          {/* Handwritten Style Annotation: Find the perfect one for you! */}
          <div className="hidden sm:block absolute right-1/4 -bottom-8 pointer-events-none">
            <span className="font-serif italic text-sm text-slate-400 -rotate-3 block">
              Find the perfect<br />one for you!
            </span>
            <svg
              className="w-10 h-6 text-slate-300 ml-auto -mt-1"
              viewBox="0 0 40 25"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            >
              <path d="M5 5 C 15 20, 25 22, 35 15" />
              <path d="M30 14 L 35 15 L 34 20" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
};
