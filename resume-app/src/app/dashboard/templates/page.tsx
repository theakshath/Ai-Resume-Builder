"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  Search,
  Heart,
  ArrowRight,
  CheckCircle2,
  Star,
  X,
  ShieldCheck,
  Zap,
  SlidersHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Toast } from "@/components/ui/Toast";

export interface TemplateItem {
  id: string;
  name: string;
  category: "Professional" | "Modern" | "Minimal" | "Creative" | "Academic" | "Tech" | "Business" | "Healthcare" | "Finance";
  tags: string[];
  description: string;
  atsScore: number;
  isPopular?: boolean;
  colorHex: string;
  isDark?: boolean;
  previewType:
    | "modern"
    | "dark"
    | "minimal"
    | "sidebar"
    | "classic"
    | "gradient"
    | "creative-colorful"
    | "academic"
    | "bold"
    | "tech-elite"
    | "business"
    | "elegant-sidebar";
  demoCandidate: {
    name: string;
    role: string;
    avatarInitials: string;
  };
}

const templatesCatalog: TemplateItem[] = [
  {
    id: "modern-professional",
    name: "Modern Professional",
    category: "Modern",
    tags: ["Clean", "ATS Friendly"],
    description: "Sleek modern header with crisp typography and high-density recruiter scanning layout.",
    atsScore: 98,
    isPopular: true,
    colorHex: "#4F46E5",
    previewType: "modern",
    demoCandidate: { name: "Alex Morgan", role: "Software Engineer", avatarInitials: "AM" },
  },
  {
    id: "dark-professional",
    name: "Dark Professional",
    category: "Modern",
    tags: ["Modern", "Elegant"],
    description: "High-contrast dark mode canvas with vibrant indigo accent highlights.",
    atsScore: 96,
    colorHex: "#1E1E2E",
    isDark: true,
    previewType: "dark",
    demoCandidate: { name: "Alex Morgan", role: "Product Designer", avatarInitials: "AM" },
  },
  {
    id: "minimal-clean",
    name: "Minimal Clean",
    category: "Minimal",
    tags: ["Simple", "ATS Friendly"],
    description: "Monospaced sub-headers, generous whitespace, and ultra-clean hierarchy.",
    atsScore: 99,
    isPopular: true,
    colorHex: "#3B82F6",
    previewType: "minimal",
    demoCandidate: { name: "Alex Morgan", role: "Data Analyst", avatarInitials: "AM" },
  },
  {
    id: "creative-sidebar",
    name: "Creative Sidebar",
    category: "Creative",
    tags: ["Creative", "Modern"],
    description: "Two-column design featuring a purple sidebar for skills and contact info.",
    atsScore: 92,
    colorHex: "#6366F1",
    previewType: "sidebar",
    demoCandidate: { name: "Alex Morgan", role: "Full Stack Developer", avatarInitials: "AM" },
  },
  {
    id: "elegant-classic",
    name: "Elegant Classic",
    category: "Professional",
    tags: ["Professional", "Timeless"],
    description: "Traditional executive format with refined serif titles and structured dividers.",
    atsScore: 97,
    colorHex: "#475569",
    previewType: "classic",
    demoCandidate: { name: "Alex Morgan", role: "Marketing Specialist", avatarInitials: "AM" },
  },
  {
    id: "modern-gradient",
    name: "Modern Gradient",
    category: "Modern",
    tags: ["Trendy", "Fresh"],
    description: "Top gradient banner accents with organized technical competence chips.",
    atsScore: 94,
    colorHex: "#10B981",
    previewType: "gradient",
    demoCandidate: { name: "Alex Morgan", role: "Mechanical Engineer", avatarInitials: "AM" },
  },
  {
    id: "creative-modern",
    name: "Creative Modern",
    category: "Creative",
    tags: ["Creative", "Colorful"],
    description: "Playful accent pops designed for designers, marketers, and content creators.",
    atsScore: 91,
    colorHex: "#EC4899",
    previewType: "creative-colorful",
    demoCandidate: { name: "Alex Morgan", role: "UI/UX Designer", avatarInitials: "AM" },
  },
  {
    id: "academic",
    name: "Academic",
    category: "Academic",
    tags: ["Simple", "Formal"],
    description: "Scholarly CV structure tailored for research publications and education credentials.",
    atsScore: 95,
    colorHex: "#64748B",
    previewType: "academic",
    demoCandidate: { name: "Alex Morgan", role: "Research Scholar", avatarInitials: "AM" },
  },
  {
    id: "bold-modern",
    name: "Bold Modern",
    category: "Tech",
    tags: ["Bold", "Professional"],
    description: "Commanding header bar layout that highlights core impact metrics and leadership.",
    atsScore: 94,
    colorHex: "#EF4444",
    previewType: "bold",
    demoCandidate: { name: "Alex Morgan", role: "Cybersecurity Analyst", avatarInitials: "AM" },
  },
  {
    id: "tech-elite",
    name: "Tech Elite",
    category: "Tech",
    tags: ["Premium", "Modern"],
    description: "Dark slate theme built for senior engineers, CTOs, and tech architects.",
    atsScore: 96,
    colorHex: "#0F172A",
    isDark: true,
    previewType: "tech-elite",
    demoCandidate: { name: "Alex Morgan", role: "AI/ML Engineer", avatarInitials: "AM" },
  },
  {
    id: "business-professional",
    name: "Business Professional",
    category: "Business",
    tags: ["Professional", "Clean"],
    description: "Corporate blueprint optimized for finance, management, and consulting.",
    atsScore: 98,
    isPopular: true,
    colorHex: "#2563EB",
    previewType: "business",
    demoCandidate: { name: "Alex Morgan", role: "Chartered Accountant", avatarInitials: "AM" },
  },
  {
    id: "creative-elegant",
    name: "Creative Elegant",
    category: "Creative",
    tags: ["Unique", "Stylish"],
    description: "Warm subtle background curves with elegant typography and clean balance.",
    atsScore: 93,
    colorHex: "#F59E0B",
    previewType: "elegant-sidebar",
    demoCandidate: { name: "Alex Morgan", role: "Content Writer", avatarInitials: "AM" },
  },
  // Existing template IDs preserved for full system compatibility
  {
    id: "executive-clean",
    name: "Executive Clean",
    category: "Professional",
    tags: ["Executive", "Clean"],
    description: "Classic typography, crisp line dividers, and high-density recruiter readability.",
    atsScore: 98,
    isPopular: true,
    colorHex: "#4F46E5",
    previewType: "classic",
    demoCandidate: { name: "Alex Morgan", role: "Executive Director", avatarInitials: "AM" },
  },
  {
    id: "tech-specialist",
    name: "Tech Specialist",
    category: "Tech",
    tags: ["GitHub Links", "Technical"],
    description: "Optimized for GitHub links, technical skills grouping, and project metrics.",
    atsScore: 95,
    isPopular: true,
    colorHex: "#059669",
    previewType: "tech-elite",
    demoCandidate: { name: "Alex Morgan", role: "Staff DevOps Lead", avatarInitials: "AM" },
  },
  {
    id: "minimalist-mono",
    name: "Minimalist Mono",
    category: "Minimal",
    tags: ["Monospace", "Clean"],
    description: "Monospaced sub-headers, generous whitespace, and elegant clean hierarchy.",
    atsScore: 92,
    colorHex: "#7C3AED",
    previewType: "minimal",
    demoCandidate: { name: "Alex Morgan", role: "Product Manager", avatarInitials: "AM" },
  },
  {
    id: "modern-tech",
    name: "Modern Tech",
    category: "Tech",
    tags: ["Engineering", "Accents"],
    description: "Vibrant accent highlights with side-by-side core competence tags.",
    atsScore: 94,
    colorHex: "#2563EB",
    previewType: "modern",
    demoCandidate: { name: "Alex Morgan", role: "Systems Architect", avatarInitials: "AM" },
  },
  {
    id: "creative-bold",
    name: "Creative Bold",
    category: "Creative",
    tags: ["Marketing", "Visual Callouts"],
    description: "Bold header profile layout with distinct visual callouts for key achievements.",
    atsScore: 90,
    colorHex: "#D97706",
    previewType: "bold",
    demoCandidate: { name: "Alex Morgan", role: "Brand Strategist", avatarInitials: "AM" },
  },
  {
    id: "ats-standard",
    name: "ATS Universal Standard",
    category: "Professional",
    tags: ["100% Parser", "Workday"],
    description: "Guaranteed 100% Workday & Taleo parser compliance with plain formatting.",
    atsScore: 100,
    isPopular: true,
    colorHex: "#111827",
    previewType: "minimal",
    demoCandidate: { name: "Alex Morgan", role: "Operations Lead", avatarInitials: "AM" },
  },
];

const CATEGORIES = [
  "All",
  "Professional",
  "Modern",
  "Minimal",
  "Creative",
  "Academic",
  "Tech",
  "Business",
  "Healthcare",
  "Finance",
] as const;

export default function TemplatesPage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load favorites from local storage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("resumeai_favorite_templates");
      if (saved) setFavorites(JSON.parse(saved));
    } catch {
      // ignore
    }
  }, []);

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites((prev) => {
      const updated = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      try {
        localStorage.setItem("resumeai_favorite_templates", JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  const handleSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    setToastMessage(`Selected template "${templateId}". Opening Resume Builder...`);
    setTimeout(() => {
      router.push(`/dashboard/resumes/builder?template=${templateId}`);
    }, 450);
  };

  const filteredTemplates = useMemo(() => {
    return templatesCatalog.filter((tmpl) => {
      const matchesCategory =
        selectedCategory === "All" ||
        tmpl.category.toLowerCase() === selectedCategory.toLowerCase();

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        tmpl.name.toLowerCase().includes(q) ||
        tmpl.description.toLowerCase().includes(q) ||
        tmpl.category.toLowerCase().includes(q) ||
        tmpl.tags.some((tag) => tag.toLowerCase().includes(q));

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="space-y-8 bg-[#FAF9FD] min-h-screen pb-16 font-sans text-slate-900">
      {/* Upper Navigation Row / Skip to Builder */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            ResumeAI Catalog
          </span>
        </div>
        <Link href="/dashboard/resumes/builder">
          <Button
            variant="outline"
            size="sm"
            className="font-bold text-xs border-indigo-200 text-indigo-700 bg-indigo-50/50 hover:bg-indigo-100 hover:text-indigo-800 transition-all rounded-lg"
          >
            Skip to Builder →
          </Button>
        </Link>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-50/90 via-purple-50/50 to-indigo-100/60 border border-indigo-100/80 p-6 sm:p-8 lg:p-10 shadow-sm">
        {/* Soft Decorative Ambient Glow */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-300/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
          {/* Left Column: Hero Text */}
          <div className="lg:col-span-7 space-y-5 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100/80 border border-indigo-200/70 text-indigo-700 text-xs font-bold uppercase tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>✦ PROFESSIONAL TEMPLATES</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
              Templates for{" "}
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 bg-clip-text text-transparent underline decoration-indigo-300/70 decoration-wavy decoration-2">
                Every Ambition
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-xl font-medium">
              Choose from 50+ ATS-optimized, professional templates designed to help you stand out and get hired.
            </p>

            {/* Feature Indicators */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="flex items-start gap-2.5 bg-white/70 backdrop-blur-xs p-3 rounded-xl border border-indigo-100/70 shadow-2xs">
                <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">ATS Optimized</h4>
                  <p className="text-[11px] text-slate-500 font-medium">Pass applicant tracking systems</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 bg-white/70 backdrop-blur-xs p-3 rounded-xl border border-indigo-100/70 shadow-2xs">
                <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Professional Design</h4>
                  <p className="text-[11px] text-slate-500 font-medium">Modern & clean layouts</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 bg-white/70 backdrop-blur-xs p-3 rounded-xl border border-indigo-100/70 shadow-2xs">
                <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">For Every Industry</h4>
                  <p className="text-[11px] text-slate-500 font-medium">Tech, Business, Creative & more</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Mockup */}
          <div className="lg:col-span-5 relative flex justify-center items-center py-4">
            {/* Handwritten callout text 1 */}
            <div className="hidden sm:block absolute -top-2 left-0 z-20 font-serif italic text-xs font-bold text-indigo-600 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-full shadow-xs border border-indigo-100">
              Same Skills. A Stronger You. ✨
            </div>

            {/* Handwritten callout text 2 */}
            <div className="hidden sm:block absolute -bottom-2 right-2 z-20 font-serif italic text-xs font-bold text-purple-600 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-full shadow-xs border border-purple-100">
              Design · Apply · Grow 🚀
            </div>

            {/* Overlapping Mockup Stack */}
            <div className="relative w-full max-w-sm aspect-[4/3] flex items-center justify-center">
              {/* Back Card 2 */}
              <div className="absolute w-[70%] h-[85%] -left-2 top-2 bg-white rounded-xl shadow-md border border-slate-200/80 transform -rotate-6 p-3 space-y-2 opacity-60 pointer-events-none">
                <div className="h-3 bg-slate-200 rounded w-1/2" />
                <div className="h-2 bg-slate-100 rounded w-1/3" />
                <div className="space-y-1 pt-2">
                  <div className="h-1.5 bg-indigo-100 rounded w-full" />
                  <div className="h-1.5 bg-slate-100 rounded w-4/5" />
                </div>
              </div>

              {/* Back Card 1 */}
              <div className="absolute w-[75%] h-[90%] -right-2 top-0 bg-white rounded-xl shadow-lg border border-slate-200/80 transform rotate-4 p-3 space-y-2 opacity-85 pointer-events-none">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-purple-500 text-white font-bold text-[8px] flex items-center justify-center">
                    AM
                  </div>
                  <div className="h-3 bg-slate-800 rounded w-2/3" />
                </div>
                <div className="h-1.5 bg-purple-100 rounded w-1/2" />
                <div className="space-y-1 pt-1">
                  <div className="h-1.5 bg-slate-100 rounded w-full" />
                  <div className="h-1.5 bg-slate-100 rounded w-3/4" />
                </div>
              </div>

              {/* Main Template Card Preview */}
              <div className="relative z-10 w-[82%] bg-white rounded-2xl shadow-xl border border-indigo-200/80 p-4 space-y-3 backdrop-blur-xs">
                {/* Header */}
                <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0 ring-2 ring-indigo-200">
                    AM
                  </div>
                  <div>
                    <h3 className="text-xs font-extrabold text-slate-900 leading-tight">Alex Morgan</h3>
                    <p className="text-[10px] font-semibold text-indigo-600">Software Engineer</p>
                  </div>
                </div>

                {/* Simulated Content Lines */}
                <div className="space-y-2 text-left">
                  <div>
                    <div className="h-1.5 bg-indigo-600 rounded w-1/4 mb-1" />
                    <div className="h-1 bg-slate-200 rounded w-full mb-0.5" />
                    <div className="h-1 bg-slate-200 rounded w-5/6" />
                  </div>
                  <div>
                    <div className="h-1.5 bg-indigo-600 rounded w-1/3 mb-1" />
                    <div className="flex gap-1">
                      <div className="h-3 bg-indigo-50 border border-indigo-100 rounded px-1.5 w-12" />
                      <div className="h-3 bg-purple-50 border border-purple-100 rounded px-1.5 w-14" />
                      <div className="h-3 bg-slate-50 border border-slate-200 rounded px-1.5 w-10" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Feature Checklist Card */}
              <div className="absolute bottom-1 -right-3 z-30 bg-white/95 backdrop-blur-md rounded-xl p-3 shadow-lg border border-indigo-100 space-y-1.5 text-left text-[11px] font-bold text-slate-800">
                <div className="flex items-center gap-1.5 text-emerald-600">
                  <CheckCircle2 className="w-3.5 h-3.5 fill-emerald-100" />
                  <span>ATS Friendly</span>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-600">
                  <CheckCircle2 className="w-3.5 h-3.5 fill-emerald-100" />
                  <span>Easy to Edit</span>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-600">
                  <CheckCircle2 className="w-3.5 h-3.5 fill-emerald-100" />
                  <span>Export to PDF</span>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-600">
                  <CheckCircle2 className="w-3.5 h-3.5 fill-emerald-100" />
                  <span>Multiple Formats</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Toolbar: Search + Categories */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search Input Field */}
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search templates (e.g. modern, minimal, tech...)"
              className="w-full pl-10 pr-9 py-2.5 text-xs rounded-xl bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 shadow-2xs focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-medium"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Results Counter */}
          <div className="text-xs font-semibold text-slate-500 flex items-center gap-2">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
            <span>
              Showing <strong className="text-slate-900">{filteredTemplates.length}</strong> templates
            </span>
          </div>
        </div>

        {/* Category Pills Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none scroll-smooth">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-200 scale-105"
                    : "bg-white text-slate-600 border border-slate-200/80 hover:bg-indigo-50/60 hover:text-indigo-600"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Templates Grid Section */}
      {filteredTemplates.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3 max-w-md mx-auto my-8 shadow-xs">
          <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">No templates found</h3>
          <p className="text-xs text-slate-500">
            No templates match your search query &quot;{searchQuery}&quot;. Try clearing filters or searching for another keyword.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("All");
            }}
            className="text-xs font-bold border-slate-300"
          >
            Clear Filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-5">
          {filteredTemplates.map((tmpl) => {
            const isFav = favorites.includes(tmpl.id);
            const isSelected = selectedTemplate === tmpl.id;

            return (
              <div
                key={tmpl.id}
                className={`bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-2xs hover:shadow-xl hover:border-indigo-400 transition-all duration-300 flex flex-col justify-between group relative ${
                  isSelected ? "ring-2 ring-indigo-600 border-indigo-600" : ""
                }`}
              >
                {/* Top Thumbnail Section */}
                <div className="relative h-56 bg-slate-50 border-b border-slate-100 p-3 overflow-hidden flex flex-col justify-between group-hover:bg-indigo-50/20 transition-colors">
                  {/* Favorite Heart Button */}
                  <button
                    onClick={(e) => toggleFavorite(tmpl.id, e)}
                    aria-label="Favorite template"
                    className="absolute top-2.5 right-2.5 z-20 w-7 h-7 rounded-full bg-white/90 backdrop-blur-xs border border-slate-200 flex items-center justify-center shadow-xs hover:scale-110 transition-all text-slate-400 hover:text-rose-500"
                  >
                    <Heart
                      className={`w-4 h-4 transition-colors ${
                        isFav ? "fill-rose-500 text-rose-500" : ""
                      }`}
                    />
                  </button>

                  {/* Popular Badge */}
                  {tmpl.isPopular && (
                    <div className="absolute top-2.5 left-2.5 z-20 px-2 py-0.5 rounded-md bg-indigo-600 text-white text-[10px] font-bold flex items-center gap-1 shadow-2xs">
                      <Star className="w-2.5 h-2.5 fill-white" /> Popular
                    </div>
                  )}

                  {/* Miniature Resume Renderer */}
                  <div className="w-full h-full pt-6 px-1 transition-transform duration-300 group-hover:scale-[1.03]">
                    <MiniResumeThumbnail template={tmpl} />
                  </div>
                </div>

                {/* Card Content & Details */}
                <div className="p-3.5 space-y-2 text-left flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <h3 className="text-xs font-extrabold text-slate-900 group-hover:text-indigo-600 transition-colors truncate">
                        {tmpl.name}
                      </h3>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded shrink-0">
                        {tmpl.atsScore}% ATS
                      </span>
                    </div>

                    {/* Tag Pills */}
                    <div className="flex flex-wrap gap-1 mb-2">
                      {tmpl.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[9px] font-semibold text-slate-500 bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action Button */}
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleSelect(tmpl.id)}
                    className="w-full font-bold text-xs py-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-600 hover:text-white border border-indigo-200/80 hover:border-indigo-600 shadow-2xs transition-all flex items-center justify-center gap-1.5 rounded-xl group-hover:bg-indigo-600 group-hover:text-white"
                  >
                    <span>Use Template</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Bottom AI Template Recommendation Banner */}
      <section className="mt-12 rounded-3xl bg-gradient-to-r from-purple-100/90 via-indigo-100/80 to-purple-50 border border-purple-200/80 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs text-left">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-indigo-300">
            <Sparkles className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
              Still not sure which template to choose?
            </h3>
            <p className="text-xs sm:text-sm font-medium text-slate-600 max-w-lg">
              Let AI suggest the perfect template based on your profile and career goals.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
          {/* Social Proof */}
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2 overflow-hidden">
              <div className="inline-block h-7 w-7 rounded-full ring-2 ring-white bg-indigo-500 font-bold text-[10px] text-white flex items-center justify-center">
                AM
              </div>
              <div className="inline-block h-7 w-7 rounded-full ring-2 ring-white bg-purple-500 font-bold text-[10px] text-white flex items-center justify-center">
                JD
              </div>
              <div className="inline-block h-7 w-7 rounded-full ring-2 ring-white bg-emerald-500 font-bold text-[10px] text-white flex items-center justify-center">
                SK
              </div>
            </div>
            <div className="text-[11px] text-slate-600 leading-tight">
              <strong className="text-slate-900 block font-bold">500K+ users</strong>
              already created amazing resumes!
            </div>
          </div>

          <Button
            variant="primary"
            size="md"
            onClick={() => handleSelect("modern-professional")}
            className="w-full sm:w-auto font-extrabold text-xs py-3 px-5 bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-200 rounded-xl whitespace-nowrap"
          >
            Find My Perfect Template →
          </Button>
        </div>
      </section>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm">
          <Toast
            type="success"
            title="Template Selected"
            message={toastMessage}
            onClose={() => setToastMessage(null)}
          />
        </div>
      )}
    </div>
  );
}

{/* Miniature Resume Thumbnail Preview Renderer */}
function MiniResumeThumbnail({ template }: { template: TemplateItem }) {
  const { demoCandidate, previewType, isDark } = template;

  if (isDark || previewType === "dark" || previewType === "tech-elite") {
    return (
      <div className="w-full h-full bg-slate-900 rounded-xl p-2.5 text-white shadow-md border border-slate-700 flex flex-col justify-between text-left">
        <div className="border-b border-slate-700 pb-1.5 flex items-center justify-between">
          <div>
            <div className="text-[10px] font-extrabold text-indigo-400 tracking-tight">
              {demoCandidate.name}
            </div>
            <div className="text-[8px] font-semibold text-slate-400">{demoCandidate.role}</div>
          </div>
          <div className="w-4 h-4 rounded-full bg-indigo-500 text-[7px] font-bold flex items-center justify-center">
            {demoCandidate.avatarInitials}
          </div>
        </div>
        <div className="space-y-1 py-1">
          <div className="h-1 bg-indigo-500/40 rounded w-1/3" />
          <div className="h-1 bg-slate-700 rounded w-full" />
          <div className="h-1 bg-slate-700 rounded w-4/5" />
        </div>
        <div className="flex gap-1 pt-1">
          <span className="text-[7px] bg-slate-800 border border-slate-700 px-1 py-0.5 rounded text-indigo-300 font-mono">
            React
          </span>
          <span className="text-[7px] bg-slate-800 border border-slate-700 px-1 py-0.5 rounded text-indigo-300 font-mono">
            Python
          </span>
        </div>
      </div>
    );
  }

  if (previewType === "sidebar" || previewType === "creative-colorful") {
    return (
      <div className="w-full h-full bg-white rounded-xl shadow-md border border-purple-200 overflow-hidden flex text-left">
        {/* Left Purple Sidebar */}
        <div className="w-1/3 bg-indigo-600 p-1.5 text-white flex flex-col justify-between">
          <div>
            <div className="w-4 h-4 rounded-full bg-white text-indigo-600 font-bold text-[7px] flex items-center justify-center mb-1">
              {demoCandidate.avatarInitials}
            </div>
            <div className="text-[8px] font-bold leading-tight">{demoCandidate.name}</div>
          </div>
          <div className="space-y-1">
            <div className="h-1 bg-indigo-400 rounded w-full" />
            <div className="h-1 bg-indigo-400 rounded w-3/4" />
          </div>
        </div>
        {/* Right Content */}
        <div className="w-2/3 p-2 space-y-1.5 flex flex-col justify-between">
          <div>
            <div className="text-[9px] font-extrabold text-slate-800">{demoCandidate.role}</div>
            <div className="h-1 bg-indigo-100 rounded w-full mt-1" />
            <div className="h-1 bg-slate-100 rounded w-4/5 mt-0.5" />
          </div>
          <div className="space-y-1">
            <div className="h-1 bg-indigo-200 rounded w-1/2" />
            <div className="h-1 bg-slate-100 rounded w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (previewType === "gradient") {
    return (
      <div className="w-full h-full bg-white rounded-xl shadow-md border border-emerald-200 overflow-hidden flex flex-col justify-between text-left">
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-2 text-white">
          <div className="text-[10px] font-extrabold">{demoCandidate.name}</div>
          <div className="text-[8px] opacity-90">{demoCandidate.role}</div>
        </div>
        <div className="p-2 space-y-1.5">
          <div className="h-1 bg-emerald-100 rounded w-1/3" />
          <div className="h-1 bg-slate-100 rounded w-full" />
          <div className="h-1 bg-slate-100 rounded w-5/6" />
        </div>
        <div className="p-2 pt-0 flex gap-1">
          <span className="text-[7px] bg-emerald-50 border border-emerald-200 text-emerald-700 px-1 py-0.5 rounded font-bold">
            CAD
          </span>
          <span className="text-[7px] bg-emerald-50 border border-emerald-200 text-emerald-700 px-1 py-0.5 rounded font-bold">
            FEA
          </span>
        </div>
      </div>
    );
  }

  if (previewType === "classic" || previewType === "academic") {
    return (
      <div className="w-full h-full bg-[#FCFCFD] rounded-xl p-2.5 shadow-md border border-slate-200 flex flex-col justify-between text-left font-serif">
        <div className="text-center border-b-2 border-slate-800 pb-1">
          <div className="text-[10px] font-bold text-slate-900 uppercase tracking-wider">
            {demoCandidate.name}
          </div>
          <div className="text-[7px] text-slate-600 italic">{demoCandidate.role}</div>
        </div>
        <div className="space-y-1 py-1 font-sans">
          <div className="h-1 bg-slate-800 rounded w-1/4" />
          <div className="h-1 bg-slate-200 rounded w-full" />
          <div className="h-1 bg-slate-200 rounded w-4/5" />
        </div>
        <div className="border-t border-slate-200 pt-1 font-sans">
          <div className="h-1 bg-slate-400 rounded w-1/3" />
        </div>
      </div>
    );
  }

  // Default Modern / Clean Preview
  return (
    <div className="w-full h-full bg-white rounded-xl p-2.5 shadow-md border border-slate-200 flex flex-col justify-between text-left">
      <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
        <div>
          <div className="text-[10px] font-extrabold text-slate-900 tracking-tight">
            {demoCandidate.name}
          </div>
          <div className="text-[8px] font-bold text-indigo-600">{demoCandidate.role}</div>
        </div>
        <div className="w-4 h-4 rounded-full bg-indigo-100 text-indigo-700 font-bold text-[7px] flex items-center justify-center">
          {demoCandidate.avatarInitials}
        </div>
      </div>
      <div className="space-y-1 py-1">
        <div className="h-1 bg-indigo-600 rounded w-1/3" />
        <div className="h-1 bg-slate-100 rounded w-full" />
        <div className="h-1 bg-slate-100 rounded w-4/5" />
      </div>
      <div className="flex gap-1 pt-1">
        <span className="text-[7px] bg-indigo-50 text-indigo-700 px-1 py-0.5 rounded font-semibold border border-indigo-100">
          Clean
        </span>
        <span className="text-[7px] bg-slate-100 text-slate-600 px-1 py-0.5 rounded font-semibold">
          ATS
        </span>
      </div>
    </div>
  );
}
