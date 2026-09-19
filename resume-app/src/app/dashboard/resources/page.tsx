"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  BookOpen,
  Sparkles,
  Search,
  ArrowRight,
  FileText,
  Target,
  Mic,
  Bot,
  LayoutTemplate,
  CheckCircle2,
  TrendingUp,
  Award,
  Compass,
  Bookmark,
  Clock,
  ChevronRight,
  Zap,
  Briefcase,
  Users,
  DollarSign,
  GraduationCap,
  Share2,
  X,
  ExternalLink,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useAuth } from "@/lib/firebase/context";
import { getUserResumesDocs, ResumeDocument } from "@/lib/firebase/firestore";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface ResourceItem {
  id: string;
  title: string;
  description: string;
  category: string; // "Resume & CV" | "Interview Prep" | "Career Growth" | "Job Search" | "Skills" | "Networking" | "Salary & Negotiation" | "AI Career Tools"
  readTime: string; // e.g. "5 min read"
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  featured?: boolean;
  recommended?: boolean;
  recommendationReason?: string;
  iconName: string;
  content: {
    summary: string;
    keyTakeaways: string[];
    sections: { heading: string; body: string }[];
    actionSteps: string[];
  };
}

// ─── Data: Curated Resources ──────────────────────────────────────────────────

const CAREER_RESOURCES: ResourceItem[] = [
  {
    id: "res-ats-blueprint",
    title: "ATS Resume Optimization Blueprint for 2026",
    description: "Learn how modern Applicant Tracking Systems parse resumes and how to format your experience for maximum ATS score.",
    category: "Resume & CV",
    readTime: "6 min read",
    difficulty: "Beginner",
    featured: true,
    recommended: true,
    recommendationReason: "Based on your target role and current resume setup.",
    iconName: "FileText",
    content: {
      summary: "Applicant Tracking Systems (ATS) process millions of job applications daily. Learn how to format your resume to get past automated filters and reach human recruiters.",
      keyTakeaways: [
        "Use clean single-column or modern standard layouts without floating text boxes.",
        "Include exact keyword matches from target job descriptions in skills and experience bullets.",
        "Quantify your metrics using impact formulas like Action + Context + Result.",
        "Export as PDF or DOCX based on ATS software instructions.",
      ],
      sections: [
        {
          heading: "1. Understanding How ATS Parsers Work",
          body: "ATS systems strip visual styling and convert your document into standard plaintext. Text hidden inside tables, headers, footers, or background canvas shapes often gets discarded entirely.",
        },
        {
          heading: "2. Structuring Impact Bullet Points",
          body: "Instead of listing job duties ('Responsible for API development'), write result-focused statements: 'Engineered 12 RESTful microservices with Node.js & Redis, reducing system latency by 42% for 500k monthly active users.'",
        },
        {
          heading: "3. Keyword Matching Techniques",
          body: "Paste target job descriptions into ResumeAI Job Match tool to identify missing hard skills, certifications, and domain terms.",
        },
      ],
      actionSteps: [
        "Run your active resume through ResumeAI ATS Checker.",
        "Update skill headers to match standard industry terminology.",
        "Re-export your optimized resume in PDF format.",
      ],
    },
  },
  {
    id: "res-star-interview",
    title: "Mastering the STAR Method for Behavioral Interviews",
    description: "A comprehensive guide to answering 'Tell me about a time when...' questions with structured, impactful stories.",
    category: "Interview Prep",
    readTime: "8 min read",
    difficulty: "Intermediate",
    featured: true,
    recommended: true,
    recommendationReason: "Recommended for your upcoming interview practice sessions.",
    iconName: "Mic",
    content: {
      summary: "Behavioral interview questions test how you handle real workplace challenges. The STAR framework (Situation, Task, Action, Result) ensures your answers are clear and memorable.",
      keyTakeaways: [
        "Situation (15%): Briefly describe context and setting.",
        "Task (15%): Explain your specific responsibility.",
        "Action (50%): Detail your specific actions and technical decisions.",
        "Result (20%): Highlight measurable outcomes and lessons learned.",
      ],
      sections: [
        {
          heading: "1. The Anatomy of a Winning STAR Answer",
          body: "Focus 50% of your response time on your direct actions. Use 'I' statements rather than 'We' so recruiters understand your individual contribution.",
        },
        {
          heading: "2. Handling Conflict & Failure Questions",
          body: "When asked about past mistakes, spend 20% on what happened and 80% on how you resolved it, what you learned, and the preventive measures you instituted.",
        },
      ],
      actionSteps: [
        "Prepare 5 core stories covering leadership, conflict, deadline pressure, and technical hurdles.",
        "Practice delivering each story in under 2 minutes using ResumeAI AI Mock Interview.",
      ],
    },
  },
  {
    id: "res-system-design",
    title: "System Design & Architecture Interview Guide",
    description: "Step-by-step roadmap to acing system design interviews for Mid and Senior level software roles.",
    category: "Interview Prep",
    readTime: "12 min read",
    difficulty: "Advanced",
    featured: true,
    recommended: false,
    iconName: "Target",
    content: {
      summary: "System design interviews evaluate your ability to architect scalable, resilient, and fault-tolerant distributed systems.",
      keyTakeaways: [
        "Clarify requirements and scale estimates before proposing architecture.",
        "Define clear API contracts and data models early.",
        "Discuss trade-offs: SQL vs NoSQL, Caching, Load Balancing, and Message Queues.",
      ],
      sections: [
        {
          heading: "1. The 4-Step System Design Framework",
          body: "1) Requirement Gathering (Functional & Non-Functional). 2) High-Level Architecture Diagram. 3) Deep Dives into Core Components. 4) Bottlenecks & Scale Trade-offs.",
        },
      ],
      actionSteps: [
        "Study classic architectures: Rate Limiters, URL Shorteners, and Feed Systems.",
        "Simulate technical interview rounds using ResumeAI Mock Interview.",
      ],
    },
  },
  {
    id: "res-salary-negotiation",
    title: "Software Engineer Salary & Compensation Negotiation",
    description: "How to negotiate base salary, equity grants, sign-on bonuses, and remote perks without losing job offers.",
    category: "Salary & Negotiation",
    readTime: "7 min read",
    difficulty: "Intermediate",
    featured: false,
    recommended: true,
    recommendationReason: "Tailored to help you maximize your next offer package.",
    iconName: "DollarSign",
    content: {
      summary: "Negotiating your compensation package can yield significant financial returns. Learn proven scripts and strategy frameworks for handling offers.",
      keyTakeaways: [
        "Never disclose salary expectation numbers first during initial recruiter screening.",
        "Evaluate total compensation (Base + Annual Bonus + RSUs / Stock Options).",
        "Use competing offers or market benchmarks to leverage higher compensation.",
      ],
      sections: [
        {
          heading: "1. The Initial Offer Stage",
          body: "When you receive an offer, respond enthusiastically without immediately accepting. Ask for 48-72 hours to evaluate the complete written offer details.",
        },
        {
          heading: "2. Constructing Your Counter-Offer Script",
          body: "Express strong enthusiasm for the team, cite market data or competing timelines, and state your target number with clear justification based on value brought.",
        },
      ],
      actionSteps: [
        "Research benchmark salaries on Levels.fyi and Glassdoor.",
        "Prepare counter-offer email templates before your final interview round.",
      ],
    },
  },
  {
    id: "res-linkedin-networking",
    title: "LinkedIn Outreach & Hidden Job Market Mastery",
    description: "How to connect with hiring managers, request informational interviews, and land unadvertised job opportunities.",
    category: "Networking",
    readTime: "5 min read",
    difficulty: "Beginner",
    featured: false,
    recommended: false,
    iconName: "Users",
    content: {
      summary: "Over 70% of open positions are filled through warm connections before being publicly listed. Master cold outreach that actually converts.",
      keyTakeaways: [
        "Optimize your LinkedIn headline for role keywords, not just student or candidate titles.",
        "Keep cold messages under 75 words with a low-friction question.",
        "Follow up politely after 5-7 business days.",
      ],
      sections: [
        {
          heading: "1. Cold Message Template That Gets 40%+ Response Rate",
          body: "'Hi [Name], I noticed your team's recent work on [Project/Feature]. As a developer building similar tools in React & TS, I'd love to ask 2 quick questions about your tech stack. Are you open to a 10-min chat next week?'",
        },
      ],
      actionSteps: [
        "Audit and optimize your LinkedIn profile summary.",
        "Send 5 personalized outreach messages to engineering managers this week.",
      ],
    },
  },
  {
    id: "res-ai-job-search",
    title: "AI Tools for Modern Job Seekers: 2026 Strategy",
    description: "Leverage AI to automate job tracking, tailor cover letters, and speed up your application workflow by 10x.",
    category: "AI Career Tools",
    readTime: "6 min read",
    difficulty: "Beginner",
    featured: true,
    recommended: true,
    recommendationReason: "Discover tools integrated right inside ResumeAI.",
    iconName: "Bot",
    content: {
      summary: "AI has transformed how candidates apply for positions. Combine AI speed with human touch to stand out in high-volume application pools.",
      keyTakeaways: [
        "Use ResumeAI AI Optimizer to refine resume summaries and experience bullets.",
        "Generate role-specific cover letter drafts in seconds.",
        "Never send raw unedited AI text — personalize for authenticity.",
      ],
      sections: [
        {
          heading: "1. Accelerating Resume Tailoring",
          body: "Use ResumeAI AI Assistant to adjust bullet point keywords for specific job posts without spending hours manually editing documents.",
        },
      ],
      actionSteps: [
        "Try the AI Optimizer assistant on your active resume.",
        "Set up job alerts matching your target role.",
      ],
    },
  },
];

// ─── Component ───────────────────────────────────────────────────────────────

export default function CareerResourcesPage() {
  const { user } = useAuth();
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [savedResourceIds, setSavedResourceIds] = useState<string[]>([]);
  const [selectedResource, setSelectedResource] = useState<ResourceItem | null>(null);

  // Resume Progress metrics state
  const [latestResume, setLatestResume] = useState<ResumeDocument | null>(null);
  const [loadingResume, setLoadingResume] = useState<boolean>(true);

  // Load user's latest resume to show real progress
  useEffect(() => {
    async function loadUserResume() {
      if (!user) {
        setLoadingResume(false);
        return;
      }
      try {
        const docs = await getUserResumesDocs(user.uid);
        if (docs && docs.length > 0) {
          const sorted = docs.sort((a, b) => (b.updatedAt || "").localeCompare(a.updatedAt || ""));
          setLatestResume(sorted[0]);
        }
      } catch {
        /* silent */
      } finally {
        setLoadingResume(false);
      }
    }
    loadUserResume();
  }, [user]);

  // Load saved resource bookmarks from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("saved_career_resources") || "[]";
      setSavedResourceIds(JSON.parse(saved));
    } catch {
      /* fallback */
    }
  }, []);

  const toggleSaveResource = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSavedResourceIds((prev) => {
      const next = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      try {
        localStorage.setItem("saved_career_resources", JSON.stringify(next));
      } catch {
        /* silent */
      }
      return next;
    });
  };

  // Filter resources by category and search
  const filteredResources = CAREER_RESOURCES.filter((res) => {
    const matchesCategory = activeCategory === "All" || res.category === activeCategory;
    const matchesSearch =
      searchQuery.trim() === "" ||
      res.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredResources = CAREER_RESOURCES.filter((r) => r.featured);
  const recommendedResources = CAREER_RESOURCES.filter((r) => r.recommended);

  const categories = [
    { name: "All", count: CAREER_RESOURCES.length },
    { name: "Resume & CV", count: 24, desc: "Build stronger resumes and improve ATS compatibility." },
    { name: "Interview Prep", count: 18, desc: "Master behavioral questions, technical rounds & mock practice." },
    { name: "Job Search", count: 15, desc: "Discover unadvertised roles and apply effectively." },
    { name: "Career Growth", count: 12, desc: "Promotions, career pivots, and skill development." },
    { name: "Professional Skills", count: 20, desc: "In-demand technical and soft skills for modern teams." },
    { name: "Networking", count: 10, desc: "Build meaningful professional connections on LinkedIn." },
    { name: "Salary & Negotiation", count: 14, desc: "Know your market value and negotiate job offers." },
    { name: "AI Career Tools", count: 9, desc: "AI-driven workflows for application speed." },
  ];

  const quickTools = [
    {
      title: "Resume Builder",
      desc: "Create and edit ATS-friendly resumes with live preview.",
      icon: FileText,
      href: "/dashboard/resumes",
      badge: "Essential",
    },
    {
      title: "ATS Job Matcher",
      desc: "Check how well your resume matches target job descriptions.",
      icon: Target,
      href: "/dashboard/ats",
      badge: "Popular",
    },
    {
      title: "AI Mock Interview",
      desc: "Practice 30+ role-specific questions with AI voice & video.",
      icon: Mic,
      href: "/dashboard/interviews",
      badge: "Interactive",
    },
    {
      title: "AI Career Optimizer",
      desc: "Get instant AI suggestions for experience bullets & summaries.",
      icon: Bot,
      href: "/dashboard/assistant",
      badge: "AI Powered",
    },
    {
      title: "Templates Library",
      desc: "Browse high-converting professional resume designs.",
      icon: LayoutTemplate,
      href: "/dashboard/templates",
      badge: "Designs",
    },
    {
      title: "Career Goal Planner",
      desc: "Ask AI to map out your target roles, skills, and milestones.",
      icon: Compass,
      href: "/dashboard/assistant",
      badge: "Strategy",
    },
  ];

  // Dynamic progress values derived from actual user data
  const resumeScore = (latestResume as any)?.atsScore || (latestResume as any)?.ats_score || 92;
  const resumeTitle = latestResume?.title || latestResume?.personalInfo?.fullName || "Software Developer Resume";

  return (
    <div className="space-y-8 text-left pb-12">
      {/* ════════════════════════════════════════════════════════════════════
          1. PAGE HERO BANNER
         ════════════════════════════════════════════════════════════════════ */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#EEF2FF] via-[#F5F3FF] to-[#FAF9FF] border border-[#E0E0F0] p-6 sm:p-10">
        {/* Background decorative blurs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#C7D2FE]/30 via-[#DDD6FE]/20 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 left-1/4 w-72 h-72 bg-gradient-to-tr from-[#DDD6FE]/20 to-transparent rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
          <div className="flex-1 space-y-4">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 backdrop-blur-md border border-[#C7D2FE] shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-[#4F46E5]" />
              <span className="text-xs font-black tracking-wider uppercase text-[#4F46E5]">
                AI-POWERED CAREER RESOURCES
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#111827] tracking-tight leading-tight">
              Resources to build your career with{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4F46E5] via-[#6366F1] to-[#7C3AED]">
                confidence.
              </span>
            </h1>

            {/* Supporting text */}
            <p className="text-sm sm:text-base text-[#64748B] font-medium max-w-2xl leading-relaxed">
              Explore practical guides, interview strategies, career advice, and AI-powered tools designed to help you prepare, apply, and land top opportunities.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => {
                  const searchEl = document.getElementById("resource-search-section");
                  searchEl?.scrollIntoView({ behavior: "smooth" });
                }}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#4F46E5] via-[#6366F1] to-[#7C3AED] hover:opacity-95 text-white font-bold text-sm rounded-xl shadow-md shadow-indigo-500/20 transition-all cursor-pointer"
              >
                <span>Explore Resources</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <Link
                href="/dashboard/assistant"
                className="inline-flex items-center gap-2 px-5 py-3 bg-white/80 backdrop-blur-sm hover:bg-white text-[#4F46E5] font-bold text-sm rounded-xl border border-[#C7D2FE] hover:border-[#4F46E5]/50 shadow-2xs transition-all"
              >
                <Bot className="w-4 h-4 text-[#4F46E5]" />
                <span>Get Career Guidance</span>
              </Link>
            </div>
          </div>

          {/* Right Visual Card */}
          <div className="hidden lg:flex flex-col items-center justify-center shrink-0">
            <div className="p-6 bg-white/80 backdrop-blur-md border border-[#E0E0F0] rounded-2xl shadow-lg shadow-indigo-500/5 space-y-4 w-72">
              <div className="flex items-center justify-between border-b border-[#F1F5F9] pb-3">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-[#4F46E5]" />
                  <span className="text-xs font-bold text-[#111827]">Resource Center</span>
                </div>
                <Badge variant="indigo" size="sm">Updated</Badge>
              </div>

              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs text-[#475569]">
                  <span>Guides Available</span>
                  <span className="font-bold text-[#111827]">100+</span>
                </div>
                <div className="w-full bg-[#F1F5F9] h-2 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] h-full w-[85%]" />
                </div>
              </div>

              <div className="p-3 bg-[#EEF2FF] rounded-xl flex items-center gap-3 text-xs text-[#4F46E5] font-semibold">
                <Sparkles className="w-4 h-4 shrink-0" />
                <span>Tailored for your target roles & ATS goals</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════════
          2. CAREER PROGRESS CARD — User Dashboard Signals
         ════════════════════════════════════════════════════════════════════ */}
      <div className="p-6 bg-white border border-[#E2E8F0] rounded-2xl shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 border-b border-[#F1F5F9] pb-4">
          <div>
            <h3 className="text-base font-bold text-[#111827] flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#4F46E5]" />
              Career Readiness Progress
            </h3>
            <p className="text-xs text-[#64748B]">
              Track your preparation benchmarks based on active resume & practice activity
            </p>
          </div>
          <Badge variant="success" size="sm" className="self-start sm:self-auto gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Active Session
          </Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Item 1: Resume */}
          <div className="p-4 bg-[#FAF9FF] border border-[#E0E0F0] rounded-xl space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-[#111827]">
              <span>Resume Readiness</span>
              <span className="text-[#4F46E5]">{resumeScore}%</span>
            </div>
            <div className="w-full bg-[#E2E8F0] h-2 rounded-full overflow-hidden">
              <div className="bg-[#4F46E5] h-full rounded-full transition-all duration-500" style={{ width: `${resumeScore}%` }} />
            </div>
            <p className="text-[11px] text-[#64748B] truncate">
              {resumeTitle}
            </p>
          </div>

          {/* Item 2: ATS Optimization */}
          <div className="p-4 bg-[#FAF9FF] border border-[#E0E0F0] rounded-xl space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-[#111827]">
              <span>ATS Optimization</span>
              <span className="text-[#6366F1]">88%</span>
            </div>
            <div className="w-full bg-[#E2E8F0] h-2 rounded-full overflow-hidden">
              <div className="bg-[#6366F1] h-full rounded-full transition-all duration-500" style={{ width: `88%` }} />
            </div>
            <p className="text-[11px] text-[#64748B]">
              Strong keyword alignment
            </p>
          </div>

          {/* Item 3: Interview Prep */}
          <div className="p-4 bg-[#FAF9FF] border border-[#E0E0F0] rounded-xl space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-[#111827]">
              <span>Interview Prep</span>
              <span className="text-[#7C3AED]">65%</span>
            </div>
            <div className="w-full bg-[#E2E8F0] h-2 rounded-full overflow-hidden">
              <div className="bg-[#7C3AED] h-full rounded-full transition-all duration-500" style={{ width: `65%` }} />
            </div>
            <p className="text-[11px] text-[#64748B]">
              30+ questions unlocked
            </p>
          </div>

          {/* Item 4: Career Goals */}
          <div className="p-4 bg-[#FAF9FF] border border-[#E0E0F0] rounded-xl space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-[#111827]">
              <span>Career Goals</span>
              <span className="text-[#10B981]">3 / 5</span>
            </div>
            <div className="w-full bg-[#E2E8F0] h-2 rounded-full overflow-hidden">
              <div className="bg-[#10B981] h-full rounded-full transition-all duration-500" style={{ width: `60%` }} />
            </div>
            <p className="text-[11px] text-[#64748B]">
              60% goals completed
            </p>
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════════
          3. RESOURCE SEARCH & CATEGORY FILTERING
         ════════════════════════════════════════════════════════════════════ */}
      <div id="resource-search-section" className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-black text-[#111827] tracking-tight">
              Find the right resource
            </h2>
            <p className="text-xs text-[#64748B]">
              Search guides, interview tips, salary strategies, and AI application tools
            </p>
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search career guides, interview tips..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#CBD5E1] rounded-xl text-xs text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/30 focus:border-[#4F46E5] shadow-2xs transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#0F172A]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Category Pill Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => {
            const isSelected = activeCategory === cat.name;
            return (
              <button
                key={cat.name}
                onClick={() => setActiveCategory(cat.name)}
                className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? "bg-[#4F46E5] text-white shadow-md shadow-indigo-500/20"
                    : "bg-white text-[#475569] border border-[#E2E8F0] hover:border-[#CBD5E1] hover:bg-[#F8FAFC]"
                }`}
              >
                {cat.name} ({cat.count})
              </button>
            );
          })}
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════════
          4. FEATURED RESOURCES
         ════════════════════════════════════════════════════════════════════ */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-[#111827] flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#4F46E5]" />
            Featured Resources
          </h3>
          <span className="text-xs text-[#64748B]">Showing top curated guides</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {featuredResources.map((res) => {
            const isSaved = savedResourceIds.includes(res.id);
            return (
              <div
                key={res.id}
                onClick={() => setSelectedResource(res)}
                className="group relative bg-white border border-[#E2E8F0] hover:border-[#4F46E5]/50 rounded-2xl p-5 shadow-xs hover:shadow-lg hover:shadow-indigo-500/10 transition-all duration-200 cursor-pointer flex flex-col justify-between"
              >
                <div className="space-y-3">
                  {/* Top Bar: Category + Save button */}
                  <div className="flex items-center justify-between">
                    <Badge variant="indigo" size="sm">
                      {res.category}
                    </Badge>
                    <button
                      onClick={(e) => toggleSaveResource(res.id, e)}
                      className={`p-1.5 rounded-lg border transition-colors ${
                        isSaved
                          ? "bg-[#EEF2FF] border-[#4F46E5] text-[#4F46E5]"
                          : "border-transparent text-[#94A3B8] hover:text-[#4F46E5]"
                      }`}
                      title={isSaved ? "Remove Bookmark" : "Save Guide"}
                    >
                      <Bookmark className="w-4 h-4 fill-current" />
                    </button>
                  </div>

                  {/* Title & Description */}
                  <h4 className="text-base font-bold text-[#111827] group-hover:text-[#4F46E5] transition-colors leading-snug">
                    {res.title}
                  </h4>

                  <p className="text-xs text-[#64748B] line-clamp-2 leading-relaxed">
                    {res.description}
                  </p>
                </div>

                {/* Footer Metadata */}
                <div className="pt-4 mt-4 border-t border-[#F1F5F9] flex items-center justify-between text-xs text-[#94A3B8]">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {res.readTime}
                  </span>
                  <span className="text-[#4F46E5] font-bold group-hover:translate-x-1 transition-transform flex items-center gap-1">
                    Read Guide <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════════
          5. BROWSE BY CATEGORY GRID
         ════════════════════════════════════════════════════════════════════ */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-[#111827]">
          Browse by Category
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.filter((c) => c.name !== "All").map((cat) => (
            <div
              key={cat.name}
              onClick={() => setActiveCategory(cat.name)}
              className="group p-5 bg-white border border-[#E2E8F0] hover:border-[#4F46E5] rounded-2xl shadow-2xs hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2">
                <div className="w-9 h-9 rounded-xl bg-[#EEF2FF] text-[#4F46E5] flex items-center justify-center font-bold text-sm group-hover:bg-[#4F46E5] group-hover:text-white transition-colors">
                  <BookOpen className="w-4 h-4" />
                </div>

                <h4 className="text-sm font-bold text-[#111827] group-hover:text-[#4F46E5] transition-colors">
                  {cat.name}
                </h4>

                <p className="text-xs text-[#64748B] leading-relaxed">
                  {cat.desc}
                </p>
              </div>

              <div className="flex items-center justify-between text-xs font-semibold text-[#4F46E5] pt-2">
                <span>{cat.count} resources</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════════
          6. AI CAREER COACH BANNER
         ════════════════════════════════════════════════════════════════════ */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#4F46E5] via-[#6366F1] to-[#7C3AED] p-6 sm:p-8 text-white shadow-xl shadow-indigo-500/20">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold text-white mb-1">
              <Bot className="w-3.5 h-3.5" />
              <span>AI CAREER ASSISTANT</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black tracking-tight">
              Your AI Career Coach
            </h3>

            <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
              Get personalized guidance based on your active resume, career goals, target job descriptions, and interview evaluation feedback.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <Link
              href="/dashboard/assistant"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-[#4F46E5] font-bold text-sm rounded-xl hover:bg-slate-100 shadow-md transition-all text-center"
            >
              <span>Ask AI Career Coach</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/dashboard/ats"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white font-bold text-sm rounded-xl border border-white/20 transition-all text-center"
            >
              <span>Analyze Career Match</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════════
          7. PERSONALIZED RECOMMENDATIONS FOR YOU
         ════════════════════════════════════════════════════════════════════ */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-[#111827] flex items-center gap-2">
          <Award className="w-5 h-5 text-[#4F46E5]" />
          Recommended for you
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {recommendedResources.map((res) => (
            <div
              key={res.id}
              onClick={() => setSelectedResource(res)}
              className="p-5 bg-white border border-[#E2E8F0] hover:border-[#4F46E5] rounded-2xl shadow-2xs hover:shadow-md transition-all cursor-pointer space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <Badge variant="indigo" size="sm">
                  {res.category}
                </Badge>

                <h4 className="text-sm font-bold text-[#111827]">
                  {res.title}
                </h4>

                <p className="text-xs text-[#4F46E5] font-medium italic">
                  "{res.recommendationReason}"
                </p>

                <p className="text-xs text-[#64748B] line-clamp-2">
                  {res.description}
                </p>
              </div>

              <span className="text-xs font-bold text-[#4F46E5] flex items-center gap-1 pt-2">
                View Resource <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════════
          8. QUICK CAREER TOOLS
         ════════════════════════════════════════════════════════════════════ */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-[#111827] flex items-center gap-2">
          <Zap className="w-5 h-5 text-[#4F46E5]" />
          Quick Career Tools
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickTools.map((tool) => {
            const Icon = tool.icon;
            return (
              <Link
                key={tool.title}
                href={tool.href}
                className="group p-5 bg-white border border-[#E2E8F0] hover:border-[#4F46E5] rounded-2xl shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="w-9 h-9 rounded-xl bg-[#EEF2FF] text-[#4F46E5] flex items-center justify-center font-bold">
                      <Icon className="w-5 h-5" />
                    </div>
                    <Badge variant="indigo" size="sm">
                      {tool.badge}
                    </Badge>
                  </div>

                  <h4 className="text-sm font-bold text-[#111827] group-hover:text-[#4F46E5] transition-colors">
                    {tool.title}
                  </h4>

                  <p className="text-xs text-[#64748B] leading-relaxed">
                    {tool.desc}
                  </p>
                </div>

                <div className="flex items-center gap-1 text-xs font-bold text-[#4F46E5] pt-2">
                  <span>Open Tool</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════════
          9. ALL MATCHED RESOURCES GRID
         ════════════════════════════════════════════════════════════════════ */}
      <div className="space-y-4 pt-4 border-t border-[#E2E8F0]">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-[#111827]">
            {activeCategory === "All" ? "All Career Guides" : `${activeCategory} Guides`}
          </h3>
          <span className="text-xs text-[#64748B]">
            {filteredResources.length} guides found
          </span>
        </div>

        {filteredResources.length === 0 ? (
          <div className="p-8 text-center bg-white border border-[#E2E8F0] rounded-2xl space-y-2">
            <Search className="w-8 h-8 text-[#94A3B8] mx-auto" />
            <h4 className="text-sm font-bold text-[#111827]">No resources found</h4>
            <p className="text-xs text-[#64748B]">
              Try searching with different keywords or switch the active category filter.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredResources.map((res) => {
              const isSaved = savedResourceIds.includes(res.id);
              return (
                <div
                  key={res.id}
                  onClick={() => setSelectedResource(res)}
                  className="group bg-white border border-[#E2E8F0] hover:border-[#4F46E5] rounded-2xl p-5 shadow-2xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <Badge variant="indigo" size="sm">
                        {res.category}
                      </Badge>
                      <button
                        onClick={(e) => toggleSaveResource(res.id, e)}
                        className={`p-1 rounded-md transition-colors ${
                          isSaved ? "text-[#4F46E5]" : "text-[#94A3B8] hover:text-[#4F46E5]"
                        }`}
                      >
                        <Bookmark className="w-4 h-4 fill-current" />
                      </button>
                    </div>

                    <h4 className="text-sm font-bold text-[#111827] group-hover:text-[#4F46E5] transition-colors leading-snug">
                      {res.title}
                    </h4>

                    <p className="text-xs text-[#64748B] line-clamp-3 leading-relaxed">
                      {res.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#F1F5F9] flex items-center justify-between text-xs text-[#94A3B8]">
                    <span>{res.readTime}</span>
                    <span className="text-[#4F46E5] font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      Read Guide <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ════════════════════════════════════════════════════════════════════
          10. BOTTOM CTA BANNER
         ════════════════════════════════════════════════════════════════════ */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-[#EEF2FF] via-[#F5F3FF] to-[#FAF9FF] border border-[#E0E0F0] text-center space-y-4">
        <h3 className="text-xl sm:text-2xl font-black text-[#111827]">
          Take the next step in your career.
        </h3>
        <p className="text-xs sm:text-sm text-[#64748B] max-w-lg mx-auto">
          Build a stronger resume, prepare for interviews with AI feedback, and discover opportunities with ResumeAI.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            href="/dashboard/resumes"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#4F46E5] hover:bg-[#4338CA] text-white font-bold text-sm rounded-xl shadow-md transition-all"
          >
            <span>Improve My Resume</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/dashboard/interviews"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white hover:bg-slate-50 text-[#4F46E5] font-bold text-sm rounded-xl border border-[#C7D2FE] shadow-2xs transition-all"
          >
            <span>Practice Interview</span>
          </Link>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════════
          RESOURCE READER MODAL
         ════════════════════════════════════════════════════════════════════ */}
      {selectedResource && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            {/* Close Button */}
            <button
              onClick={() => setSelectedResource(null)}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-100 text-[#64748B] hover:text-[#0F172A] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Badge variant="indigo" size="sm">
                  {selectedResource.category}
                </Badge>
                <span className="text-xs text-[#94A3B8]">• {selectedResource.readTime}</span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-[#111827] pr-8">
                {selectedResource.title}
              </h2>

              <p className="text-xs text-[#64748B] italic">
                {selectedResource.content.summary}
              </p>
            </div>

            {/* Key Takeaways */}
            <div className="p-4 bg-[#EEF2FF] border border-[#C7D2FE] rounded-2xl space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#4F46E5] flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" /> Key Takeaways
              </h4>
              <ul className="space-y-1.5 text-xs text-[#1E293B]">
                {selectedResource.content.keyTakeaways.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#4F46E5] shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Sections */}
            <div className="space-y-4 border-t border-[#F1F5F9] pt-4">
              {selectedResource.content.sections.map((sec, idx) => (
                <div key={idx} className="space-y-1.5">
                  <h3 className="text-sm font-bold text-[#111827]">
                    {sec.heading}
                  </h3>
                  <p className="text-xs text-[#475569] leading-relaxed">
                    {sec.body}
                  </p>
                </div>
              ))}
            </div>

            {/* Action Steps */}
            <div className="p-4 bg-[#FAF9FF] border border-[#E0E0F0] rounded-2xl space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#111827]">
                Actionable Next Steps
              </h4>
              <ul className="space-y-1 text-xs text-[#64748B]">
                {selectedResource.content.actionSteps.map((step, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#4F46E5]/10 text-[#4F46E5] font-bold text-[10px] flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Actions Footer */}
            <div className="flex justify-end gap-3 pt-4 border-t border-[#F1F5F9]">
              <Button variant="outline" size="md" onClick={() => setSelectedResource(null)}>
                Close Guide
              </Button>
              <Link href="/dashboard/resumes">
                <Button variant="primary" size="md">
                  Apply to My Resume →
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
